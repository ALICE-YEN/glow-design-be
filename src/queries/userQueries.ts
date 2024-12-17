export const getAllUsersQuery = `
  SELECT id, name, email
  FROM users
`;

export const createUserQuery = `
  INSERT INTO users (name, email)
  VALUES ($1, $2)
  RETURNING id, name, email
`;
