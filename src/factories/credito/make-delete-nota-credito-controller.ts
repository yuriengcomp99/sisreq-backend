import { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"
import { DeleteNotaCreditoUseCase } from "../../use-cases/credito/delete-nota-credito.js"
import { DeleteNotaCreditoController } from "../../controllers/credito/delete-nota-credito-controller.js"

export function makeDeleteNotaCreditoController() {
  const repository = new NotaCreditoRepository()
  const useCase = new DeleteNotaCreditoUseCase(repository)
  const controller = new DeleteNotaCreditoController(useCase)
  return controller
}