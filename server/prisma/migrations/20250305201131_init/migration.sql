/*
  Warnings:

  - You are about to drop the column `tipo` on the `Alojamiento` table. All the data in the column will be lost.
  - Added the required column `tipoAlojamiento` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alojamiento" DROP COLUMN "tipo",
ADD COLUMN     "tipoAlojamiento" "TipoAlojamiento" NOT NULL;
