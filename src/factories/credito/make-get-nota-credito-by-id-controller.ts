import { NotaCreditoRepository } from "../../repositories/credito/nota-credito-repository.js"
import { UserRepository } from "../../repositories/user/user-repository.js"
import { GetNotaCreditoByIdUseCase } from "../../use-cases/credito/get-nota-credito-by-id.js"
import { GetNotaCreditoByIdController } from "../../controllers/credito/get-nota-credito-by-id-controller.js"

export function makeGetNotaCreditoByIdController() {
  const repository = new NotaCreditoRepository()
  const userRepository = new UserRepository()
  const useCase = new GetNotaCreditoByIdUseCase(repository, userRepository)
  const controller = new GetNotaCreditoByIdController(useCase)
  return controller
}
