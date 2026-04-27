import { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"
import { EmitRequisicaoDocumentsUseCase } from "../../use-cases/requisicao/emit-requisicao-documents-use-case.js"
import { EmitRequisicaoDocumentsController } from "../../controllers/requisicao/emit-requisicao-documents-controller.js"

export function makeEmitRequisicaoDocumentsController() {
  const repo = new RequisicaoRepository()
  const useCase = new EmitRequisicaoDocumentsUseCase(repo)
  const controller = new EmitRequisicaoDocumentsController(useCase)
  return controller
}
