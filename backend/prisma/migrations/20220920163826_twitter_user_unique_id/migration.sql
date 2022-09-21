/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `TwitterUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TwitterUser" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "TwitterUser_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "TwitterUser_id_key" ON "TwitterUser"("id");
