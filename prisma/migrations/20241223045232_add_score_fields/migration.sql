-- AlterTable
ALTER TABLE "Guess" ADD COLUMN     "isCorrect" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "totalScore" INTEGER NOT NULL DEFAULT 0;