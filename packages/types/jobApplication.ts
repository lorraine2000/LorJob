import { z } from "zod";

import { PRIORITES, STATUS } from "@jobi/constants";
import { JobApplicationSchema } from "@jobi/schemas/job-application.schema";

export type JobApplicationType = z.infer<typeof JobApplicationSchema>;
export type CandidatureFormInputType = z.input<typeof JobApplicationSchema>;

export type StatutValue = (typeof STATUS)[number]["value"];
export type PrioriteValue = (typeof PRIORITES)[number]["value"];

export interface JobApplicationFilterType {
  statut: StatutValue;
  priorite: PrioriteValue;
}

export interface JobApplicationFilterProps {
  filtres: JobApplicationFilterType;
  onFiltresChange: React.Dispatch<
    React.SetStateAction<JobApplicationFilterType>
  >;
}

export interface JobApplicationsProps {
  candidatures: JobApplicationType[];
  onEdition: (candidature: JobApplicationType) => void;
}
