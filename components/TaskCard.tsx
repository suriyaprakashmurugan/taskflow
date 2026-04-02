// components/TaskCard.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SerializedTask } from "@/types/task";

interface TaskCardProps {
  task: SerializedTask;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const priorityStyles = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
} as const;

type PriorityKey = keyof typeof priorityStyles;

const statusOptions = ["todo", "in-progress", "done"];

export default function TaskCard({
  task,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
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
    opacity: isDragging ? 0.4 : 1, // fade while dragging
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition"
    >
      {/* Drag handle + Title + Delete */}
      <div className="flex items-start justify-between gap-2">

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="text-gray-300 hover:text-gray-400 cursor-grab active:cursor-grabbing mt-0.5 shrink-0"
        >
          ⠿
        </div>

        <h3 className="flex-1 font-medium text-gray-800 text-sm leading-snug">
          {task.title}
        </h3>

        <button
          onClick={() => onDelete(task._id)}
          className="text-gray-300 hover:text-red-400 transition text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-400 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Priority + Status */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            priorityStyles[task.priority as PriorityKey]
          }`}
        >
          {task.priority}
        </span>

        <select
          aria-label="Task status"
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1 bg-white cursor-pointer"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s === "in-progress"
                ? "In Progress"
                : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}