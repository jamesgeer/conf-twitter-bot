/*
  Warnings:

  - The primary key for the `TwitterOAuth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[twitterUserId]` on the table `TwitterOAuth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId,twitterUserId]` on the table `TwitterOAuth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `twitterUserId` to the `TwitterOAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TwitterOAuth" DROP CONSTRAINT "TwitterOAuth_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "twitterUserId" BIGINT NOT NULL,
ADD CONSTRAINT "TwitterOAuth_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "TwitterOAuth_twitterUserId_key" ON "TwitterOAuth"("twitterUserId");

-- CreateIndex
CREATE UNIQUE INDEX "TwitterOAuth_accountId_twitterUserId_key" ON "TwitterOAuth"("accountId", "twitterUserId");

-- AddForeignKey
ALTER TABLE "TwitterOAuth" ADD CONSTRAINT "TwitterOAuth_twitterUserId_fkey" FOREIGN KEY ("twitterUserId") REFERENCES "TwitterUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
