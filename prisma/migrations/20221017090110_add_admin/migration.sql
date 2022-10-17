-- AlterTable
ALTER TABLE `blogs` ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false;
