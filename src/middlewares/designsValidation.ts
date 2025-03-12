import { Request, Response, NextFunction } from "express";
import { pool } from "../config/db";
import { AppError } from "../utils/AppError";
import { getDesignQuery } from "../queries/designsQueries";

/**
 * Middleware 驗證 req.params.designId 是否為合法數字，
 * 若合法則附加設計 ID 至 req.designId，否則回傳錯誤。
 */
export function validateDesignId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 驗證 designId 是否為數字
  const designId = parseInt(req.params.designId, 10);
  if (isNaN(designId)) {
    return next(new AppError("ERR_INVALID_DESIGNID", 400));
  }
  // 可以將 designId 存到 req 物件中，便於後續使用
  (req as any).designId = designId;
  next();
}

/**
 * Middleware 驗證 design 是否存在。
 * 若存在則附加至 req.design，否則回傳錯誤。
 */
export async function validateDesignExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const designId = (req as any).designId;
  try {
    const result = await pool.query(getDesignQuery, [designId]);
    if (result.rowCount === 0) {
      return next(new AppError("ERR_RESOURCE_NOT_FOUND", 404));
    }
    // 將查詢結果存入 req.design 供後續使用
    (req as any).design = result.rows[0];
    next();
  } catch (error) {
    next(error);
  }
}
