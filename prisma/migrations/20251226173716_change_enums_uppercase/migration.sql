/*
  Warnings:

  - The values [pending,paid,shipped,delivered,cancelled] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [men,women,unisex] on the enum `ProductGender` will be removed. If these variants are still used in the database, this will fail.
  - The values [jeans,shorts] on the enum `ProductTypes` will be removed. If these variants are still used in the database, this will fail.
  - The values [black,blue,darkBlue,lightBlue] on the enum `ProductVariantColors` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProductGender_new" AS ENUM ('MEN', 'WOMEN', 'UNISEX');
ALTER TABLE "products" ALTER COLUMN "gender" TYPE "ProductGender_new" USING ("gender"::text::"ProductGender_new");
ALTER TYPE "ProductGender" RENAME TO "ProductGender_old";
ALTER TYPE "ProductGender_new" RENAME TO "ProductGender";
DROP TYPE "public"."ProductGender_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProductTypes_new" AS ENUM ('JEANS', 'SHORTS', 'SHIRTS', 'KNICKERS');
ALTER TABLE "products" ALTER COLUMN "type" TYPE "ProductTypes_new" USING ("type"::text::"ProductTypes_new");
ALTER TYPE "ProductTypes" RENAME TO "ProductTypes_old";
ALTER TYPE "ProductTypes_new" RENAME TO "ProductTypes";
DROP TYPE "public"."ProductTypes_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProductVariantColors_new" AS ENUM ('BLACK', 'BLUE', 'DARK_BLUE', 'LIGHT_BLUE');
ALTER TABLE "product_variants" ALTER COLUMN "color" TYPE "ProductVariantColors_new" USING ("color"::text::"ProductVariantColors_new");
ALTER TYPE "ProductVariantColors" RENAME TO "ProductVariantColors_old";
ALTER TYPE "ProductVariantColors_new" RENAME TO "ProductVariantColors";
DROP TYPE "public"."ProductVariantColors_old";
COMMIT;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';
