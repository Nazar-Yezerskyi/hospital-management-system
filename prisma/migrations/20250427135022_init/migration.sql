/*
  Warnings:

  - Made the column `appointmentId` on table `Hospitalization` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Hospitalization" DROP CONSTRAINT "Hospitalization_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Hospitalization" ALTER COLUMN "appointmentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Hospitalization" ADD CONSTRAINT "Hospitalization_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
