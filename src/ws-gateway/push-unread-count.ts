import { WebSocket } from "ws"
import { forEachSocketOfUser } from "./user-sockets.js"
import { buildUnreadCountPayload } from "./ws-notification-events.js"

export function pushUnreadCountToUser(userId: string, count: number): void {
  const payload = buildUnreadCountPayload(count)
  forEachSocketOfUser(userId, (socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(payload)
    }
  })
}
