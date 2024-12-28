/*
  Warnings:

  - You are about to drop the `LyricBlock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LyricBlock" DROP CONSTRAINT "LyricBlock_songId_fkey";

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "lyricBlocks" TEXT[];

-- DropTable
DROP TABLE "LyricBlock";
