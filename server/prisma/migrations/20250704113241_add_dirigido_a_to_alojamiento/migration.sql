/*
  Warnings:

  - Added the required column `dirigidoA` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `infoExtra` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alojamiento" ADD COLUMN     "dirigidoA" TEXT NOT NULL,
ADD COLUMN     "infoExtra" TEXT NOT NULL;
