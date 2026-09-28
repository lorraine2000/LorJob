/*
  Warnings:

  - You are about to drop the `jobApplication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "jobApplication" DROP CONSTRAINT "jobApplication_userId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- DropTable
DROP TABLE "jobApplication";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "first_name" TEXT NOT NULL DEFAULT '',
    "last_name" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "password_hash" TEXT,
    "image" TEXT,
    "objectif_quotidien" INTEGER,
    "preferred_locale" TEXT NOT NULL DEFAULT 'fr',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobApplications" (
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
    "prochaine_relance" TIMESTAMP(3) NOT NULL,
    "contact_email" TEXT,
    "contact_nom" TEXT,
    "url_offre" TEXT,
    "notes" TEXT,
    "priorite" "Priorite" NOT NULL DEFAULT 'moyenne',
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jobApplications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relances" (
    "id" TEXT NOT NULL,
    "dateRelance" TIMESTAMP(3),
    "note" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'à faire',
    "jobApplicationId" TEXT NOT NULL,
    "dateDerniereRelance" TIMESTAMP(3),

    CONSTRAINT "relances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobApplications" ADD CONSTRAINT "jobApplications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relances" ADD CONSTRAINT "relances_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "jobApplications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
