import { Router } from "express"
import { makeGetCapacidadeController } from "../factories/capacidade/make-get-capacidade.js"
import { authMiddleware } from "../middlewares/auth-middleware.js"

const getCapacidadeController = makeGetCapacidadeController()

const capacidadeRouter = Router();

/**
 * @swagger
 * /capacidade:
 *   get:
 *     summary: Buscar capacidade de empenho
 *     description: Retorna itens com saldo disponível (qtdSaldo > 0). Permite filtro opcional por descrição.
 *     tags:
 *       - Capacidade
 *     parameters:
 *       - in: query
 *         name: description
 *         required: false
 *         schema:
 *           type: string
 *         description: Texto para busca na descrição do item (LIKE / contains)
 *     responses:
 *       200:
 *         description: Lista de itens com capacidade disponível
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pregao:
 *                     type: string
 *                     example: "12/2026"
 *                   ugg:
 *                     type: string
 *                     example: "160000"
 *                   descricao:
 *                     type: string
 *                     example: "Caneta azul"
 *                   fornecedor:
 *                     type: string
 *                     example: "Empresa XYZ"
 *                   qtdSaldo:
 *                     type: number
 *                     example: 150
 *       500:
 *         description: Erro interno do servidor
 */
capacidadeRouter.get("/",authMiddleware, (req, res) => {
  return getCapacidadeController.handle(req, res)
})

export { capacidadeRouter }