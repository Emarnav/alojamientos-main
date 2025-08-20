/*
  Warnings:

  - You are about to drop the column `managerCognitoId` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `tenantCognitoId` on the `Alquiler` table. All the data in the column will be lost.
  - You are about to drop the column `cognitoId` on the `Inquilino` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Inquilino` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Inquilino` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `Inquilino` table. All the data in the column will be lost.
  - You are about to drop the column `cognitoId` on the `Propietario` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Propietario` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Propietario` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `Propietario` table. All the data in the column will be lost.
  - You are about to drop the column `tenantCognitoId` on the `Solicitud` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuarioId]` on the table `Inquilino` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuarioId]` on the table `Propietario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `managerUsuarioId` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantUsuarioId` to the `Alquiler` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Inquilino` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Propietario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantUsuarioId` to the `Solicitud` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Alojamiento" DROP CONSTRAINT "Alojamiento_managerCognitoId_fkey";

-- DropForeignKey
ALTER TABLE "Alquiler" DROP CONSTRAINT "Alquiler_tenantCognitoId_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_tenantCognitoId_fkey";

-- DropIndex
DROP INDEX "Inquilino_cognitoId_key";

-- DropIndex
DROP INDEX "Propietario_cognitoId_key";

-- AlterTable
ALTER TABLE "Alojamiento" DROP COLUMN "managerCognitoId",
ADD COLUMN     "managerUsuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Alquiler" DROP COLUMN "tenantCognitoId",
ADD COLUMN     "tenantUsuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Inquilino" DROP COLUMN "cognitoId",
DROP COLUMN "email",
DROP COLUMN "nombre",
DROP COLUMN "telefono",
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Propietario" DROP COLUMN "cognitoId",
DROP COLUMN "email",
DROP COLUMN "nombre",
DROP COLUMN "telefono",
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Solicitud" DROP COLUMN "tenantCognitoId",
ADD COLUMN     "tenantUsuarioId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "cognitoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id" SERIAL NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alojamientoId" INTEGER NOT NULL,
    "remitenteId" INTEGER NOT NULL,
    "destinatarioId" INTEGER NOT NULL,

    CONSTRAINT "Mensaje_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cognitoId_key" ON "Usuario"("cognitoId");

-- CreateIndex
CREATE UNIQUE INDEX "Inquilino_usuarioId_key" ON "Inquilino"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Propietario_usuarioId_key" ON "Propietario"("usuarioId");

-- AddForeignKey
ALTER TABLE "Alojamiento" ADD CONSTRAINT "Alojamiento_managerUsuarioId_fkey" FOREIGN KEY ("managerUsuarioId") REFERENCES "Propietario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propietario" ADD CONSTRAINT "Propietario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquilino" ADD CONSTRAINT "Inquilino_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_alojamientoId_fkey" FOREIGN KEY ("alojamientoId") REFERENCES "Alojamiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_remitenteId_fkey" FOREIGN KEY ("remitenteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_destinatarioId_fkey" FOREIGN KEY ("destinatarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_tenantUsuarioId_fkey" FOREIGN KEY ("tenantUsuarioId") REFERENCES "Inquilino"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alquiler" ADD CONSTRAINT "Alquiler_tenantUsuarioId_fkey" FOREIGN KEY ("tenantUsuarioId") REFERENCES "Inquilino"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;
