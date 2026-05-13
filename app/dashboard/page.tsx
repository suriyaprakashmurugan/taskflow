// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import DashboardClient from "@/components/DashboardClient";

export const metadata = {
  title: "Kanban Board — TaskFlow",
  description: "Manage your team's tasks with a premium dark Kanban board.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();

  const rawTasks = await Task.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const tasks = (rawTasks as any[]).map((task) => ({
    _id: String(task._id),
    title: String(task.title),
    description: task.description ? String(task.description) : "",
    status: task.status,
    priority: task.priority,
    userId: String(task.userId),
    createdAt: String(task.createdAt),
    updatedAt: String(task.updatedAt),
  }));

  const user = {
    name: session.user?.name ?? null,
    email: session.user?.email ?? null,
    image: session.user?.image ?? null,
  };

  return <DashboardClient initialTasks={tasks} user={user} />;
}
