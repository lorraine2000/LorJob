"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Target, Edit3, Check, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingButton } from "../ui/loading-button";

interface ObjectifQuotidienProps {
  objectif: number;
  realise: number;
  onObjectifChange: () => void;
}

export default function ObjectifQuotidien({
  objectif,
  realise,
  onObjectifChange,
}: ObjectifQuotidienProps) {
  const [edition, setEdition] = useState<boolean>(false);
  const [nouvelObjectif, setNouvelObjectif] = useState<number>(objectif);
  const [enregistrement, setEnregistrement] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timeout);
  }, []);

  const pourcentage = objectif ? Math.min((realise / objectif) * 100, 100) : 0;

  const sauvegarderObjectif = async () => {
    setEnregistrement(true);
    try {
      console.log("save objectif: ", nouvelObjectif);
      setEdition(false);
      onObjectifChange();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setEnregistrement(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-40 h-5" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
            <Skeleton className="w-24 h-6 mx-auto" />
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-black dark:text-white">
          <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg dark:from-purple-800 dark:to-pink-800">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-300" />
          </div>
          Objectif quotidien
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg
              className="w-32 h-32 transform -rotate-90"
              viewBox="0 0 36 36"
              aria-hidden="true"
            >
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
                className="dark:stroke-gray-700"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray={`${pourcentage}, 100`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-200">
                  {realise}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  sur {objectif}
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              pourcentage >= 100
                ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-400 dark:border-green-600"
                : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            {pourcentage >= 100 ? (
              <>
                <Check className="w-4 h-4" />
                Objectif atteint !
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                {pourcentage.toFixed(0)}% réalisé
              </>
            )}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {edition ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <Input
                type="number"
                min={1}
                value={nouvelObjectif}
                onChange={(e) => setNouvelObjectif(parseInt(e.target.value) || 0)}
                className="text-center dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                placeholder="Nouvel objectif"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEdition(false);
                    setNouvelObjectif(objectif);
                  }}
                  className="flex-1 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  Annuler
                </Button>
                <LoadingButton
                  onClick={sauvegarderObjectif}
                  disabled={enregistrement}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {enregistrement ? "Sauvegarde..." : "Confirmer"}
                </LoadingButton>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button
                variant="outline"
                onClick={() => setEdition(true)}
                className="w-full flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-gray-700 dark:text-white"
              >
                <Edit3 className="w-4 h-4" />
                Modifier l&apos;objectif
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
