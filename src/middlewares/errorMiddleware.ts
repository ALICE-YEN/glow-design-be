// TODO: 這部分還可以再研究跟優化，code原生數字跟自定義會混淆。errorMiddleware、AppError 界線
import { Request, Response, NextFunction } from "express";
import { errorMap } from "../utils/errorMap";
import { AppError } from "../utils/AppError";

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error caught by middleware:", err);

  const error = errorMap[err.code] || errorMap["ERR_SERVER_ERROR"];
  res.status(error.status).json({
    code: err.code || "ERR_SERVER_ERROR",
    message: error.message,
  });
};
