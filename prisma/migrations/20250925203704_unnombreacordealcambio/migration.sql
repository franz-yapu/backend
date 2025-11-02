/*
  Warnings:

  - Added the required column `first_name_tutor` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name_tutor` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_tutor` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "first_name_tutor" TEXT NOT NULL,
ADD COLUMN     "last_name_tutor" TEXT NOT NULL,
ADD COLUMN     "phone_tutor" TEXT NOT NULL;
