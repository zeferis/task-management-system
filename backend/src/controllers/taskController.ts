import pool from "../config/db.js";
import type { Response } from "express";
import type { AuthRequest } from "../types/auth.js";
export const getTasks = async (req: AuthRequest, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id=$1 ORDER BY created_at DESC",
    [req.userId],
  );
  res.status(200).json(result.rows);
};
export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description } = req.body;
  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message: "Title must be a non-empty string",
    });
  }
  if (typeof description !== "string") {
    return res.status(400).json({
      message: "description must be a non-empty string",
    });
  }
  const result = await pool.query(
    "INSERT INTO tasks(title,description,user_id) VALUES ($1,$2,$3) RETURNING *",
    [title, description, req.userId],
  );
  res.status(201).json(result.rows[0]);
};
export const updateTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message: "Title must be a non-empty string",
    });
  }
  if (!["active", "complete"].includes(status)) {
    return res.status(400).json({ message: "invalid status" });
  }
  const taskId = Number(id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }
  const result = await pool.query(
    "UPDATE tasks SET title=$1, description=$2, status=$3 WHERE id=$4 AND user_id=$5 RETURNING *",
    [title, description, status, taskId, req.userId],
  );
  if (!result.rows[0]) {
    res.status(404).json({ message: "cant find task" });
    return;
  }
  res.status(200).json(result.rows[0]);
};
export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const taskId = Number(id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }
  const result = await pool.query(
    "DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING * ",
    [taskId, req.userId],
  );
  if (!result.rows[0]) {
    res.status(404).json({ message: "cant find task to delete" });
    return;
  }
  res.status(200).json(result.rows[0]);
};
