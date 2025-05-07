import { Router } from "express";
import { validate } from "../middlewares/validate";
import {
  designIdParamsSchema,
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

router.get("/:designId", validate(designIdParamsSchema, "params"), getDesign);
router.get("/user/:userId", getDesignsByUser);
router.post("/", validate(createDesignSchema), createDesign);
router.patch(
  "/:designId",
  validate(designIdParamsSchema, "params"),
  validate(updateDesignSchema),
  updateDesign
);
router.delete(
  "/:designId",
  validate(designIdParamsSchema, "params"),
  softDeleteDesign
);

export default router;
