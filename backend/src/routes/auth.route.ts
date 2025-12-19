import { Router } from "express";
import { authController } from "@/controllers";
import { validate } from "@/middlewares";
import { registerSchema, loginSchema } from "@/dto";

export const router = Router();

router.post("/register", validate({ body: registerSchema }), authController.register);
router.post("/login", validate({ body: loginSchema }), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
