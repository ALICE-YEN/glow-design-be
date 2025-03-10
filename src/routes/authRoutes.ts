import { Router } from "express";
import {
  login,
  register,
  googleSsoHandler,
  refreshToken,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleSsoHandler);
router.post("/refresh", refreshToken);

export default router;
