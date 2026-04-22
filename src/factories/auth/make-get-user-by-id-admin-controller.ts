import { UserRepository } from "../../repositories/user/user-repository.js"
import { GetUserByIdAdminUseCase } from "../../use-cases/auth/get-user-by-id-admin-use-case.js"
import { GetUserByIdAdminController } from "../../controllers/auth/get-user-by-id-admin-controller.js"

export function makeGetUserByIdAdminController() {
  const repository = new UserRepository()
  const useCase = new GetUserByIdAdminUseCase(repository)
  return new GetUserByIdAdminController(useCase)
}
