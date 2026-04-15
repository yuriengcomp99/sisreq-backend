import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface JwtPayload {
  sub: string
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      error: "Token não enviado",
    })
  }

  const [, token] = authHeader.split(" ")

  if (!token) {
    return res.status(401).json({
      error: "token Inválido",
    })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload

    req.userId = decoded.sub

    return next()
  } catch (error) {
    return res.status(401).json({
      error: "token inválido ou expirado",
    })
  }
}