import { Router } from "express"

import { makeCreateNotaCreditoController } from "../factories/credito/make-create-nota-credito-controller.js"
import { makeGetNotasCreditoController } from "../factories/credito/make-get-notas-credito-controller.js"
import { makeGetNotaCreditoByIdController } from "../factories/credito/make-get-nota-credito-by-id-controller.js"
import { makeUpdateNotaCreditoController } from "../factories/credito/make-update-nota-credito-controller.js"
import { makeDeleteNotaCreditoController } from "../factories/credito/make-delete-nota-credito-controller.js"
import { authMiddleware } from "../middlewares/auth-middleware.js"

const router = Router()

const createController = makeCreateNotaCreditoController()
const getController = makeGetNotasCreditoController()
const getByIdController = makeGetNotaCreditoByIdController()
const updateController = makeUpdateNotaCreditoController()
const deleteController = makeDeleteNotaCreditoController()

/**
 * @swagger
 * /nota-credito:
 *   post:
 *     tags: [NotaCredito]
 *     summary: Criar nota de crédito
 */
router.post("/",authMiddleware, (req, res) => createController.handle(req, res))

/**
 * @swagger
 * /nota-credito:
 *   get:
 *     tags: [NotaCredito]
 *     summary: Listar notas de crédito
 */
router.get("/",authMiddleware, (req, res) => getController.handle(req, res))

/**
 * @swagger
 * /nota-credito/{id}:
 *   get:
 *     tags: [NotaCredito]
 *     summary: Buscar nota por ID
 */
router.get("/:id",authMiddleware, (req, res) => getByIdController.handle(req, res))

/**
 * @swagger
 * /nota-credito/{id}:
 *   patch:
 *     tags: [NotaCredito]
 *     summary: Atualizar nota
 */
router.patch("/:id",authMiddleware, (req, res) => updateController.handle(req, res))

/**
 * @swagger
 * /nota-credito/{id}:
 *   delete:
 *     tags: [NotaCredito]
 *     summary: Deletar nota
 */
router.delete("/:id",authMiddleware, (req, res) => deleteController.handle(req, res))

export { router as NotaCreditoRouter }