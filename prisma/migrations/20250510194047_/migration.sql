-- DropForeignKey
ALTER TABLE "SubmittedAnswer" DROP CONSTRAINT "SubmittedAnswer_attemptId_fkey";

-- AddForeignKey
ALTER TABLE "SubmittedAnswer" ADD CONSTRAINT "SubmittedAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
