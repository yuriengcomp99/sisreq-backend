import type { SignOptions } from "jsonwebtoken"
import { env } from "../../config/env.js"

const exp = (s: string): SignOptions["expiresIn"] => s as SignOptions["expiresIn"]

export const jwtConfig: {
  access: { secret: string; expiresIn: SignOptions["expiresIn"] }
  refresh: { secret: string; expiresIn: SignOptions["expiresIn"] }
} = {
  access: {
    secret: env.jwtAccessSecret,
    expiresIn: exp(env.jwtAccessExpiresIn),
  },
  refresh: {
    secret: env.jwtRefreshSecret,
    expiresIn: exp(env.jwtRefreshExpiresIn),
  },
}
