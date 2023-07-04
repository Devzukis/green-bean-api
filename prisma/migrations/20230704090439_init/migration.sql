-- CreateTable
CREATE TABLE "Azuki" (
    "id" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "canClaim" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Azuki_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Azuki_tokenId_key" ON "Azuki"("tokenId");
