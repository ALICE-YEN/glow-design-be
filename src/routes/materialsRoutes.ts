// categories 的 type_id 與 material_categories 中 material_id 對應的 type_id 可能不同。
// 如何解決這個問題？
// Ans：數據庫層面強制約束，使用觸發器檢查一致性 在 material_categories 表的插入或更新時，檢查 materials.type_id 是否與 categories.type_id 匹配。

import { Router } from "express";
import {
  getMaterialList,
  getMaterialTypes,
  getMaterialsByType,
  getCategoriesByType,
  getMaterialsByCategory,
} from "../controllers/materialsController";

const router = Router();

router.get("/", getMaterialList); // 待確定不需要再刪除
router.get("/material-types", getMaterialTypes);
router.get("/material-types/:materialTypeId", getMaterialsByType);
router.get("/material-types/:materialTypeId/categories", getCategoriesByType);
router.get("/categories/:categoryId", getMaterialsByCategory);

export default router;
