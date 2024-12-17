import { Request, Response } from "express";
import { pool } from "../config/db";
import { getAllUsersQuery, createUserQuery } from "../queries/userQueries";

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(getAllUsersQuery);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(createUserQuery, [name, email]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};
