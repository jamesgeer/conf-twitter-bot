-- CreateTable
CREATE TABLE "ScrapeHistory" (
    "id" SERIAL NOT NULL,
    "links" TEXT NOT NULL,
    "errors" TEXT NOT NULL,
    "scrapeDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrapeHistory_pkey" PRIMARY KEY ("id")
);
