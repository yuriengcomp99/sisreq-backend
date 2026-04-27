import { Request, Response } from "express"
import { EmitRequisicaoDocumentsUseCase } from "../../use-cases/requisicao/emit-requisicao-documents-use-case.js"
import { errorResponse } from "../../helpers/api-response.js"

function sendBuffer(
  res: Response,
  buffer: Buffer,
  filename: string,
  contentType: string
) {
  const safe = filename.replace(/[^\w.\-]+/g, "_")
  res.setHeader("Content-Type", contentType)
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${safe}"; filename*=UTF-8''${encodeURIComponent(filename)}`
  )
  res.setHeader("Cache-Control", "no-store")
  return res.status(200).send(buffer)
}

export class EmitRequisicaoDocumentsController {
  constructor(private useCase: EmitRequisicaoDocumentsUseCase) {}

  async emitWord(req: Request, res: Response) {
    try {
      const id = String(req.params.id)
      const { buffer, filename } = await this.useCase.executeWord(id)
      return sendBuffer(
        res,
        buffer,
        filename,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao gerar documento"
      const status = msg.includes("não encontrada") ? 404 : 500
      return res.status(status).json(errorResponse(msg, null))
    }
  }

  async emitPdf(req: Request, res: Response) {
    try {
      const id = String(req.params.id)
      const { buffer, filename } = await this.useCase.executePdf(id)
      return sendBuffer(res, buffer, filename, "application/pdf")
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao gerar PDF"
      const status = msg.includes("não encontrada") ? 404 : 500
      return res.status(status).json(errorResponse(msg, null))
    }
  }
}
