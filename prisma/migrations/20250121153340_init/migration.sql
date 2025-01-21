/*
  Warnings:

  - Made the column `phone` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `field` VARCHAR(191) NULL,
    ADD COLUMN `job_status` ENUM('TIDAK_BEKERJA', 'MAHASISWA', 'BEKERJA') NOT NULL DEFAULT 'TIDAK_BEKERJA',
    MODIFY `phone` VARCHAR(191) NOT NULL;
