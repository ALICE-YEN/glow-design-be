import { z } from "zod";

export const materialTypeParamsSchema = z.object({
  materialTypeId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: "Invalid materialTypeId" }),
});

export const categoryIdParamsSchema = z.object({
  categoryId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: "Invalid categoryId" }),
});
