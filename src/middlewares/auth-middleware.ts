import { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../helpers/auth/jwt-tokens.js"
import { errorResponse } from "../helpers/api-response.js"

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization?.trim()

  if (!authHeader) {
    return res
      .status(401)
      .json(errorResponse("Token de acesso não enviado", null))
  }

  const bearer = /^Bearer\s+(.+)$/i.exec(authHeader)
  const token = bearer?.[1]?.trim()

  if (!token) {
    return res
      .status(401)
      .json(
        errorResponse(
          "Cabeçalho inválido. Use: Authorization: Bearer <accessToken>",
          null
        )
      )
  }

  try {
    const payload = verifyAccessToken(token)
    req.userId = payload.sub
    return next()
  } catch {
    return res
      .status(401)
      .json(errorResponse("Token inválido ou expirado", null))
  }
}
