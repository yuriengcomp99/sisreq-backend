import { NotificationRepository } from "../../modules/notificacoes/repository/notification-repository.js"
import { GetNotificationsUseCase } from "../../modules/notificacoes/use-case/get-notifications-use-case.js"
import { GetNotificationsController } from "../../modules/notificacoes/controller/get-notifications-controller.js"

export function makeGetNotificationsController() {
  const repository = new NotificationRepository()
  const useCase = new GetNotificationsUseCase(repository)
  const controller = new GetNotificationsController(useCase)
  return controller
}
