/*
  Warnings:

  - You are about to drop the column `headOfDepartmentId` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `Hospitalization` table. All the data in the column will be lost.
  - You are about to drop the column `wardId` on the `Hospitalization` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_headOfDepartmentId_fkey";

-- DropForeignKey
ALTER TABLE "Hospitalization" DROP CONSTRAINT "Hospitalization_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Hospitalization" DROP CONSTRAINT "Hospitalization_wardId_fkey";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "headOfDepartmentId";

-- AlterTable
ALTER TABLE "Hospitalization" DROP COLUMN "departmentId",
DROP COLUMN "wardId";
