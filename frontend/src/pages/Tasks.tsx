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
interface LogoutProps {
  onLogout: () => void;
}
const Tasks = ({ onLogout }: LogoutProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [titles, setTitles] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [filter, setFilter] = useState("all");
  const [err, setErr] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingTaskId, setPendingTaskId] = useState<number | null>(null);
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
    if (isLoading || isCreating) {
      return;
    }
    setErr("");
    setIsCreating(true);
    try {
      const newTask = await createTask(titles, description);
      setTasks((prev) => [newTask, ...prev]);
      setTitles("");
      setDescription("");
    } catch (error) {
      handleError(error);
    } finally {
      setIsCreating(false);
    }
  };
  const handleDelete = async (id: number) => {
    if (pendingTaskId !== null) return;
    setErr("");
    setPendingTaskId(id);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      handleError(error);
    } finally {
      setPendingTaskId(null);
    }
  };
  const handleToggleStatus = async (task: Task) => {
    if (pendingTaskId !== null) return;
    setErr("");
    setPendingTaskId(task.id);
    const status = task.status === "active" ? "complete" : "active";
    try {
      const updatedTask = await updateTask(
        task.id,
        task.title,
        task.description,
        status,
      );

      setTasks((prev) =>
        prev.map((item) => (item.id === task.id ? updatedTask : item)),
      );
    } catch (error) {
      handleError(error);
    } finally {
      setPendingTaskId(null);
    }
  };
  const handleUpdate = async (task: Task) => {
    if (pendingTaskId !== null) return;
    setErr("");
    setPendingTaskId(task.id);
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
    } finally {
      setPendingTaskId(null);
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
      setIsLoading(true);
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [handleError]);
  return (
    <main className="workspace">
      <header className="page-header">
        <div className="page-title">
          <span className="brand-mark" aria-hidden="true">
            ✓
          </span>
          <h1>Công việc của tôi</h1>
        </div>
        <button className="button-secondary" onClick={() => onLogout()}>
          Đăng xuất
        </button>
      </header>
      <form className="create-form panel" onSubmit={handleSubmit}>
        <h2>Thêm công việc</h2>
        <div className="create-fields">
          <label htmlFor="task-title">
            Tiêu đề
            <input
              disabled={isCreating}
              type="text"
              value={titles}
              id="task-title"
              placeholder="Bạn cần làm gì?"
              onChange={(e) => setTitles(e.target.value)}
              required
            />
          </label>
          <label htmlFor="task-description">
            Mô tả
            <input
              disabled={isCreating}
              type="text"
              id="task-description"
              placeholder="Thêm chi tiết công việc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={isLoading || isCreating}>
            {isCreating ? "Đang thêm..." : "＋ Thêm công việc"}
          </button>
        </div>
      </form>
      <section className="task-section" aria-label="Danh sách công việc">
        <div className="list-header">
          <h2>Danh sách công việc</h2>
          <div className="filter-tabs" role="group" aria-label="Lọc công việc">
            <button
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              Tất cả
            </button>
            <button
              aria-pressed={filter === "active"}
              onClick={() => setFilter("active")}
            >
              Đang làm
            </button>
            <button
              aria-pressed={filter === "complete"}
              onClick={() => setFilter("complete")}
            >
              Hoàn thành
            </button>
          </div>
        </div>
        {err && (
          <p className="error-message" role="alert">
            {err}
          </p>
        )}
        {isLoading && (
          <p className="list-message" role="status">
            Đang tải công việc...
          </p>
        )}
        {!isLoading && !err && filterTasks.length === 0 && (
          <p className="list-message">Chưa có công việc trong danh sách này.</p>
        )}
        <div className="task-grid">
          {filterTasks.map((task) => (
            <div key={task.id}>
              {editingId === task.id ? (
                <div className="task-card edit-card">
                  <h2>Chỉnh sửa công việc</h2>
                  <label htmlFor={`edit-title-${task.id}`}>Tiêu đề</label>
                  <input
                    disabled={pendingTaskId !== null}
                    id={`edit-title-${task.id}`}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <label htmlFor={`edit-description-${task.id}`}>Mô tả</label>
                  <input
                    disabled={pendingTaskId !== null}
                    id={`edit-description-${task.id}`}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />

                  <button
                    disabled={pendingTaskId !== null}
                    onClick={() => handleUpdate(task)}
                  >
                    {pendingTaskId === task.id ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              ) : (
                <TaskItem
                  task={task}
                  disabled={pendingTaskId !== null}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleEdit}
                />
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
export default Tasks;
