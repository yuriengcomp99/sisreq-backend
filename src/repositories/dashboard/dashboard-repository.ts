import { Prisma } from "@prisma/client"
import { prisma } from "../../database/prisma.js"

export type DashboardResumo = {
  totalRequisicoes: number
  totalItensComSaldoDisponivel: number
  totalLicitacoes: number
  creditoDisponivelReais: number
}

export class DashboardRepository {
  async getResumo(): Promise<DashboardResumo> {
    const [totalRequisicoes, totalItensComSaldoDisponivel, gruposLicitacao, creditoRow] =
      await Promise.all([
        prisma.requisicao.count(),
        prisma.ataItem.count({ where: { qtdSaldo: { gt: 0 } } }),
        prisma.ataItem.groupBy({ by: ["pregao", "ugg"] }),
        prisma.$queryRaw<Array<{ total: unknown }>>(Prisma.sql`
          SELECT COALESCE(
            SUM(GREATEST(nc.valor - COALESCE(u.consumido, 0), 0)),
            0
          )::double precision AS total
          FROM "NotaCredito" nc
          LEFT JOIN (
            SELECT r."notaCreditoId" AS nid,
                   SUM(rd."valor_total") AS consumido
            FROM "Requisicao" r
            INNER JOIN "RequisicaoDetalhe" rd ON rd."requisicaoId" = r.id
            WHERE r."notaCreditoId" IS NOT NULL
            GROUP BY r."notaCreditoId"
          ) u ON u.nid = nc.id
        `),
      ])

    const rawTotal = creditoRow[0]?.total
    const creditoDisponivelReais =
      typeof rawTotal === "number" ? rawTotal : Number(rawTotal ?? 0)

    return {
      totalRequisicoes,
      totalItensComSaldoDisponivel,
      totalLicitacoes: gruposLicitacao.length,
      creditoDisponivelReais,
    }
  }
}
