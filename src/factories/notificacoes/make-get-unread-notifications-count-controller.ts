import { NotificationRepository } from "../../modules/notificacoes/repository/notification-repository.js"
import { GetUnreadNotificationsCountUseCase } from "../../modules/notificacoes/use-case/get-unread-notifications-count-use-case.js"
import { GetUnreadNotificationsCountController } from "../../modules/notificacoes/controller/get-unread-notifications-count-controller.js"

export function makeGetUnreadNotificationsCountController() {
  const repository = new NotificationRepository()
  const useCase = new GetUnreadNotificationsCountUseCase(repository)
  const controller = new GetUnreadNotificationsCountController(useCase)
  return controller
}
