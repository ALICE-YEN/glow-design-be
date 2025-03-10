// 感覺使用上跟 errorMap 沒有做結合，要再想一下
import { ErrorCode } from "../utils/errorMap";

export class AppError extends Error {
  public code: ErrorCode;
  public status: number;

  constructor(code: ErrorCode, status: number) {
    super();
    this.code = code;
    this.status = status;
  }
}
