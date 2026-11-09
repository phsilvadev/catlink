import { test, expect, type APIRequestContext } from "@playwright/test";
import { Pool } from "pg";
import { createServer, type Server } from "node:http";
import sharp from "sharp";

const origin = process.env.BETTER_AUTH_URL || "http://localhost:3000";
let db: Pool, storage: Server;
const objects = new Map<string, Buffer>();
const headers = { origin };
const password = "Onboarding-Teste-123!";
const suffix = crypto.randomUUID().slice(0, 8);
async function account(context: APIRequestContext, label: string) {
  const result = await context.post("/api/auth/sign-up/email", {
    headers,
    data: {
      name: "Teste",
      email: `onboarding-${label}-${suffix}@example.com`,
      password,
    },
  });
  expect(result.status()).toBe(200);
  return (await result.json()).user.id as string;
}
async function step(
  context: APIRequestContext,
  number: number,
  data: unknown,
  revision: number,
) {
  return context.post("/api/onboarding", {
    headers,
    data: { step: number, data, expectedRevision: revision },
  });
}
test.beforeAll(async () => {
  if (
    !process.env.DATABASE_URL ||
    !new URL(process.env.DATABASE_URL).pathname.endsWith("_test")
  )
    throw new Error("Use a dedicated _test database.");
  db = new Pool({ connectionString: process.env.DATABASE_URL });
  await db.query('DELETE FROM "RateLimit"');
  storage = createServer(async (req, res) => {
    const key = req.url!.split("?")[0];
    if (req.method === "PUT") {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.from(chunk));
      objects.set(key, Buffer.concat(chunks));
      res.writeHead(200, { ETag: '"test"' });
      res.end();
    } else if (req.method === "GET") {
      const bytes = objects.get(key);
      if (!bytes) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.writeHead(200, {
        "Content-Type": "image/webp",
        "Content-Length": bytes.length,
      });
      res.end(bytes);
    } else {
      objects.delete(key);
      res.writeHead(204);
      res.end();
    }
  });
  await new Promise<void>((resolve) =>
    storage.listen(39010, "127.0.0.1", resolve),
  );
});
test.afterAll(async () => {
  await db?.end();
  if (storage)
    await new Promise<void>((resolve, reject) =>
      storage.close((error) => (error ? reject(error) : resolve())),
    );
});

test("primeiro acesso no celular persiste etapas, foto e perfil e cria um só rascunho", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/cadastro");
  await page
    .getByLabel("E-mail", { exact: true })
    .fill(`onboarding-ui-${suffix}@example.com`);
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Criar conta", exact: true }).click();
  await expect(page).toHaveURL(/\/app\/primeiro-acesso$/);
  await page.getByLabel("Nome do endereço").fill(`perfil-${suffix}`);
  await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await expect(
    page.getByRole("heading", { name: "O que descreve você?" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "O que descreve você?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Marca pessoal/ }).click();
  await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await page.getByRole("button", { name: "Instagram", exact: true }).click();
  await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await page.getByRole("button", { name: /Básico/ }).click();
  await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await page.getByLabel("Nome do perfil").fill("Meu perfil salvo");
  await page
    .getByLabel("Bio", { exact: true })
    .fill("Olá, este é meu Catlink.");
  await page
    .getByLabel("Link do Instagram (opcional)")
    .fill("https://instagram.com/exemplo");
  const image = await sharp({
    create: { width: 60, height: 60, channels: 3, background: "#6366f1" },
  })
    .png()
    .toBuffer();
  await page
    .getByLabel("Selecionar foto do perfil")
    .setInputFiles({ name: "foto.png", mimeType: "image/png", buffer: image });
  await expect(
    page.getByRole("button", { name: "Remover foto" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await expect(
    page.getByRole("heading", { name: "Tudo pronto para começar" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Meu perfil salvo", { exact: true }).last(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Criar meu rascunho" }).click();
  await expect(
    page.getByRole("heading", { name: "Seu Catlink está pronto para editar!" }),
  ).toBeVisible();
  const state = await context.request
    .get("/api/onboarding")
    .then((response) => response.json());
  const id = state.data.completedPageId;
  const draft = await context.request
    .get(`/api/pages/${id}`)
    .then((response) => response.json());
  expect(draft.data.publishedVersionId).toBe(null);
  expect(draft.data.draft.profile.name).toBe("Meu perfil salvo");
  expect(draft.data.draft.blocks[0].items[0].url).toBe(
    "https://instagram.com/exemplo",
  );
  const avatar = await context.request.get(
    `/api/assets/${draft.data.draft.profile.avatarAssetId}`,
  );
  expect(avatar.status()).toBe(200);
  expect((await sharp(await avatar.body()).metadata()).format).toBe("webp");
  const repeated = await step(context.request, 6, {}, state.data.revision - 1);
  expect(repeated.status()).toBe(200);
  expect((await repeated.json()).data.completedPageId).toBe(id);
  expect(
    (
      await context.request
        .get("/api/pages")
        .then((response) => response.json())
    ).data,
  ).toHaveLength(1);
  await page.getByRole("link", { name: "Continuar no editor" }).click();
  await expect(page).toHaveURL(new RegExp(`/app/editor/${id}$`));
  await expect(
    page.getByRole("heading", { name: "Meu perfil salvo", exact: true }),
  ).toBeVisible();
  await page.goto("/app");
  await expect(
    page.getByRole("heading", { name: "Minhas páginas", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toContainText("Rascunho");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("onboarding rejeita saltos, conflito entre abas, URLs inválidas e foto de outra conta", async ({
  playwright,
  request,
}) => {
  const a = await playwright.request.newContext({ baseURL: origin }),
    b = await playwright.request.newContext({ baseURL: origin });
  await account(a, "a");
  await account(b, "b");
  expect((await request.get("/api/onboarding")).status()).toBe(401);
  const initial = await a
    .get("/api/onboarding")
    .then((response) => response.json());
  expect((await step(a, 6, {}, initial.data.revision)).status()).toBe(400);
  expect((await step(a, 1, { slug: `seguro-${suffix}` }, 0)).status()).toBe(
    200,
  );
  expect((await step(a, 1, { slug: `outra-aba-${suffix}` }, 0)).status()).toBe(
    409,
  );
  expect((await step(a, 2, { kind: "personal" }, 1)).status()).toBe(200);
  expect((await step(a, 3, { platforms: ["website"] }, 2)).status()).toBe(200);
  expect(
    (await step(a, 4, { templateKey: "unknown-premium" }, 3)).status(),
  ).toBe(403);
  expect((await step(a, 4, { templateKey: "basic" }, 3)).status()).toBe(200);
  expect(
    (
      await step(
        a,
        5,
        {
          profile: { name: "Nome", bio: "" },
          links: [{ platform: "website", url: "nao-url" }],
        },
        4,
      )
    ).status(),
  ).toBe(400);
  const image = await sharp({
    create: { width: 10, height: 10, channels: 3, background: "#ffffff" },
  })
    .png()
    .toBuffer();
  const asset = await b.post("/api/assets/avatar", {
    headers: { ...headers, "Content-Type": "image/png" },
    data: image,
  });
  expect(asset.status()).toBe(200);
  const assetId = (await asset.json()).data.id;
  expect((await a.get(`/api/assets/${assetId}`)).status()).toBe(404);
  expect(
    (
      await step(
        a,
        5,
        {
          profile: { name: "Nome", bio: "", avatarAssetId: assetId },
          links: [],
        },
        4,
      )
    ).status(),
  ).toBe(404);
  expect(
    (
      await a.post("/api/assets/avatar", {
        headers,
        data: Buffer.from("not an image"),
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await step(a, 5, { profile: { name: "Nome", bio: "" }, links: [] }, 4)
    ).status(),
  ).toBe(200);
  await db.query(
    'DELETE FROM "PlanTemplateAccess" WHERE "planKey"=\'FREE\' AND "templateKey"=\'basic\'',
  );
  try {
    expect((await step(a, 6, {}, 5)).status()).toBe(403);
  } finally {
    await db.query(
      'INSERT INTO "PlanTemplateAccess" ("planKey","templateKey") VALUES (\'FREE\',\'basic\') ON CONFLICT DO NOTHING',
    );
  }
  expect(
    (await b.get("/api/onboarding").then((response) => response.json())).data
      .state.slug,
  ).toBe("");
  await a.dispose();
  await b.dispose();
});
