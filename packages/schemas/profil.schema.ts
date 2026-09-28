import { z } from "zod";

export const ProfilSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  objectif_quotidien: z
    .number()
    .min(1, "Objectif requis")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "L'objectif doit être un nombre positif",
    }),

  preferredLocale: z.enum(["fr", "en"]),
  image: z
    .any()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        (typeof val === "object" &&
          val !== null &&
          "length" in val &&
          typeof val.length === "number"),
      {
        message: "Image invalide",
      }
    ),
});

export const ProfilSchemaApi = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  objectif_quotidien: z
    .number()
    .min(1, "Objectif requis")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "L'objectif doit être un nombre positif",
    }),

  preferredLocale: z.enum(["fr", "en"]),
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
