import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken"
import { jwtConfig } from "./jwt-config.js"
import type { AccessTokenPayload, RefreshTokenPayload } from "../../types/auth/jwt-payload.js"

export function signAccessToken(userId: string): string {
  const opts: SignOptions = {
    subject: userId,
    expiresIn: jwtConfig.access.expiresIn,
  }
  return jwt.sign({ tokenUse: "access" }, jwtConfig.access.secret, opts)
}

export function signRefreshToken(userId: string): string {
  const opts: SignOptions = {
    subject: userId,
    expiresIn: jwtConfig.refresh.expiresIn,
  }
  return jwt.sign({ tokenUse: "refresh" }, jwtConfig.refresh.secret, opts)
}

function assertAccessPayload(decoded: JwtPayload): asserts decoded is AccessTokenPayload {
  if (decoded.tokenUse !== "access") {
    throw new jwt.JsonWebTokenError("Invalid access token")
  }
  if (typeof decoded.sub !== "string" || !decoded.sub) {
    throw new jwt.JsonWebTokenError("Missing sub")
  }
}

function assertRefreshPayload(decoded: JwtPayload): asserts decoded is RefreshTokenPayload {
  if (decoded.tokenUse !== "refresh") {
    throw new jwt.JsonWebTokenError("Invalid refresh token")
  }
  if (typeof decoded.sub !== "string" || !decoded.sub) {
    throw new jwt.JsonWebTokenError("Missing sub")
  }
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, jwtConfig.access.secret)
  if (typeof decoded === "string") {
    throw new jwt.JsonWebTokenError("Invalid JWT payload")
  }
  assertAccessPayload(decoded)
  return decoded
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, jwtConfig.refresh.secret)
  if (typeof decoded === "string") {
    throw new jwt.JsonWebTokenError("Invalid JWT payload")
  }
  assertRefreshPayload(decoded)
  return decoded
}
