import { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"
import { GetNotaCreditoByIdUseCase } from "../../use-cases/credito/get-nota-credito-by-id.js"
import { GetNotaCreditoByIdController } from "../../controllers/credito/get-nota-credito-by-id-controller.js"

export function makeGetNotaCreditoByIdController() {
  const repository = new NotaCreditoRepository()
  const useCase = new GetNotaCreditoByIdUseCase(repository)
  const controller = new GetNotaCreditoByIdController(useCase)
  return controller
}