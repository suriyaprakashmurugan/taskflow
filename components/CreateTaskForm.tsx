// components/CreateTaskForm.tsx
"use client";

import { useState } from "react";

interface CreateTaskFormProps {
  onTaskCreated: (task: any) => void;
}

export default function CreateTaskForm({ onTaskCreated }: CreateTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
  });

  const handleSubmit = async () => {
    if (!form.title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create task");

      const raw = await res.json();

      // Serialize before passing to parent — same pattern as dashboard
      const newTask = {
        _id: raw._id.toString(),
        title: raw.title,
        description: raw.description || "",
        status: raw.status,
        priority: raw.priority,
        userId: raw.userId.toString(),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      };

      onTaskCreated(newTask);
      setForm({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
      });
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full border-2 border-dashed border-gray-200 rounded-xl p-3 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-400 transition"
      >
        + Add Task
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 shadow-sm">
      {/* Title */}
      <input
        autoFocus
        type="text"
        placeholder="Task title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Description */}
      <textarea
        placeholder="Description (optional)"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={2}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
      />

      {/* Priority + Status row */}
      <div className="flex gap-2">
        <select
          aria-label="Task priority"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
          className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          aria-label="Task status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={loading || !form.title.trim()}
          className="flex-1 bg-blue-500 text-white text-sm rounded-lg py-1.5 hover:bg-blue-600 disabled:opacity-50 transition"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="flex-1 border border-gray-200 text-sm rounded-lg py-1.5 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
