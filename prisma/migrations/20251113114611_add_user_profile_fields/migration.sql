-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verified" TIMESTAMPTZ(6),
ADD COLUMN     "image" VARCHAR(255);
