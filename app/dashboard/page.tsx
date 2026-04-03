// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import TaskBoardWrapper from "@/components/TaskBoardWrapper";
import WorkspaceSelector from "@/components/WorkspaceSelector";
import AnalyticsToggle from "@/components/AnalyticsToggle";
import LogoutButton from "@/components/LogoutButton";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-bold text-gray-800 text-lg">TaskFlow</h1>
          <WorkspaceSelector /> {/* 👈 no props */}
          <div className="flex items-center gap-3">
            <img
              src={session.user?.image || ""}
              className="w-8 h-8 rounded-full"
              alt={session.user?.name || "User avatar"}
            />
            <span className="text-sm text-gray-600">{session.user?.name}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">My Tasks</h2>
          <p className="text-sm text-gray-400 mt-1">
            {tasks.length} tasks total
          </p>
        </div>
        <AnalyticsToggle />
        <TaskBoardWrapper initialTasks={tasks} />
      </main>
    </div>
  );
}
