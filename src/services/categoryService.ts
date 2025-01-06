import type {
  Category,
  ParentCategory,
  CategoryMaterialSQL,
  CategoryWithMaterials,
} from "../types/interface";

export const organizeCategories = (
  categories: Category[]
): ParentCategory[] => {
  const categoryMap = new Map<number, ParentCategory>();

  categories.forEach((cat: Category) => {
    categoryMap.set(cat.id, { ...cat, categories: [] });
  });

  categories.forEach((cat) => {
    if (cat.parent_id && categoryMap.has(cat.parent_id)) {
      categoryMap.get(cat.parent_id)?.categories.push(categoryMap.get(cat.id)!);
    }
  });

  return [...categoryMap.values()].filter((cat) => !cat.parent_id);
};

export const organizeMaterialsAndCategories = (
  rows: CategoryMaterialSQL[]
): Category => {
  const categoryMap = new Map<number, CategoryWithMaterials>();

  rows.forEach((row) => {
    if (!categoryMap.has(row.category_id)) {
      categoryMap.set(row.category_id, {
        id: row.category_id,
        name: row.category_name,
        parent_id: row.category_parent_id,
        type_id: row.type_id,
        materials: [],
        subcategories: [],
      });
    }

    if (row.material_id) {
      categoryMap.get(row.category_id)?.materials?.push({
        id: row.material_id,
        name: row.material_name,
        img_url: row.material_img_url,
      });
    }
  });

  // 將子分類嵌套到父分類，父分類的 materials 不影響子分類
  const result: CategoryWithMaterials[] = [];
  categoryMap.forEach((category) => {
    if (category.parent_id) {
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        parent.subcategories?.push(category);
      }
    } else {
      result.push(category);
    }
  });

  return result[0];
};
