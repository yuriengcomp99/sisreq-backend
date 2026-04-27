import type {
  EmpenhoTipo,
  NotaCredito,
  Requisicao,
  RequisicaoDetalhe,
  SimNao,
} from "@prisma/client"

export type RequisicaoDocumentRow = Requisicao & {
  detalhes: RequisicaoDetalhe[]
  notaCredito: NotaCredito | null
  user: {
    first_name: string
    army_name: string
    graduation: string
  }
}

export type DetalheFornecedor = RequisicaoDetalhe & {
  fornecedor?: string | null
}

export type FornecedorGroup = {
  fornecedor: string
  itens: DetalheFornecedor[]
}

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const

export function formatDatePtBrLong(date: Date): string {
  const d = new Date(date)
  const dia = d.getDate()
  const mes = MESES[d.getMonth()]
  const ano = d.getFullYear()
  return `${dia} de ${mes} de ${ano}.`
}

export function formatMoneyBr(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function empenhoTipoLabel(t: EmpenhoTipo): string {
  const map: Record<EmpenhoTipo, string> = {
    ORDINARIO: "Ordinário",
    ESTIMATIVO: "Estimativo",
    GLOBAL: "Global",
  }
  return map[t] ?? String(t)
}

export function contratoLabel(c: SimNao): string {
  return c === "SIM" ? "Sim" : "Não"
}

/** Linha “Fonte de recurso” — prioriza observação livre da NC; senão monta um resumo. */
export function fonteRecursoTexto(nota: NotaCredito | null): string {
  if (!nota) return "—"
  const obs = nota.observacao?.trim()
  if (obs) return obs
  const partes: string[] = []
  if (nota.emitente) partes.push(nota.emitente)
  partes.push(`NC ${nota.numero}`)
  partes.push(
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(nota.valor)
  )
  return partes.join(" – ")
}

export function fornecedorLinha(nota: NotaCredito | null): string {
  if (!nota?.emitente?.trim()) return "—"
  return nota.emitente.trim()
}

export function groupDetalhesByFornecedor(
  detalhes: RequisicaoDetalhe[],
  fornecedorPadrao: string
): FornecedorGroup[] {
  const groups = new Map<string, DetalheFornecedor[]>()

  for (const item of detalhes as DetalheFornecedor[]) {
    const nome = item.fornecedor?.trim() || fornecedorPadrao || "FORNECEDOR NÃO INFORMADO"
    const current = groups.get(nome) ?? []
    current.push(item)
    groups.set(nome, current)
  }

  return Array.from(groups.entries()).map(([fornecedor, itens]) => ({
    fornecedor,
    itens,
  }))
}

export function nomeAssinante(user: RequisicaoDocumentRow["user"]): string {
  const n = [user.first_name, user.army_name].filter(Boolean).join(" ").trim()
  return n || user.graduation || "—"
}

export function safeDownloadBaseName(
  numeroDiex: string,
  nup: string
): string {
  const slug = nup.replace(/[^\w\-./]+/g, "_").slice(0, 80)
  return `Requisicao-${numeroDiex}-${slug}`
}
