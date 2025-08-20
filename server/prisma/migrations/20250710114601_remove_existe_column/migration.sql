/*
  Warnings:

  - You are about to drop the column `averageRating` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfReviews` on the `Alojamiento` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Ubicacion` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Ubicacion` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Ubicacion` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Ubicacion` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Ubicacion` table. All the data in the column will be lost.
  - Added the required column `estado` to the `Alojamiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ciudad` to the `Ubicacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigoPostal` to the `Ubicacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direccion` to the `Ubicacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pais` to the `Ubicacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provincia` to the `Ubicacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alojamiento" DROP COLUMN "averageRating",
DROP COLUMN "numberOfReviews",
ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "motivoRechazo" TEXT;

-- AlterTable
ALTER TABLE "Ubicacion" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "postalCode",
DROP COLUMN "state",
ADD COLUMN     "ciudad" TEXT NOT NULL,
ADD COLUMN     "codigoPostal" TEXT NOT NULL,
ADD COLUMN     "direccion" TEXT NOT NULL,
ADD COLUMN     "pais" TEXT NOT NULL,
ADD COLUMN     "provincia" TEXT NOT NULL;
