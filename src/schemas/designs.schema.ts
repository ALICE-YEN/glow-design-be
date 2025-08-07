import { z } from "zod";

export const designIdParamsSchema = z.object({
  designId: z
    .string()
    .regex(/^[0-9]+$/, "設計 ID 必須為數字")
    .transform((val) => parseInt(val, 10)), // 轉換為數字
});

export const userIdParamsSchema = z.object({
  userId: z
    .string()
    .regex(/^[0-9]+$/, "使用者 ID 必須為數字")
    .transform((val) => parseInt(val, 10)),
});

export const createDesignSchema = z.object({
  name: z.string().min(1, "設計名稱不可為空"),
  description: z.string().min(1, "描述不可為空"),
  data: z.any(),
});

export const updateDesignSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    data: z.any().optional(),
  })
  .refine((data) => data.name || data.description || data.data !== undefined, {
    message: "至少必須提供一個欄位進行更新",
  });
