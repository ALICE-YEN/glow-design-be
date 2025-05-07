import { z } from "zod";

const strongPasswordSchema = z
  .string()
  .min(8, "密碼至少需要 8 個字元")
  .regex(/[A-Z]/, "密碼至少需要一個大寫字母")
  .regex(/[a-z]/, "密碼至少需要一個小寫字母")
  .regex(/[0-9]/, "密碼至少需要一個數字");

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: strongPasswordSchema,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: strongPasswordSchema,
});

export const googleSsoSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  ssoId: z.string().min(1, "SSO ID is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});
