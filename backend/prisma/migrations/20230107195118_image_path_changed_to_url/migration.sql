/*
  Warnings:

  - You are about to drop the column `path` on the `Upload` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `Upload` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Upload` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Upload_path_key";

-- AlterTable
ALTER TABLE "Upload" DROP COLUMN "path",
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Upload_url_key" ON "Upload"("url");
