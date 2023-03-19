/*
  Warnings:

  - You are about to drop the column `user` on the `chat` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chat" DROP COLUMN "user";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "user",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
