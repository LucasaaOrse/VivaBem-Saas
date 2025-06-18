-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailConfirmationToken" TEXT;
ALTER TABLE "User" ADD COLUMN "emailConfirmationTokenExpires" DATETIME;
ALTER TABLE "User" ADD COLUMN "password" TEXT;
