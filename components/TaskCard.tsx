// components/TaskCard.tsx
"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SerializedTask } from "@/types/task";

interface TaskCardProps {
  task: SerializedTask;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const PRIORITY_CONFIG = {
  high: {
    label: "High Priority",
    className: "badge badge-high",
  },
  medium: {
    label: "Medium",
    className: "badge badge-medium",
  },
  low: {
    label: "Low",
    className: "badge badge-low",
  },
} as const;

type PriorityKey = keyof typeof PRIORITY_CONFIG;

// Format date nicely
function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function TaskCard({
  task,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 999 : undefined,
  };

  const priorityCfg =
    PRIORITY_CONFIG[(task.priority as PriorityKey)] ??
    PRIORITY_CONFIG["medium"];
  const createdDate = formatDate(task.createdAt);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task-card"
      onMouseLeave={() => setShowMenu(false)}
    >
      {/* Top row: drag handle + title + menu */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          style={{
            color: "var(--text-muted)",
            cursor: "grab",
            padding: "2px 0",
            flexShrink: 0,
            lineHeight: 1,
            fontSize: 14,
            marginTop: 1,
          }}
          title="Drag to move"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
            <circle cx="9" cy="5" r="2" />
            <circle cx="9" cy="12" r="2" />
            <circle cx="9" cy="19" r="2" />
            <circle cx="15" cy="5" r="2" />
            <circle cx="15" cy="12" r="2" />
            <circle cx="15" cy="19" r="2" />
          </svg>
        </div>

        {/* Title */}
        <h3
          style={{
            flex: 1,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1.45,
            wordBreak: "break-word",
          }}
        >
          {task.title}
        </h3>

        {/* Card menu */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={() => setShowMenu((v) => !v)}
            title="Card options"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: "2px 4px",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              if (!showMenu)
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text-muted)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>

          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                right: 0,
                background: "var(--bg-overlay)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)",
                padding: "4px",
                zIndex: 10,
                minWidth: 120,
                boxShadow: "var(--shadow-card)",
                animation: "fadeInUp 0.15s ease",
              }}
            >
              {[
                { label: "To Do", value: "todo" },
                { label: "In Progress", value: "in-progress" },
                { label: "Done", value: "done" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onStatusChange(task._id, opt.value);
                    setShowMenu(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "6px 10px",
                    fontSize: 12,
                    color:
                      task.status === opt.value
                        ? "var(--accent-indigo)"
                        : "var(--text-secondary)",
                    background: "transparent",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontWeight: task.status === opt.value ? 600 : 400,
                    transition: "background var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }}
                >
                  Move to {opt.label}
                </button>
              ))}

              <div
                style={{
                  height: 1,
                  background: "var(--border-subtle)",
                  margin: "4px 0",
                }}
              />

              <button
                onClick={() => {
                  onDelete(task._id);
                  setShowMenu(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "6px 10px",
                  fontSize: 12,
                  color: "#f87171",
                  background: "transparent",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "background var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(239,68,68,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                }}
              >
                Delete task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            marginTop: 6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {task.description}
        </p>
      )}

      {/* Priority badge */}
      <div style={{ marginTop: 8 }}>
        <span className={priorityCfg.className}>{priorityCfg.label}</span>
      </div>

      {/* Progress bar (visual indicator) */}
      <div style={{ marginTop: 10 }}>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width:
                task.status === "done"
                  ? "100%"
                  : task.status === "in-progress"
                  ? "55%"
                  : "15%",
            }}
          />
        </div>
      </div>

      {/* Footer: date + actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        {/* Due date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: "var(--text-muted)",
            fontSize: 11,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {createdDate}
        </div>

        {/* Comment + Attach icons */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            title="Comments"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 11,
              padding: 0,
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-secondary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-muted)";
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            title="Attachments"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              padding: 0,
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-secondary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-muted)";
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}