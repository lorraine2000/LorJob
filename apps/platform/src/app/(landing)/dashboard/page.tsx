"use client";

import { AuthWrapper } from "../../../components/pages/auth-wrapper";
import React, { useState, useEffect, useCallback } from "react";
import { format, startOfDay, endOfDay, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import CandidaturesRecentes from "../../../components/dashboard/candidatures-recentes";
import GraphiqueEvolution from "../../../components/dashboard/graphique-evolution";
import ObjectifQuotidien from "../../../components/dashboard/objectif-quotidien";
import StatsCards from "../../../components/dashboard/stats-cards";
import { JobApplicationType } from "@jobi/types/jobApplication";
import { honoClient } from "apps/platform/src/lib/clients/hono-client";
import { useUserStore } from "apps/platform/src/lib/store/user-store";
import { Loader2 } from "lucide-react";

function Dashboard() {
  const [candidatures, setCandidatures] = useState<JobApplicationType[]>([]);
  const user = useUserStore((state) => state.value.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllJobApplication();
  }, []);

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

  const candidaturesAujourdhui = candidatures.filter((c) => {
    const aujourdhui = startOfDay(new Date());
    const finJour = endOfDay(new Date());
    const dateCandidature = new Date(c.date_candidature);
    return dateCandidature >= aujourdhui && dateCandidature <= finJour;
  });

  const candidaturesSemaine = candidatures.filter((c) => {
    const ilYa7Jours = subDays(new Date(), 7);
    return new Date(c.date_candidature) >= ilYa7Jours;
  });

  const tauxReponseNumber =
    candidatures.length > 0
      ? (candidatures.filter((c) =>
          ["entretien_programme", "entretien_passe", "accepte"].includes(
            c.statut
          )
        ).length /
          candidatures.length) *
        100
      : 0;

  const candidaturesRecente = [...candidatures]
    .sort(
      (a, b) =>
        new Date(b.date_candidature).getTime() -
        new Date(a.date_candidature).getTime()
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">
          <Loader2 />
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground p-6 w-screen max-w-7xl mx-auto space-y-8">
      <div className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 -mx-6 px-6 py-4 border-b border-border">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground text-lg">
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
        <StatsCards
          titre="Candidatures totales"
          valeur={candidatures.length}
          icon="briefcase"
          couleur="blue"
          tendance={`+${candidaturesSemaine.length} cette semaine`}
        />
        <StatsCards
          titre="Aujourd'hui"
          valeur={candidaturesAujourdhui.length}
          icon="calendar"
          couleur="purple"
          objectif={user?.objectif_quotidien || 3}
        />
        <StatsCards
          titre="Taux de réponse"
          valeur={Number(tauxReponseNumber.toPrecision(5))}
          icon="trending-up"
          couleur="green"
          tendance="Performance globale"
        />
        <StatsCards
          titre="En attente"
          valeur={
            candidatures.filter((c) => c.statut === "en_attente_reponse").length
          }
          icon="clock"
          couleur="amber"
          tendance="Relances à prévoir"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <GraphiqueEvolution
            userObjectif={user?.objectif_quotidien || 0}
            candidatures={candidatures}
          />
          <CandidaturesRecentes candidatures={candidaturesRecente} />
        </div>

        <div className="space-y-8">
          <ObjectifQuotidien
            objectif={user?.objectif_quotidien || 0}
            realise={candidaturesAujourdhui.length}
            onObjectifChange={getAllJobApplication}
          />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <AuthWrapper Page={Dashboard} />;
}
