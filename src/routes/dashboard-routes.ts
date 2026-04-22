import { Router } from "express"
import { authMiddleware } from "../middlewares/auth-middleware.js"
import { makeGetDashboardResumoController } from "../factories/dashboard/make-get-dashboard-resumo-controller.js"

const dashboardRouter = Router()
const getDashboardResumoController = makeGetDashboardResumoController()

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Resumo para dashboard
 *     description: |
 *       Retorna totais de requisições, itens de ata com saldo disponível (qtdSaldo > 0),
 *       quantidade de licitações (combinações distintas pregão + UGG) e soma do crédito
 *       ainda disponível nas notas de crédito (valor da nota menos valor consumido nas requisições).
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas agregadas
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
 *                     totalRequisicoes:
 *                       type: integer
 *                     totalItensComSaldoDisponivel:
 *                       type: integer
 *                     totalLicitacoes:
 *                       type: integer
 *                     creditoDisponivelReais:
 *                       type: number
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno
 */
dashboardRouter.get("/", authMiddleware, (req, res) =>
  getDashboardResumoController.handle(req, res)
)

export { dashboardRouter }
