import type { WebSocket } from "ws"

const socketsByUserId = new Map<string, Set<WebSocket>>()

export function trackUserSocket(userId: string, socket: WebSocket): void {
  let set = socketsByUserId.get(userId)
  if (!set) {
    set = new Set()
    socketsByUserId.set(userId, set)
  }
  set.add(socket)

  let detached = false
  const detach = () => {
    if (detached) {
      return
    }
    detached = true
    set?.delete(socket)
    if (set && set.size === 0) {
      socketsByUserId.delete(userId)
    }
  }

  socket.once("close", detach)
  socket.once("error", detach)
}

export function forEachSocketOfUser(
  userId: string,
  fn: (socket: WebSocket) => void
): void {
  const set = socketsByUserId.get(userId)
  if (!set) {
    return
  }
  for (const s of set) {
    fn(s)
  }
}
