import { test, expect, type APIRequestContext } from "@playwright/test";
import { Pool } from "pg";

test.describe.configure({ mode: "serial" });
const suffix = crypto.randomUUID().slice(0, 8);
const freePlan = `test-free-${suffix}`,
  paidPlan = `test-paid-${suffix}`;
const freeTemplate = `test-basic-${suffix}`,
  paidTemplate = `test-premium-${suffix}`;
const theme = {
  schemaVersion: 1,
  background: "#ffffff",
  foreground: "#111827",
  accent: "#6366f1",
  initialBlocks: [],
};
const origin = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const headers = { origin };
let free: APIRequestContext, paid: APIRequestContext, db: Pool;
let freeId: string, paidId: string, pageId: string;

const draft = (type: "text" | "button" = "text") => ({
  schemaVersion: 1,
  profile: { name: "Página de teste", bio: "" },
  blocks:
    type === "text"
      ? [
          {
            id: crypto.randomUUID(),
            type: "text",
            content: "Olá",
            visible: true,
          },
        ]
      : [
          {
            id: crypto.randomUUID(),
            type: "button",
            label: "Site",
            url: "https://example.com",
            visible: true,
          },
        ],
});

test.beforeAll(async ({ playwright }) => {
  if (
    !process.env.DATABASE_URL ||
    !new URL(process.env.DATABASE_URL).pathname.endsWith("_test")
  )
    throw new Error("Use a dedicated database ending in _test.");
  db = new Pool({ connectionString: process.env.DATABASE_URL });
  await db.query('DELETE FROM "RateLimit"');
  free = await playwright.request.newContext({ baseURL: origin });
  paid = await playwright.request.newContext({ baseURL: origin });
  for (const [context, label] of [
    [free, "free"],
    [paid, "paid"],
  ] as const) {
    const response = await context.post("/api/auth/sign-up/email", {
      headers,
      data: {
        email: `catalog-${label}-${suffix}@example.com`,
        name: "Teste",
        password: "Catalogo-Teste-123!",
      },
    });
    expect(response.status()).toBe(200);
    const userId = (await response.json()).user.id;
    if (label === "free") freeId = userId;
    else paidId = userId;
  }
  await db.query(
    "INSERT INTO \"Plan\" (key,name,\"pageLimit\",active) VALUES ($1,'Teste gratuito',1,true),($2,'Teste pago',2,true)",
    [freePlan, paidPlan],
  );
  await db.query(
    'INSERT INTO "Entitlement" ("userId","planKey","updatedAt") VALUES ($1,$2,NOW()),($3,$4,NOW())',
    [freeId, freePlan, paidId, paidPlan],
  );
  await db.query(
    "INSERT INTO \"Template\" (key,name,description,active,version,config,\"updatedAt\") VALUES ($1,'Básico teste','Teste',true,1,$3,NOW()),($2,'Premium teste','Teste',true,1,$3,NOW())",
    [freeTemplate, paidTemplate, theme],
  );
  await db.query(
    'INSERT INTO "PlanTemplateAccess" ("planKey","templateKey") VALUES ($1,$3),($2,$3),($2,$4)',
    [freePlan, paidPlan, freeTemplate, paidTemplate],
  );
  await db.query(
    "INSERT INTO \"PlanBlockAccess\" (\"planKey\",\"blockKey\") VALUES ($1,'text'),($2,'text'),($2,'button')",
    [freePlan, paidPlan],
  );
});

test.afterAll(async () => {
  if (!db) return;
  await db.query('DELETE FROM "User" WHERE id = ANY($1)', [
    [freeId, paidId].filter(Boolean),
  ]);
  await db.query('DELETE FROM "Plan" WHERE key = ANY($1)', [
    [freePlan, paidPlan],
  ]);
  await db.query('DELETE FROM "Template" WHERE key = ANY($1)', [
    [freeTemplate, paidTemplate],
  ]);
  await db.end();
  await free?.dispose();
  await paid?.dispose();
});

test("catálogo consulta concessões reais e bloqueia tentativas diretas", async ({
  request,
  page,
}) => {
  expect((await request.get("/api/catalog")).status()).toBe(401);
  const response = await free.get("/api/catalog");
  expect(response.status()).toBe(200);
  const catalog = (await response.json()).data;
  expect(
    catalog.templates.find((item: { key: string }) => item.key === freeTemplate)
      .allowed,
  ).toBe(true);
  expect(
    catalog.templates.find((item: { key: string }) => item.key === paidTemplate)
      .allowed,
  ).toBe(false);
  expect(
    catalog.blocks.find((item: { key: string }) => item.key === "button")
      .allowed,
  ).toBe(false);
  const denied = await free.post("/api/pages", {
    headers,
    data: {
      name: "Teste",
      slug: `premium-${suffix}`,
      templateKey: paidTemplate,
    },
  });
  expect(denied.status()).toBe(403);
  expect((await denied.json()).code).toBe("PLAN_REQUIRED");
  expect(
    (
      await free.post("/api/pages", {
        headers,
        data: {
          name: "Teste",
          slug: `forge-${suffix}`,
          templateKey: freeTemplate,
          planKey: paidPlan,
          ownerId: paidId,
        },
      })
    ).status(),
  ).toBe(400);
  await page.context().addCookies((await free.storageState()).cookies);
  await page.goto("/app/catalogo");
  await expect(
    page.getByRole("heading", { name: "Modelos e blocos" }),
  ).toBeVisible();
  await expect(
    page.getByRole("article").filter({ hasText: "Premium teste" }),
  ).toContainText("Não incluído");
});

test("limite gratuito é atômico com criações simultâneas e slug é global", async () => {
  const results = await Promise.all(
    ["a", "b"].map((letter) =>
      free.post("/api/pages", {
        headers,
        data: {
          name: "Teste",
          slug: `free-${letter}-${suffix}`,
          templateKey: freeTemplate,
        },
      }),
    ),
  );
  expect(results.map((result) => result.status()).sort()).toEqual([200, 403]);
  const success = results.find((result) => result.status() === 200)!;
  const created = (await success.json()).data;
  pageId = created.id;
  expect(
    (await free.get("/api/pages").then((result) => result.json())).data,
  ).toHaveLength(1);
  const duplicate = await paid.post("/api/pages", {
    headers,
    data: {
      name: "Teste",
      slug: created.slug.toUpperCase(),
      templateKey: freeTemplate,
    },
  });
  expect(duplicate.status()).toBe(409);
  const reserved = await paid.post("/api/pages", {
    headers,
    data: { name: "Teste", slug: "login", templateKey: freeTemplate },
  });
  expect(reserved.status()).toBe(400);
});

test("salvar e publicar revalidam plano, revisão, origem e propriedade", async () => {
  expect((await paid.get(`/api/pages/${pageId}`)).status()).toBe(404);
  expect(
    (
      await paid.put(`/api/pages/${pageId}`, {
        headers,
        data: { expectedRevision: 1, draft: draft() },
      })
    ).status(),
  ).toBe(404);
  expect(
    (
      await paid.post(`/api/pages/${pageId}/publish`, {
        headers,
        data: { expectedRevision: 1 },
      })
    ).status(),
  ).toBe(404);
  expect(
    (await paid.delete(`/api/pages/${pageId}/publish`, { headers })).status(),
  ).toBe(404);
  expect(
    (
      await free.put(`/api/pages/${pageId}`, {
        headers,
        data: { expectedRevision: 1, draft: draft("button") },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await free.put(`/api/pages/${pageId}`, {
        headers: { origin: "https://example.org" },
        data: { expectedRevision: 1, draft: draft() },
      })
    ).status(),
  ).toBe(403);
  const unsafe = draft("button");
  unsafe.blocks[0] = {
    ...unsafe.blocks[0],
    url: "javascript:alert(1)",
  } as (typeof unsafe.blocks)[0];
  expect(
    (
      await free.put(`/api/pages/${pageId}`, {
        headers,
        data: { expectedRevision: 1, draft: unsafe },
      })
    ).status(),
  ).toBe(400);
  const valid = await free.put(`/api/pages/${pageId}`, {
    headers,
    data: { expectedRevision: 1, draft: draft() },
  });
  expect(valid.status()).toBe(200);
  expect((await valid.json()).data.revision).toBe(2);
  expect(
    (
      await free.put(`/api/pages/${pageId}`, {
        headers,
        data: { expectedRevision: 1, draft: draft() },
      })
    ).status(),
  ).toBe(409);
  expect(
    (
      await free.post(`/api/pages/${pageId}/publish`, {
        headers,
        data: { expectedRevision: 1 },
      })
    ).status(),
  ).toBe(409);
  await db.query(
    'DELETE FROM "PlanBlockAccess" WHERE "planKey"=$1 AND "blockKey"=\'text\'',
    [freePlan],
  );
  expect(
    (
      await free.post(`/api/pages/${pageId}/publish`, {
        headers,
        data: { expectedRevision: 2 },
      })
    ).status(),
  ).toBe(403);
  await db.query(
    'INSERT INTO "PlanBlockAccess" ("planKey","blockKey") VALUES ($1,\'text\')',
    [freePlan],
  );
  expect(
    (
      await free.post(`/api/pages/${pageId}/publish`, {
        headers,
        data: { expectedRevision: 2 },
      })
    ).status(),
  ).toBe(200);
  await free.put(`/api/pages/${pageId}`, {
    headers,
    data: {
      expectedRevision: 2,
      draft: { ...draft(), profile: { name: "Somente rascunho", bio: "" } },
    },
  });
  const snapshot = await db.query(
    'SELECT v.document FROM "PublishedVersion" v JOIN "Page" p ON p."publishedVersionId"=v.id WHERE p.id=$1',
    [pageId],
  );
  expect(snapshot.rows[0].document.profile.name).toBe("Página de teste");
  expect(JSON.stringify(snapshot.rows[0].document)).not.toContain(freeId);
  expect(
    (await free.delete(`/api/pages/${pageId}/publish`, { headers })).status(),
  ).toBe(200);
  const state = (
    await free.get(`/api/pages/${pageId}`).then((result) => result.json())
  ).data;
  expect(state.publishedVersionId).toBe(null);
  expect(state.draft.profile.name).toBe("Somente rascunho");
});

test("plano autorizado usa premium e alterações do catálogo preservam o snapshot aplicado", async () => {
  const created = await paid.post("/api/pages", {
    headers,
    data: { name: "Pago", slug: `paid-${suffix}`, templateKey: paidTemplate },
  });
  expect(created.status()).toBe(200);
  const id = (await created.json()).data.id;
  expect(
    (
      await paid.put(`/api/pages/${id}`, {
        headers,
        data: { expectedRevision: 1, draft: draft("button") },
      })
    ).status(),
  ).toBe(200);
  await db.query('UPDATE "Template" SET version=2,config=$2 WHERE key=$1', [
    paidTemplate,
    { ...theme, accent: "#000000" },
  ]);
  expect(
    (
      await paid.put(`/api/pages/${id}`, {
        headers,
        data: { expectedRevision: 2, draft: draft("button") },
      })
    ).status(),
  ).toBe(200);
  const saved = (
    await paid.get(`/api/pages/${id}`).then((result) => result.json())
  ).data;
  expect(saved.templateVersion).toBe(1);
  expect(saved.templateConfig.accent).toBe("#6366f1");
  await db.query('UPDATE "Template" SET active=false WHERE key=$1', [
    paidTemplate,
  ]);
  expect(
    (
      await paid.post(`/api/pages/${id}/publish`, {
        headers,
        data: { expectedRevision: 3 },
      })
    ).status(),
  ).toBe(403);
  const retained = (
    await paid.get(`/api/pages/${id}`).then((result) => result.json())
  ).data;
  expect(retained.draft.blocks).toHaveLength(1);
});
