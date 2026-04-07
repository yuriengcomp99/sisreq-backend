import { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"
import { CreateRequisicaoUseCase } from "../../use-cases/requisicao/create-requisicao-usecase.js"
import { RequisicaoController } from "../../controllers/requisicao/requisicao-controller.js"

export function makeCreateRequisicaoController() {
  const repository = new RequisicaoRepository()

  const useCase = new CreateRequisicaoUseCase(repository)
  
  const controller = new RequisicaoController(useCase)

  return controller
}