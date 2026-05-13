// components/TaskBoardWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { SerializedTask } from "@/types/task";

const TaskBoard = dynamic(() => import("@/components/TaskBoard"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "40px 0",
        color: "var(--text-muted)",
        fontSize: 13,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: "3px solid var(--border-default)",
          borderTopColor: "var(--accent-indigo)",
          animation: "spin 0.8s linear infinite",
          flexShrink: 0,
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      Loading board…
    </div>
  ),
});

export default function TaskBoardWrapper({
  initialTasks,
  workspaceId,
}: {
  initialTasks: SerializedTask[];
  workspaceId: string;
}) {
  return <TaskBoard initialTasks={initialTasks} workspaceId={workspaceId} />;
}