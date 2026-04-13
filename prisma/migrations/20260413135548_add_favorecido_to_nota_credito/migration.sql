-- AlterTable
ALTER TABLE "NotaCredito" ADD COLUMN     "favorecido" TEXT NOT NULL DEFAULT 'BCMS',
ALTER COLUMN "emitente" DROP DEFAULT;
