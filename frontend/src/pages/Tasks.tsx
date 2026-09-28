import { useState, useEffect, useCallback } from "react";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/taskServices";
import TaskItem from "../components/TaskItem";
import axios from "axios";
import type { Task } from "../types/task";
interface logoutProps {
  onLogout: () => void;
}
const Tasks = ({ onLogout }: logoutProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [titles, setTitles] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [filter, setFilter] = useState("all");
  const [err, setErr] = useState("");
  const handleError = useCallback(
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          onLogout();
          return;
        }
        setErr(error.response?.data?.message || "Something went wrong");
        return;
      }
      setErr("Something went wrong");
    },
    [onLogout],
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const newTask = await createTask(titles, description);
      setTasks((prev) => [newTask, ...prev]);
      setTitles("");
      setDescription("");
    } catch (error) {
      handleError(error);
    }
  };
  const handleDelete = async (id: number) => {
    setErr("");
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      handleError(error);
    }
  };
  const handleComplete = async (task: Task) => {
    setErr("");
    try {
      const updatedTask = await updateTask(
        task.id,
        task.title,
        task.description,
        "complete",
      );

      setTasks((prev) =>
        prev.map((item) => (item.id === task.id ? updatedTask : item)),
      );
    } catch (error) {
      handleError(error);
    }
  };
  const handleUpdate = async (task: Task) => {
    setErr("");
    try {
      const updatedTask = await updateTask(
        task.id,
        editTitle,
        editDescription,
        task.status,
      );

      setTasks((prev) =>
        prev.map((item) => (item.id === task.id ? updatedTask : item)),
      );
      setEditingId(null);
    } catch (error) {
      handleError(error);
    }
  };
  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };
  const filterTasks = tasks.filter((task) => {
    if (filter === "all" || task.status === filter) return true;
    return false;
  });
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        handleError(error);
      }
    };
    fetchTasks();
  }, [handleError]);
  return (
    <div>
      <button onClick={() => onLogout()}>Logout</button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={titles}
          placeholder="Title"
          onChange={(e) => setTitles(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
      <h1>Task Management</h1>
      <button onClick={() => setFilter("active")}>ACTIVE</button>
      <button onClick={() => setFilter("complete")}>COMPLETE</button>
      <button onClick={() => setFilter("all")}>ALL</button>
      {filterTasks.map((task) => (
        <div key={task.id}>
          {editingId === task.id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />

              <button onClick={() => handleUpdate(task)}>Save</button>
            </>
          ) : (
            <TaskItem
              task={task}
              onDelete={handleDelete}
              onComplete={handleComplete}
              onEdit={handleEdit}
            />
          )}
        </div>
      ))}
      {err && <p>{err}</p>}
    </div>
  );
};
export default Tasks;
