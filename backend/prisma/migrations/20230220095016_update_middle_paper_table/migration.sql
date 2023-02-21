/*
  Warnings:

  - A unique constraint covering the columns `[paperId]` on the table `AcmPaper` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paperId]` on the table `ResearchrPaper` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paperId` to the `AcmPaper` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paperId` to the `ResearchrPaper` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AcmPaper" ADD COLUMN     "paperId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ResearchrPaper" ADD COLUMN     "paperId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Paper" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcmPaper_paperId_key" ON "AcmPaper"("paperId");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchrPaper_paperId_key" ON "ResearchrPaper"("paperId");

-- AddForeignKey
ALTER TABLE "AcmPaper" ADD CONSTRAINT "AcmPaper_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchrPaper" ADD CONSTRAINT "ResearchrPaper_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
