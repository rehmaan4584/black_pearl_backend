/*
  Warnings:

  - Added the required column `publicId` to the `product_variant_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_variant_images" ADD COLUMN     "publicId" TEXT NOT NULL;
