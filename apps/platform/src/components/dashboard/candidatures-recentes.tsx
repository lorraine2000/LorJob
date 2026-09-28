"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Building2, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { JobApplicationType } from "@jobi/types/jobApplication";

const statutsCouleurs = {
  candidature_envoyee:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800",
  en_attente_reponse:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800",
  entretien_programme:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-100 dark:border-purple-800",
  entretien_passe:
    "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-100 dark:border-indigo-800",
  refus:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800",
  accepte:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800",
  relance_necessaire:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-100 dark:border-orange-800",
};

const statutsTexte = {
  candidature_envoyee: "Candidature envoyée",
  en_attente_reponse: "En attente de réponse",
  entretien_programme: "Entretien programmé",
  entretien_passe: "Entretien passé",
  refus: "Refusé",
  accepte: "Accepté",
  relance_necessaire: "Relance nécessaire",
};

interface Props {
  candidatures: JobApplicationType[];
}

export default function CandidaturesRecentes({ candidatures }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Card className="bg-card border border-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Clock className="w-5 h-5 text-muted-foreground" />
          Candidatures récentes
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-muted/50 border border-border space-y-2 animate-pulse"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
                <Skeleton className="h-3 w-1/4" />
              </div>
            ))
          ) : candidatures.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucune candidature pour le moment
            </p>
          ) : (
            candidatures.map((candidature, index) => (
              <motion.div
                key={candidature.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-muted/40 hover:bg-muted transition-colors border border-border"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {candidature.poste}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {candidature.entreprise}
                      </div>
                      {candidature.lieu && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {candidature.lieu}
                        </div>
                      )}
                    </div>
                  </div>

                  <Badge
                    className={`${
                      statutsCouleurs[candidature.statut]
                    } border text-xs font-medium`}
                  >
                    {statutsTexte[candidature.statut]}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  {format(
                    new Date(candidature.date_candidature),
                    "d MMMM yyyy",
                    { locale: fr }
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
