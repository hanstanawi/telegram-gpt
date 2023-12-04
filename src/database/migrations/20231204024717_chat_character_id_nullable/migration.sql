-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_characterId_fkey";

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "characterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;
