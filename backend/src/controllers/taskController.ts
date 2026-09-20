import pool from "../config/db.js";
import type { Request, Response } from "express";

export const getTasks = async (req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM tasks ORDER BY created_at DESC",
  );
  res.status(200).json(result.rows);
};
export const createTask = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "Title is required",
    });
  }
  const result = await pool.query(
    "INSERT INTO tasks(title,description) VALUES ($1,$2) RETURNING *",
    [title, description],
  );
  res.status(201).json(result.rows[0]);
};
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  if (!["active", "complete"].includes(status)) {
    return res.status(400).json({ message: "invalid status" });
  }
  const result = await pool.query(
    "UPDATE tasks SET title=$1, description=$2, status=$3 WHERE id=$4 RETURNING *",
    [title, description, status, id],
  );
  if (!result.rows[0]) {
    res.status(404).json({ message: "cant find task" });
    return;
  }
  res.status(200).json(result.rows[0]);
};
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query(
    "DELETE FROM tasks WHERE id=$1 RETURNING * ",
    [id],
  );
  if (!result.rows[0]) {
    res.status(404).json({ message: "cant find task to delete" });
    return;
  }
  res.status(200).json(result.rows[0]);
};
