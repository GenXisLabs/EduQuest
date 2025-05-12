-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "cldPublicId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "fileUpload" BOOLEAN NOT NULL DEFAULT false;
