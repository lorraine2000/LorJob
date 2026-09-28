import { z } from "zod";

import { RelanceSchema } from '@jobi/schemas/relance.schema';

export type RelanceType = z.infer<typeof RelanceSchema>;