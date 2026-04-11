import { CapacidadeRepository } from "../../repositories/capacidade/capacidade-repository.js"
import { GetCapacidadeUseCase } from "../../use-cases/capacidade/get-capacidade-usecase.js"
import { GetCapacidadeController } from "../../controllers/capacidade/get-capacidade-controller.js"

export function makeGetCapacidadeController() {
  const repository = new CapacidadeRepository()
  const useCase = new GetCapacidadeUseCase(repository)
  const controller = new GetCapacidadeController(useCase)

  return controller
}