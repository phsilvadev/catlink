import { z } from "zod";

const reserved = new Set([
  "app",
  "api",
  "admin",
  "login",
  "cadastro",
  "recuperar-senha",
  "configuracoes",
  "catalogo",
]);
export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(40)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .refine((value) => !reserved.has(value), "Este endereço está reservado.");
const webUrl = z
  .string()
  .max(2048)
  .url()
  .refine(
    (value) => ["http:", "https:"].includes(new URL(value).protocol),
    "Use uma URL http ou https.",
  );
const base = { id: z.string().uuid(), visible: z.boolean().default(true) };
export const blockSchema = z.discriminatedUnion("type", [
  z
    .object({
      ...base,
      type: z.literal("text"),
      content: z.string().min(1).max(5000),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("link"),
      label: z.string().min(1).max(120),
      url: webUrl,
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("button"),
      label: z.string().min(1).max(120),
      url: webUrl,
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("image"),
      url: webUrl,
      alt: z.string().max(250),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("social"),
      items: z
        .array(
          z.object({ label: z.string().min(1).max(80), url: webUrl }).strict(),
        )
        .max(20),
    })
    .strict(),
]);
export const draftSchema = z
  .object({
    schemaVersion: z.literal(1),
    profile: z
      .object({ name: z.string().min(1).max(80), bio: z.string().max(500) })
      .strict(),
    blocks: z
      .array(blockSchema)
      .max(100)
      .refine(
        (items) => new Set(items.map((item) => item.id)).size === items.length,
        "IDs de blocos repetidos.",
      ),
  })
  .strict();
export const templateConfigSchema = z
  .object({
    schemaVersion: z.literal(1),
    background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    foreground: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    initialBlocks: z.array(blockSchema).max(100),
  })
  .strict();
export const createPageSchema = z
  .object({
    slug: slugSchema,
    name: z.string().trim().min(1).max(80),
    templateKey: z.string().min(1).max(80),
  })
  .strict();
export const savePageSchema = z
  .object({
    expectedRevision: z.number().int().positive(),
    templateKey: z.string().min(1).max(80).optional(),
    draft: draftSchema,
  })
  .strict();
export const revisionSchema = z
  .object({ expectedRevision: z.number().int().positive() })
  .strict();
export type Draft = z.infer<typeof draftSchema>;
