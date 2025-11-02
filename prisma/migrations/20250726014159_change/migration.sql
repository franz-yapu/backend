-- DropForeignKey
ALTER TABLE "Behavior" DROP CONSTRAINT "Behavior_teacher_id_fkey";

-- AddForeignKey
ALTER TABLE "Behavior" ADD CONSTRAINT "Behavior_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
