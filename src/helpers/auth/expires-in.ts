export function jwtExpiresInToMs(expiresIn: string): number {
  const match = /^(\d+)(s|m|h|d)$/i.exec(expiresIn.trim())
  if (!match) {
    throw new Error(`Invalid expiresIn: ${expiresIn}`)
  }

  const n = Number(match[1])
  const unit = match[2].toLowerCase() as "s" | "m" | "h" | "d"
  const multipliers = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 } as const

  return n * multipliers[unit]
}
