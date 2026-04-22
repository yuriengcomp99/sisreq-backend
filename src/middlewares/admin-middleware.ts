import type { Request, Response, NextFunction } from "express"
import { UserRole } from "@prisma/client"
import { UserRepository } from "../repositories/user/user-repository.js"
import { errorResponse } from "../helpers/api-response.js"

const userRepository = new UserRepository()

export async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.userId
  if (!userId) {
    return res.status(401).json(errorResponse("Não autorizado", null))
  }

  const user = await userRepository.findById(userId)
  if (!user) {
    return res.status(401).json(errorResponse("Usuário não encontrado", null))
  }

  if (user.role !== UserRole.ADMIN) {
    return res
      .status(403)
      .json(errorResponse("Apenas administradores podem acessar este recurso.", null))
  }

  return next()
}
