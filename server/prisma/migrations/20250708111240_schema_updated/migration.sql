/*
  Warnings:

  - You are about to drop the column `usuarioAId` on the `Conversacion` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioBId` on the `Conversacion` table. All the data in the column will be lost.
  - You are about to drop the column `alojamientoId` on the `Mensaje` table. All the data in the column will be lost.
  - You are about to drop the column `destinatarioId` on the `Mensaje` table. All the data in the column will be lost.
  - You are about to drop the column `remitenteId` on the `Mensaje` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[alojamientoId,inquilinoId,propietarioId]` on the table `Conversacion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inquilinoId` to the `Conversacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propietarioId` to the `Conversacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emisorId` to the `Mensaje` table without a default value. This is not possible if the table is not empty.
  - Made the column `conversacionId` on table `Mensaje` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Conversacion" DROP CONSTRAINT "Conversacion_usuarioAId_fkey";

-- DropForeignKey
ALTER TABLE "Conversacion" DROP CONSTRAINT "Conversacion_usuarioBId_fkey";

-- DropForeignKey
ALTER TABLE "Mensaje" DROP CONSTRAINT "Mensaje_alojamientoId_fkey";

-- DropForeignKey
ALTER TABLE "Mensaje" DROP CONSTRAINT "Mensaje_conversacionId_fkey";

-- DropForeignKey
ALTER TABLE "Mensaje" DROP CONSTRAINT "Mensaje_destinatarioId_fkey";

-- DropForeignKey
ALTER TABLE "Mensaje" DROP CONSTRAINT "Mensaje_remitenteId_fkey";

-- DropIndex
DROP INDEX "Conversacion_alojamientoId_usuarioAId_usuarioBId_key";

-- AlterTable
ALTER TABLE "Conversacion" DROP COLUMN "usuarioAId",
DROP COLUMN "usuarioBId",
ADD COLUMN     "inquilinoId" INTEGER NOT NULL,
ADD COLUMN     "propietarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Mensaje" DROP COLUMN "alojamientoId",
DROP COLUMN "destinatarioId",
DROP COLUMN "remitenteId",
ADD COLUMN     "emisorId" INTEGER NOT NULL,
ALTER COLUMN "conversacionId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conversacion_alojamientoId_inquilinoId_propietarioId_key" ON "Conversacion"("alojamientoId", "inquilinoId", "propietarioId");

-- AddForeignKey
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_inquilinoId_fkey" FOREIGN KEY ("inquilinoId") REFERENCES "Inquilino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "Propietario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_emisorId_fkey" FOREIGN KEY ("emisorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "Conversacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
