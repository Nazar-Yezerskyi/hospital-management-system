-- CreateTable
CREATE TABLE "Ward" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "type" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "Ward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WardPlace" (
    "id" SERIAL NOT NULL,
    "placeNumver" INTEGER NOT NULL,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "wardId" INTEGER NOT NULL,

    CONSTRAINT "WardPlace_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardPlace" ADD CONSTRAINT "WardPlace_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
