import { AtaRepository } from "../../repositories/ata/ata-repository.js"
import { GetPregoesUseCase } from "../../use-cases/ata/get-pregoes-usecase.js"
import { GetPregoesController } from "../../controllers/ata/get-pregoes-controller.js"

export function makeGetPregoesController() {
  const repository = new AtaRepository()

  const useCase = new GetPregoesUseCase(repository)

  const getPregoesController = new GetPregoesController(useCase)
  
  return getPregoesController
}