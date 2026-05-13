// components/Topbar.tsx
"use client";

import { useState } from "react";

interface TopbarProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
  onMenuClick: () => void;
  onShowAnalytics: () => void;
  showAnalytics: boolean;
}

export default function Topbar({
  user,
  onMenuClick,
  onShowAnalytics,
  showAnalytics,
}: TopbarProps) {
  const [searchVal, setSearchVal] = useState("");

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="topbar">
      {/* Hamburger (mobile only) */}
      <button
        id="sidebar-hamburger"
        className="icon-btn"
        onClick={onMenuClick}
        title="Toggle menu"
        style={{ display: "none" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
          <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
          <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
        </svg>
      </button>

      <style>{`
        @media (max-width: 768px) {
          #sidebar-hamburger { display: flex !important; }
          #topbar-date { display: none !important; }
          #topbar-search { max-width: 100% !important; }
        }
      `}</style>

      {/* Date */}
      <span
        id="topbar-date"
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          whiteSpace: "nowrap",
          marginRight: 8,
        }}
      >
        {today}
      </span>

      {/* Search */}
      <div
        className="search-bar"
        id="topbar-search"
        style={{ flex: 1, maxWidth: 320 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          placeholder="Search tasks…"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          aria-label="Search tasks"
        />
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Analytics toggle */}
      <button
        className="btn-ghost"
        onClick={onShowAnalytics}
        style={{ fontSize: 12, padding: "6px 12px" }}
      >
        {showAnalytics ? "Hide Analytics" : "Analytics"}
      </button>

      {/* Notification bell */}
      <button className="icon-btn" title="Notifications" style={{ position: "relative" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* Notification dot */}
        <span
          style={{
            position: "absolute",
            top: 7,
            right: 7,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#ef4444",
            border: "2px solid var(--bg-surface)",
          }}
        />
      </button>

      {/* User avatar */}
      {user.image ? (
        <img
          src={user.image}
          alt={user.name || "User"}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "2px solid var(--border-default)",
            cursor: "pointer",
            transition: "border-color var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLImageElement).style.borderColor =
              "var(--accent-indigo)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLImageElement).style.borderColor =
              "var(--border-default)";
          }}
        />
      ) : (
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "white",
            cursor: "pointer",
            border: "2px solid var(--border-default)",
          }}
        >
          {(user.name || "U")[0].toUpperCase()}
        </div>
      )}

      {user.name && (
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-primary)",
            whiteSpace: "nowrap",
          }}
          id="topbar-username"
        >
          {user.name}
        </span>
      )}
      <style>{`
        @media (max-width: 480px) {
          #topbar-username { display: none; }
        }
      `}</style>
    </header>
  );
}
