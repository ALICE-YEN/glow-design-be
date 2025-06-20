import { Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";
import { JWT_SECRET_KEY } from "../utils/constants";
import type { AuthenticatedRequest, JwtPayload } from "../types/interface";

const authenticateToken: RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new AppError(
        "ERR_UNAUTHORIZED",
        401,
        "Access token not provided or invalid format"
      )
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
    console.log("Decoded JWT:", decoded);
    // 將解碼後的用戶資訊存入 req.user
    req.user = decoded;
    next();
  } catch (error) {
    return next(
      new AppError("ERR_INVALID_TOKEN", 401, "Token is invalid or has expired")
    );
  }
};

export default authenticateToken;
