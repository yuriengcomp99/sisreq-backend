import { GetUserProfileController } from "../../controllers/auth/get-user-controller.js"
import { GetUserProfileUseCase } from "../../use-cases/auth/get-user-use-case.js"
import { UserRepository } from "../../repositories/user/user-repository.js"

export function makeGetUserProfileController() {
  const userRepository = new UserRepository()

  const useCase = new GetUserProfileUseCase(userRepository)

  const getUserProfileController = new GetUserProfileController(useCase)

  return getUserProfileController
}