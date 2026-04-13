import { Router } from "express"

import { makeCreateNotaCreditoController } from "../factories/nota-credito/make-create-nota-credito-controller.js"
import { makeGetNotasCreditoController } from "../factories/nota-credito/make-get-notas-credito-controller.js"
import { makeGetNotaCreditoByIdController } from "../factories/nota-credito/make-get-nota-credito-by-id-controller.js"
import { makeUpdateNotaCreditoController } from "../factories/nota-credito/make-update-nota-credito-controller.js"
import { makeDeleteNotaCreditoController } from "../factories/nota-credito/make-delete-nota-credito-controller.js"

const router = Router()

const createController = makeCreateNotaCreditoController()
const getController = makeGetNotasCreditoController()
const getByIdController = makeGetNotaCreditoByIdController()
const updateController = makeUpdateNotaCreditoController()
const deleteController = makeDeleteNotaCreditoController()

/**
 * @swagger
 * tags:
 *   name: NotaCredito
 *   description: Gestão de notas de crédito
 */

/**
 * @swagger
 * /nota-credito:
 *   post:
 *     summary: Criar nota de crédito
 */
router.post("/", (req, res) => createController.handle(req, res))

/**
 * @swagger
 * /nota-credito:
 *   get:
 *     summary: Listar notas de crédito
 */
router.get("/", (req, res) => getController.handle(req, res))

/**
 * @swagger
 * /nota-credito/{id}:
 *   get:
 *     summary: Buscar nota por ID
 */
router.get("/:id", (req, res) => getByIdController.handle(req, res))

/**
 * @swagger
 * /nota-credito/{id}:
 *   patch:
 *     summary: Atualizar nota
 */
router.patch("/:id", (req, res) => updateController.handle(req, res))

/**
 * @swagger
 * /nota-credito/{id}:
 *   delete:
 *     summary: Deletar nota
 */
router.delete("/:id", (req, res) => deleteController.handle(req, res))

export { router as NotaCreditoRouter }