import { UserRepository } from "../../repositories/user/user-repository.js"
import { DeleteUserUseCase } from "../../use-cases/auth/delete-user-use-case.js"
import { AdminDeleteUserController } from "../../controllers/auth/admin-delete-user-controller.js"

export function makeAdminDeleteUserController() {
  const repository = new UserRepository()
  const useCase = new DeleteUserUseCase(repository)
  const controller = new AdminDeleteUserController(useCase)
  return controller
}
