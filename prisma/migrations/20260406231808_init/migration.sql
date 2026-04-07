/*
  Warnings:

  - You are about to alter the column `qtdHomologada` on the `AtaItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `qtdAutorizada` on the `AtaItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `qtdSaldo` on the `AtaItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Made the column `pregao` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `objeto` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ugg` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nrAta` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nrItem` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `descricao` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fornecedor` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inicioVigAta` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fimVigAta` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `valorUnitario` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uasg` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tipoUasg` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `qtdHomologada` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `qtdAutorizada` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `qtdSaldo` on table `AtaItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AtaItem" ALTER COLUMN "pregao" SET NOT NULL,
ALTER COLUMN "objeto" SET NOT NULL,
ALTER COLUMN "ugg" SET NOT NULL,
ALTER COLUMN "nrAta" SET NOT NULL,
ALTER COLUMN "nrItem" SET NOT NULL,
ALTER COLUMN "descricao" SET NOT NULL,
ALTER COLUMN "fornecedor" SET NOT NULL,
ALTER COLUMN "inicioVigAta" SET NOT NULL,
ALTER COLUMN "fimVigAta" SET NOT NULL,
ALTER COLUMN "valorUnitario" SET NOT NULL,
ALTER COLUMN "uasg" SET NOT NULL,
ALTER COLUMN "tipoUasg" SET NOT NULL,
ALTER COLUMN "qtdHomologada" SET NOT NULL,
ALTER COLUMN "qtdHomologada" SET DATA TYPE INTEGER,
ALTER COLUMN "qtdAutorizada" SET NOT NULL,
ALTER COLUMN "qtdAutorizada" SET DATA TYPE INTEGER,
ALTER COLUMN "qtdSaldo" SET NOT NULL,
ALTER COLUMN "qtdSaldo" SET DATA TYPE INTEGER;
