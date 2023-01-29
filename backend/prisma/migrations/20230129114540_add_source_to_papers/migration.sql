/*
  Warnings:

  - Added the required column `source` to the `AcmPaper` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `ResearchrPaper` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AcmPaper" ADD COLUMN     "source" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ResearchrPaper" ADD COLUMN     "source" TEXT NOT NULL;
