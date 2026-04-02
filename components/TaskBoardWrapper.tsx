// components/TaskBoardWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { SerializedTask } from "@/types/task";

const TaskBoard = dynamic(() => import("@/components/TaskBoard"), {
  ssr: false,
  loading: () => (
    <div className="text-sm text-gray-400">Loading board...</div>
  ),
});

export default function TaskBoardWrapper({
  initialTasks,
}: {
  initialTasks: SerializedTask[];
}) {
  return <TaskBoard initialTasks={initialTasks} />;
}