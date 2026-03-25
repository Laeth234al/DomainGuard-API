import { Router } from "express";
import { login, register, me } from "./user.controller";
import { loginSchema, registerSchema } from "./user.validation";
import { validate } from "../../middleware/validate";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", validate(registerSchema, "body"), register);
router.post("/login", validate(loginSchema, "body"), login);
router.get("/me", authMiddleware, me);

export default router;
