import { Request, Response } from "express"
import { successResponse } from "../../helpers/api-response.js"
import {
  getRefreshCookieClearOptions,
  refreshCookieName,
} from "../../config/auth-cookie.js"

export class LogoutController {
  async handle(_req: Request, res: Response) {
    res.clearCookie(refreshCookieName, getRefreshCookieClearOptions())
    return res
      .status(200)
      .json(successResponse(null, "Logout realizado com sucesso"))
  }
}
