import { Request, Response, RequestHandler, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";
import { AppError } from "../utils/AppError";
import {
  insertUserQuery,
  checkEmailQuery,
  loginQuery,
  insertGoogleUserQuery,
  findUserBySsoOrEmailQuery,
} from "../queries/authQueries";

const secretKey = process.env.JWT_SECRET || "your_jwt_secret";

export const register: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      throw new AppError("ERR_MISSING_FIELDS", 400);
    }

    // TODO: REDIS - Caching User Data for Fast Lookups、Redis can act as a fast lock to prevent duplicates during High Concurrency
    // Check if the email already exists
    const emailExists = await pool.query(checkEmailQuery, [email]);
    if ((emailExists?.rowCount ?? 0) > 0) {
      throw new AppError("ERR_EMAIL_EXISTS", 400);
    }

    // Hash the password and insert the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(insertUserQuery, [
      username,
      email,
      hashedPassword,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if ((error as any).code === "23505") {
      next(new AppError("ERR_EMAIL_EXISTS", 400));
      return;
    }
    // Pass all other errors to errorMiddleware for centralized handling
    next(error);
  }
};

export const login: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new AppError("ERR_MISSING_FIELDS", 400);
    }
    const result = await pool.query(loginQuery, [email]);
    if (result.rowCount === 0) {
      throw new AppError("ERR_INVALID_CREDENTIALS", 401);
    }
    const user = result.rows[0];

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("ERR_INVALID_CREDENTIALS", 401);
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
      expiresIn: "1h", // Token expiration time
    });

    res.status(200).json({
      token,
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

export const googleSsoHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, ssoId } = req.body;

  try {
    if (!username || !email || !ssoId) {
      throw new AppError("ERR_MISSING_FIELDS", 400);
    }

    // Check if the user already exists in the database
    const result = await pool.query(findUserBySsoOrEmailQuery, [ssoId, email]);
    let user = result.rows[0];
    console.log("user1", user);

    if (user) {
      if (user.sso_id !== ssoId) {
        throw new AppError("ERR_EMAIL_EXISTS", 400);
      }
      // Login
    } else {
      // Register
      const result = await pool.query(insertGoogleUserQuery, [
        username,
        email,
        ssoId,
      ]);
      user = result.rows[0];
      console.log("user2", user);
    }
    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
      expiresIn: "1h", // Token expiration time
    });

    res.status(200).json({
      token,
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};
