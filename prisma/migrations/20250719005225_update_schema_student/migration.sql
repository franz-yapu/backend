/*
  Warnings:

  - You are about to drop the column `user_id` on the `Student` table. All the data in the column will be lost.
  - Added the required column `address` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identity card` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `middle_name` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_user_id_fkey";

-- DropIndex
DROP INDEX "Student_user_id_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "user_id",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "identity card" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "middle_name" TEXT NOT NULL;
