-- CreateTable
CREATE TABLE "Paper" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fullAuthors" TEXT,
    "doi" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "preprint" TEXT,
    "shortAbstract" TEXT NOT NULL,
    "fullAbstract" TEXT,
    "monthYear" TEXT,
    "pages" TEXT,
    "citations" INTEGER,
    "downloads" INTEGER,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Paper_doi_key" ON "Paper"("doi");
