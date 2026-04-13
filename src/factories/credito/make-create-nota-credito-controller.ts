import { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"
import { CreateNotaCreditoUseCase } from "../../use-cases/credito/create-nota-credito.js"
import { CreateNotaCreditoController } from "../../controllers/credito/create-nota-credito-controller.js"

export function makeCreateNotaCreditoController() {
  const repository = new NotaCreditoRepository()
  const useCase = new CreateNotaCreditoUseCase(repository)
  const controller = new CreateNotaCreditoController(useCase)
  return controller
}