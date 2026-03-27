import { Router } from "express";
import { addSpam, checkSpam, deleteSpam } from "./spam.controller";
import {
  addSpamSchema,
  checkSpamSchema,
  deleteSpamSchema,
} from "./spam.validation";
import { validate } from "../../middleware/validate";
import { authMiddleware, requireRole } from "../../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: Spam
 *  description: Spam doamin management
 */

/**
 * @swagger
 * /api/spam/check:
 *    get:
 *      summary: Check if domain is Spam
 *      tags: [Spam]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: domain
 *          required: true
 *          schema:
 *            type: string
 *            example: spam.xyz
 *      responses:
 *        200:
 *          description: Detction result
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        400:
 *          description: Invalid data
 */
router.get(
  "/check",
  authMiddleware,
  requireRole(["user", "admin"]),
  validate(checkSpamSchema, "query"),
  checkSpam,
);

/**
 * @swagger
 * /api/spam/create:
 *    post:
 *      summary: Add new spam domain
 *      tags: [Spam]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - domain
 *              properties:
 *                domain:
 *                  type: string
 *                  example: bad-doamin.xyz
 *      responses:
 *        201:
 *          description: Spam Added
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Forbidden -- Admin only --
 *        400:
 *          description: Invalid data or Domain exists
 */
router.post(
  "/create",
  authMiddleware,
  requireRole(["admin"]),
  validate(addSpamSchema, "body"),
  addSpam,
);

/**
 * @swagger
 * /api/spam/{id}:
 *    delete:
 *      summary: Delete spam domain
 *      tags: [Spam]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *            example: 67d1a2c3f4a5b6c7d8e9f0a1
 *      responses:
 *        204:
 *          description: Deleted successfully
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Forbidden -- Admin only --
 *        400:
 *          description: Invalid data or Domain not found
 */
router.delete(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  validate(deleteSpamSchema, "params"),
  deleteSpam,
);

export default router;
