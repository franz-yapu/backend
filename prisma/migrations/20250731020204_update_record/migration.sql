-- DropForeignKey
ALTER TABLE "AcademicRecord" DROP CONSTRAINT "AcademicRecord_teacher_id_fkey";

-- AddForeignKey
ALTER TABLE "AcademicRecord" ADD CONSTRAINT "AcademicRecord_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
