/*
  Warnings:

  - You are about to drop the `_userroles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_userroles` DROP FOREIGN KEY `_UserRoles_A_fkey`;

-- DropForeignKey
ALTER TABLE `_userroles` DROP FOREIGN KEY `_UserRoles_B_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `roleId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_userroles`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
