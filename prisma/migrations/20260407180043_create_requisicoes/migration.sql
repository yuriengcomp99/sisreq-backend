/*
  Warnings:

  - A unique constraint covering the columns `[pregao,ugg,nrAta,nrItem]` on the table `AtaItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EmpenhoTipo" AS ENUM ('ORDINARIO', 'ESTIMATIVO', 'GLOBAL');

-- CreateEnum
CREATE TYPE "SimNao" AS ENUM ('SIM', 'NAO');

-- DropIndex
DROP INDEX "AtaItem_pregao_nrAta_nrItem_key";

-- CreateTable
CREATE TABLE "Requisicao" (
    "id" TEXT NOT NULL,
    "numero_diex" TEXT NOT NULL,
    "nup" TEXT NOT NULL,
    "data_req" TIMESTAMP(3) NOT NULL,
    "de" TEXT NOT NULL,
    "para" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nr_pregao" TEXT NOT NULL,
    "ug" TEXT NOT NULL,
    "nome_da_ug" TEXT NOT NULL,
    "descricao_necessidade" VARCHAR(500) NOT NULL,
    "recurso_id" INTEGER NOT NULL,
    "empenho_tipo" "EmpenhoTipo" NOT NULL,
    "contrato" "SimNao" NOT NULL,
    "classe_grupo_pca" TEXT NOT NULL,
    "nr_contratacao_pca" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requisicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequisicaoDetalhe" (
    "id" TEXT NOT NULL,
    "requisicaoId" TEXT NOT NULL,
    "nr_item" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "subitem" TEXT NOT NULL,
    "und" TEXT NOT NULL,
    "qtd" INTEGER NOT NULL,
    "valor_unitario" DOUBLE PRECISION NOT NULL,
    "valor_total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequisicaoDetalhe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AtaItem_pregao_ugg_nrAta_nrItem_key" ON "AtaItem"("pregao", "ugg", "nrAta", "nrItem");

-- AddForeignKey
ALTER TABLE "RequisicaoDetalhe" ADD CONSTRAINT "RequisicaoDetalhe_requisicaoId_fkey" FOREIGN KEY ("requisicaoId") REFERENCES "Requisicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
