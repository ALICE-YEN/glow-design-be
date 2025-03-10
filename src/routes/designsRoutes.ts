import { Router } from "express";
import {
  getDesign,
  getDesignsByUser,
  createDesign,
} from "../controllers/designsController";

const router = Router();

router.get("/:designId", getDesign);
router.get("/user/:userId", getDesignsByUser);
router.post("/", createDesign);
// router.put("/:designId", updateDesign);
// router.delete("/:designId", softDeleteDesign);

export default router;
