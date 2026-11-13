import { test, expect, type APIRequestContext } from "@playwright/test";
import { Pool } from "pg";

test.describe.configure({ mode: "serial" });
const origin = process.env.BETTER_AUTH_URL || "http://localhost:3000";
let auth: APIRequestContext;
let cookies: Awaited<ReturnType<APIRequestContext["storageState"]>>["cookies"];
const suffix = crypto.randomUUID().slice(0, 8);
test.beforeAll(async ({ playwright }) => {
  if (
    !process.env.DATABASE_URL ||
    !new URL(process.env.DATABASE_URL).pathname.endsWith("_test")
  )
    throw new Error("Use an isolated _test database.");
  const db = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await db.query('DELETE FROM "RateLimit"');
  } finally {
    await db.end();
  }
  auth = await playwright.request.newContext({ baseURL: origin });
  const response = await auth.post("/api/auth/sign-up/email", {
    headers: { origin },
    data: {
      name: "Username Test",
      email: `username-${suffix}@example.com`,
      password: "Username-Teste-123!",
    },
  });
  expect(response.status()).toBe(200);
  cookies = (await auth.storageState()).cookies;
});
test.afterAll(async () => {
  await auth?.dispose();
});
test.beforeEach(async ({ page }) => {
  await page.context().addCookies(cookies);
  await page.goto("/app/primeiro-acesso");
});

test("pausa de digitação mostra spinner antes do sucesso e invalida checks anteriores", async ({
  page,
}) => {
  const start = new Date("2026-11-13T12:00:00Z");
  await page.clock.install({ time: start });
  await page.clock.pauseAt(new Date(start.getTime() + 1000));
  const calls: string[] = [];
  let release: () => void = () => undefined;
  await page.route("**/api/onboarding/slug?*", async (route) => {
    const slug = new URL(route.request().url()).searchParams.get("slug")!;
    calls.push(slug);
    await new Promise<void>((resolve) => {
      release = resolve;
    });
    await route
      .fulfill({ json: { data: { slug, available: true } } })
      .catch(() => undefined);
  });
  const input = page.getByLabel("Nome de usuário"),
    submit = page.getByRole("button", { name: "Confirmar meu link" });
  await input.fill("primeiro-nome");
  await page.clock.fastForward(300);
  await input.fill("segundo-nome");
  await page.clock.fastForward(449);
  expect(calls).toHaveLength(0);
  await expect(page.getByTestId("slug-check-success")).toHaveCount(0);
  await page.clock.fastForward(1);
  await expect.poll(() => calls.length).toBe(1);
  await expect(page.getByTestId("slug-check-spinner")).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "Verificando nome de usuário",
  );
  await expect(submit).toBeDisabled();
  release();
  await expect(page.getByTestId("slug-check-success")).toBeVisible();
  await expect(submit).toBeEnabled();
  // Returning to a formerly checked name must not briefly reuse the old green state.
  await input.fill("outro-nome");
  await input.fill("segundo-nome");
  await expect(page.getByTestId("slug-check-success")).toHaveCount(0);
  await expect(submit).toBeDisabled();
  await page.clock.fastForward(450);
  await expect.poll(() => calls.length).toBe(2);
  await expect(page.getByTestId("slug-check-spinner")).toBeVisible();
  release();
  await expect(submit).toBeEnabled();
});

test("respostas antigas não substituem nome ocupado; erro permite tentar novamente", async ({
  page,
}) => {
  let releaseOld: () => void = () => undefined;
  await page.route("**/api/onboarding/slug?*", async (route) => {
    const slug = new URL(route.request().url()).searchParams.get("slug")!;
    if (slug === "nome-antigo") {
      await new Promise<void>((resolve) => {
        releaseOld = resolve;
      });
      await route
        .fulfill({ json: { data: { slug, available: true } } })
        .catch(() => undefined);
      return;
    }
    if (slug === "falha-rede") {
      await route.fulfill({ status: 503, json: { message: "unavailable" } });
      return;
    }
    await route.fulfill({ json: { data: { slug, available: false } } });
  });
  const input = page.getByLabel("Nome de usuário");
  await input.fill("nome-antigo");
  await expect(page.getByTestId("slug-check-spinner")).toBeVisible();
  await input.fill("nome-ocupado");
  await expect(page.getByRole("status")).toContainText("já está em uso");
  releaseOld();
  await expect(page.getByTestId("slug-check-success")).toHaveCount(0);
  await input.fill("falha-rede");
  await expect(
    page.getByRole("button", { name: "Tentar novamente" }),
  ).toBeVisible();
  await page.unroute("**/api/onboarding/slug?*");
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.getByTestId("slug-check-success")).toBeVisible();
});

test("consulta real autentica, valida nomes e segue as medidas do HTML", async ({
  page,
  request,
}) => {
  expect((await request.get("/api/onboarding/slug?slug=teste")).status()).toBe(
    401,
  );
  expect((await auth.get("/api/onboarding/slug?slug=login")).status()).toBe(
    400,
  );
  const taken = `ja-existe-${suffix}`;
  const created = await auth.post("/api/pages", {
    headers: { origin },
    data: { slug: taken, name: "Página existente", templateKey: "basic" },
  });
  expect(created.status()).toBe(200);
  const response = await auth.get(`/api/onboarding/slug?slug=${taken}`);
  expect(response.headers()["cache-control"]).toBe("no-store");
  expect((await response.json()).data.available).toBe(false);
  await page.setViewportSize({ width: 837, height: 872 });
  await page.getByLabel("Nome de usuário").fill(taken);
  await expect(page.getByRole("status")).toContainText("já está em uso");
  await expect(
    page.getByRole("button", { name: "Confirmar meu link" }),
  ).toBeDisabled();
  const box = await page.getByTestId("username-panel").boundingBox();
  expect(box!.width).toBe(420);
  expect(Math.abs(box!.x - (837 - 420) / 2)).toBeLessThan(1);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
