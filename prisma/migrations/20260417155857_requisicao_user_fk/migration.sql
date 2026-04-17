/*
  Warnings:

  - Added the required column `userId` to the `Requisicao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Requisicao" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Requisicao" ADD CONSTRAINT "Requisicao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
