export const errorMap = {
  ERR_MISSING_FIELDS: {
    status: 400,
    message: "All fields are required",
  },
  ERR_EMAIL_EXISTS: {
    status: 400,
    message: "Email already exists",
  },
  ERR_SERVER_ERROR: {
    status: 500,
    message: "Internal Server Error",
  },
  ERR_INVALID_CREDENTIALS: {
    status: 401,
    message: "Invalid email or password",
  },
} as const;

export type ErrorCode = keyof typeof errorMap;
