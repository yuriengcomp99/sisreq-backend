import "dotenv/config"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import type { IncomingMessage } from "node:http"
import { WebSocketServer, type WebSocket } from "ws"
import { verifyAccessToken } from "../helpers/auth/jwt-tokens.js"
import { NotificationRepository } from "../modules/notificacoes/repository/notification-repository.js"
import { readAccessTokenFromUpgradeRequest } from "./read-access-token-from-upgrade.js"
import { buildUnreadCountPayload } from "./ws-notification-events.js"
import { trackUserSocket } from "./user-sockets.js"

const LOG = "[ws-gateway]"

/**
 * Autenticação WebSocket (passo a passo):
 *
 * 1. O cliente abre a conexão para o mesmo host/porta do gateway (ex.: `ws://localhost:8081`).
 * 2. No handshake HTTP → WebSocket, o navegador não envia `Authorization` por padrão; por isso
 *    aceitamos o access JWT na query string: `ws://localhost:8081/?token=<accessJwt>`.
 *    Clientes não-browser (Node, testes) podem usar `Authorization: Bearer <accessJwt>` no upgrade.
 * 3. Aqui lemos `req` do upgrade (`readAccessTokenFromUpgradeRequest`), extraímos o token e
 *    chamamos `verifyAccessToken` (mesmo segredo e regras do REST).
 * 4. Se não houver token ou for inválido/expirado, fechamos o socket com código 1008 (violação
 *    de política) antes de tratar mensagens — ninguém entra “anônimo”.
 * 5. Se válido, `sub` do JWT é o `userId`; registramos o socket em memória (`trackUserSocket`)
 *    para futuras notificações push por usuário.
 * 6. Só então enviamos `{ type: "connected", userId }` e passamos a aceitar `ping`/echo.
 */
export type WebSocketGatewayOptions = {
  port?: number
}

function parsePort(): number {
  const raw = process.env.WS_PORT?.trim()
  if (raw) {
    const n = Number(raw)
    if (Number.isInteger(n) && n > 0 && n < 65536) {
      return n
    }
  }
  return 8081
}

function closeUnauthenticated(socket: WebSocket, reason: "missing_token" | "invalid_token") {
  socket.close(1008, reason)
}

export function startWebSocketGateway(
  options: WebSocketGatewayOptions = {}
): WebSocketServer {
  const port = options.port ?? parsePort()
  const notificationRepository = new NotificationRepository()

  const wss = new WebSocketServer({ port })

  wss.on("connection", (socket: WebSocket, req: IncomingMessage) => {
    const token = readAccessTokenFromUpgradeRequest(req)
    if (!token) {
      console.warn(LOG, "rejeitado: token ausente")
      closeUnauthenticated(socket, "missing_token")
      return
    }

    let userId: string
    try {
      userId = verifyAccessToken(token).sub
    } catch {
      console.warn(LOG, "rejeitado: token inválido ou expirado")
      closeUnauthenticated(socket, "invalid_token")
      return
    }

    trackUserSocket(userId, socket)
    console.log(LOG, "autenticado userId=", userId)

    socket.send(
      JSON.stringify({
        type: "connected",
        userId,
        message: "ws-gateway authenticated",
      })
    )

    void notificationRepository
      .countUnreadByUserId(userId)
      .then((count) => {
        socket.send(buildUnreadCountPayload(count))
      })
      .catch((err: unknown) => {
        console.error(LOG, "falha ao enviar unread inicial:", err)
      })

    socket.on("message", (raw: Buffer | ArrayBuffer | Buffer[]) => {
      const text =
        typeof raw === "string"
          ? raw
          : raw instanceof Buffer
            ? raw.toString("utf8")
            : ""
      if (text === "ping") {
        socket.send(JSON.stringify({ type: "pong" }))
        return
      }
      socket.send(JSON.stringify({ type: "echo", payload: text || null }))
    })

    socket.on("error", (err: unknown) => {
      console.error(LOG, "socket error:", err)
    })
  })

  wss.on("listening", () => {
    console.log(LOG, "listening on port", port)
  })

  wss.on("error", (err: unknown) => {
    console.error(LOG, "server error:", err)
  })

  return wss
}

const isDirectRun =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isDirectRun) {
  startWebSocketGateway()
}
