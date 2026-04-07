import { AtaRepository } from "../../repositories/ata/ata-repository.js"
import { GetPregaoByUggUseCase } from "../../use-cases/ata/get-pregao-by-ugg-usecase.js"
import { GetPregaoByUggController } from "../../controllers/ata/get-pregao-by-ugg-controller.js"

export function makeGetPregaoByUggController() {
  const ataRepository = new AtaRepository()

  const useCase = new GetPregaoByUggUseCase(ataRepository)
  
  const controller = new GetPregaoByUggController(useCase)

  return controller
}