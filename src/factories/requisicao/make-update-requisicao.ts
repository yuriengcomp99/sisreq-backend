import { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"
import { UpdateRequisicaoUseCase } from "../../use-cases/requisicao/update-requisicao-use-case.js"
import { UpdateRequisicaoController } from "../../controllers/requisicao/update-requisicao-controller.js"

export function makeUpdateRequisicaoController() {
  const repository = new RequisicaoRepository()
  const useCase = new UpdateRequisicaoUseCase(repository)
  const controller = new UpdateRequisicaoController(useCase)

  return controller
}