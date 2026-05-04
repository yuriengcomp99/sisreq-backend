export const WS_NOTIFICATION_EVENT = {
  UNREAD_COUNT: "notifications_unread_count",
} as const

export type NotificationsUnreadCountPayload = {
  type: typeof WS_NOTIFICATION_EVENT.UNREAD_COUNT
  count: number
}

export function buildUnreadCountPayload(count: number): string {
  const body: NotificationsUnreadCountPayload = {
    type: WS_NOTIFICATION_EVENT.UNREAD_COUNT,
    count,
  }
  return JSON.stringify(body)
}
