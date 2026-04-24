import type { IncomingMessage } from "node:http"

/**
 * Obtém o access JWT enviado na conexão WebSocket.
 *
 * Ordem: cabeçalho `Authorization: Bearer <token>`, depois query `?token=` ou `?access_token=`.
 */
export function readAccessTokenFromUpgradeRequest(
  req: IncomingMessage
): string | null {
  const auth = req.headers.authorization?.trim()
  if (auth) {
    const m = /^Bearer\s+(.+)$/i.exec(auth)
    if (m?.[1]) {
      return m[1].trim()
    }
  }

  try {
    const u = new URL(req.url ?? "/", "http://127.0.0.1")
    const q =
      u.searchParams.get("token") ?? u.searchParams.get("access_token")
    const t = q?.trim()
    return t && t.length > 0 ? t : null
  } catch {
    return null
  }
}
