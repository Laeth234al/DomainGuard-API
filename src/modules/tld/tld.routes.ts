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

router.get(
  "/check",
  authMiddleware,
  requireRole(["user", "admin"]),
  validate(checkTLDSchema, "body"),
  checkTLD
);

router.post(
  "/create",
  authMiddleware,
  requireRole(["admin"]),
  validate(addTLDSchema, "body"),
  addTLD
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  validate(deleteTLDSchema, "params"),
  deleteTLD
);

export default router;
