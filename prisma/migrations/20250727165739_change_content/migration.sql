/*
  Warnings:

  - You are about to drop the column `content` on the `project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `content`,
    ADD COLUMN `description` VARCHAR(191) NULL;
