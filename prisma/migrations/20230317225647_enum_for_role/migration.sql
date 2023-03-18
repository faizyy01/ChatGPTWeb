/*
  Warnings:

  - Added the required column `role` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'SYSTEM');

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "role" "Role" NOT NULL;
