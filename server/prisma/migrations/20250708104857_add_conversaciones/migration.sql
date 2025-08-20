/*
  Warnings:

  - You are about to drop the column `fecha` on the `Mensaje` table. All the data in the column will be lost.
  - You are about to drop the `Alquiler` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Solicitud` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TenantProperties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alquiler" DROP CONSTRAINT "Alquiler_alojamientoId_fkey";

-- DropForeignKey
ALTER TABLE "Alquiler" DROP CONSTRAINT "Alquiler_tenantUsuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_alojamientoId_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_alquilerId_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_tenantUsuarioId_fkey";

-- DropForeignKey
ALTER TABLE "_TenantProperties" DROP CONSTRAINT "_TenantProperties_A_fkey";

-- DropForeignKey
ALTER TABLE "_TenantProperties" DROP CONSTRAINT "_TenantProperties_B_fkey";

-- AlterTable
ALTER TABLE "Mensaje" DROP COLUMN "fecha",
ADD COLUMN     "conversacionId" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Alquiler";

-- DropTable
DROP TABLE "Solicitud";

-- DropTable
DROP TABLE "_TenantProperties";

-- DropEnum
DROP TYPE "EstadoSolicitud";

-- CreateTable
CREATE TABLE "Conversacion" (
    "id" SERIAL NOT NULL,
    "alojamientoId" INTEGER NOT NULL,
    "usuarioAId" INTEGER NOT NULL,
    "usuarioBId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversacion_alojamientoId_usuarioAId_usuarioBId_key" ON "Conversacion"("alojamientoId", "usuarioAId", "usuarioBId");

-- AddForeignKey
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_alojamientoId_fkey" FOREIGN KEY ("alojamientoId") REFERENCES "Alojamiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_usuarioAId_fkey" FOREIGN KEY ("usuarioAId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_usuarioBId_fkey" FOREIGN KEY ("usuarioBId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "Conversacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
