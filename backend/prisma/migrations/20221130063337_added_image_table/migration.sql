-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "tweetId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "alt" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_name_key" ON "Image"("name");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
