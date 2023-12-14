/*
  Warnings:

  - You are about to drop the column `chatId` on the `Voice` table. All the data in the column will be lost.
  - Added the required column `name` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Voice" DROP CONSTRAINT "Voice_chatId_fkey";

-- DropIndex
DROP INDEX "Voice_chatId_key";

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "voiceId" TEXT;

-- AlterTable
ALTER TABLE "Voice" DROP COLUMN "chatId";

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "Voice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
