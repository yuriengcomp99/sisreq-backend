-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "EmpenhoTipo" AS ENUM ('ORDINARIO', 'ESTIMATIVO', 'GLOBAL');

-- CreateEnum
CREATE TYPE "SimNao" AS ENUM ('SIM', 'NAO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "army_name" TEXT NOT NULL,
    "graduation" TEXT NOT NULL,
    "designationId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "om" TEXT NOT NULL DEFAULT 'BCMS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Designation" (
    "id" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Designation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtaItem" (
    "id" TEXT NOT NULL,
    "pregao" TEXT NOT NULL,
    "objeto" TEXT NOT NULL,
    "ugg" TEXT NOT NULL,
    "nrAta" TEXT NOT NULL,
    "nrItem" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "fornecedor" TEXT NOT NULL,
    "inicioVigAta" TIMESTAMP(3) NOT NULL,
    "fimVigAta" TIMESTAMP(3) NOT NULL,
    "valorUnitario" DOUBLE PRECISION NOT NULL,
    "uasg" TEXT NOT NULL,
    "tipoUasg" TEXT NOT NULL,
    "qtdHomologada" INTEGER NOT NULL,
    "qtdAutorizada" INTEGER NOT NULL,
    "qtdSaldo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AtaItem_pkey" PRIMARY KEY ("id")
);

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
    "notaCreditoId" TEXT,
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

-- CreateTable
CREATE TABLE "NotaCredito" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "emitente" TEXT NOT NULL,
    "favorecido" TEXT NOT NULL DEFAULT 'BCMS',
    "observacao" TEXT,
    "prazo" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotaCredito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AtaItem_pregao_ugg_nrAta_nrItem_key" ON "AtaItem"("pregao", "ugg", "nrAta", "nrItem");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requisicao" ADD CONSTRAINT "Requisicao_notaCreditoId_fkey" FOREIGN KEY ("notaCreditoId") REFERENCES "NotaCredito"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisicaoDetalhe" ADD CONSTRAINT "RequisicaoDetalhe_requisicaoId_fkey" FOREIGN KEY ("requisicaoId") REFERENCES "Requisicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
