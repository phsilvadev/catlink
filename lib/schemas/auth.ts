import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Informe um e-mail válido.")
  .max(254, "O e-mail é muito longo.");
export const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Informe sua senha.")
    .max(128, "A senha deve ter no máximo 128 caracteres."),
});
export const signUpSchema = signInSchema.extend({
  password: z
    .string()
    .min(8, "Use pelo menos 8 caracteres.")
    .max(128, "Use no máximo 128 caracteres."),
});
