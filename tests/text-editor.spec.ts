import { test, expect } from "@playwright/test";
import { Pool } from "pg";

const origin = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const headers = { origin };
test("painel de texto aplica estilo na prévia, salva, reabre e exclui no PostgreSQL", async ({
  page,
  context,
}) => {
  if (
    !process.env.DATABASE_URL ||
    !new URL(process.env.DATABASE_URL).pathname.endsWith("_test")
  )
    throw new Error("Use a dedicated _test database.");
  const db = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await db.query('DELETE FROM "RateLimit"');
    const suffix = crypto.randomUUID().slice(0, 8);
    const account = await context.request.post("/api/auth/sign-up/email", {
      headers,
      data: {
        name: "Editor",
        email: `text-${suffix}@example.com`,
        password: "Text-Editor-123!",
      },
    });
    expect(account.ok()).toBeTruthy();
    const created = await context.request.post("/api/pages", {
      headers,
      data: {
        slug: `text-${suffix}`,
        name: "Minha página",
        templateKey: "basic",
      },
    });
    expect(created.status()).toBe(200);
    const record = (await created.json()).data;
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto(`/app/editor/${record.id}`);
    await expect(page.getByTestId("phone-frame")).toHaveCSS("width", "300px");
    await expect(page.getByTestId("phone-frame")).toHaveCSS("height", "600px");
    await expect(page.locator(".profile-cover")).toBeVisible();
    await expect(page.locator(".profile-heading h1")).toHaveText(
      "Minha página",
    );
    await page.getByRole("button", { name: "Text", exact: true }).click();
    const settings = page.getByRole("complementary", {
      name: "Configurações do bloco de texto",
    });
    await expect(settings).toHaveCSS("width", "320px");
    await settings
      .getByLabel("Conteúdo", { exact: true })
      .fill("Texto com estilo que fica salvo.");
    const preview = page.getByTestId("page-text-block");
    await expect(preview).toHaveText("Texto com estilo que fica salvo.");
    await settings
      .getByRole("button", { name: "Negrito", exact: true })
      .click();
    await settings
      .getByRole("button", { name: "Itálico", exact: true })
      .click();
    await settings
      .getByRole("button", { name: "Sublinhado", exact: true })
      .click();
    await settings
      .getByRole("button", { name: "Alinhar à esquerda", exact: true })
      .click();
    await settings.getByLabel("Cor do texto", { exact: true }).fill("#7c3aed");
    await settings.getByLabel("Espaço superior", { exact: true }).fill("24");
    await settings.getByLabel("Espaço inferior", { exact: true }).fill("32");
    await settings.getByText("Cor de fundo", { exact: true }).click();
    await expect(
      settings.getByRole("switch", { name: "Ativar cor de fundo" }),
    ).toBeChecked();
    await settings.getByLabel("Tamanho da fonte", { exact: true }).focus();
    await page.keyboard.press("Home");
    for (let i = 0; i < 14; i++) await page.keyboard.press("ArrowRight");
    await expect(preview).toHaveCSS("font-weight", "700");
    await expect(preview).toHaveCSS("font-style", "italic");
    await expect(preview).toHaveCSS("text-align", "left");
    await expect(preview).toHaveCSS("font-size", "24px");
    await expect(preview).toHaveCSS("padding-top", "24px");
    await expect(preview).toHaveCSS("padding-bottom", "32px");
    await expect(preview).toHaveCSS("color", "rgb(124, 58, 237)");
    await settings.getByRole("button", { name: "Salvar alterações" }).click();
    await expect(
      settings.getByRole("button", { name: "Salvar alterações" }),
    ).toBeDisabled();
    const saved = (
      await (await context.request.get(`/api/pages/${record.id}`)).json()
    ).data;
    expect(
      saved.draft.blocks.filter((b: { type: string }) => b.type === "text"),
    ).toHaveLength(1);
    expect(
      saved.draft.blocks.find((b: { type: string }) => b.type === "text").style,
    ).toMatchObject({
      bold: true,
      italic: true,
      underline: true,
      align: "left",
      fontSize: 24,
      color: "#7c3aed",
      paddingTop: 24,
      paddingBottom: 32,
      background: "#f3f4f6",
    });
    await page.reload();
    await expect(page.getByTestId("page-text-block")).toHaveText(
      "Texto com estilo que fica salvo.",
    );
    await page.getByRole("button", { name: "Editar bloco de texto" }).click();
    await expect(
      settings.getByRole("button", { name: "Negrito" }),
    ).toHaveAttribute("aria-pressed", "true");
    await settings
      .getByRole("button", { name: "Excluir bloco de texto" })
      .click();
    await expect(page.getByTestId("page-text-block")).toHaveCount(0);
    const deleted = (
      await (await context.request.get(`/api/pages/${record.id}`)).json()
    ).data;
    expect(
      deleted.draft.blocks.filter((b: { type: string }) => b.type === "text"),
    ).toHaveLength(0);
    expect(
      deleted.draft.blocks.filter((b: { type: string }) => b.type !== "text"),
    ).toEqual(record.draft.blocks);
    expect(deleted.publishedVersionId).toBeNull();
    // The server also validates styles; malformed CSS cannot bypass the UI.
    const invalid = await context.request.put(`/api/pages/${record.id}`, {
      headers,
      data: {
        expectedRevision: deleted.revision,
        draft: {
          ...deleted.draft,
          blocks: [
            {
              id: crypto.randomUUID(),
              type: "text",
              visible: true,
              content: "Inválido",
              style: { fontSize: 999, color: "url(javascript:alert(1))" },
            },
          ],
        },
      },
    });
    expect(invalid.status()).toBe(400);
    const intact = (
      await (await context.request.get(`/api/pages/${record.id}`)).json()
    ).data;
    expect(intact.revision).toBe(deleted.revision);
  } finally {
    await db.end();
  }
});
