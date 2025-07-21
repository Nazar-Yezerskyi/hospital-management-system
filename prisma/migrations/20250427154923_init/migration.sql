/*
  Warnings:

  - You are about to drop the column `totalWriteOffValue` on the `MedicineWriteOff` table. All the data in the column will be lost.
  - Added the required column `totalWriteOffPrice` to the `MedicineWriteOff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicineWriteOff" DROP COLUMN "totalWriteOffValue",
ADD COLUMN     "totalWriteOffPrice" DOUBLE PRECISION NOT NULL;
