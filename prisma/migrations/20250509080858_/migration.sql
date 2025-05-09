/*
  Warnings:

  - You are about to drop the `AdminSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdminSession" DROP CONSTRAINT "AdminSession_adminId_fkey";

-- DropTable
DROP TABLE "AdminSession";
