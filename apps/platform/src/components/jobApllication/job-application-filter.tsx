import React from "react";
import { JobApplicationFilterType, JobApplicationFilterProps } from "@jobi/types/jobApplication";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Filter } from "lucide-react";
import { PRIORITES, STATUS } from "@jobi/constants";

export default function JobApplicationFilter({
  filtres,
  onFiltresChange,
}: JobApplicationFilterProps) {
  const gererChangementFiltre = (type: keyof JobApplicationFilterType, valeur: string) => {
    onFiltresChange((prev) => ({
      ...prev,
      [type]: valeur,
    }));
  };

  return (
    <Card className="bg-card text-card-foreground shadow-sm mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filtres :</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Select
              value={filtres.statut}
              onValueChange={(value) => gererChangementFiltre("statut", value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS.map((statut) => (
                  <SelectItem key={statut.value} value={statut.value}>
                    {statut.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filtres.priorite}
              onValueChange={(value) => gererChangementFiltre("priorite", value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITES.map((priorite) => (
                  <SelectItem key={priorite.value} value={priorite.value}>
                    {priorite.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
