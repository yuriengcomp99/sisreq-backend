import type { JwtPayload as StandardJwtPayload } from "jsonwebtoken"

export interface AccessTokenPayload extends StandardJwtPayload {
  sub: string
  tokenUse: "access"
}

export interface RefreshTokenPayload extends StandardJwtPayload {
  sub: string
  tokenUse: "refresh"
}
