// components/CreateTaskForm.tsx
"use client";

import { useState } from "react";

interface CreateTaskFormProps {
  onTaskCreated: (task: any) => void;
  defaultStatus?: string;
  workspaceId: string;
}

export default function CreateTaskForm({
  onTaskCreated,
  defaultStatus = "todo",
  workspaceId,
}: CreateTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: defaultStatus,
  });

  const handleSubmit = async () => {
    if (!form.title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, workspaceId }),
      });

      if (!res.ok) throw new Error("Failed to create task");

      const raw = await res.json();

      const newTask = {
        _id: raw._id.toString(),
        title: raw.title,
        description: raw.description || "",
        status: raw.status,
        priority: raw.priority,
        userId: raw.userId.toString(),
        workspaceId: raw.workspaceId.toString(),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      };

      onTaskCreated(newTask);
      setForm({
        title: "",
        description: "",
        priority: "medium",
        status: defaultStatus,
      });
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* + Add Task button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "8px 12px",
          background: "transparent",
          border: "1px dashed var(--border-default)",
          borderRadius: "var(--radius-sm)",
          color: "var(--text-muted)",
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
          transition:
            "border-color var(--transition-fast), color var(--transition-fast), background var(--transition-fast)",
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.borderColor = "var(--accent-indigo)";
          btn.style.color = "#a5b4fc";
          btn.style.background = "rgba(99,102,241,0.05)";
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.borderColor = "var(--border-default)";
          btn.style.color = "var(--text-muted)";
          btn.style.background = "transparent";
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
          <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
        </svg>
        Add Task
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="modal-panel">
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                Create New Task
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  fontSize: 20,
                  lineHeight: 1,
                  padding: 4,
                  borderRadius: 6,
                  transition: "color var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--text-muted)";
                }}
              >
                ×
              </button>
            </div>

            {/* Form fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Title */}
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Task Title *
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Enter task title…"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    fontSize: 13,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) handleSubmit();
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Description
                  <span
                    style={{
                      fontWeight: 400,
                      color: "var(--text-muted)",
                      marginLeft: 4,
                    }}
                  >
                    (optional)
                  </span>
                </label>
                <textarea
                  placeholder="Add more details…"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    fontSize: 13,
                    resize: "none",
                  }}
                />
              </div>

              {/* Priority + Status row */}
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Priority
                  </label>
                  <select
                    aria-label="Task priority"
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Status
                  </label>
                  <select
                    aria-label="Task status"
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 24,
              }}
            >
              <button
                className="btn-ghost"
                onClick={() => setIsOpen(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading || !form.title.trim()}
                style={{ flex: 1, justifyContent: "center" }}
              >
                {loading ? (
                  <>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "white",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    Creating…
                  </>
                ) : (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                      <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                    </svg>
                    Create Task
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
