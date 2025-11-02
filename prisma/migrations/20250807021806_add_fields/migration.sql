-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "statusSee" TEXT NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Behavior" ADD COLUMN     "statusSee" TEXT NOT NULL DEFAULT 'active';
