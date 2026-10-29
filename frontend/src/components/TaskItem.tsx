import type { Task } from "../types/task";
interface TaskItemProps {
  task: Task;
  disabled: boolean;
  onDelete: (id: number) => void;
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
}
const TaskItem = ({
  task,
  disabled,
  onDelete,
  onToggleStatus,
  onEdit,
}: TaskItemProps) => (
  <article
    className={`task-card ${task.status === "complete" ? "task-complete" : ""}`}
  >
    <h2>{task.title}</h2>
    <p className="task-description">{task.description}</p>
    <span className={`status-badge ${task.status}`}>
      {task.status === "active" ? "Đang làm" : "Hoàn thành"}
    </span>
    <div className="task-actions">
      <button
        className="button-danger"
        disabled={disabled}
        onClick={() => onDelete(task.id)}
      >
        Xóa
      </button>
      <button disabled={disabled} onClick={() => onToggleStatus(task)}>
        {task.status === "active" ? "Hoàn thành" : "Làm lại"}
      </button>
      <button disabled={disabled} onClick={() => onEdit(task)}>
        Sửa
      </button>
    </div>
  </article>
);
export default TaskItem;
