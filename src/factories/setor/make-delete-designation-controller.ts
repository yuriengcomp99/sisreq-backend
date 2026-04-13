import { DesignationRepository } from "../../repositories/setor/designation-repository.js"
import { DeleteDesignationUseCase } from "../../use-cases/setor/delete-designation.js"
import { DeleteDesignationController } from "../../controllers/setor/delete-designation-controller.js"

export function makeDeleteDesignationController() {
  const repository = new DesignationRepository()
  const useCase = new DeleteDesignationUseCase(repository)
  const controller = new DeleteDesignationController(useCase)
  return controller
}