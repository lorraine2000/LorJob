/*
  Warnings:

  - Added the required column `objectif_quotidien` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "objectif_quotidien" INTEGER NOT NULL;
