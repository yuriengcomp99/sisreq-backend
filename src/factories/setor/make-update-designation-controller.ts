import { DesignationRepository } from "../../repositories/setor/designation-repository.js"
import { UpdateDesignationUseCase } from "../../use-cases/setor/update-designation.js"
import { UpdateDesignationController } from "../../controllers/setor/update-designation-controller.js"

export function makeUpdateDesignationController() {
  const repository = new DesignationRepository()
  const useCase = new UpdateDesignationUseCase(repository)
  const controller = new UpdateDesignationController(useCase)
  return controller
}