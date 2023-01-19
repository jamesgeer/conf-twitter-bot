/*
  Warnings:

  - You are about to drop the column `scheduledTimeUTC` on the `Tweet` table. All the data in the column will be lost.
  - Added the required column `dateTime` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "scheduledTimeUTC",
ADD COLUMN     "dateTime" TIMESTAMPTZ(3) NOT NULL;
