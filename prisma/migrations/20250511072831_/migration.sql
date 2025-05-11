-- AlterTable
ALTER TABLE "QuizAttempt" ADD COLUMN     "finalPercentage" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "finalMarks" SET DEFAULT 0;
