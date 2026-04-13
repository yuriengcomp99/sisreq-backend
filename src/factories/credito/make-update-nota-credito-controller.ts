import { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"
import { UpdateNotaCreditoUseCase } from "../../use-cases/credito/update-nota-credito.js"
import { UpdateNotaCreditoController } from "../../controllers/credito/update-nota-credito-controller.js"

export function makeUpdateNotaCreditoController() {
  const repository = new NotaCreditoRepository()
  const useCase = new UpdateNotaCreditoUseCase(repository)
  const controller = new UpdateNotaCreditoController(useCase)
  return controller
}