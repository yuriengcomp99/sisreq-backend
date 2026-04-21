import type { NotaCredito } from "@prisma/client"

export type NotaCreditoResumoRequisicoes = {
  requisicaoCount: number
  valorTotalRequisicoes: number
  valorRestante: number
}

export function notaCreditoComResumoDTO(
  nota: NotaCredito,
  stats: Pick<NotaCreditoResumoRequisicoes, "requisicaoCount" | "valorTotalRequisicoes">
) {
  const valorRestante = nota.valor - stats.valorTotalRequisicoes
  return {
    ...nota,
    requisicaoCount: stats.requisicaoCount,
    valorTotalRequisicoes: stats.valorTotalRequisicoes,
    valorRestante,
  }
}
