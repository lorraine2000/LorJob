import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Building2,
  MapPin,
  Euro,
  Calendar,
  Edit,
  ExternalLink,
  Star,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { JobApplicationsProps } from "packages/types/jobApplication";
import { LoadingButton } from "../ui/loading-button";

type Statut =
  | "candidature_envoyee"
  | "en_attente_reponse"
  | "entretien_programme"
  | "entretien_passe"
  | "refus"
  | "accepte"
  | "relance_necessaire";

type Priorite = "faible" | "moyenne" | "haute";

const statutsCouleurs: Record<Statut, string> = {
  candidature_envoyee: "bg-blue-100 text-blue-800 border-blue-200",
  en_attente_reponse: "bg-amber-100 text-amber-800 border-amber-200",
  entretien_programme: "bg-purple-100 text-purple-800 border-purple-200",
  entretien_passe: "bg-indigo-100 text-indigo-800 border-indigo-200",
  refus: "bg-red-100 text-red-800 border-red-200",
  accepte: "bg-green-100 text-green-800 border-green-200",
  relance_necessaire: "bg-orange-100 text-orange-800 border-orange-200",
};

const statutsTexte: Record<Statut, string> = {
  candidature_envoyee: "Candidature envoyée",
  en_attente_reponse: "En attente de réponse",
  entretien_programme: "Entretien programmé",
  entretien_passe: "Entretien passé",
  refus: "Refusé",
  accepte: "Accepté",
  relance_necessaire: "Relance nécessaire",
};

const prioritesCouleurs: Record<Priorite, string> = {
  faible: "text-green-600",
  moyenne: "text-amber-600",
  haute: "text-red-600",
};

export default function JobApplications({
  candidatures,
  onEdition,
}: JobApplicationsProps) {
  if (candidatures.length === 0) {
    return (
      <Card className="bg-card backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Aucune candidature trouvée
          </h3>
          <p className="text-muted-foreground text-center">
            Utilisez le bouton &quot;Nouvelle candidature&quot; pour commencer
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {candidatures.map((candidature, index) => (
        <motion.div
          key={candidature.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="group bg-card backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col gap-4">
                {/* En-tête */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                        {candidature.poste}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium truncate">
                          {candidature.entreprise}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      <Star
                        className={`w-4 h-4 ${
                          prioritesCouleurs[candidature.priorite]
                        }`}
                      />
                      <Badge
                        className={`${
                          statutsCouleurs[candidature.statut]
                        } border text-xs font-medium whitespace-nowrap`}
                      >
                        {statutsTexte[candidature.statut]}
                      </Badge>
                    </div>
                  </div>

                  {/* Informations principales */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    {candidature.lieu && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{candidature.lieu}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(
                          new Date(candidature.date_candidature),
                          "d MMM yyyy",
                          { locale: fr }
                        )}
                      </span>
                    </div>

                    {(candidature.salaire_min || candidature.salaire_max) && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Euro className="w-4 h-4" />
                        <span>
                          {candidature.salaire_min && candidature.salaire_max
                            ? `${candidature.salaire_min} - ${candidature.salaire_max}€`
                            : candidature.salaire_min
                            ? `À partir de ${candidature.salaire_min}€`
                            : `Jusqu'à ${candidature.salaire_max}€`}
                        </span>
                      </div>
                    )}

                    {candidature.prochaine_relance && (
                      <div className="flex items-center gap-2 text-amber-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          Relance le{" "}
                          {format(
                            new Date(candidature.prochaine_relance),
                            "d MMM",
                            {
                              locale: fr,
                            }
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {candidature.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {candidature.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border mt-auto">
                  <LoadingButton
                    variant="outline"
                    size="sm"
                    onClick={() => onEdition(candidature)}
                    className="flex-1 justify-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </LoadingButton>

                  {candidature.url_offre && (
                    <LoadingButton
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1 justify-center"
                    >
                      <a
                        href={candidature.url_offre}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Voir l&apos;offre
                      </a>
                    </LoadingButton>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
