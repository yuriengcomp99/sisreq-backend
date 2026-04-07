/*
  Warnings:

  - A unique constraint covering the columns `[pregao,nrAta,nrItem]` on the table `AtaItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AtaItem_pregao_nrAta_nrItem_key" ON "AtaItem"("pregao", "nrAta", "nrItem");
