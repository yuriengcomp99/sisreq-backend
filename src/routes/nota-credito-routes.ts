import { Router } from "express"

import { makeCreateNotaCreditoController } from "../factories/credito/make-create-nota-credito-controller.js"
import { makeGetNotasCreditoController } from "../factories/credito/make-get-notas-credito-controller.js"
import { makeGetNotaCreditoByIdController } from "../factories/credito/make-get-nota-credito-by-id-controller.js"
import { makeGetNotaCreditoRequisicoesController } from "../factories/credito/make-get-nota-credito-requisicoes-controller.js"
import { makeUpdateNotaCreditoController } from "../factories/credito/make-update-nota-credito-controller.js"
import { makeDeleteNotaCreditoController } from "../factories/credito/make-delete-nota-credito-controller.js"
import { authMiddleware } from "../middlewares/auth-middleware.js"

const router = Router()

const createController = makeCreateNotaCreditoController()
const getController = makeGetNotasCreditoController()
const getByIdController = makeGetNotaCreditoByIdController()
const getNotaCreditoRequisicoesController =
  makeGetNotaCreditoRequisicoesController()
const updateController = makeUpdateNotaCreditoController()
const deleteController = makeDeleteNotaCreditoController()

/**
 * @swagger
 * /nota-credito:
 *   post:
 *     tags: [NotaCredito]
 *     summary: Criar nota de crédito
 *     description: Cadastra uma nova nota de crédito para associação em requisições.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             numero: "2026NC000123"
 *             emitente: "160001 - Base Central"
 *             favorecido: "BCMS"
 *             observacao: "Crédito para aquisição de material de expediente"
 *             prazo: "2026-12-31T00:00:00.000Z"
 *             valor: 15000
 *     responses:
 *       201:
 *         description: Nota de crédito criada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               sucesso: true
 *               mensagem: "Nota de crédito criada com sucesso"
 *               dados:
 *                 id: "f9f4f6f1-8f53-4d7d-9b77-3b89ac7f8d12"
 *                 numero: "2026NC000123"
 *                 emitente: "160001 - Base Central"
 *                 favorecido: "BCMS"
 *                 observacao: "Crédito para aquisição de material de expediente"
 *                 prazo: "2026-12-31T00:00:00.000Z"
 *                 valor: 15000
 *                 createdAt: "2026-04-15T10:00:00.000Z"
 *                 updatedAt: "2026-04-15T10:00:00.000Z"
 *       400:
 *         description: Dados inválidos para criação da nota de crédito
 */
router.post("/",authMiddleware, (req, res) => createController.handle(req, res))

/**
 * @swagger
 * /nota-credito:
 *   get:
 *     tags: [NotaCredito]
 *     summary: Listar notas de crédito
 *     description: Retorna todas as notas de crédito cadastradas, com resumo de requisições vinculadas (quantidade, valor total consumido nas linhas das requisições e saldo valor da nota menos esse total).
 *     responses:
 *       200:
 *         description: Lista de notas de crédito
 *         content:
 *           application/json:
 *             example:
 *               sucesso: true
 *               mensagem: "Operação realizada com sucesso"
 *               dados:
 *                 - id: "f9f4f6f1-8f53-4d7d-9b77-3b89ac7f8d12"
 *                   numero: "2026NC000123"
 *                   emitente: "160001 - Base Central"
 *                   favorecido: "BCMS"
 *                   observacao: "Crédito para aquisição de material de expediente"
 *                   prazo: "2026-12-31T00:00:00.000Z"
 *                   valor: 15000
 *                   requisicaoCount: 2
 *                   valorTotalRequisicoes: 5000
 *                   valorRestante: 10000
 *                   createdAt: "2026-04-15T10:00:00.000Z"
 *                   updatedAt: "2026-04-15T10:00:00.000Z"
 *                 - id: "7de7c541-8c6d-4ce4-a1af-cf3a7d7a6a8d"
 *                   numero: "2026NC000124"
 *                   emitente: "160001 - Base Central"
 *                   favorecido: "BCMS"
 *                   observacao: null
 *                   prazo: "2026-11-30T00:00:00.000Z"
 *                   valor: 8000
 *                   requisicaoCount: 0
 *                   valorTotalRequisicoes: 0
 *                   valorRestante: 8000
 *                   createdAt: "2026-04-16T09:30:00.000Z"
 *                   updatedAt: "2026-04-16T09:30:00.000Z"
 *       500:
 *         description: Erro ao buscar notas de crédito
 */
router.get("/",authMiddleware, (req, res) => getController.handle(req, res))

/**
 * @swagger
 * /nota-credito/{id}/requisicoes:
 *   get:
 *     tags: [NotaCredito]
 *     summary: Nota de crédito com requisições vinculadas (sem itens)
 *     description: Mesmos dados da nota que GET /nota-credito/{id} (incluindo resumo de valores), mais lista de requisições sem detalhes/itens.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Objeto com `nota` e array `requisicoes`
 *       404:
 *         description: Nota não encontrada ou sem permissão
 */
router.get(
  "/:id/requisicoes",
  authMiddleware,
  (req, res) => getNotaCreditoRequisicoesController.handle(req, res)
)

/**
 * @swagger
 * /nota-credito/{id}:
 *   get:
 *     tags: [NotaCredito]
 *     summary: Buscar nota por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "f9f4f6f1-8f53-4d7d-9b77-3b89ac7f8d12"
 *     responses:
 *       200:
 *         description: Nota de crédito encontrada
 *         content:
 *           application/json:
 *             example:
 *               sucesso: true
 *               mensagem: "Operação realizada com sucesso"
 *               dados:
 *                 id: "f9f4f6f1-8f53-4d7d-9b77-3b89ac7f8d12"
 *                 numero: "2026NC000123"
 *                 emitente: "160001 - Base Central"
 *                 favorecido: "BCMS"
 *                 observacao: "Crédito para aquisição de material de expediente"
 *                 prazo: "2026-12-31T00:00:00.000Z"
 *                 valor: 15000
 *                 requisicaoCount: 2
 *                 valorTotalRequisicoes: 5000
 *                 valorRestante: 10000
 *                 createdAt: "2026-04-15T10:00:00.000Z"
 *                 updatedAt: "2026-04-15T10:00:00.000Z"
 *       404:
 *         description: Nota de crédito não encontrada
 */
router.get("/:id",authMiddleware, (req, res) => getByIdController.handle(req, res))

/**
 * @swagger
 * /nota-credito/{id}:
 *   patch:
 *     tags: [NotaCredito]
 *     summary: Atualizar nota
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "f9f4f6f1-8f53-4d7d-9b77-3b89ac7f8d12"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             observacao: "Crédito atualizado para aquisição de TI"
 *             valor: 18000
 *             prazo: "2027-01-31T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Nota de crédito atualizada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               sucesso: true
 *               mensagem: "Nota de crédito atualizada com sucesso"
 *               dados:
 *                 id: "f9f4f6f1-8f53-4d7d-9b77-3b89ac7f8d12"
 *                 numero: "2026NC000123"
 *                 emitente: "160001 - Base Central"
 *                 favorecido: "BCMS"
 *                 observacao: "Crédito atualizado para aquisição de TI"
 *                 prazo: "2027-01-31T00:00:00.000Z"
 *                 valor: 18000
 *                 createdAt: "2026-04-15T10:00:00.000Z"
 *                 updatedAt: "2026-04-20T11:00:00.000Z"
 *       400:
 *         description: Dados inválidos para atualização da nota de crédito
 */
router.patch("/:id",authMiddleware, (req, res) => updateController.handle(req, res))

/**
 * @swagger
 * /nota-credito/{id}:
 *   delete:
 *     tags: [NotaCredito]
 *     summary: Deletar nota
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "f9f4f6f1-8f53-4d7d-9b77-3b89ac7f8d12"
 *     responses:
 *       200:
 *         description: Nota de crédito removida com sucesso
 *         content:
 *           application/json:
 *             example:
 *               sucesso: true
 *               mensagem: "Nota de crédito removida com sucesso"
 *               dados: null
 *       400:
 *         description: Falha ao remover nota de crédito
 */
router.delete("/:id",authMiddleware, (req, res) => deleteController.handle(req, res))

export { router as NotaCreditoRouter }