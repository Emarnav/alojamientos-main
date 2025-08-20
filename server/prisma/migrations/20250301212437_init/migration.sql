/*
  Warnings:

  - You are about to drop the column `amenities` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `applicationFee` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `baths` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `beds` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `highlights` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `isParkingIncluded` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `isPetsAllowed` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerMonth` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `securityDeposit` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `squareFeet` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `tipoAlojamiento` on the `Alojamiento` table. All the data in the column will be lost.
  - Added the required column `baños` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descripcion` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `habitaciones` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `superficie` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alojamiento" DROP COLUMN "amenities",
DROP COLUMN "applicationFee",
DROP COLUMN "baths",
DROP COLUMN "beds",
DROP COLUMN "description",
DROP COLUMN "highlights",
DROP COLUMN "isParkingIncluded",
DROP COLUMN "isPetsAllowed",
DROP COLUMN "name",
DROP COLUMN "pricePerMonth",
DROP COLUMN "securityDeposit",
DROP COLUMN "squareFeet",
DROP COLUMN "tipoAlojamiento",
ADD COLUMN     "aguaIncluido" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "baños" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "descripcion" TEXT NOT NULL,
ADD COLUMN     "electricidadIncluido" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gasIncluido" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "habitaciones" INTEGER NOT NULL,
ADD COLUMN     "hayAireAcondicionado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayAscensor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayCalefaccion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayGaraje" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayGas" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayGimnasio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayHorno" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayInternet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayLavadora" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayLavavajillas" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayMicroondas" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayMuebles" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayNevera" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayPiscina" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayPortero" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "haySecadora" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayTelefono" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayTelevision" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayTerraza" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hayZonaComunitaria" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "internetIncluido" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "precio" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "superficie" INTEGER NOT NULL,
ADD COLUMN     "tipo" "TipoAlojamiento" NOT NULL;
