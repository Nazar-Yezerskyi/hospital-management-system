-- AlterTable
ALTER TABLE "StaffDetails" ADD COLUMN     "appointmentDurationMinutes" INTEGER;

-- CreateTable
CREATE TABLE "SheduleSlot" (
    "id" SERIAL NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SheduleSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkShedule" (
    "id" SERIAL NOT NULL,
    "staffDetailsId" INTEGER NOT NULL,
    "sheduleSlotId" INTEGER NOT NULL,

    CONSTRAINT "WorkShedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkShedule_staffDetailsId_sheduleSlotId_key" ON "WorkShedule"("staffDetailsId", "sheduleSlotId");

-- AddForeignKey
ALTER TABLE "WorkShedule" ADD CONSTRAINT "WorkShedule_staffDetailsId_fkey" FOREIGN KEY ("staffDetailsId") REFERENCES "StaffDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkShedule" ADD CONSTRAINT "WorkShedule_sheduleSlotId_fkey" FOREIGN KEY ("sheduleSlotId") REFERENCES "SheduleSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
