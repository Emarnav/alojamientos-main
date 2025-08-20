/*
  Warnings:

  - Added the required column `plazasLibres` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alojamiento" ADD COLUMN     "plazasLibres" INTEGER NOT NULL;
