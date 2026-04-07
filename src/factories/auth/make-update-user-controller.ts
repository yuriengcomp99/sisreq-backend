import { UpdateUserController } from "../../controllers/auth/update-user-controller.js"
import { UpdateUserUseCase } from "../../use-cases/auth/update-user-use-case.js"
import { UserRepository } from "../../repositories/user/user-repository.js"

export function makeUpdateUserController() {
  const userRepository = new UserRepository()

  const updateUserUseCase = new UpdateUserUseCase(userRepository)

  const updateUserController = new UpdateUserController(updateUserUseCase)

  return updateUserController
}