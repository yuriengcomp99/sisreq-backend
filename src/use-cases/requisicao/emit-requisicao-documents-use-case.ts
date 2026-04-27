import { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"
import {
  buildRequisicaoDocx,
  buildRequisicaoPdf,
} from "../../services/requisicao/requisicao-document-builder.js"
import { safeDownloadBaseName } from "../../services/requisicao/requisicao-document-helpers.js"

export class EmitRequisicaoDocumentsUseCase {
  constructor(private repo: RequisicaoRepository) {}

  async executeWord(id: string): Promise<{ buffer: Buffer; filename: string }> {
    const r = await this.repo.findByIdForDocument(id)
    if (!r) throw new Error("Requisição não encontrada")

    const buffer = await buildRequisicaoDocx(r)
    const filename = `${safeDownloadBaseName(r.numero_diex, r.nup)}.docx`
    return { buffer, filename }
  }

  async executePdf(id: string): Promise<{ buffer: Buffer; filename: string }> {
    const r = await this.repo.findByIdForDocument(id)
    if (!r) throw new Error("Requisição não encontrada")

    const buffer = await buildRequisicaoPdf(r)
    const filename = `${safeDownloadBaseName(r.numero_diex, r.nup)}.pdf`
    return { buffer, filename }
  }
}
