/*
  Warnings:

  - You are about to drop the column `locationId` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `leaseId` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the `Lease` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[alquilerId]` on the table `Solicitud` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ubicacionId` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tipoAlojamiento` on the `Alojamiento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Alojamiento" DROP CONSTRAINT "Alojamiento_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Lease" DROP CONSTRAINT "Lease_alojamientoId_fkey";

-- DropForeignKey
ALTER TABLE "Lease" DROP CONSTRAINT "Lease_tenantCognitoId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_leaseId_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_leaseId_fkey";

-- DropIndex
DROP INDEX "Solicitud_leaseId_key";

-- AlterTable
ALTER TABLE "Alojamiento" DROP COLUMN "locationId",
ADD COLUMN     "ubicacionId" INTEGER NOT NULL,
DROP COLUMN "tipoAlojamiento",
ADD COLUMN     "tipoAlojamiento" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Solicitud" DROP COLUMN "leaseId",
ADD COLUMN     "alquilerId" INTEGER;

-- DropTable
DROP TABLE "Lease";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "Payment";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "TipoAlojamiento";

-- CreateTable
CREATE TABLE "Ubicacion" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "coordinates" geography(Point, 4326) NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alquiler" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "rent" DOUBLE PRECISION NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL,
    "alojamientoId" INTEGER NOT NULL,
    "tenantCognitoId" TEXT NOT NULL,

    CONSTRAINT "Alquiler_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Solicitud_alquilerId_key" ON "Solicitud"("alquilerId");

-- AddForeignKey
ALTER TABLE "Alojamiento" ADD CONSTRAINT "Alojamiento_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_alquilerId_fkey" FOREIGN KEY ("alquilerId") REFERENCES "Alquiler"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alquiler" ADD CONSTRAINT "Alquiler_alojamientoId_fkey" FOREIGN KEY ("alojamientoId") REFERENCES "Alojamiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alquiler" ADD CONSTRAINT "Alquiler_tenantCognitoId_fkey" FOREIGN KEY ("tenantCognitoId") REFERENCES "Inquilino"("cognitoId") ON DELETE RESTRICT ON UPDATE CASCADE;
