import { test, expect } from "@playwright/test";
import { Pool } from "pg";

const password = "Catlink-Teste-Seguro-123!";

test.beforeAll(async () => {
  const connectionString = process.env.DATABASE_URL;
  if (
    !connectionString ||
    !new URL(connectionString).pathname.endsWith("_test")
  ) {
    throw new Error("Auth tests require a dedicated database ending in _test.");
  }
  const db = new Pool({ connectionString });
  try {
    await db.query('DELETE FROM "RateLimit"');
  } finally {
    await db.end();
  }
});

test("cadastro, sessão persistente, logout e login com PostgreSQL real", async ({
  page,
}) => {
  const email = `auth-${crypto.randomUUID()}@example.com`;
  await page.goto("/cadastro");
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Criar conta", exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Sair da conta" }),
  ).toBeVisible();

  const db = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const result = await db.query(
      'SELECT a.password, u."emailVerified" FROM "Account" a JOIN "User" u ON a."userId" = u.id WHERE u.email = $1',
      [email],
    );
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].password).not.toBe(password);
    expect(result.rows[0].password.length).toBeGreaterThan(32);
    expect(result.rows[0].emailVerified).toBe(false);
  } finally {
    await db.end();
  }

  await page.getByRole("button", { name: "Sair da conta" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByLabel("Senha", { exact: true }).fill("SenhaErrada123");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "E-mail ou senha incorretos" }),
  ).toContainText("E-mail ou senha incorretos");
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page.getByLabel("Lembrar de mim").uncheck();
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);
  const sessionCookie = (await page.context().cookies()).find((cookie) =>
    cookie.name.includes("session_token"),
  );
  expect(sessionCookie?.expires).toBe(-1);
});

test("validação, alternância de senha e navegação no celular", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByText("Informe um e-mail válido.")).toBeVisible();
  await expect(page.getByLabel("E-mail", { exact: true })).toBeFocused();
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page
    .getByRole("button", { name: "Mostrar senha", exact: true })
    .click();
  await expect(page.getByLabel("Senha", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await page
    .getByRole("button", { name: "Ocultar senha", exact: true })
    .click();
  await expect(page.getByLabel("Senha", { exact: true })).toHaveAttribute(
    "type",
    "password",
  );
  await page.getByRole("link", { name: "Crie sua conta grátis" }).click();
  await expect(
    page.getByRole("heading", { name: "Crie sua conta" }),
  ).toBeVisible();
  await page.getByLabel("E-mail", { exact: true }).fill("teste@example.com");
  await page.getByLabel("Senha", { exact: true }).fill("curta");
  await page.getByRole("button", { name: "Criar conta", exact: true }).click();
  await expect(page.getByText("Use pelo menos 8 caracteres.")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("endpoints rejeitam origem externa, senha curta e fluxos de e-mail adiados", async ({
  request,
}) => {
  const malicious = await request.post("/api/auth/sign-up/email", {
    headers: { origin: "https://example.org" },
    data: {
      email: `csrf-${crypto.randomUUID()}@example.com`,
      password,
      name: "Teste",
    },
  });
  expect(malicious.status()).toBe(403);
  const weak = await request.post("/api/auth/sign-up/email", {
    headers: { origin: process.env.BETTER_AUTH_URL || "http://localhost:3000" },
    data: {
      email: `weak-${crypto.randomUUID()}@example.com`,
      password: "123",
      name: "Teste",
    },
  });
  expect(weak.status()).toBe(400);
  const deferred = await request.post("/api/auth/request-password-reset", {
    data: { email: "teste@example.com" },
  });
  expect(deferred.status()).toBe(404);
});

test("limite de tentativas é persistido e retorna 429", async ({ request }) => {
  const db = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await db.query('DELETE FROM "RateLimit"');
  } finally {
    await db.end();
  }
  let limited = false;
  for (let attempt = 0; attempt < 11; attempt++) {
    const response = await request.post("/api/auth/sign-in/email", {
      headers: {
        origin: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      },
      data: { email: "missing-account@example.com", password },
    });
    if (response.status() === 429) {
      limited = true;
      break;
    }
    expect(response.status()).toBe(401);
  }
  expect(limited).toBe(true);
});
