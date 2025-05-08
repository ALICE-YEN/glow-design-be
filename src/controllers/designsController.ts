import { Request, Response, RequestHandler, NextFunction } from "express";
import { pool } from "../config/db";
import { AppError } from "../utils/appError";
import { parseSortParams } from "../services/designs/parseSortParams";
import { generateUpdateDesignQuery } from "../services/designs/generateUpdateQuery";
import {
  getDesignQuery,
  checkUserQuery,
  getDesignsByUserQuery,
  createDesignQuery,
  softDeleteDesignQuery,
} from "../queries/designsQueries";

export const getDesign: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const designId = req.params.designId as unknown as number;

  try {
    const result = await pool.query(getDesignQuery, [designId]);
    if (result.rowCount === 0) {
      return next(
        new AppError("ERR_RESOURCE_NOT_FOUND", 404, "Design not found")
      );
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
  // 驗證傳入的排序欄位與排序方向，確保不會 SQL Injection
  const { sortBy, sortOrder } = parseSortParams(
    req.query.sort_by,
    req.query.sort_order
  );

  // 動態組合 ORDER BY 子句：PostgreSQL 的參數化查詢（prepared statements）設計時只允許參數替換那些被視為文字值的部分，而不是 SQL 語法中的結構性元素，例如表名、欄位名稱或關鍵字。
  const orderByClause = `ORDER BY ${sortBy} ${sortOrder}`;

  const userId = req.params.userId as unknown as number;

  try {
    // 驗證 userId 是否存在
    const userExists = await pool.query(checkUserQuery, [userId]);
    if (userExists.rowCount === 0) {
      return next(new AppError("ERR_USER_NOT_FOUND", 401, "User not found"));
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

  try {
    // 驗證 userId 是否存在
    const userExists = await pool.query(checkUserQuery, [createdBy]);
    if (userExists.rowCount === 0) {
      return next(new AppError("ERR_USER_NOT_FOUND", 500, "User not found"));
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

// 目前還沒考慮 design_versions 的部分，只有簡單的更新 design 的資料
export const updateDesign: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const designId = req.params.designId as unknown as number;

  const { name, description, data } = req.body;

  try {
    const { updateDesignQuery, values } = generateUpdateDesignQuery(
      { name, description, data },
      designId
    );

    const result = await pool.query(updateDesignQuery, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const softDeleteDesign: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const designId = req.params.designId as unknown as number;

  try {
    const result = await pool.query(softDeleteDesignQuery, [designId]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
