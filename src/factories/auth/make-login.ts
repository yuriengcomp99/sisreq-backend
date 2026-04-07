import { UserRepository } from "../../repositories/user/user-repository.js"
import { LoginUseCase } from "../../use-cases/auth/login-usecase.js"
import { LoginController } from "../../controllers/auth/login-controller.js"

export function makeLoginController() {
  const userRepository = new UserRepository()

  const loginUseCase = new LoginUseCase(userRepository)

  const loginController = new LoginController(loginUseCase)

  return loginController
}