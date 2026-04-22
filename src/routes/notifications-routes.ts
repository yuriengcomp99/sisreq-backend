import { Router } from "express"
import { authMiddleware } from "../middlewares/auth-middleware.js"
import { makeGetNotificationsController } from "../factories/notificacoes/make-get-notifications-controller.js"
import { makeMarkAllNotificationsReadController } from "../factories/notificacoes/make-mark-all-notifications-read-controller.js"
import { makeGetUnreadNotificationsCountController } from "../factories/notificacoes/make-get-unread-notifications-count-controller.js"

const notificationsRouter = Router()
const getNotificationsController = makeGetNotificationsController()
const markAllNotificationsReadController =
  makeMarkAllNotificationsReadController()
const getUnreadNotificationsCountController =
  makeGetUnreadNotificationsCountController()

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Quantidade de notificações não lidas
 *     description: Retorna o número de notificações do usuário autenticado com read = false.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contagem retornada com sucesso
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
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       minimum: 0
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno
 */
notificationsRouter.get("/unread-count", authMiddleware, (req, res) =>
  getUnreadNotificationsCountController.handle(req, res)
)

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

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Marcar todas as notificações como lidas
 *     description: Atualiza todas as notificações não lidas do usuário autenticado para lidas.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Operação concluída (count pode ser 0 se já estavam todas lidas)
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
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: Número de notificações atualizadas
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno
 */
notificationsRouter.patch("/read-all", authMiddleware, (req, res) =>
  markAllNotificationsReadController.handle(req, res)
)

export { notificationsRouter }
