import { NotificationRepository } from "../../modules/notificacoes/repositor/notification-repository.js"
import { MarkAllNotificationsReadUseCase } from "../../modules/notificacoes/use-case/mark-all-notifications-read-use-case.js"
import { MarkAllNotificationsReadController } from "../../modules/notificacoes/controller/mark-all-notifications-read-controller.js"

export function makeMarkAllNotificationsReadController() {
  const repository = new NotificationRepository()
  const useCase = new MarkAllNotificationsReadUseCase(repository)
  const controller = new MarkAllNotificationsReadController(useCase)
  return controller
}
