/*
  Warnings:

  - You are about to alter the column `job_status` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `job_status` VARCHAR(191) NOT NULL;
