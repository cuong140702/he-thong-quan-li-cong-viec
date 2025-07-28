/*
  Warnings:

  - Made the column `description` on table `role` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `role` MODIFY `description` VARCHAR(191) NOT NULL;
