import { UserRepository } from "../../repositories/user/user-repository.js"
import { RegisterUseCase } from "../../use-cases/auth/register-usecase.js"
import { RegisterController } from "../../controllers/auth/register-controller.js"

export function makeRegisterController() {
  const userRepository = new UserRepository()

  const registerUseCase = new RegisterUseCase(userRepository)

  const registerController = new RegisterController(registerUseCase)

  return registerController
}