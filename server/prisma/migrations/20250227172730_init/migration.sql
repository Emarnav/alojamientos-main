/*
  Warnings:

  - You are about to drop the column `name` on the `Inquilino` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Inquilino` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Propietario` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Propietario` table. All the data in the column will be lost.
  - You are about to drop the `Property` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nombre` to the `Inquilino` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Inquilino` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Propietario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Propietario` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Solicitud` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoAlojamiento" AS ENUM ('ColegioMayor', 'Piso', 'PisoCompartido', 'ResidenciaFamiliar', 'ResidenciaUniversitaria');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('Pending', 'Denied', 'Approved');

-- DropForeignKey
ALTER TABLE "Lease" DROP CONSTRAINT "Lease_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_managerCognitoId_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "_TenantFavorites" DROP CONSTRAINT "_TenantFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_TenantFavorites" DROP CONSTRAINT "_TenantFavorites_B_fkey";

-- DropForeignKey
ALTER TABLE "_TenantProperties" DROP CONSTRAINT "_TenantProperties_A_fkey";

-- DropForeignKey
ALTER TABLE "_TenantProperties" DROP CONSTRAINT "_TenantProperties_B_fkey";

-- AlterTable
ALTER TABLE "Inquilino" DROP COLUMN "name",
DROP COLUMN "phoneNumber",
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "telefono" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Propietario" DROP COLUMN "name",
DROP COLUMN "phoneNumber",
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "telefono" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Solicitud" DROP COLUMN "status",
ADD COLUMN     "status" "EstadoSolicitud" NOT NULL;

-- DropTable
DROP TABLE "Property";

-- DropEnum
DROP TYPE "PropertyType";

-- DropEnum
DROP TYPE "SolicitudStatus";

-- CreateTable
CREATE TABLE "Alojamiento" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pricePerMonth" DOUBLE PRECISION NOT NULL,
    "securityDeposit" DOUBLE PRECISION NOT NULL,
    "applicationFee" DOUBLE PRECISION NOT NULL,
    "photoUrls" TEXT[],
    "amenities" "Amenity"[],
    "highlights" "Highlight"[],
    "isPetsAllowed" BOOLEAN NOT NULL DEFAULT false,
    "isParkingIncluded" BOOLEAN NOT NULL DEFAULT false,
    "beds" INTEGER NOT NULL,
    "baths" DOUBLE PRECISION NOT NULL,
    "squareFeet" INTEGER NOT NULL,
    "tipoAlojamiento" "TipoAlojamiento" NOT NULL,
    "postedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "averageRating" DOUBLE PRECISION DEFAULT 0,
    "numberOfReviews" INTEGER DEFAULT 0,
    "locationId" INTEGER NOT NULL,
    "managerCognitoId" TEXT NOT NULL,

    CONSTRAINT "Alojamiento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alojamiento" ADD CONSTRAINT "Alojamiento_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alojamiento" ADD CONSTRAINT "Alojamiento_managerCognitoId_fkey" FOREIGN KEY ("managerCognitoId") REFERENCES "Propietario"("cognitoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Alojamiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Alojamiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TenantFavorites" ADD CONSTRAINT "_TenantFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES "Alojamiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TenantFavorites" ADD CONSTRAINT "_TenantFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "Inquilino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TenantProperties" ADD CONSTRAINT "_TenantProperties_A_fkey" FOREIGN KEY ("A") REFERENCES "Alojamiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TenantProperties" ADD CONSTRAINT "_TenantProperties_B_fkey" FOREIGN KEY ("B") REFERENCES "Inquilino"("id") ON DELETE CASCADE ON UPDATE CASCADE;
