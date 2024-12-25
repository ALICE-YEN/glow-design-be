export const registerQuery = `
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
