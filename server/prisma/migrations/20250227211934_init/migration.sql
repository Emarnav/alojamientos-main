/*
  Warnings:

  - You are about to drop the column `propertyId` on the `Lease` table. All the data in the column will be lost.
  - You are about to drop the column `propertyId` on the `Solicitud` table. All the data in the column will be lost.
  - Added the required column `alojamientoId` to the `Lease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alojamientoId` to the `Solicitud` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lease" DROP CONSTRAINT "Lease_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_propertyId_fkey";

-- AlterTable
ALTER TABLE "Lease" DROP COLUMN "propertyId",
ADD COLUMN     "alojamientoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Solicitud" DROP COLUMN "propertyId",
ADD COLUMN     "alojamientoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_alojamientoId_fkey" FOREIGN KEY ("alojamientoId") REFERENCES "Alojamiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_alojamientoId_fkey" FOREIGN KEY ("alojamientoId") REFERENCES "Alojamiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
