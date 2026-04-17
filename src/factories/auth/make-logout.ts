import { LogoutController } from "../../controllers/auth/logout-controller.js"

export function makeLogoutController() {
  return new LogoutController()
}
