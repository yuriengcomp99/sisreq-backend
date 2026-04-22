import { UserRepository } from "../../repositories/user/user-repository.js"
import { UpdateUserUseCase } from "../../use-cases/auth/update-user-use-case.js"
import { AdminUpdateUserController } from "../../controllers/auth/admin-update-user-controller.js"

export function makeAdminUpdateUserController() {
  const repository = new UserRepository()
  const useCase = new UpdateUserUseCase(repository)
  return new AdminUpdateUserController(useCase)
}
