import type { CookieOptions } from "express"
import { env } from "./env.js"
import { jwtExpiresInToMs } from "../helpers/auth/expires-in.js"

export function getRefreshCookieOptions(): CookieOptions {
  const maxAge = jwtExpiresInToMs(env.jwtRefreshExpiresIn)

  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? "strict" : "lax",
    path: "/auth",
    maxAge,
  }
}

export function getRefreshCookieClearOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? "strict" : "lax",
    path: "/auth",
  }
}

export const refreshCookieName = env.refreshCookieName
