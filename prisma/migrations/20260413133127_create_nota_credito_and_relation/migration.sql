/*
  Warnings:

  - You are about to drop the column `recurso_id` on the `Requisicao` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Requisicao" DROP COLUMN "recurso_id",
ADD COLUMN     "notaCreditoId" TEXT;

-- CreateTable
CREATE TABLE "NotaCredito" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "emitente" TEXT NOT NULL DEFAULT 'BCMS',
    "observacao" TEXT,
    "prazo" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotaCredito_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Requisicao" ADD CONSTRAINT "Requisicao_notaCreditoId_fkey" FOREIGN KEY ("notaCreditoId") REFERENCES "NotaCredito"("id") ON DELETE SET NULL ON UPDATE CASCADE;
