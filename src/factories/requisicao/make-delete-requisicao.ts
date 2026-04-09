import { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"
import { DeleteRequisicaoUseCase } from "../../use-cases/requisicao/delete-requisicao-use-case.js"
import { DeleteRequisicaoController } from "../../controllers/requisicao/delete-requisicao-controller.js"

export function makeDeleteRequisicaoController() {
  const repository = new RequisicaoRepository()
  const useCase = new DeleteRequisicaoUseCase(repository)
  const controller = new DeleteRequisicaoController(useCase)

  return controller
}