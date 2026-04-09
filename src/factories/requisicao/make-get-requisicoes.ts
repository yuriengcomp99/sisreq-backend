import { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"
import { GetRequisicoesUseCase } from "../../use-cases/requisicao/get-requisicoes-usecase.js"
import { GetRequisicoesController } from "../../controllers/requisicao/get-requisicoes-controller.js"

export function makeGetRequisicoesController() {
  const repository = new RequisicaoRepository()
  const useCase = new GetRequisicoesUseCase(repository)
  const controller = new GetRequisicoesController(useCase)

  return controller
}