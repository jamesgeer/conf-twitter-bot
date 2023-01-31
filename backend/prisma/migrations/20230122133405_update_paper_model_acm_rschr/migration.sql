/*
  Warnings:

  - You are about to drop the `Paper` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Paper";

-- CreateTable
CREATE TABLE "AcmPaper" (
    "id" SERIAL NOT NULL,
    "doi" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT[],
    "fullAuthors" TEXT,
    "url" TEXT NOT NULL,
    "preprint" TEXT,
    "shortAbstract" TEXT NOT NULL,
    "fullAbstract" TEXT,
    "monthYear" TEXT,
    "pages" TEXT,
    "citations" INTEGER,
    "downloads" INTEGER,

    CONSTRAINT "AcmPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchrPaper" (
    "id" SERIAL NOT NULL,
    "doi" TEXT,
    "title" TEXT NOT NULL,
    "authors" TEXT[],
    "fullAuthors" TEXT,
    "url" TEXT NOT NULL,
    "preprint" TEXT,
    "shortAbstract" TEXT NOT NULL,
    "fullAbstract" TEXT,

    CONSTRAINT "ResearchrPaper_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcmPaper_doi_key" ON "AcmPaper"("doi");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchrPaper_doi_key" ON "ResearchrPaper"("doi");
