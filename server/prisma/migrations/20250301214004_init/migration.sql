/*
  Warnings:

  - The values [Pending,Denied,Approved] on the enum `EstadoSolicitud` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `message` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Solicitud` table. All the data in the column will be lost.
  - Added the required column `nombre` to the `Solicitud` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Solicitud` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoSolicitud_new" AS ENUM ('Pendiente', 'Denegada', 'Aprobada');
ALTER TABLE "Solicitud" ALTER COLUMN "estado" TYPE "EstadoSolicitud_new" USING ("estado"::text::"EstadoSolicitud_new");
ALTER TYPE "EstadoSolicitud" RENAME TO "EstadoSolicitud_old";
ALTER TYPE "EstadoSolicitud_new" RENAME TO "EstadoSolicitud";
DROP TYPE "EstadoSolicitud_old";
COMMIT;

-- AlterTable
ALTER TABLE "Solicitud" DROP COLUMN "message",
DROP COLUMN "name",
DROP COLUMN "phoneNumber",
ADD COLUMN     "mensaje" TEXT,
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "telefono" TEXT NOT NULL;
