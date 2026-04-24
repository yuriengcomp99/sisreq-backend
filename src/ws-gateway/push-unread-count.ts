import { WebSocket } from "ws"
import { forEachSocketOfUser } from "./user-sockets.js"
import { buildUnreadCountPayload } from "./ws-notification-events.js"

/**
 * Passo 2 — envia o contador de não lidas para todos os sockets WebSocket daquele usuário.
 * Se o usuário estiver offline (nenhum socket), não faz nada (o sino atualiza no próximo GET REST).
 */
export function pushUnreadCountToUser(userId: string, count: number): void {
  const payload = buildUnreadCountPayload(count)
  forEachSocketOfUser(userId, (socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(payload)
    }
  })
}
