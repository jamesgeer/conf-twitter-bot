/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `ResearchrPaper` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ResearchrPaper_title_key" ON "ResearchrPaper"("title");
