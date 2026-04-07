import { Router } from "express"
import { makeUpdateUserController } from "../factories/auth/make-update-user-controller.js"
import { authMiddleware } from "../middlewares/auth-middleware.js"
import { makeDeleteUserController } from "../factories/auth/make-delete-user-controller.js"
import { makeGetUserProfileController } from "../factories/auth/make-get-user-controller.js"

const router = Router()

const updateUserController = makeUpdateUserController()
const deleteUserController = makeDeleteUserController()
const getUserProfileController = makeGetUserProfileController()

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Yuri Rodrigues
 *               email:
 *                 type: string
 *                 example: yuri@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 */
router.patch("/me", authMiddleware, (req, res) => {
  return updateUserController.handle(req, res)
})

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete authenticated user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User deleted successfully
 */
router.delete("/me", authMiddleware, (req, res) => {
  return deleteUserController.handle(req, res)
})

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get("/me", authMiddleware, (req, res) => {
  return getUserProfileController.handle(req, res)
})

export default router