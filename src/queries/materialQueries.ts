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
