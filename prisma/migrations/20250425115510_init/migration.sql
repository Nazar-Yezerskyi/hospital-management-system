/*
  Warnings:

  - You are about to drop the column `placeNumver` on the `WardPlace` table. All the data in the column will be lost.
  - Added the required column `placeNumber` to the `WardPlace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WardPlace" DROP COLUMN "placeNumver",
ADD COLUMN     "placeNumber" INTEGER NOT NULL;
