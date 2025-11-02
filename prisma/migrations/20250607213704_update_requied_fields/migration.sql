/*
  Warnings:

  - Made the column `category_id` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `marca_id` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product" ALTER COLUMN "category_id" SET NOT NULL,
ALTER COLUMN "marca_id" SET NOT NULL;
