import { useState, useEffect } from "react";
import { getTasks,createTask } from "./services/taskServices";
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = await createTask(titles, description);
    setTasks((prev) => [newTask, ...prev]);
    setTitles("");
    setDescription("");
  };
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
      {tasks.map((task) => (
        <div key={task.id}>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>{task.status}</p>
        </div>
      ))}
    </div>
  );
}
export default App;
