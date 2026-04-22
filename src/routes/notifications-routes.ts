import { Router } from "express"
import { authMiddleware } from "../middlewares/auth-middleware.js"
import { makeGetNotificationsController } from "../factories/notificacoes/make-get-notifications-controller.js"

const notificationsRouter = Router()
const getNotificationsController = makeGetNotificationsController()

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Listar notificações do usuário
 *     description: Retorna todas as notificações do usuário autenticado, da mais recente para a mais antiga.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *                 dados:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       message:
 *                         type: string
 *                       read:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno
 */
notificationsRouter.get("/", authMiddleware, (req, res) =>
  getNotificationsController.handle(req, res)
)

export { notificationsRouter }
