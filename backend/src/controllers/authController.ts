import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import { DatabaseError } from "pg";
export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res
      .status(400)
      .json({ message: "Username, email and password must be strings" });
  }
  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedUsername || !normalizedEmail || password.trim().length === 0) {
    return res.status(400).json({
      message: "Username, email and password are required",
    });
  }
  if (!emailPattern.test(normalizedEmail)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must contain at least 8 characters",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      "INSERT INTO users(username,email,password) VALUES ($1,$2,$3) RETURNING id,username,email,create_at",
      [normalizedUsername, normalizedEmail, hashedPassword],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof DatabaseError && error.code === "23505") {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }
    throw error;
  }
};
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      message: "Email and password must be strings",
    });
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const result = await pool.query("SELECT * FROM users WHERE email=$1", [
    normalizedEmail,
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
