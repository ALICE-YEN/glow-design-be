import { Router } from "express";
import validate from "../middlewares/validate";
import {
  loginSchema,
  registerSchema,
  googleSsoSchema,
  refreshTokenSchema,
} from "../schemas/auth.schema";
import {
  login,
  register,
  googleSsoHandler,
  refreshToken,
} from "../controllers/authController";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google-login", validate(googleSsoSchema), googleSsoHandler);
router.post("/refresh-token", validate(refreshTokenSchema), refreshToken);

export default router;
