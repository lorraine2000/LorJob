"use client";

import React, { CSSProperties } from "react";
import { Card, CardContent } from "../ui/card";
import {
  Briefcase,
  Calendar,
  TrendingUp,
  Clock,
  Target,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

type IconKey = "briefcase" | "calendar" | "trending-up" | "clock" | "target" | "check";
type CouleurKey = "blue" | "purple" | "green" | "amber";

interface StatsCardsProps {
  titre: string;
  valeur: number;
  icon: IconKey;
  couleur: CouleurKey;
  tendance?: string;
  objectif?: number;
}

// Icon map
const icons: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  briefcase: Briefcase,
  calendar: Calendar,
  "trending-up": TrendingUp,
  clock: Clock,
  target: Target,
  check: CheckCircle2,
};

// Couleurs mappées vers les variables CSS
const couleurs: Record<
  CouleurKey,
  {
    bgGradientVar: string; // variable CSS pour gradient background
    iconVar: string;       // variable CSS pour couleur icône
    accentVar: string;     // variable CSS pour couleur accent (bg + border)
  }
> = {
  blue: {
    bgGradientVar: "var(--color-chart-2)",       // par exemple chart-2 correspond à un bleu
    iconVar: "var(--color-chart-2)",
    accentVar: "var(--color-chart-2)",
  },
  purple: {
    bgGradientVar: "var(--color-chart-4)",
    iconVar: "var(--color-chart-4)",
    accentVar: "var(--color-chart-4)",
  },
  green: {
    bgGradientVar: "var(--color-chart-5)",
    iconVar: "var(--color-chart-5)",
    accentVar: "var(--color-chart-5)",
  },
  amber: {
    bgGradientVar: "var(--color-chart-1)",
    iconVar: "var(--color-chart-1)",
    accentVar: "var(--color-chart-1)",
  },
};

export default function StatsCards({
  titre,
  valeur,
  icon,
  couleur,
  tendance,
  objectif,
}: StatsCardsProps) {
  const Icon = icons[icon];
  const colorTheme = couleurs[couleur];

  const pourcentageObjectif =
    objectif !== undefined ? Math.min((valeur / objectif) * 100, 100) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="group relative overflow-hidden border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
        {/* Cercle en background avec dégradé dynamique */}
        <div
          className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full opacity-10 group-hover:opacity-15 transition-opacity"
          style={{
            background: `radial-gradient(circle at center, ${colorTheme.bgGradientVar} 0%, transparent 80%)`,
          }}
        />

        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start mb-4">
            {/* Cercle icône avec couleur accent + bordure */}
            <div
              className="p-3 rounded-xl border"
              style={{
                backgroundColor: `${colorTheme.accentVar}33`, // 20% opacity
                borderColor: colorTheme.accentVar,
              }}
            >
              <div style={{ color: colorTheme.iconVar }}>
                <Icon className="w-6 h-6" aria-hidden />
              </div>
            </div>

            {/* Barre de progression */}
            {pourcentageObjectif !== null && (
              <div className="text-right">
                <div
                  className="text-xs font-medium"
                  style={{ color: colorTheme.iconVar }}
                >
                  {pourcentageObjectif.toFixed(0)}%
                </div>
                <div className="w-12 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pourcentageObjectif}%`,
                      background: colorTheme.bgGradientVar,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">{titre}</p>
            <p className="text-3xl font-bold text-foreground mb-3">{valeur}</p>
            {objectif !== undefined && (
              <p className="text-xs text-muted-foreground mb-2">Objectif: {objectif}</p>
            )}
            {tendance && (
              <p className="text-xs font-medium" style={{ color: colorTheme.iconVar }}>
                {tendance}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
