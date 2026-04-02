// types/task.ts
export interface SerializedTask {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  userId: string;
  createdAt: string; 
  updatedAt: string;  
}