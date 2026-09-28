import { z } from "zod";

export const signUpFormSchemaClient = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe trop court"),
  objectif_quotidien: z
    .number()
    .min(1, "Objectif requis")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "L'objectif doit être un nombre positif",
    }),

  image: z
    .any()
    .optional()
    .refine(
      (fileList) =>
        !fileList ||
        fileList instanceof FileList ||
        fileList instanceof File || { message: "Image invalide" }
    ),
});

export const signUpFormSchemaServer = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe trop court"),
  objectif_quotidien: z
    .number()
    .min(1, "Objectif requis")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "L'objectif doit être un nombre positif",
    }),

  image: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        // URL HTTP(S) en prod
        if (/^https?:\/\//.test(val)) return true;
        // Chemin local relatif ou absolu
        if (/^(\/|\.\/|\.\.\/)/.test(val)) return true;
        return false;
      },
      { message: "Format d'image invalide (attendu : URL ou chemin relatif)" }
    ),
});

export const signInSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe requis"),
});
