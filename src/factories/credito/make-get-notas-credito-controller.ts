import { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"
import { GetNotasCreditoUseCase } from "../../use-cases/credito/get-notas-credito.js"
import { GetNotasCreditoController } from "../../controllers/credito/get-notas-credito-controller.js"

export function makeGetNotasCreditoController() {
  const repository = new NotaCreditoRepository()
  const useCase = new GetNotasCreditoUseCase(repository)
  const controller = new GetNotasCreditoController(useCase)
  return controller
}