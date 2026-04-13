import { DesignationRepository } from "../../repositories/setor/designation-repository.js"
import { GetDesignationsUseCase } from "../../use-cases/setor/get-designations.js"
import { GetDesignationsController } from "../../controllers/setor/get-designations-controller.js"

export function makeGetDesignationsController() {
  const repository = new DesignationRepository()
  const useCase = new GetDesignationsUseCase(repository)
  const controller = new GetDesignationsController(useCase)
  return controller
}