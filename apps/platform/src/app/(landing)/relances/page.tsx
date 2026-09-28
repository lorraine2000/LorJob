"use client";

import React, { useCallback, useEffect, useState } from "react";
import { RelanceType } from "@jobi/types/relance";
import { Check, Trash, Clock } from "lucide-react";
import { format, isPast } from "date-fns";
import { Button } from "apps/platform/src/components/ui/button";
import { Input } from "apps/platform/src/components/ui/input";
import { honoClient } from "apps/platform/src/lib/clients/hono-client";
import { toast } from "sonner";

export default function RelancesPage() {
  const [relances, setRelances] = useState<RelanceType[]>([]);
  const [search, setSearch] = useState("");

  const getRelances = useCallback(async () => {
    try {
      const response = await honoClient.api.relance.all.$get();
      const data = await response.json();
      if (Array.isArray(data)) {
        setRelances(data as RelanceType[]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    }
  }, []);

  useEffect(() => {
    getRelances();
  }, [getRelances]);

  const filtered = relances.filter((r) =>
    r.jobApplication.entreprise.toLowerCase().includes(search.toLowerCase())
  );

  const markAsDone = async (id: string) => {
    const response = await honoClient.api.relance[":id"].$patch({
      param: { id },
    });

    if (response.ok) {
      setRelances((prev) =>
        prev.map((r) => (r.id === id ? { ...r, statut: "faite" } : r))
      );
    } else {
      const error = await response.json();
      const errorText =
        typeof error === "string"
          ? error
          : "error" in error
          ? error.error
          : "message" in error
          ? error.message
          : "Erreur inconnue";

      toast.error("Erreur lors de la mise à jour : " + errorText);
    }
  };

  const deleteRelance = (id: string) => {
    setRelances((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-6">
      <div className="sticky top-0 bg-background z-50 p-4">
        <h1 className="text-3xl font-bold mb-4">Mes relances</h1>

        <div className="flex items-center gap-4 mb-6">
          <Input
            placeholder="Rechercher une entreprise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md"
          />
        </div>
      </div>
      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-muted-foreground">Aucune relance à afficher.</p>
        )}

        {filtered.map((relance) => {
          const date = new Date(relance.dateRelance);
          const estEnRetard = isPast(date) && relance.statut === "à faire";

          return (
            <div
              key={relance.id}
              className="border border-border rounded-lg p-4 flex justify-between items-center bg-card"
            >
              <div>
                <p className="font-semibold">
                  {relance.jobApplication.entreprise} –{" "}
                  {relance.jobApplication.poste}
                </p>
                <p className="text-sm text-muted-foreground">
                  À relancer le {format(date, "dd/MM/yyyy")}
                  {relance.note && ` – ${relance.note}`}
                </p>
                {estEnRetard && (
                  <span className="text-red-500 text-xs">En retard</span>
                )}
                {relance.statut === "faite" && (
                  <span className="text-green-600 text-xs">Relancée</span>
                )}
                {!estEnRetard && (
                  <span className="text-yellow-500 text-xs">À venir</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {relance.statut !== "faite" && (
                  <Button
                    disabled={!estEnRetard}
                    variant="outline"
                    onClick={() => markAsDone(relance.id)}
                  >
                    {estEnRetard ? (
                      <Check className="w-4 h-4 mr-1" />
                    ) : (
                      <Clock className="w-4 h-4 mr-1" />
                    )}
                    Marquer comme faite
                  </Button>
                )}
                <Button
                  variant="destructive"
                  disabled={true}
                  onClick={() => deleteRelance(relance.id)}
                >
                  <Trash className="w-4 h-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
