export const errorMap = {
  ERR_MISSING_FIELDS: {
    status: 400,
    message: "All fields are required",
  },
  ERR_NO_UPDATE_FIELDS: {
    status: 400,
    message: "No field to update",
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
  ERR_INVALID_DESIGNID: {
    status: 500,
    message: "Invalid designId",
  },
  ERR_INVALID_USERID: {
    status: 500,
    message: "Invalid userId",
  },
  ERR_RESOURCE_NOT_FOUND: {
    status: 404,
    message: "The requested resource was not found",
  },
  ERR_USER_NOT_FOUND: {
    status: 404,
    message: "The user was not found",
  },
  ERR_UNAUTHORIZED: {
    status: 401,
    message: "User not authenticated",
  },
} as const;

export type ErrorCode = keyof typeof errorMap;
