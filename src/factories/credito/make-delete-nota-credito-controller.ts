import { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"
import { UserRepository } from "../../repositories/user/user-repository.js"
import { DeleteNotaCreditoUseCase } from "../../use-cases/credito/delete-nota-credito.js"
import { DeleteNotaCreditoController } from "../../controllers/credito/delete-nota-credito-controller.js"

export function makeDeleteNotaCreditoController() {
  const repository = new NotaCreditoRepository()
  const userRepository = new UserRepository()
  const useCase = new DeleteNotaCreditoUseCase(repository, userRepository)
  const controller = new DeleteNotaCreditoController(useCase)
  return controller
}
