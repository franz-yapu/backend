/*
  Warnings:

  - You are about to alter the column `grade_1` on the `AcademicRecord` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `grade_2` on the `AcademicRecord` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `grade_3` on the `AcademicRecord` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `final_grade` on the `AcademicRecord` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "AcademicRecord" ALTER COLUMN "grade_1" SET DATA TYPE INTEGER,
ALTER COLUMN "grade_2" SET DATA TYPE INTEGER,
ALTER COLUMN "grade_3" SET DATA TYPE INTEGER,
ALTER COLUMN "final_grade" SET DATA TYPE INTEGER;
