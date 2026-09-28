import axios from "axios";
import type { TaskStatus } from "../types/task";
import type { Task } from "../types/task";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const TASKS_URL = `${API_URL}/api/tasks`;
const getConfig = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

export const getTasks = async () => {
  const response = await axios.get<Task[]>(TASKS_URL, getConfig());
  return response.data;
};
export const createTask = async (title: string, description: string) => {
  const response = await axios.post<Task>(
    TASKS_URL,
    {
      title,
      description,
    },
    getConfig(),
  );
  return response.data;
};
export const deleteTask = async (id: number) => {
  const response = await axios.delete<Task>(`${TASKS_URL}/${id}`, getConfig());
  return response.data;
};
export const updateTask = async (
  id: number,
  title: string,
  description: string,
  status: TaskStatus,
) => {
  const response = await axios.put<Task>(
    `${TASKS_URL}/${id}`,
    { title, description, status },
    getConfig(),
  );
  return response.data;
};
