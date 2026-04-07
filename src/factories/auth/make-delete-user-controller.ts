import { DeleteUserController } from "../../controllers/auth/delete-user-controller.js"
import { DeleteUserUseCase } from "../../use-cases/auth/delete-user-use-case.js"
import { UserRepository } from "../../repositories/user/user-repository.js"

export function makeDeleteUserController() {
  const userRepository = new UserRepository()

  const deleteUserUseCase = new DeleteUserUseCase(userRepository)

  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  return deleteUserController
}