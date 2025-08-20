/*
  Warnings:

  - You are about to drop the column `inquilinoId` on the `Conversacion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[alojamientoId,estudianteId,propietarioId]` on the table `Conversacion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `estudianteId` to the `Conversacion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversacion" DROP CONSTRAINT "Conversacion_inquilinoId_fkey";

-- DropIndex
DROP INDEX "Conversacion_alojamientoId_inquilinoId_propietarioId_key";

-- AlterTable
ALTER TABLE "Conversacion" DROP COLUMN "inquilinoId",
ADD COLUMN     "estudianteId" INTEGER NOT NULL,
ADD COLUMN     "estudianteVistoUltimo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "propietarioVistoUltimo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ultimoMensajeId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Conversacion_alojamientoId_estudianteId_propietarioId_key" ON "Conversacion"("alojamientoId", "estudianteId", "propietarioId");

-- AddForeignKey
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
