import { Router } from "express";
import validate from "../middlewares/validate";
import authenticateToken from "../middlewares/authenticateToken";
import {
  designIdParamsSchema,
  userIdParamsSchema,
  createDesignSchema,
  updateDesignSchema,
} from "../schemas/designs.schema";
import {
  getDesign,
  getDesignsByUser,
  createDesign,
  updateDesign,
  softDeleteDesign,
} from "../controllers/designsController";

const router = Router();

router.get(
  "/:designId",
  authenticateToken,
  validate(designIdParamsSchema, "params"),
  getDesign
);
router.get(
  "/user/:userId",
  authenticateToken,
  validate(userIdParamsSchema, "params"),
  getDesignsByUser
);
router.post("/", authenticateToken, validate(createDesignSchema), createDesign);
router.patch(
  "/:designId",
  authenticateToken,
  validate(designIdParamsSchema, "params"),
  validate(updateDesignSchema),
  updateDesign
);
router.delete(
  "/:designId",
  authenticateToken,
  validate(designIdParamsSchema, "params"),
  softDeleteDesign
);

export default router;
