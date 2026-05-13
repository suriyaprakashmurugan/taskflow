// components/KanbanColumn.tsx
"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SerializedTask } from "@/types/task";
import TaskCard from "./TaskCard";
import CreateTaskForm from "./CreateTaskForm";

interface KanbanColumnProps {
  id: string;
  label: string;
  color: string;
  tasks: SerializedTask[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onTaskCreated: (task: SerializedTask) => void;
  workspaceId: string;
}

const COLUMN_CONFIG: Record<
  string,
  { borderColor: string; badgeBg: string; badgeColor: string; dotColor: string }
> = {
  todo: {
    borderColor: "var(--col-todo)",
    badgeBg: "rgba(59,130,246,0.15)",
    badgeColor: "#60a5fa",
    dotColor: "#3b82f6",
  },
  "in-progress": {
    borderColor: "var(--col-progress)",
    badgeBg: "rgba(245,158,11,0.15)",
    badgeColor: "#fbbf24",
    dotColor: "#f59e0b",
  },
  done: {
    borderColor: "var(--col-done)",
    badgeBg: "rgba(16,185,129,0.15)",
    badgeColor: "#34d399",
    dotColor: "#10b981",
  },
};

export default function KanbanColumn({
  id,
  label,
  color: _color,
  tasks,
  onDelete,
  onStatusChange,
  onTaskCreated,
  workspaceId,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const cfg = COLUMN_CONFIG[id] ?? COLUMN_CONFIG["todo"];

  return (
    <div
      className="kanban-column"
      style={{
        borderTop: `3px solid ${cfg.borderColor}`,
        boxShadow: isOver
          ? `0 0 0 2px ${cfg.borderColor}40, var(--shadow-card)`
          : undefined,
        transition: "box-shadow 0.15s ease",
      }}
    >
      {/* Column Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px 10px",
          borderBottom: "1px solid var(--border-subtle)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: cfg.dotColor,
              flexShrink: 0,
            }}
          />
          <h2
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "0.01em",
            }}
          >
            {label}
          </h2>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "1px 8px",
              borderRadius: 99,
              background: cfg.badgeBg,
              color: cfg.badgeColor,
            }}
          >
            {tasks.length}
          </span>
        </div>

        {/* Column menu */}
        <button
          title="Column options"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            padding: 4,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            transition: "color var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </div>

      {/* Cards scrollable area */}
      <div
        ref={setNodeRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minHeight: 60,
        }}
      >
        <SortableContext
          id={id}
          items={tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </SortableContext>

        {/* Empty state */}
        {tasks.length === 0 && (
          <div
            style={{
              flex: 1,
              border: "2px dashed var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 80,
              opacity: isOver ? 0.8 : 0.5,
              transition: "opacity 0.15s ease",
            }}
          >
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Drop tasks here
            </p>
          </div>
        )}
      </div>

      {/* Add Task footer */}
      <div
        style={{
          padding: "10px 12px 12px",
          borderTop: "1px solid var(--border-subtle)",
          flexShrink: 0,
        }}
      >
        <CreateTaskForm
          onTaskCreated={onTaskCreated}
          defaultStatus={id}
          workspaceId={workspaceId}
        />
      </div>
    </div>
  );
}