export const getMaterialListQuery = `
SELECT m.id, m.name, m.img_url, mt.name AS type_name, mt.description AS type_description, COALESCE(array_agg(jsonb_build_object('id', c.id, 'name', c.name)) FILTER (WHERE c.id IS NOT NULL), '{}') AS categories
FROM materials m
LEFT JOIN material_types mt ON m.type_id = mt.id
LEFT JOIN material_categories mc ON m.id = mc.material_id
LEFT JOIN categories c ON mc.category_id = c.id
GROUP BY m.id, m.name, m.img_url, mt.name, mt.description
ORDER BY m.type_id, m.id
`;

export const getMaterialTypesQuery = `
SELECT mt.id, mt.name, mt.description
FROM material_types mt
`;

export const getMaterialsByTypeQuery = `
SELECT m.id, m.name, m.img_url
FROM materials m
WHERE m.type_id = $1
`;

export const getCategoriesByTypeQuery = `
SELECT c.id, c.type_id, c.parent_id, c.name
FROM categories c
WHERE c.type_id = $1
`;

export const getCategoryMaterialsQuery = `
SELECT c.id AS category_id, c.name AS category_name, c.parent_id AS category_parent_id, c.type_id, m.id AS material_id, m.name AS material_name, m.img_url AS material_img_url
FROM categories c
LEFT JOIN material_categories mc ON c.id = mc.category_id
LEFT JOIN materials m ON mc.material_id = m.id
WHERE c.id = $1
`;

export const getCategoryWithSubcategoriesMaterialsQuery = `
WITH RECURSIVE category_tree AS (
  SELECT id, type_id, parent_id, name
  FROM categories
  WHERE id = $1 -- API 傳入的 categoryId
  UNION ALL
  SELECT c.id, c.type_id, c.parent_id, c.name
  FROM categories c
  INNER JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT 
  ct.id AS category_id,
  ct.name AS category_name,
  ct.parent_id AS category_parent_id,
  ct.type_id,
  m.id AS material_id,
  m.name AS material_name,
  m.img_url AS material_img_url
FROM category_tree ct
LEFT JOIN material_categories mc ON ct.id = mc.category_id
LEFT JOIN materials m ON mc.material_id = m.id
ORDER BY ct.id;
`;
