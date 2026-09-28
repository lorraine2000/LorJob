import { z } from "zod";

import { ProfilSchema } from '@jobi/schemas/profil.schema';

export type ProfileValues = z.infer<typeof ProfilSchema>;