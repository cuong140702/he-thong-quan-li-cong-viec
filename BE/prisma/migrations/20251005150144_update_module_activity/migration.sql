/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `activity` DROP COLUMN `ipAddress`,
    DROP COLUMN `userAgent`,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;
