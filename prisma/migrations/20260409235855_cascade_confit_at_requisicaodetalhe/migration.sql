-- DropForeignKey
ALTER TABLE "RequisicaoDetalhe" DROP CONSTRAINT "RequisicaoDetalhe_requisicaoId_fkey";

-- AddForeignKey
ALTER TABLE "RequisicaoDetalhe" ADD CONSTRAINT "RequisicaoDetalhe_requisicaoId_fkey" FOREIGN KEY ("requisicaoId") REFERENCES "Requisicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
