import "server-only";
import { templateStarter } from "@/lib/page-appearance";
import { getDb } from "./db";
import type { Prisma } from "@/generated/prisma/client";
import { templateConfigSchema } from "@/lib/schemas/page";

type Db = Prisma.TransactionClient;
export class DomainError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function accountPlan(db: Db, userId: string) {
  const entitlement = await db.entitlement.findUnique({
    where: { userId },
    include: { plan: true },
  });
  const plan =
    entitlement?.plan ?? (await db.plan.findUnique({ where: { key: "FREE" } }));
  if (!plan?.active)
    throw new DomainError(
      "PLAN_UNAVAILABLE",
      403,
      "Plano indisponível. Entre em contato com o suporte.",
    );
  return plan;
}
export async function allowedTemplate(db: Db, planKey: string, key: string) {
  const access = await db.planTemplateAccess.findUnique({
    where: { planKey_templateKey: { planKey, templateKey: key } },
    include: { template: true },
  });
  if (!access?.template.active)
    throw new DomainError(
      "PLAN_REQUIRED",
      403,
      "Seu plano não permite este modelo.",
    );
  const result = templateConfigSchema.safeParse(access.template.config);
  if (!result.success)
    throw new DomainError(
      "INVALID_TEMPLATE",
      409,
      "Modelo temporariamente indisponível.",
    );
  await allowedBlocks(
    db,
    planKey,
    result.data.initialBlocks.map((block) => block.type),
  );
  return { ...access.template, config: result.data };
}
export async function allowedBlocks(db: Db, planKey: string, keys: string[]) {
  const unique = [...new Set(keys)];
  if (!unique.length) return;
  const grants = await db.planBlockAccess.findMany({
    where: {
      planKey,
      blockKey: { in: unique },
      block: { active: true, schemaVersion: 1 },
    },
  });
  if (grants.length !== unique.length)
    throw new DomainError(
      "PLAN_REQUIRED",
      403,
      "Há blocos indisponíveis para seu plano.",
    );
}
export async function listCatalog(userId: string) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const plan = await accountPlan(tx, userId);
    const [templates, blocks] = await Promise.all([
      tx.template.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
        include: { plans: { where: { planKey: plan.key } } },
      }),
      tx.blockDefinition.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
        include: { plans: { where: { planKey: plan.key } } },
      }),
    ]);
    const grants = await tx.planBlockAccess.findMany({
      where: { planKey: plan.key, block: { active: true, schemaVersion: 1 } },
    });
    const blockKeys = new Set(grants.map((grant) => grant.blockKey));
    return {
      plan: { key: plan.key, name: plan.name, pageLimit: plan.pageLimit },
      templates: templates.map((template) => {
        const config = templateConfigSchema.safeParse(template.config);
        return {
          key: template.key,
          name: template.name,
          description: template.description,
          thumbnail: template.thumbnail,
          preview: config.success
            ? { draft: templateStarter(config.data), theme: config.data }
            : null,
          version: template.version,
          allowed:
            template.plans.length > 0 &&
            config.success &&
            config.data.initialBlocks.every((block) =>
              blockKeys.has(block.type),
            ),
        };
      }),
      blocks: blocks.map((block) => ({
        key: block.key,
        name: block.name,
        description: block.description,
        allowed: block.plans.length > 0 && block.schemaVersion === 1,
      })),
    };
  });
}
