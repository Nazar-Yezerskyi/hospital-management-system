/*
  Warnings:

  - Made the column `headOfDepartmentId` on table `Department` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_headOfDepartmentId_fkey";

-- AlterTable
ALTER TABLE "Department" ALTER COLUMN "headOfDepartmentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_headOfDepartmentId_fkey" FOREIGN KEY ("headOfDepartmentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
