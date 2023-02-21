/*
  Warnings:

  - You are about to drop the `AcmPaper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResearchrPaper` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `shortAbstract` to the `Paper` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Paper` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Paper` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Paper` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AcmPaper" DROP CONSTRAINT "AcmPaper_paperId_fkey";

-- DropForeignKey
ALTER TABLE "ResearchrPaper" DROP CONSTRAINT "ResearchrPaper_paperId_fkey";

-- AlterTable
ALTER TABLE "Paper" ADD COLUMN     "authors" TEXT[],
ADD COLUMN     "citations" INTEGER,
ADD COLUMN     "doi" TEXT,
ADD COLUMN     "downloads" INTEGER,
ADD COLUMN     "fullAbstract" TEXT,
ADD COLUMN     "fullAuthors" TEXT,
ADD COLUMN     "monthYear" TEXT,
ADD COLUMN     "pages" TEXT,
ADD COLUMN     "preprint" TEXT,
ADD COLUMN     "scrapeDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "shortAbstract" TEXT NOT NULL,
ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "url" TEXT NOT NULL;

-- DropTable
DROP TABLE "AcmPaper";

-- DropTable
DROP TABLE "ResearchrPaper";
