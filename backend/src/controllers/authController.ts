import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email and password are required" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users(username,email,password) VALUES ($1,$2,$3) RETURNING id,username,email,create_at",
    [username, email, hashedPassword],
  );
  return res.status(201).json(result.rows[0]);
};
