-- CreateTable
CREATE TABLE "Paper" (
    "id" SERIAL NOT NULL,
    "batchId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "password" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "paperId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "marks" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
