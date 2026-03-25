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

router.get(
  "/check",
  authMiddleware,
  requireRole(["user", "admin"]),
  validate(checkSpamSchema, "body"),
  checkSpam
);

router.post(
  "/create",
  authMiddleware,
  requireRole(["admin"]),
  validate(addSpamSchema, "body"),
  addSpam
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  validate(deleteSpamSchema, "params"),
  deleteSpam
);

export default router;
