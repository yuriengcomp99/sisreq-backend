import { signAccessToken, verifyRefreshToken } from "../../helpers/auth/jwt-tokens.js"

export class RefreshTokenUseCase {
  execute(refreshToken: string | undefined) {
    if (!refreshToken?.trim()) {
      throw new Error("Refresh token não enviado")
    }

    const payload = verifyRefreshToken(refreshToken)
    return { accessToken: signAccessToken(payload.sub) }
  }
}
