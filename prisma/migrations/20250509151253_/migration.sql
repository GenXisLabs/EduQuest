/*
  Warnings:

  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[studentId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "studentId" DROP DEFAULT,
ALTER COLUMN "studentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Student_studentId_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentId_key" ON "Student"("studentId");
