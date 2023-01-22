/*
  Warnings:

  - You are about to drop the column `accountId` on the `TwitterOAuth` table. All the data in the column will be lost.
  - Made the column `updatedAt` on table `TwitterOAuth` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TwitterOAuth" DROP CONSTRAINT "TwitterOAuth_accountId_fkey";

-- DropIndex
DROP INDEX "TwitterOAuth_accountId_key";

-- DropIndex
DROP INDEX "TwitterOAuth_accountId_twitterUserId_key";

-- AlterTable
ALTER TABLE "TwitterOAuth" DROP COLUMN "accountId",
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
