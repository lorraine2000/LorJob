import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  nom: z.string(),
  email: z.string().email(),
  objectif_quotidien: z
    .number()
    .min(1, "Objectif requis")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "L'objectif doit être un nombre positif",
    }),

  // Ajoute ici d'autres propriétés si besoin
});

export type UserType = z.infer<typeof UserSchema>;
