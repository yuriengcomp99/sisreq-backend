import { DesignationRepository } from "../../repositories/setor/designation-repository.js"
import { CreateDesignationUseCase } from "../../use-cases/setor/create-designation.js"
import { CreateDesignationController } from "../../controllers/setor/create-designation-controller.js"

export function makeCreateDesignationController() {
  const repository = new DesignationRepository()
  const useCase = new CreateDesignationUseCase(repository)
  const controller = new CreateDesignationController(useCase)
  return controller
}