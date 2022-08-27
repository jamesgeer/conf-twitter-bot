/*
  Warnings:

  - You are about to drop the column `confUserId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `confUserId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `ConfUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_confUserId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_confUserId_fkey";

-- DropIndex
DROP INDEX "Session_confUserId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "confUserId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "confUserId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ConfUser";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_key" ON "Session"("userId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
