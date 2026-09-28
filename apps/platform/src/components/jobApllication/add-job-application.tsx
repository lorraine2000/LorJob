"use client";

import { Building2, Briefcase, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { JobApplicationSchema } from "@jobi/schemas/job-application.schema";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { PRIORITES, STATUS } from "@jobi/constants";
import {
  CandidatureFormInputType,
  JobApplicationType,
} from "packages/types/jobApplication";
import { LoadingButton } from "../ui/loading-button";

type Props = {
  candidature?: Partial<JobApplicationType>;
  onSoumission: (
    data: CandidatureFormInputType | JobApplicationType
  ) => Promise<void>;
  onAnnulation: () => void;
};

export default function AddJobApplication({
  candidature,
  onSoumission,
  onAnnulation,
}: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CandidatureFormInputType>({
    resolver: zodResolver(JobApplicationSchema),
    defaultValues: {
      entreprise: "",
      poste: "",
      lieu: "",
      salaire_min: 0,
      salaire_max: 0,
      description: "",
      statut: "candidature_envoyee",
      date_candidature: new Date().toISOString().split("T")[0],
      date_relance: "",
      prochaine_relance: "",
      contact_email: "",
      contact_nom: "",
      url_offre: "",
      notes: "",
      priorite: "moyenne",
      ...candidature,
    },
  });

  const onSubmit = async (
    data: CandidatureFormInputType | JobApplicationType
  ) => {
    console.log("Edition de la candidature: ", data.id);
    setLoading(true);
    await onSoumission(data);
    setLoading(false);
  };

  return (
    <Card className="bg-card backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="border-b border-slate-100">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            {candidature ? "Modifier la candidature" : "Nouvelle candidature"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onAnnulation}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ENTREPRISE */}
            <div className="space-y-2">
              <Label htmlFor="entreprise">Entreprise *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  id="entreprise"
                  placeholder="Nom de l'entreprise"
                  className="pl-10"
                  {...register("entreprise")}
                />
                {errors.entreprise && (
                  <p className="text-red-500 text-sm">
                    {errors.entreprise.message}
                  </p>
                )}
              </div>
            </div>

            {/* POSTE */}
            <div className="space-y-2">
              <Label htmlFor="poste">Poste *</Label>
              <Input
                id="poste"
                placeholder="Intitulé du poste"
                {...register("poste")}
              />
              {errors.poste && (
                <p className="text-red-500 text-sm">{errors.poste.message}</p>
              )}
            </div>

            {/* LIEU */}
            <div className="space-y-2">
              <Label htmlFor="lieu">Lieu</Label>
              <Input
                id="lieu"
                placeholder="Ville, département..."
                {...register("lieu")}
              />
            </div>

            {/* DATE */}
            <div className="space-y-2">
              <Label htmlFor="date_candidature">Date de candidature *</Label>
              <Input type="date" {...register("date_candidature")} />
              {errors.date_candidature && (
                <p className="text-red-500 text-sm">
                  {errors.date_candidature.message}
                </p>
              )}
            </div>

            {/* SALAIRE MIN */}
            <div className="space-y-2">
              <Label htmlFor="salaire_min">Salaire minimum (€)</Label>
              <Input
                type="number"
                {...register("salaire_min", { valueAsNumber: true })}
              />
            </div>

            {/* SALAIRE MAX */}
            <div className="space-y-2">
              <Label htmlFor="salaire_max">Salaire maximum (€)</Label>
              <Input
                type="number"
                {...register("salaire_max", { valueAsNumber: true })}
              />
            </div>

            {/* STATUT */}
            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select
                value={watch("statut")}
                onValueChange={(value) =>
                  setValue("statut", value as JobApplicationType["statut"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* PRIORITÉ */}
            <div className="space-y-2">
              <Label htmlFor="priorite">Priorité</Label>
              <Select
                value={watch("priorite")}
                onValueChange={(value) =>
                  setValue("priorite", value as JobApplicationType["priorite"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une priorité" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CONTACT NOM */}
            <div className="space-y-2">
              <Label htmlFor="contact_nom">Contact (nom)</Label>
              <Input id="contact_nom" {...register("contact_nom")} />
            </div>

            {/* CONTACT EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact (email)</Label>
              <Input
                id="contact_email"
                type="email"
                {...register("contact_email")}
              />
              {errors.contact_email && (
                <p className="text-red-500 text-sm">
                  {errors.contact_email.message}
                </p>
              )}
            </div>

            {/* URL OFFRE */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="url_offre">URL de l&apos;offre</Label>
              <Input id="url_offre" type="url" {...register("url_offre")} />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="description">Description du poste</Label>
            <Textarea rows={4} {...register("description")} />
          </div>

          {/* NOTES */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes personnelles</Label>
            <Textarea rows={3} {...register("notes")} />
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-100">
            <LoadingButton
              type="button"
              variant="outline"
              onClick={onAnnulation}
              isLoading={isSubmitting || loading}
              className="flex-1"
            >
              Annuler
            </LoadingButton>
            <LoadingButton
              type="submit"
              disabled={loading}
              isLoading={loading || isSubmitting}
              className={cn(
                "flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                loading && "opacity-60"
              )}
            >
              {loading
                ? "Enregistrement..."
                : Object.keys(candidature ?? {}).length > 0
                ? "Modifier"
                : "Ajouter"}
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
