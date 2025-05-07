import { Router } from "express";
import {
  getDesign,
  getDesignsByUser,
  createDesign,
  updateDesign,
  softDeleteDesign,
} from "../controllers/designsController";
import {
  validateDesignId,
  validateDesignExists,
} from "../middlewares/designsValidation";

const router = Router();

router.get("/:designId", validateDesignId, validateDesignExists, getDesign);
router.get("/user/:userId", getDesignsByUser);
router.post("/", createDesign);
router.patch(
  "/:designId",
  validateDesignId,
  validateDesignExists,
  updateDesign
);
router.delete(
  "/:designId",
  validateDesignId,
  validateDesignExists,
  softDeleteDesign
);

export default router;
