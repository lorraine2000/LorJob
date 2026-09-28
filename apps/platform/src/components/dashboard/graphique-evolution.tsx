"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { JobApplicationType } from "@jobi/types/jobApplication";

type DonneeGraph = {
  jour: string;
  candidatures: number;
  date: string;
};

interface GraphiqueEvolutionProps {
  userObjectif: number;
  candidatures: JobApplicationType[];
}

export default function GraphiqueEvolution({
  candidatures,
  userObjectif,
}: GraphiqueEvolutionProps) {
  const [donnees, setDonnees] = useState<DonneeGraph[] | null>(null);

  useEffect(() => {
    const genererDonnees = (): DonneeGraph[] => {
      const derniers7Jours = eachDayOfInterval({
        start: subDays(new Date(), 6),
        end: new Date(),
      });

      return derniers7Jours.map((jour) => {
        const candidaturesDuJour = candidatures.filter((c) => {
          const dateCandidature = new Date(c.date_candidature);
          return (
            format(dateCandidature, "yyyy-MM-dd") === format(jour, "yyyy-MM-dd")
          );
        });

        return {
          jour: format(jour, "EEE", { locale: fr }),
          candidatures: candidaturesDuJour.length,
          date: format(jour, "yyyy-MM-dd"),
        };
      });
    };

    const timeout = setTimeout(() => {
      setDonnees(genererDonnees());
    }, 500); // simulate async loading

    return () => clearTimeout(timeout);
  }, [candidatures]);

  const donneesParJour = useMemo(() => {
    const counts: Record<string, number> = {};

    candidatures.forEach((c) => {
      const jour = format(new Date(c.date_candidature), "yyyy-MM-dd");
      counts[jour] = (counts[jour] || 0) + 1;
    });

    return Object.entries(counts).map(([jour, total]) => ({ jour, total }));
  }, [candidatures]);

  const maxCandidatures = useMemo(() => {
    if (donneesParJour.length === 0) return 0;

    const maxTotal = Math.max(...donneesParJour.map((d) => d.total));
    return maxTotal > userObjectif ? maxTotal : userObjectif;
  }, [donneesParJour, userObjectif]);

  return (
    <Card className="bg-card border border-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <TrendingUp className="w-5 h-5 text-muted-foreground" />
          Évolution des candidatures (7 derniers jours)
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-64">
          {donnees ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donnees}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="jour"
                  stroke="var(--foreground)"
                  fontSize={12}
                  tickLine={true}
                  axisLine={true}
                />
                <YAxis
                  domain={[0, maxCandidatures]}
                  stroke="var(--foreground)"
                  fontSize={12}
                  tickLine={true}
                  axisLine={true}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    color: "hsl(var(--foreground))",
                  }}
                  labelStyle={{
                    color: "var(--foreground)",
                  }}
                  cursor={{ fill: "hsl(var(--accent) / 0.2)" }}
                />
                <Bar
                  dataKey="candidatures"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col gap-4 h-full">
              <Skeleton className="h-6 w-1/4 rounded-lg" />
              <div className="flex-1 grid grid-cols-7 gap-2 items-end">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-full w-full rounded-md" />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
