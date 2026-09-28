-- CreateEnum
CREATE TYPE "Statut" AS ENUM ('candidature_envoyee', 'en_attente_reponse', 'entretien_programme', 'entretien_passe', 'refus', 'accepte', 'relance_necessaire');

-- CreateEnum
CREATE TYPE "Priorite" AS ENUM ('faible', 'moyenne', 'haute');

-- CreateTable
CREATE TABLE "jobApplication" (
    "id" TEXT NOT NULL,
    "entreprise" TEXT NOT NULL,
    "poste" TEXT NOT NULL,
    "lieu" TEXT NOT NULL,
    "salaire_min" DOUBLE PRECISION,
    "salaire_max" DOUBLE PRECISION,
    "description" TEXT,
    "statut" "Statut" NOT NULL DEFAULT 'candidature_envoyee',
    "date_candidature" TIMESTAMP(3) NOT NULL,
    "date_relance" TIMESTAMP(3),
    "prochaine_relance" TIMESTAMP(3),
    "contact_email" TEXT,
    "contact_nom" TEXT,
    "url_offre" TEXT,
    "notes" TEXT,
    "priorite" "Priorite" NOT NULL DEFAULT 'moyenne',
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jobApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "jobApplication" ADD CONSTRAINT "jobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
