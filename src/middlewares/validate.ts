import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utils/appError";
import { formatZodError } from "../utils/formatZodError";

const validate = (
  schema: ZodSchema,
  source: "body" | "query" | "params" = "body"
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(
        new AppError(
          "ERR_VALIDATION",
          400,
          "輸入資料格式錯誤",
          formatZodError(result.error)
        )
      );
    }

    req[source] = result.data;
    next();
  };
};

export default validate;
