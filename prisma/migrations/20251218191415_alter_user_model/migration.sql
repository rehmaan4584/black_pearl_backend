/*
  Warnings:

  - The values [buyer,seller] on the enum `UserTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserTypes_new" AS ENUM ('BUYER', 'SELLER');
ALTER TABLE "users" ALTER COLUMN "userType" TYPE "UserTypes_new" USING ("userType"::text::"UserTypes_new");
ALTER TYPE "UserTypes" RENAME TO "UserTypes_old";
ALTER TYPE "UserTypes_new" RENAME TO "UserTypes";
DROP TYPE "public"."UserTypes_old";
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "userType" SET DEFAULT 'BUYER';
