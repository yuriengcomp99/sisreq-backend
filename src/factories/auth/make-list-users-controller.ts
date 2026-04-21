import { ListUsersController } from "../../controllers/auth/list-users-controller.js"
import { ListUsersUseCase } from "../../use-cases/auth/list-users-use-case.js"
import { UserRepository } from "../../repositories/user/user-repository.js"

export function makeListUsersController() {
  const userRepository = new UserRepository()
  const useCase = new ListUsersUseCase(userRepository)
  return new ListUsersController(useCase)
}
