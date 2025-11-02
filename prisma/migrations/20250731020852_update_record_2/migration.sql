/*
  Warnings:

  - You are about to drop the column `subject_id` on the `AcademicRecord` table. All the data in the column will be lost.
  - You are about to drop the `_StudentToTutor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `grade_id` to the `AcademicRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutorId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AcademicRecord" DROP CONSTRAINT "AcademicRecord_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_grade_id_fkey";

-- DropForeignKey
ALTER TABLE "Tutor" DROP CONSTRAINT "Tutor_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_StudentToTutor" DROP CONSTRAINT "_StudentToTutor_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentToTutor" DROP CONSTRAINT "_StudentToTutor_B_fkey";

-- AlterTable
ALTER TABLE "AcademicRecord" DROP COLUMN "subject_id",
ADD COLUMN     "grade_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "tutorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_StudentToTutor";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRecord" ADD CONSTRAINT "AcademicRecord_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
