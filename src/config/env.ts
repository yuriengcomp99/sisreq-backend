import dotenv from "dotenv"

dotenv.config()

function requireSecret(
  name: "JWT_ACCESS_SECRET" | "JWT_REFRESH_SECRET",
  fallback?: string
): string {
  const value = process.env[name] ?? fallback
  if (!value?.trim()) {
    throw new Error(`Missing ${name} or JWT_SECRET`)
  }
  return value
}

const legacyJwtSecret = process.env.JWT_SECRET?.trim()
const jwtAccessSecret = requireSecret("JWT_ACCESS_SECRET", legacyJwtSecret)
const jwtRefreshSecret = requireSecret("JWT_REFRESH_SECRET", legacyJwtSecret)

const frontendOrigins = (() => {
  const raw = process.env.FRONTEND_ORIGIN?.trim()
  if (raw) {
    return raw.split(",").map((s) => s.trim()).filter(Boolean)
  }
  return ["http://localhost:3000", "http://127.0.0.1:3000"]
})()

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProd: process.env.NODE_ENV === "production",
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtAccessSecret,
  jwtRefreshSecret,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  refreshCookieName: process.env.REFRESH_COOKIE_NAME ?? "refreshToken",
  frontendOrigins,
}
