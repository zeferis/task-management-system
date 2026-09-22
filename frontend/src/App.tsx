import { useState, useEffect } from "react";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "./services/taskServices";
import TaskItem from "./components/TaskItem";
interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}
function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [titles, setTitles] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [filter, setFilter] = useState("all");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = await createTask(titles, description);
    setTasks((prev) => [newTask, ...prev]);
    setTitles("");
    setDescription("");
  };
  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((e) => e.id !== id));
  };
  const handleComplete = async (task: Task) => {
    const updatedTask = await updateTask(
      task.id,
      task.title,
      task.description,
      "complete",
    );

    setTasks((prev) =>
      prev.map((item) => (item.id === task.id ? updatedTask : item)),
    );
  };
  const handleUpdate = async (task: Task) => {
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
  };
  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };
  const filterTasks=tasks.filter((task)=>{
    if(filter==='all'||task.status===filter)return true;
    return false;
  })
  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks();
      setTasks(data);
    };
    fetchTasks();
  }, []);
  return (
    <div>
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
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onComplete={handleComplete}
              onEdit={handleEdit}
            />
          )}
        </div>
      ))}
    </div>
  );
}
export default App;
