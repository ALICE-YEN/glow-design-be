export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  type_id: number;
}

export interface Material {
  id: number;
  name: string;
  img_url: string;
}

export interface ParentCategory extends Category {
  categories: ParentCategory[];
}

export interface CategoryMaterialSQL {
  category_id: number;
  category_name: string;
  category_parent_id: number | null;
  type_id: number;
  material_id: number;
  material_name: string;
  material_img_url: string;
}

export interface CategoryWithMaterials extends Category {
  materials: Material[];
  subcategories: Category[];
}
