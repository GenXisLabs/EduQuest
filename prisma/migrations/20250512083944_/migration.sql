/*
  Warnings:

  - You are about to drop the column `cldPublicId` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "cldPublicId";

-- AlterTable
ALTER TABLE "SubmittedAnswer" ADD COLUMN     "cldPublicId" TEXT NOT NULL DEFAULT '';
