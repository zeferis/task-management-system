import type { Task } from "../types/task";
interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
}
const TaskItem = ({
  task,
  onDelete,
  onToggleStatus,
  onEdit,
}: TaskItemProps) => (
  <div>
    <h2>{task.title}</h2>
    <p>{task.description}</p>
    <p>{task.status}</p>
    <button onClick={() => onDelete(task.id)}>DELETE</button>
    <button onClick={() => onToggleStatus(task)}>
      {task.status === "active" ? "COMPLETE" : "ACTIVE"}
    </button>
    <button onClick={() => onEdit(task)}>EDIT</button>
  </div>
);
export default TaskItem;
