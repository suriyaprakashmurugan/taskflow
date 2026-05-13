// components/TaskBoard.tsx
"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { useEffect } from "react";
import { SerializedTask } from "@/types/task";
import KanbanColumn from "./KanbanColumn";

interface TaskBoardProps {
  initialTasks: SerializedTask[];
  workspaceId: string;
}

const columns = [
  { id: "todo", label: "To Do", color: "" },
  { id: "in-progress", label: "In Progress", color: "" },
  { id: "done", label: "Done", color: "" },
];

export default function TaskBoard({ initialTasks, workspaceId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<SerializedTask[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<SerializedTask | null>(null);

  useEffect(() => {
    if (!workspaceId) return;
    fetch(`/api/tasks?workspaceId=${workspaceId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data);
        }
      });
  }, [workspaceId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleTaskCreated = (newTask: SerializedTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDelete = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t._id === id
          ? { ...t, status: status as SerializedTask["status"] }
          : t
      )
    );
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t._id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    const overColumn = columns.find((col) => col.id === overId);

    if (overColumn) {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === active.id
            ? { ...t, status: overColumn.id as SerializedTask["status"] }
            : t
        )
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const overId = over.id as string;

    const overColumn =
      columns.find((col) => col.id === overId) ||
      columns.find((col) =>
        tasks
          .filter((t) => t.status === col.id)
          .some((t) => t._id === overId)
      );

    if (!overColumn) return;

    const task = tasks.find((t) => t._id === active.id);
    if (!task) return;

    await handleStatusChange(active.id as string, overColumn.id);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            label={col.label}
            color={col.color}
            tasks={tasks.filter((t) => t.status === col.id)}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onTaskCreated={handleTaskCreated}
            workspaceId={workspaceId}
          />
        ))}
      </div>

      {/* Drag overlay — floating card while dragging */}
      <DragOverlay>
        {activeTask && (
          <div
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--accent-indigo)",
              borderRadius: "var(--radius-md)",
              padding: "14px",
              boxShadow: "var(--shadow-glow)",
              transform: "rotate(2deg)",
              opacity: 0.95,
              maxWidth: 280,
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {activeTask.title}
            </p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}