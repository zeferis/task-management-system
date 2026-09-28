export type TaskStatus = "active" | "complete";
export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
}
