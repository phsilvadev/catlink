import { test, expect } from "@playwright/test";
import { Pool } from "pg";

const origin = process.env.BETTER_AUTH_URL || "http://localhost:3000";

test("HTML integrado mantém a prévia sem reload, anima a volta e aplica PixelMaster no rascunho", async ({
  page,
  context,
}) => {
  if (
    !process.env.DATABASE_URL ||
    !new URL(process.env.DATABASE_URL).pathname.endsWith("_test")
  )
    throw new Error("Use a dedicated _test database.");
  const db = new Pool({ connectionString: process.env.DATABASE_URL });
  const suffix = crypto.randomUUID().slice(0, 8);
  const plan = `ENTRY_TEST_${suffix}`;
  let userId = "";
  try {
    await db.query('DELETE FROM "RateLimit"');
    const account = await context.request.post("/api/auth/sign-up/email", {
      headers: { origin },
      data: {
        name: "Prévia",
        email: `entry-${suffix}@example.com`,
        password: "Entry-Teste-123!",
      },
    });
    expect(account.ok()).toBeTruthy();
    userId = (await account.json()).user.id;
    await db.query(
      'INSERT INTO "Plan" (key,name,"pageLimit",active) VALUES ($1,$2,1,true)',
      [plan, "Teste de modelos"],
    );
    await db.query(
      'INSERT INTO "PlanTemplateAccess" ("planKey","templateKey") SELECT $1,key FROM "Template" WHERE key=ANY($2)',
      [plan, ["basic", "sunset", "mint", "pixel"]],
    );
    await db.query(
      'INSERT INTO "PlanBlockAccess" ("planKey","blockKey") SELECT $1,key FROM "BlockDefinition"',
      [plan],
    );
    await db.query(
      'INSERT INTO "Entitlement" ("userId","planKey","updatedAt") VALUES ($1,$2,NOW())',
      [userId, plan],
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/app/primeiro-acesso");
    const initialTime = await page.evaluate(() => performance.timeOrigin);
    const frame = await page.locator(".showcase-phone").elementHandle();
    await page.getByLabel("Nome de usuário").fill(`entry-${suffix}`);
    await page.getByRole("button", { name: "Confirmar meu link" }).click();
    await expect(
      page.getByRole("heading", { name: "O que descreve você?" }),
    ).toBeVisible();
    await page.getByRole("radio", { name: /Marca pessoal/ }).check();
    await page.getByRole("button", { name: "Salvar e continuar" }).click();
    await expect(
      page.getByRole("heading", { name: "Quais plataformas você usa?" }),
    ).toBeVisible();
    await page
      .getByRole("checkbox", { name: "Instagram", exact: true })
      .check();
    await page.getByRole("button", { name: "Salvar e continuar" }).click();
    await expect(
      page.getByRole("heading", { name: "Escolha seu modelo" }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page
          .locator(".showcase-phone")
          .evaluate((el) => Math.round(el.getBoundingClientRect().width)),
      )
      .toBe(315);
    await page.getByRole("button", { name: "Mostrar próximo modelo" }).click();
    await page
      .getByRole("radio", { name: "Tema PixelMaster", exact: true })
      .check();
    await expect(page.locator(".showcase-phone")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await expect(page.locator(".showcase-phone")).toHaveAttribute(
      "data-theme",
      "pixel",
    );
    await expect(page.locator(".pixel-template")).toBeVisible();
    await expect(page.locator(".pixel-template h1")).toContainText(
      "PixelMaster",
    );
    await page.getByRole("button", { name: "Voltar", exact: true }).click();
    await expect
      .poll(() =>
        page.locator(".showcase-phone").evaluate((el) => {
          const w = el.getBoundingClientRect().width;
          return w > 270 && w < 315;
        }),
      )
      .toBeTruthy();
    await expect
      .poll(() =>
        page
          .locator(".showcase-phone")
          .evaluate((el) => Math.round(el.getBoundingClientRect().width)),
      )
      .toBe(270);
    await expect(
      page.getByRole("checkbox", { name: "Instagram", exact: true }),
    ).toBeChecked();
    await expect(
      page.getByRole("button", { name: "Experimentar tema Rosa" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Salvar e continuar" }).click();
    await expect(
      page.getByRole("radio", { name: "Tema PixelMaster", exact: true }),
    ).toBeChecked();
    expect(await page.evaluate(() => performance.timeOrigin)).toBe(initialTime);
    expect(
      await frame?.evaluate(
        (el) => el === document.querySelector(".showcase-phone"),
      ),
    ).toBe(true);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "Concluir configuração" }).click();
    await expect(page).toHaveURL(/\/app\/editor\//);
    const progress = (
      await (await context.request.get("/api/onboarding")).json()
    ).data;
    const saved = (
      await (
        await context.request.get(`/api/pages/${progress.completedPageId}`)
      ).json()
    ).data;
    expect(saved.templateKey).toBe("pixel");
    expect(saved.templateConfig.background).toBe("#ffffff");
    expect(saved.templateConfig.appearance).toBe("pixel");
    expect(saved.publishedVersionId).toBeNull();
  } finally {
    if (userId)
      await db.query('DELETE FROM "Entitlement" WHERE "userId"=$1', [userId]);
    await db.query('DELETE FROM "Plan" WHERE key=$1', [plan]);
    await db.end();
  }
});
