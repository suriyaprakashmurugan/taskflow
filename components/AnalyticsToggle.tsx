// components/AnalyticsToggle.tsx
"use client";

import { useState } from "react";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default function AnalyticsToggle() {
  const [show, setShow] = useState(false);

  return (
    <div style={{ marginBottom: 24 }}>
      <button
        onClick={() => setShow(!show)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 16px",
          background: show
            ? "rgba(99,102,241,0.15)"
            : "var(--bg-elevated)",
          border: `1px solid ${show ? "var(--accent-indigo)" : "var(--border-default)"}`,
          borderRadius: "var(--radius-sm)",
          color: show ? "#a5b4fc" : "var(--text-secondary)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: show ? 20 : 0,
          transition: "all var(--transition-fast)",
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {show ? "Hide Analytics" : "Show Analytics"}
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transform: show ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform var(--transition-fast)",
          }}
        >
          <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {show && <AnalyticsDashboard />}
    </div>
  );
}