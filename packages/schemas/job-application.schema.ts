import { z } from "zod";

export const JobApplicationSchema = 
z.object({
    id: z.string().optional(),
    entreprise: z.string(),
    poste: z.string(),
    lieu: z.string(),
    salaire_min: z.number().min(0).optional(),
    salaire_max: z.number().min(0).optional(),
    description: z.string().optional(),
    statut: z.enum([
      "candidature_envoyee",
      "en_attente_reponse",
      "entretien_programme",
      "entretien_passe",
      "refus",
      "accepte",
      "relance_necessaire",
    ]).default("candidature_envoyee"),
    date_candidature: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Date invalide",
      }),
    date_relance: z
      .string()
      .optional()
      .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Date invalide",
      }),
    prochaine_relance: z
      .string()
      .optional()
      .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Date invalide",
      }),
    contact_email: z.string().email().optional(),
    contact_nom: z.string().optional(),
    url_offre: z.string().url().optional(),
    notes: z.string().optional(),
    priorite: z.enum(["faible", "moyenne", "haute"]).default("moyenne"), // ✅ PAS de .optional()
  })
  .refine(
    (data) =>
      data.salaire_min === undefined ||
      data.salaire_max === undefined ||
      data.salaire_min <= data.salaire_max,
    {
      message: "Le salaire minimum doit être inférieur ou égal au salaire maximum",
      path: ["salaire_max"],
    }
  );

