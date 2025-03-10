import { Request, Response, RequestHandler, NextFunction } from "express";
import { pool } from "../config/db";
import { AppError } from "../utils/AppError";
import {
  getDesignQuery,
  checkUserQuery,
  getDesignsByUserQuery,
  createDesignQuery,
} from "../queries/designsQueries";

export const getDesign: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 驗證 designId 是否為數字
  const designId = parseInt(req.params.designId, 10);
  if (isNaN(designId)) {
    return next(new AppError("ERR_INVALID_DESIGNID", 500));
  }

  try {
    const result = await pool.query(getDesignQuery, [designId]);

    if (result.rowCount === 0) {
      return next(new AppError("ERR_RESOURCE_NOT_FOUND", 404));
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getDesignsByUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let sortBy = String(req.query.sort_by || "created_at");
  let sortOrder = String(req.query.sort_order || "desc").toLowerCase();

  // 定義合法的排序欄位與排序方向
  const VALID_SORT_BY = ["created_at", "updated_at", "name"];
  const VALID_SORT_ORDER = ["asc", "desc"];

  // 檢查輸入值是否合法

  if (!VALID_SORT_BY.includes(sortBy)) {
    sortBy = "created_at";
  }
  if (!VALID_SORT_ORDER.includes(sortOrder)) {
    sortOrder = "desc";
  }

  // 動態組合 ORDER BY 子句：PostgreSQL 的參數化查詢（prepared statements）設計時只允許參數替換那些被視為文字值的部分，而不是 SQL 語法中的結構性元素，例如表名、欄位名稱或關鍵字。
  // 驗證傳入的排序欄位與排序方向，確保不會 SQL Injection
  const orderByClause = `ORDER BY ${sortBy} ${sortOrder}`;

  //  驗證 userId 是否為數字
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return next(new AppError("ERR_INVALID_USERID", 500));
  }

  try {
    // 驗證 userId 是否存在
    const userExists = await pool.query(checkUserQuery, [userId]);
    if (userExists.rowCount === 0) {
      return next(new AppError("ERR_USER_NOT_FOUND", 500));
    }

    const fullQuery = getDesignsByUserQuery + " " + orderByClause;
    const result = await pool.query(fullQuery, [userId]);

    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createDesign: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 安全性考量：userId 不應來自 req.body，應該來自 JWT 或 session 驗證的 req.user.id，以防止惡意用戶偽造 userId。
  // const createdBy = req.user?.id; // 這應該從 JWT 或 session 驗證來
  const createdBy = 1;
  // if (!createdBy) {
  //   return next(new AppError("ERR_UNAUTHORIZED", 401));
  // }

  const { name, description, data } = req.body;

  if (!name || !description || !data) {
    return next(new AppError("ERR_MISSING_FIELDS", 400));
  }

  try {
    // 驗證 userId 是否存在
    const userExists = await pool.query(checkUserQuery, [createdBy]);
    if (userExists.rowCount === 0) {
      return next(new AppError("ERR_USER_NOT_FOUND", 500));
    }

    const result = await pool.query(createDesignQuery, [
      name,
      description,
      data,
      createdBy,
    ]);

    res.status(201).json(result.rows);
  } catch (error) {
    next(error);
  }
};
