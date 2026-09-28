"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import JobApplicationFilter from "apps/platform/src/components/jobApllication/job-application-filter";
import { Button } from "apps/platform/src/components/ui/button";
import { Input } from "apps/platform/src/components/ui/input";
import AddJobApplication from "apps/platform/src/components/jobApllication/add-job-application";
import JobApplications from "apps/platform/src/components/jobApllication/job-applications";
import { cn } from "apps/platform/src/lib/utils";
import {
  CandidatureFormInputType,
  JobApplicationType,
  JobApplicationFilterType,
} from "@jobi/types/jobApplication";
import { honoClient } from "apps/platform/src/lib/clients/hono-client";

export default function JobApplicationPage() {
  const [candidatures, setCandidatures] = useState<JobApplicationType[]>([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [candidatureEnEdition, setCandidatureEnEdition] =
    useState<Partial<JobApplicationType>>();
  const [recherche, setRecherche] = useState("");
  const [filtres, setFiltres] = useState<JobApplicationFilterType>({
    statut: "tous",
    priorite: "toutes",
  });
  const [afficherFiltres, setAfficherFiltres] = useState(false);
  const [loading, setLoading] = useState(true);

  const getAllJobApplication = useCallback(async () => {
    try {
      const response = await honoClient.api.jobApplication.all.$get();
      const data = await response.json();
      if (Array.isArray(data)) {
        setCandidatures(data as JobApplicationType[]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllJobApplication();
  }, [getAllJobApplication]);

  const gererSoumission = useCallback(
    async (
      jobApplicationToAdd: CandidatureFormInputType | JobApplicationType
    ) => {
      if (!jobApplicationToAdd) return;
      try {
        await honoClient.api.jobApplication.add.$post({
          json: jobApplicationToAdd,
        });
        await getAllJobApplication();
        setAfficherFormulaire(false);
        setCandidatureEnEdition({});
      } catch (error) {
        console.error("Erreur lors de l'ajout de la candidature :", error);
      }
    },
    [getAllJobApplication]
  );

  const gererEdition = (candidature: JobApplicationType) => {
    setCandidatureEnEdition(candidature);
    setAfficherFormulaire(true);
  };

  const candidaturesFiltrees: JobApplicationType[] = candidatures.filter(
    (candidature) => {
      const matchRecherche =
        candidature.entreprise
          .toLowerCase()
          .includes(recherche.toLowerCase()) ||
        candidature.poste.toLowerCase().includes(recherche.toLowerCase());
      const matchStatut =
        filtres.statut === "tous" || candidature.statut === filtres.statut;
      const matchPriorite =
        filtres.priorite === "toutes" ||
        candidature.priorite === filtres.priorite;
      return matchRecherche && matchStatut && matchPriorite;
    }
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        <div className="animate-pulse text-lg">
          Chargement des candidatures...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 transition-colors duration-300 ">
      <div className="max-w-7xl min-w-[15rem] mx-auto">
        <div className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 -mx-6 px-6 py-4 border-b border-border">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[oklch(60%_0.25_250)] to-[oklch(60%_0.25_300)] bg-clip-text text-transparent">
                  Mes candidatures
                </h1>
                <p className="text-muted-foreground mt-1">
                  {candidatures.length} candidature
                  {candidatures.length > 1 ? "s" : ""}
                </p>
              </div>

              <Button
                onClick={() => {
                  setAfficherFormulaire(true);
                  setCandidatureEnEdition({});
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-[oklch(60%_0.25_250)] to-[oklch(60%_0.25_300)] hover:from-[oklch(55%_0.25_250)] hover:to-[oklch(55%_0.25_300)] text-white shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle candidature
              </Button>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Rechercher par entreprise ou poste..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="pl-10 bg-card border border-border w-full"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setAfficherFiltres(!afficherFiltres)}
                className="sm:w-auto bg-card border border-border flex items-center justify-center"
              >
                <Filter className="w-5 h-5 mr-2" />
                {afficherFiltres ? "Masquer les filtres" : "Filtrer"}
              </Button>
            </div>

            <AnimatePresence>
              {afficherFiltres && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <JobApplicationFilter
                    filtres={filtres}
                    onFiltresChange={setFiltres}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="pt-5">
          {afficherFormulaire ? (
            <AddJobApplication
              candidature={candidatureEnEdition}
              onSoumission={gererSoumission}
              onAnnulation={() => {
                setAfficherFormulaire(false);
                setCandidatureEnEdition({});
              }}
            />
          ) : (
            <JobApplications
              candidatures={candidaturesFiltrees}
              onEdition={gererEdition}
            />
          )}
        </div>
      </div>
    </div>
  );
}
