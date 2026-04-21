import { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"
import { RequisicaoRepository } from "../../repositories/requisicao/requisicao-repository.js"
import { UserRepository } from "../../repositories/user/user-repository.js"
import { GetNotaCreditoRequisicoesUseCase } from "../../use-cases/credito/get-nota-credito-requisicoes-use-case.js"
import { GetNotaCreditoRequisicoesController } from "../../controllers/credito/get-nota-credito-requisicoes-controller.js"

export function makeGetNotaCreditoRequisicoesController() {
  const notaCreditoRepository = new NotaCreditoRepository()
  const requisicaoRepository = new RequisicaoRepository()
  const userRepository = new UserRepository()
  const useCase = new GetNotaCreditoRequisicoesUseCase(
    notaCreditoRepository,
    requisicaoRepository,
    userRepository
  )
  return new GetNotaCreditoRequisicoesController(useCase)
}
