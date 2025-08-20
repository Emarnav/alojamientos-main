/*
  Warnings:

  - You are about to drop the column `baños` on the `Alojamiento` table. All the data in the column will be lost.
  - Added the required column `banos` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alojamiento" DROP COLUMN "baños",
ADD COLUMN     "banos" DOUBLE PRECISION NOT NULL;
