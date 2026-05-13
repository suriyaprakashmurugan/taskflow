// components/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        background: "transparent",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-sm)",
        color: "var(--text-muted)",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        transition: "color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast)",
      }}
      onMouseEnter={(e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.style.color = "#f87171";
        btn.style.borderColor = "#f87171";
        btn.style.background = "rgba(239,68,68,0.08)";
      }}
      onMouseLeave={(e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.style.color = "var(--text-muted)";
        btn.style.borderColor = "var(--border-default)";
        btn.style.background = "transparent";
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Logout
    </button>
  );
}