/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Image_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Image_path_key" ON "Image"("path");
