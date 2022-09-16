/*
  Warnings:

  - Added the required column `scheduledTimeUTC` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "scheduledTimeUTC" TIMESTAMPTZ(3) NOT NULL;
