-- DropIndex
DROP INDEX "Player_socketId_key";

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "socketId" DROP NOT NULL;
