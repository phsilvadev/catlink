import "server-only";
import { randomUUID } from "node:crypto";
import { getDb } from "./db";
import {
  accountPlan,
  allowedTemplate,
  allowedBlocks,
  DomainError,
} from "./catalog";
import {
  onboardingStateSchema,
  onboardingInputSchema,
  initialOnboarding,
  platforms,
} from "@/lib/schemas/onboarding";
import { draftSchema, slugSchema } from "@/lib/schemas/page";
import type { Prisma } from "@/generated/prisma/client";
import { requireAvatar } from "./assets";

async function stateFor(tx: Prisma.TransactionClient, userId: string) {
  return tx.onboarding.upsert({
    where: { userId },
    create: { userId, state: initialOnboarding },
    update: {},
  });
}
export function readOnboarding(userId: string) {
  return getDb().$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "User" WHERE id=${userId} FOR UPDATE`;
    return stateFor(tx, userId);
  });
}
export async function updateOnboarding(userId: string, input: unknown) {
  const request = onboardingInputSchema.parse(input);
  return getDb().$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "User" WHERE id=${userId} FOR UPDATE`;
    const saved = await stateFor(tx, userId);
    if (saved.completedPageId) return saved; // Completion is idempotent, including repeated submissions.
    if (saved.revision !== request.expectedRevision)
      throw new DomainError(
        "CONFLICT",
        409,
        "Seu progresso mudou em outra aba. Recarregue para continuar.",
      );
    const state = onboardingStateSchema.parse(saved.state);
    if (request.step > state.nextStep)
      throw new DomainError(
        "STEP_REQUIRED",
        400,
        "Conclua as etapas anteriores.",
      );
    const plan = await accountPlan(tx, userId);
    if (request.step === 1) {
      if (await tx.page.findUnique({ where: { slug: request.data.slug } }))
        throw new DomainError(
          "SLUG_TAKEN",
          409,
          "Esse endereço já está em uso. Escolha outro.",
        );
      state.slug = request.data.slug;
    }
    if (request.step === 2) state.kind = request.data.kind;
    if (request.step === 3) {
      state.platforms = request.data.platforms;
      state.links = state.links.filter((link) =>
        state.platforms.includes(link.platform),
      );
    }
    if (request.step === 4) {
      await allowedTemplate(tx, plan.key, request.data.templateKey);
      state.templateKey = request.data.templateKey;
    }
    if (request.step === 5) {
      if (
        request.data.links.some(
          (link) => !state.platforms.includes(link.platform),
        )
      )
        throw new DomainError(
          "VALIDATION",
          400,
          "Escolha as plataformas antes de preencher os links.",
        );
      await requireAvatar(tx, userId, request.data.profile.avatarAssetId);
      if (request.data.links.length)
        await allowedBlocks(tx, plan.key, ["social"]);
      state.profile = request.data.profile;
      state.links = request.data.links;
    }
    if (request.step === 6) {
      slugSchema.parse(state.slug);
      if (!state.kind)
        throw new DomainError(
          "STEP_REQUIRED",
          400,
          "Escolha seu tipo de perfil.",
        );
      const template = await allowedTemplate(tx, plan.key, state.templateKey);
      if (
        (await tx.page.count({ where: { ownerId: userId } })) >= plan.pageLimit
      )
        throw new DomainError(
          "PLAN_LIMIT",
          403,
          "Você atingiu o limite de páginas do seu plano. Acesse suas páginas.",
        );
      await requireAvatar(tx, userId, state.profile.avatarAssetId);
      const blocks = template.config.initialBlocks.map((block) => ({
        ...block,
        id: randomUUID(),
      }));
      if (state.links.length)
        blocks.push({
          id: randomUUID(),
          type: "social",
          visible: true,
          items: state.links.map((link) => ({
            label: platforms.find((item) => item.key === link.platform)!.name,
            url: link.url,
          })),
        });
      await allowedBlocks(
        tx,
        plan.key,
        blocks.map((block) => block.type),
      );
      const draft = draftSchema.parse({
        schemaVersion: 1,
        profile: state.profile,
        blocks,
      });
      const page = await tx.page.create({
        data: {
          ownerId: userId,
          slug: state.slug,
          templateKey: template.key,
          templateVersion: template.version,
          templateConfig: template.config,
          draft,
        },
      });
      return tx.onboarding.update({
        where: { userId },
        data: { state, revision: { increment: 1 }, completedPageId: page.id },
      });
    }
    state.nextStep = Math.max(state.nextStep, Math.min(request.step + 1, 6));
    return tx.onboarding.update({
      where: { userId },
      data: { state, revision: { increment: 1 } },
    });
  });
}
