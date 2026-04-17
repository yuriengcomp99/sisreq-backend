import { RefreshTokenUseCase } from "../../use-cases/auth/refresh-token-usecase.js"
import { RefreshTokenController } from "../../controllers/auth/refresh-token-controller.js"

export function makeRefreshTokenController() {
  const refreshTokenUseCase = new RefreshTokenUseCase()
  return new RefreshTokenController(refreshTokenUseCase)
}
