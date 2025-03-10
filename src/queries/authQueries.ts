export const insertUserQuery = `
INSERT INTO users (username, email, password)
VALUES ($1, $2, $3)
RETURNING id, username, email
`;

// It retrieves only a constant value (1) and does not load unnecessary columns, minimizing the data transferred and improving query performance.
export const checkEmailQuery = `
SELECT 1 FROM users WHERE email = $1
`;

export const loginQuery = `
SELECT * FROM users WHERE email = $1
`;

export const findUserBySsoOrEmailQuery = `
  SELECT id, username, email, sso_id FROM users WHERE sso_id = $1 OR email = $2
`;

export const insertGoogleUserQuery = `
INSERT INTO users (username, email, sso_id)
VALUES ($1, $2, $3)
RETURNING id, username, email, sso_id
`;
