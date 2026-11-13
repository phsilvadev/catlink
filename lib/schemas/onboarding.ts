import { z } from "zod";
import { slugSchema, draftSchema, webUrl } from "./page";

export const profileKinds = [
  {
    key: "creator",
    name: "Criador de conteúdo",
    description: "Vídeos, lives e conteúdo para seu público.",
  },
  {
    key: "business",
    name: "Negócio",
    description: "Sua empresa, serviços ou negócio local.",
  },
  {
    key: "personal",
    name: "Marca pessoal",
    description: "Seu portfólio, currículo e projetos.",
  },
  {
    key: "influencer",
    name: "Influenciador",
    description: "Sua comunidade, parcerias e novidades.",
  },
  {
    key: "artist",
    name: "Artista",
    description: "Música, arte e trabalhos criativos.",
  },
  {
    key: "other",
    name: "Outro",
    description: "Um espaço para o que faz sentido para você.",
  },
] as const;
export const platforms = [
  { key: "instagram", name: "Instagram" },
  { key: "whatsapp", name: "WhatsApp" },
  { key: "tiktok", name: "TikTok" },
  { key: "youtube", name: "YouTube" },
  { key: "website", name: "Site" },
  { key: "spotify", name: "Spotify" },
  { key: "threads", name: "Threads" },
  { key: "facebook", name: "Facebook" },
  { key: "x", name: "X" },
  { key: "linkedin", name: "LinkedIn" },
] as const;
const kind = z.enum([
  "creator",
  "business",
  "personal",
  "influencer",
  "artist",
  "other",
]);
const platform = z.enum([
  "instagram",
  "whatsapp",
  "tiktok",
  "youtube",
  "website",
  "spotify",
  "threads",
  "facebook",
  "x",
  "linkedin",
]);
const platformList = z
  .array(platform)
  .max(5)
  .refine((values) => new Set(values).size === values.length);
const profile = draftSchema.shape.profile;
const links = z
  .array(z.object({ platform, url: webUrl }).strict())
  .max(5)
  .refine(
    (values) =>
      new Set(values.map((item) => item.platform)).size === values.length,
  );
export const onboardingStateSchema = z
  .object({
    nextStep: z.number().int().min(1).max(6),
    slug: z.string(),
    kind: kind.optional(),
    platforms: platformList,
    templateKey: z.string(),
    profile,
    links,
  })
  .strict();
export const onboardingInputSchema = z.discriminatedUnion("step", [
  z
    .object({
      step: z.literal(1),
      expectedRevision: z.number().int().nonnegative(),
      data: z.object({ slug: slugSchema }).strict(),
    })
    .strict(),
  z
    .object({
      step: z.literal(2),
      expectedRevision: z.number().int().nonnegative(),
      data: z.object({ kind }).strict(),
    })
    .strict(),
  z
    .object({
      step: z.literal(3),
      expectedRevision: z.number().int().nonnegative(),
      data: z.object({ platforms: platformList }).strict(),
    })
    .strict(),
  z
    .object({
      step: z.literal(4),
      expectedRevision: z.number().int().nonnegative(),
      data: z
        .object({
          templateKey: z.string().min(1).max(80),
          complete: z.boolean().optional(),
        })
        .strict(),
    })
    .strict(),
  z
    .object({
      step: z.literal(5),
      expectedRevision: z.number().int().nonnegative(),
      data: z.object({ profile, links }).strict(),
    })
    .strict(),
  z
    .object({
      step: z.literal(6),
      expectedRevision: z.number().int().nonnegative(),
      data: z.object({}).strict(),
    })
    .strict(),
]);
export type OnboardingState = z.infer<typeof onboardingStateSchema>;
export const initialOnboarding: OnboardingState = {
  nextStep: 1,
  slug: "",
  platforms: [],
  templateKey: "",
  profile: { name: "Meu Catlink", bio: "" },
  links: [],
};
