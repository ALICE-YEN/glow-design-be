import { Router } from "express";
import { getMaterialList } from "../controllers/materialsController";

const router = Router();

router.get("/", getMaterialList);

export default router;
