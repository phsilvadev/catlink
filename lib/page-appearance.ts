import catalog from "@/prisma/catalog.json";
import { z } from "zod";
import { draftSchema, templateConfigSchema } from "./schemas/page";
import type { Draft } from "./schemas/page";

export type PageAppearance = "aurora" | "sunset" | "mint" | "pixel";
export type PageTheme = {
  background: string;
  foreground: string;
  accent: string;
  appearance?: PageAppearance;
};
export function entryTheme(key: string): PageTheme {
  if (key === "sunset")
    return {
      appearance: "sunset",
      background: "#fff8fb",
      foreground: "#662944",
      accent: "#d66b9f",
    };
  if (key === "mint")
    return {
      appearance: "mint",
      background: "#f5fbf8",
      foreground: "#204e49",
      accent: "#438f89",
    };
  if (key === "pixel")
    return {
      appearance: "pixel",
      background: "#fff",
      foreground: "#111827",
      accent: "#6366f1",
    };
  return {
    appearance: "aurora",
    background: "#fff",
    foreground: "#111827",
    accent: "#111827",
  };
}
export function templateStarter(
  config: z.infer<typeof templateConfigSchema>,
): Draft {
  return draftSchema.parse({
    schemaVersion: 1,
    profile: config.initialProfile || { name: "Meu Catlink", bio: "" },
    blocks: config.initialBlocks,
  });
}
export function demoProfile(key: string): Draft {
  const template =
    catalog.templates.find((t) => t.key === key) || catalog.templates[0];
  return templateStarter(templateConfigSchema.parse(template.config));
}
