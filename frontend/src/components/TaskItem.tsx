interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}
interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
}
const TaskItem = ({ task, onDelete, onComplete,onEdit }: TaskItemProps) => (
  <div>
    <h2>{task.title}</h2>
    <p>{task.description}</p>
    <p>{task.status}</p>
    <button onClick={() => onDelete(task.id)}>DELETE</button>
    <button onClick={() => onComplete(task)}>COMPLETE</button>
    <button onClick={() => onEdit(task)}>EDIT</button>
  </div>
);
export default TaskItem;
