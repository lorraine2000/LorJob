"use client";

import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 text-center">
      <Ghost className="h-20 w-20 text-muted-foreground mb-6" />
      <h1 className="text-4xl font-bold text-foreground mb-2">
        Oups, cette page est introuvable
      </h1>
      <p className="text-muted-foreground mb-6">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center px-4 py-2 border border-border rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
