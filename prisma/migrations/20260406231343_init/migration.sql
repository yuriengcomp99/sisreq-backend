-- CreateTable
CREATE TABLE "AtaItem" (
    "id" TEXT NOT NULL,
    "pregao" TEXT,
    "objeto" TEXT,
    "ugg" TEXT,
    "nrAta" TEXT,
    "nrItem" TEXT,
    "descricao" TEXT,
    "fornecedor" TEXT,
    "inicioVigAta" TIMESTAMP(3),
    "fimVigAta" TIMESTAMP(3),
    "valorUnitario" DOUBLE PRECISION,
    "uasg" TEXT,
    "tipoUasg" TEXT,
    "qtdHomologada" DOUBLE PRECISION,
    "qtdAutorizada" DOUBLE PRECISION,
    "qtdSaldo" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AtaItem_pkey" PRIMARY KEY ("id")
);
