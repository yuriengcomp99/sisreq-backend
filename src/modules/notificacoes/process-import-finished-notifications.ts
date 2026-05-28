import { NotificationRepository } from "./repository/notification-repository.js"
import { CreateNotificationUseCase } from "./use-case/create-notification-use-case.js"

export const IMPORT_FINISHED_NOTIFICATION_MESSAGE =
  "Os dados de capacidade de compras foram atualizados."

export async function processImportFinishedNotifications(): Promise<{
  usersNotified: number
}> {
  const useCase = new CreateNotificationUseCase(new NotificationRepository())
  const result = await useCase.execute({
    message: IMPORT_FINISHED_NOTIFICATION_MESSAGE,
  })
  const count = typeof result?.count === "number" ? result.count : 0
  console.log(
    "[Notificacoes] import.finished processado:",
    count,
    "notificação(ões) criada(s)"
  )
  return { usersNotified: count }
}
