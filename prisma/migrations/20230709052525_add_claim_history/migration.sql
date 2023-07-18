-- AlterTable
ALTER TABLE "Azuki" ADD COLUMN     "blockClaimed" TEXT,
ADD COLUMN     "claimedAt" TIMESTAMP(3),
ADD COLUMN     "txHashClaimed" TEXT;
