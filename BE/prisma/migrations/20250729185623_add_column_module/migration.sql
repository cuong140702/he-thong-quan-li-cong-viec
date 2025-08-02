-- AlterTable
ALTER TABLE `permission` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `module` VARCHAR(256) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `role` ADD COLUMN `deletedAt` DATETIME(3) NULL;
