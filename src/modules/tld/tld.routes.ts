import { Router } from "express";
import { addTLD, checkTLD, deleteTLD } from "./tld.controller";
import {
  addTLDSchema,
  checkTLDSchema,
  deleteTLDSchema,
} from "./tld.validation";
import { validate } from "../../middleware/validate";
import { authMiddleware, requireRole } from "../../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: TLD
 *  description: Suspicious TLD management
 */

/**
 * @swagger
 * /api/tld/check:
 *    get:
 *      summary: Check suspicious TLD
 *      tags: [TLD]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: domain
 *          required: true
 *          schema:
 *            type: string
 *            example: promo.xyz
 *      responses:
 *        200:
 *          description: Detction result
 *        401:
 *          description: Unauthorized
 *        400:
 *          description: Invalid data
 */
router.get(
  "/check",
  authMiddleware,
  requireRole(["user", "admin"]),
  validate(checkTLDSchema, "query"),
  checkTLD,
);

/**
 * @swagger
 * /api/tld/create:
 *    post:
 *      summary: Add new suspicious TLD
 *      tags: [TLD]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - tld
 *              properties:
 *                tld:
 *                  type: string
 *                  example: xyz
 *      responses:
 *        201:
 *          description: TLD added
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        400:
 *          description: Invalid data or TLD already exists
 */
router.post(
  "/create",
  authMiddleware,
  requireRole(["admin"]),
  validate(addTLDSchema, "body"),
  addTLD,
);

/**
 * @swagger
 * /api/tld/{id}:
 *    delete:
 *      summary: Delete suspicious TLD
 *      tags: [TLD]
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
 *          description: Forbidden
 *        400:
 *          description: Invalid data or TLD not found
 */
router.delete(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  validate(deleteTLDSchema, "params"),
  deleteTLD,
);

export default router;
