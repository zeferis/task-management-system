import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email and password are required" });
  }
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE username=$1 OR email=$2",
    [username, email],
  );
  if (existingUser.rows[0]) {
    return res
      .status(409)
      .json({ message: "Username or email already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users(username,email,password) VALUES ($1,$2,$3) RETURNING id,username,email,create_at",
    [username, email, hashedPassword],
  );
  return res.status(201).json(result.rows[0]);
};
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const result = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);
  if (result.rows.length === 0) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }
  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" },
  );
  return res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
};
