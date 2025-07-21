-- DropForeignKey
ALTER TABLE "StaffDetails" DROP CONSTRAINT "StaffDetails_departmentId_fkey";

-- AlterTable
ALTER TABLE "StaffDetails" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StaffDetails" ADD CONSTRAINT "StaffDetails_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
