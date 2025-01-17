import { Router } from "express";
import {
  login,
  register,
  googleSsoHandler,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleSsoHandler);
// router.post("/logout", logout);

export default router;
