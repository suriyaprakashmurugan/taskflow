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
}

export default function KanbanColumn({
  id,
  label,
  color,
  tasks,
  onDelete,
  onStatusChange,
  onTaskCreated,
}: KanbanColumnProps) {
  // This is the key fix — register column as a droppable target
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={`${color} ${
        isOver ? "ring-2 ring-blue-300" : ""  // visual feedback when dragging over
      } rounded-2xl p-4 flex flex-col gap-3 min-h-[200px] transition-all`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-gray-700 text-sm">{label}</h2>
        <span className="text-xs bg-white text-gray-400 rounded-full px-2 py-0.5 font-medium">
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div ref={setNodeRef} className="flex flex-col gap-3 flex-1">
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

        {/* Empty drop zone */}
        {tasks.length === 0 && (
          <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center min-h-[80px]">
            <p className="text-xs text-gray-300">Drop here</p>
          </div>
        )}
      </div>

      {/* Add task — only in todo column */}
      {id === "todo" && (
        <CreateTaskForm onTaskCreated={onTaskCreated} />
      )}
    </div>
  );
}