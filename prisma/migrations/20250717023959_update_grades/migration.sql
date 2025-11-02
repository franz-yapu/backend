-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_main_teacher_id_fkey";

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_main_teacher_id_fkey" FOREIGN KEY ("main_teacher_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
