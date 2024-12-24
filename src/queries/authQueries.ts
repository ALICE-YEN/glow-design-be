export const registerQuery = `
INSERT INTO users (username, email, password)
VALUES ($1, $2, $3)
RETURNING id, username, email
`;

export const checkEmailQuery = `
  SELECT 1 FROM users WHERE email = $1
`;

export const loginQuery = `
  SELECT * FROM users WHERE email = $1
`;
