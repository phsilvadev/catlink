import "server-only";
import { templateStarter } from "@/lib/page-appearance";
import { requireAvatar } from "./assets";
import { getDb } from "./db";
import { Prisma } from "@/generated/prisma/client";
import {
  accountPlan,
  allowedTemplate,
  allowedBlocks,
  DomainError,
} from "./catalog";
import {
  createPageSchema,
  savePageSchema,
  revisionSchema,
  draftSchema,
} from "@/lib/schemas/page";

// Serializes account writes, including page-limit checks. Account is always derived from the session.
async function lockOwner(tx: Prisma.TransactionClient, userId: string) {
  const users = await tx.$queryRaw<
    { id: string }[]
  >`SELECT id FROM "User" WHERE id = ${userId} FOR UPDATE`;
  if (!users.length)
    throw new DomainError("UNAUTHENTICATED", 401, "Entre na sua conta.");
}
async function ownPage(
  tx: Prisma.TransactionClient,
  userId: string,
  id: string,
) {
  const page = await tx.page.findFirst({ where: { id, ownerId: userId } });
  if (!page) throw new DomainError("NOT_FOUND", 404, "Página não encontrada.");
  return page;
}
export async function createPage(userId: string, input: unknown) {
  const data = createPageSchema.parse(input);
  return getDb().$transaction(async (tx) => {
    await lockOwner(tx, userId);
    const plan = await accountPlan(tx, userId);
    if ((await tx.page.count({ where: { ownerId: userId } })) >= plan.pageLimit)
      throw new DomainError(
        "PLAN_LIMIT",
        403,
        "Você atingiu o limite de páginas do seu plano.",
      );
    const template = await allowedTemplate(tx, plan.key, data.templateKey);
    const draft = draftSchema.parse({
      schemaVersion: 1,
      profile: { ...templateStarter(template.config).profile, name: data.name },
      blocks: template.config.initialBlocks,
    });
    return tx.page.create({
      data: {
        ownerId: userId,
        slug: data.slug,
        templateKey: template.key,
        templateVersion: template.version,
        templateConfig: template.config,
        draft,
      },
    });
  });
}
export function listPages(userId: string) {
  return getDb().page.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      templateKey: true,
      revision: true,
      publishedVersionId: true,
      updatedAt: true,
    },
  });
}
export function getPage(userId: string, id: string) {
  return ownPage(getDb(), userId, id);
}
export async function savePage(userId: string, id: string, input: unknown) {
  const data = savePageSchema.parse(input);
  return getDb().$transaction(async (tx) => {
    await lockOwner(tx, userId);
    const page = await ownPage(tx, userId, id);
    if (page.revision !== data.expectedRevision)
      throw new DomainError(
        "CONFLICT",
        409,
        "A página foi alterada. Recarregue antes de salvar.",
      );
    const plan = await accountPlan(tx, userId);
    const template = await allowedTemplate(
      tx,
      plan.key,
      data.templateKey ?? page.templateKey,
    );
    await allowedBlocks(
      tx,
      plan.key,
      data.draft.blocks.map((block) => block.type),
    );
    await requireAvatar(tx, userId, data.draft.profile.avatarAssetId);
    const changedTemplate = template.key !== page.templateKey;
    return tx.page.update({
      where: { id },
      data: {
        draft: data.draft,
        revision: { increment: 1 },
        ...(changedTemplate
          ? {
              templateKey: template.key,
              templateVersion: template.version,
              templateConfig: template.config,
            }
          : {}),
      },
    });
  });
}
export async function publishPage(userId: string, id: string, input: unknown) {
  const { expectedRevision } = revisionSchema.parse(input);
  return getDb().$transaction(async (tx) => {
    await lockOwner(tx, userId);
    const page = await ownPage(tx, userId, id);
    if (page.revision !== expectedRevision)
      throw new DomainError(
        "CONFLICT",
        409,
        "Salve a revisão mais recente antes de publicar.",
      );
    const plan = await accountPlan(tx, userId);
    await allowedTemplate(tx, plan.key, page.templateKey);
    const draft = draftSchema.parse(page.draft);
    await requireAvatar(tx, userId, draft.profile.avatarAssetId);
    await allowedBlocks(
      tx,
      plan.key,
      draft.blocks.map((block) => block.type),
    );
    const version = await tx.publishedVersion.create({
      data: {
        pageId: id,
        sourceRevision: page.revision,
        schemaVersion: 1,
        document: {
          ...draft,
          blocks: draft.blocks.filter((block) => block.visible),
          theme: page.templateConfig,
          templateKey: page.templateKey,
          templateVersion: page.templateVersion,
        },
      },
    });
    await tx.page.update({
      where: { id },
      data: { publishedVersionId: version.id },
    });
    return { versionId: version.id, revision: page.revision };
  });
}
export function unpublishPage(userId: string, id: string) {
  return getDb().$transaction(async (tx) => {
    await lockOwner(tx, userId);
    await ownPage(tx, userId, id);
    await tx.page.update({ where: { id }, data: { publishedVersionId: null } });
    return { unpublished: true };
  });
}
