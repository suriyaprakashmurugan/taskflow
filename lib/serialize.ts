// lib/serialize.ts
export function serializeTasks(rawTasks: any[]) {
  return rawTasks.map((task) => ({
    _id: String(task._id),
    title: String(task.title),
    description: task.description ? String(task.description) : "",
    status: task.status as "todo" | "in-progress" | "done",
    priority: task.priority as "low" | "medium" | "high",
    userId: String(task.userId),
    createdAt: String(task.createdAt),
    updatedAt: String(task.updatedAt),
  }));
}