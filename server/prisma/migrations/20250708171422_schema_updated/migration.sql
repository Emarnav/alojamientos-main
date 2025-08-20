/*
  Warnings:

  - You are about to drop the `Alquiler` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inquilino` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Propietario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Solicitud` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TenantProperties` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `tipo` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('Propietario', 'Estudiante', 'Admin');

-- DropForeignKey
ALTER TABLE "Alojamiento" DROP CONSTRAINT "Alojamiento_managerUsuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Alquiler" DROP CONSTRAINT "Alquiler_alojamientoId_fkey";

-- DropForeignKey
ALTER TABLE "Alquiler" DROP CONSTRAINT "Alquiler_tenantUsuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Conversacion" DROP CONSTRAINT "Conversacion_inquilinoId_fkey";

-- DropForeignKey
ALTER TABLE "Conversacion" DROP CONSTRAINT "Conversacion_propietarioId_fkey";

-- DropForeignKey
ALTER TABLE "Inquilino" DROP CONSTRAINT "Inquilino_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Propietario" DROP CONSTRAINT "Propietario_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_alojamientoId_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_alquilerId_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_tenantUsuarioId_fkey";

-- DropForeignKey
ALTER TABLE "_TenantFavorites" DROP CONSTRAINT "_TenantFavorites_B_fkey";

-- DropForeignKey
ALTER TABLE "_TenantProperties" DROP CONSTRAINT "_TenantProperties_A_fkey";

-- DropForeignKey
ALTER TABLE "_TenantProperties" DROP CONSTRAINT "_TenantProperties_B_fkey";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "telefono" DROP NOT NULL,
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoUsuario" NOT NULL;

-- DropTable
DROP TABLE "Alquiler";

-- DropTable
DROP TABLE "Inquilino";

-- DropTable
DROP TABLE "Propietario";

-- DropTable
DROP TABLE "Solicitud";

-- DropTable
DROP TABLE "_TenantProperties";

-- DropEnum
DROP TYPE "EstadoSolicitud";

-- AddForeignKey
ALTER TABLE "Alojamiento" ADD CONSTRAINT "Alojamiento_managerUsuarioId_fkey" FOREIGN KEY ("managerUsuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_inquilinoId_fkey" FOREIGN KEY ("inquilinoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TenantFavorites" ADD CONSTRAINT "_TenantFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
