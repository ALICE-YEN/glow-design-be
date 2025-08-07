import { NextFunction, Response, Request } from "express";
import type { AuthenticatedRequest } from "../types/interface";
import { AppError } from "../utils/appError";
import { pool } from "../config/db";
import { checkUserQuery } from "../queries/designsQueries";

// 回傳一個 middleware，可自訂從哪裡取 userId（等到真正執行 middleware 時，再根據當前的 req 抓出 userId。）
const checkUserExistsInDb = (
  getUserId: (req: AuthenticatedRequest) => number | undefined
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = getUserId(req); // 在此之前已經驗證過有值，這裡不做確認是否有值

    const userExists = await pool.query(checkUserQuery, [userId]);
    if (userExists.rowCount === 0) {
      return next(new AppError("ERR_USER_NOT_FOUND", 404, "User not found"));
    }

    next();
  };
};

export default checkUserExistsInDb;
