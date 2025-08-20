/*
  Warnings:

  - You are about to drop the column `status` on the `Solicitud` table. All the data in the column will be lost.
  - Added the required column `estado` to the `Solicitud` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Solicitud" DROP COLUMN "status",
ADD COLUMN     "estado" "EstadoSolicitud" NOT NULL;
