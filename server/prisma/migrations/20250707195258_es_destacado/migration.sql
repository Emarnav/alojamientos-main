-- AlterTable
ALTER TABLE "Alojamiento" ADD COLUMN     "esDestacado" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "Amenity";

-- DropEnum
DROP TYPE "Highlight";
