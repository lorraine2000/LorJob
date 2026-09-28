import { z } from "zod";
import { JobApplicationSchema } from "./job-application.schema";

export const RelanceSchema = z.object({
  id: z.string(),
  jobApplicationId: z.string(),
  jobApplication: JobApplicationSchema,
  dateRelance: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "dateRelance invalide",
    }),
  statut: z.enum(["à faire", "faite", "en retard"]),
  note: z.string().optional(),
  dateDerniereRelance: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "dateDerniereRelance invalide",
    }),
});
