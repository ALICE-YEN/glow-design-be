export const getDesignQuery = `
SELECT id, name, description, preview_url, data, created_by, is_deleted, created_at, updated_at
FROM designs d
WHERE d.id = $1
`;

export const checkUserQuery = `
SELECT 1 FROM users WHERE id = $1
`;

export const getDesignsByUserQuery = `
SELECT id, name, description, preview_url, data, created_by, is_deleted, created_at, updated_at
FROM designs d
WHERE (d.created_by = $1 AND d.is_deleted = false)
`;

export const createDesignQuery = `
INSERT INTO designs (name, description, data, created_by)
VALUES ($1, $2, $3, $4)
RETURNING id, name, description, data, created_by, created_at, updated_at;
`;

export const softDeleteDesignQuery = `
UPDATE designs
SET is_deleted = true, updated_at = NOW()
WHERE id = $1
RETURNING id, name, description, data, created_by, is_deleted, created_at, updated_at;`;
