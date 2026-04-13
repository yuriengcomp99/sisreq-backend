import { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"
import { GetRequisicaoByIdUseCase } from "../../use-cases/requisicao/get-requisicao-by-id-use-case.js"
import { GetRequisicaoByIdController } from "../../controllers/requisicao/get-requisicao-by-id-controller.js"

export function makeGetRequisicaoByIdController() {
  const repository = new RequisicaoRepository()
  const useCase = new GetRequisicaoByIdUseCase(repository)
  const controller = new GetRequisicaoByIdController(useCase)
  return controller
}