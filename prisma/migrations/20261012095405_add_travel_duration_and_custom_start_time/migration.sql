-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "customStartTime" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "travelDuration" INTEGER NOT NULL DEFAULT 30;
