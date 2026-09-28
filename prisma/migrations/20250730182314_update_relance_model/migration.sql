/*
  Warnings:

  - You are about to drop the column `dateDerniereRelance` on the `relances` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "relances" DROP COLUMN "dateDerniereRelance",
ADD COLUMN     "emailSent" BOOLEAN NOT NULL DEFAULT false;
