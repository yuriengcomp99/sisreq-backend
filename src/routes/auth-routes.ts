import { Router } from "express"
import { authMiddleware } from "../middlewares/auth-middleware.js"

import { makeLoginController } from "../factories/auth/make-login.js"
import { makeRegisterController } from "../factories/auth/make-register.js"

import { makeUpdateUserController } from "../factories/auth/make-update-user-controller.js"
import { makeDeleteUserController } from "../factories/auth/make-delete-user-controller.js"
import { makeGetUserProfileController } from "../factories/auth/make-get-user-controller.js"
import { makeRefreshTokenController } from "../factories/auth/make-refresh-token.js"
import { makeLogoutController } from "../factories/auth/make-logout.js"

const router = Router()

const loginController = makeLoginController()
const refreshTokenController = makeRefreshTokenController()
const logoutController = makeLogoutController()
const registerController = makeRegisterController()

const updateUserController = makeUpdateUserController()
const deleteUserController = makeDeleteUserController()
const getUserProfileController = makeGetUserProfileController()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação e gerenciamento de usuário
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@email.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
router.post("/login", (req, res) => {
  return loginController.handle(req, res)
})

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renovar access token (envia refresh no cookie HttpOnly)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Novo access token
 *       401:
 *         description: Refresh inválido ou ausente
 */
router.post("/refresh", (req, res) => {
  return refreshTokenController.handle(req, res)
})

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Encerra sessão (remove cookie HttpOnly do refresh)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout realizado; cookie de refresh limpo
 */
router.post("/logout", (req, res) => {
  return logoutController.handle(req, res)
})

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - army_name
 *               - graduation
 *               - designationId
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Carlos
 *               army_name:
 *                 type: string
 *                 example: Silva
 *               graduation:
 *                 type: string
 *                 example: Sargento
 *               designationId:
 *                 type: string
 *                 example: "3240d1a0-6636-46c4-a541-7f25eb24bd69"
 *               email:
 *                 type: string
 *                 example: carlos@email.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 example: ADMIN
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post("/register", (req, res) => {
  return registerController.handle(req, res)
})

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Pegar dados do usuário logado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             example:
 *               id: "uuid"
 *               first_name: "Carlos"
 *               army_name: "Silva"
 *               graduation: "Sargento"
 *               email: "carlos@email.com"
 *               role: "ADMIN"
 *               om: "BCMS"
 *               designation:
 *                 id: "uuid"
 *                 position: "Aprovisionador"
 */
router.get("/me", authMiddleware, (req, res) => {
  return getUserProfileController.handle(req, res)
})

/**
 * @swagger
 * /auth/me:
 *   patch:
 *     summary: Atualizar usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               army_name:
 *                 type: string
 *               graduation:
 *                 type: string
 *               designationId:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             first_name: "Carlos Atualizado"
 *             password: "novaSenha123"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 */
router.patch("/me", authMiddleware, (req, res) => {
  return updateUserController.handle(req, res)
})

/**
 * @swagger
 * /auth/me:
 *   delete:
 *     summary: Deletar usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 */
router.delete("/me", authMiddleware, (req, res) => {
  return deleteUserController.handle(req, res)
})

export default router