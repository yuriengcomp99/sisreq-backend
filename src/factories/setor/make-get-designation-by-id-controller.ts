import { DesignationRepository } from "../../repositories/setor/designation-repository.js"
import { GetDesignationByIdUseCase } from "../../use-cases/setor/get-designation-by-id.js"
import { GetDesignationByIdController } from "../../controllers/setor/get-designation-by-id-controller.js"

export function makeGetDesignationByIdController() {
  const repository = new DesignationRepository()
  const useCase = new GetDesignationByIdUseCase(repository)
  const controller = new GetDesignationByIdController(useCase)
  return controller
}