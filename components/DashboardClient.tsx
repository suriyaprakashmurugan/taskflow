// components/DashboardClient.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import WorkspaceSelector from "./WorkspaceSelector";
import { SerializedTask } from "@/types/task";

const TaskBoard = dynamic(() => import("@/components/TaskBoard"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 300,
        color: "var(--text-muted)",
        fontSize: 14,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "3px solid var(--border-default)",
          borderTopColor: "var(--accent-indigo)",
          animation: "spin 0.8s linear infinite",
          marginRight: 12,
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      Loading board…
    </div>
  ),
});

const AnalyticsDashboard = dynamic(() => import("@/components/AnalyticsDashboard"), {
  ssr: false,
});

interface DashboardClientProps {
  initialTasks: SerializedTask[];
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardClient({ initialTasks, user }: DashboardClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("kanban");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");

  return (
    <div className="dashboard-layout">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeNav}
        onNavigate={setActiveNav}
      />

      <div className="main-area">
        <Topbar
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onShowAnalytics={() => setShowAnalytics((v) => !v)}
          showAnalytics={showAnalytics}
        />

        <main className="content-area">
          {/* Page header */}
          <div
            style={{
              marginBottom: 20,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
            className="animate-fade-in-up"
          >
            <div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                My Tasks
                <span
                  style={{
                    color: "var(--text-muted)",
                    fontWeight: 300,
                    fontSize: 20,
                  }}
                >
                  |
                </span>
                <span style={{ color: "var(--text-secondary)", fontSize: 18, fontWeight: 500 }}>
                  Kanban Board
                </span>
              </h1>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginTop: 4,
                }}
              >
                {initialTasks.length} tasks total
              </p>
            </div>

            {/* Workspace selector in header */}
            <WorkspaceSelector
              selected={selectedWorkspaceId}
              onSelect={setSelectedWorkspaceId}
            />
          </div>

          {/* Sub-toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <div className="search-bar" style={{ minWidth: 180, flex: "0 1 220px" }}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Filter tasks…"
                aria-label="Filter tasks"
                style={{ fontSize: 12 }}
              />
            </div>

            {/* Filters button */}
            <button
              className="btn-ghost"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                padding: "7px 14px",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Filters
            </button>

            {/* View toggle */}
            <div
              style={{
                display: "flex",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)",
                overflow: "hidden",
              }}
            >
              <button
                style={{
                  padding: "7px 12px",
                  fontSize: 12,
                  background: "var(--accent-indigo)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontWeight: 600,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="5" height="18" rx="1" />
                  <rect x="10" y="3" width="5" height="12" rx="1" />
                  <rect x="17" y="3" width="5" height="15" rx="1" />
                </svg>
                Kanban
              </button>
              <button
                style={{
                  padding: "7px 12px",
                  fontSize: 12,
                  background: "transparent",
                  color: "var(--text-secondary)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  transition: "color var(--transition-fast)",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                List
              </button>
            </div>

            <div style={{ flex: 1 }} />

            {/* Sort by */}
            <button
              className="btn-ghost"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                padding: "7px 14px",
              }}
            >
              Sort by
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Analytics panel */}
          {showAnalytics && (
            <div
              style={{ marginBottom: 24 }}
              className="animate-fade-in-up"
            >
              <AnalyticsDashboard />
            </div>
          )}

          {/* Kanban board */}
          <TaskBoard
            initialTasks={initialTasks}
            workspaceId={selectedWorkspaceId}
          />
        </main>
      </div>
    </div>
  );
}
