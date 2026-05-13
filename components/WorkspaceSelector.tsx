// components/WorkspaceSelector.tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface Workspace {
  _id: string;
  name: string;
  inviteToken: string;
}

interface WorkspaceSelectorProps {
  selected?: string;
  onSelect: (id: string) => void;
}

export default function WorkspaceSelector({ selected, onSelect }: WorkspaceSelectorProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/workspaces")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setWorkspaces(data);
          // Only auto-select if nothing is selected
          if (!selected) {
            onSelect(data[0]._id);
          }
        }
      });
  }, [onSelect, selected]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    const workspace = await res.json();
    setWorkspaces((prev) => [...prev, workspace]);
    onSelect(workspace._id);
    setNewName("");
    setCreating(false);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !selected) return;
    setInviting(true);
    try {
      await fetch("/api/workspaces/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, workspaceId: selected }),
      });
      setInviteSent(true);
      setInviteEmail("");
      setTimeout(() => setInviteSent(false), 3000);
    } finally {
      setInviting(false);
    }
  };

  const selectedWorkspace = workspaces.find((w) => w._id === selected);

  return (
    <div
      ref={dropdownRef}
      style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}
    >
      {/* Workspace pill/dropdown trigger */}
      {workspaces.length > 0 && (
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 14px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-primary)",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "border-color var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--accent-indigo)";
          }}
          onMouseLeave={(e) => {
            if (!dropdownOpen)
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--border-default)";
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--accent-indigo)",
              flexShrink: 0,
            }}
          />
          {selectedWorkspace?.name || "Select workspace"}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform var(--transition-fast)",
            }}
          >
            <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Dropdown panel */}
      {dropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            padding: "8px",
            zIndex: 20,
            minWidth: 220,
            boxShadow: "var(--shadow-elevated)",
            animation: "fadeInUp 0.15s ease",
          }}
        >
          {/* Workspace list */}
          {workspaces.map((w) => (
            <button
              key={w._id}
              onClick={() => {
                onSelect(w._id);
                setDropdownOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: "var(--radius-sm)",
                background: w._id === selected ? "rgba(99,102,241,0.1)" : "transparent",
                border: "none",
                color: w._id === selected ? "#a5b4fc" : "var(--text-secondary)",
                fontSize: 13,
                fontWeight: w._id === selected ? 600 : 400,
                cursor: "pointer",
                transition: "background var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                if (w._id !== selected)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (w._id !== selected)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: w._id === selected ? "var(--accent-indigo)" : "var(--text-muted)",
                  flexShrink: 0,
                }}
              />
              {w.name}
            </button>
          ))}

          <div
            style={{
              height: 1,
              background: "var(--border-subtle)",
              margin: "6px 0",
            }}
          />

          {/* Create new workspace */}
          {creating ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "4px" }}>
              <input
                autoFocus
                type="text"
                placeholder="Workspace name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ fontSize: 12, padding: "7px 10px", width: "100%" }}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn-primary"
                  onClick={handleCreate}
                  style={{ flex: 1, fontSize: 12, padding: "7px 10px", justifyContent: "center" }}
                >
                  Create
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => setCreating(false)}
                  style={{ flex: 1, fontSize: 12, padding: "7px 10px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                width: "100%",
                padding: "8px 10px",
                border: "none",
                background: "transparent",
                color: "var(--text-muted)",
                fontSize: 12,
                cursor: "pointer",
                borderRadius: "var(--radius-sm)",
                transition: "color var(--transition-fast), background var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
              </svg>
              New Workspace
            </button>
          )}

          {/* Invite teammate */}
          {selected && (
            <>
              <div
                style={{
                  height: 1,
                  background: "var(--border-subtle)",
                  margin: "6px 0",
                }}
              />
              <div style={{ padding: "4px", display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Invite teammate
                </p>
                <div style={{ display: "flex", gap: 6 }}>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    style={{ flex: 1, fontSize: 12, padding: "7px 10px" }}
                    onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  />
                  <button
                    onClick={handleInvite}
                    disabled={inviting || !inviteEmail.trim()}
                    className="btn-primary"
                    style={{ fontSize: 12, padding: "7px 12px", whiteSpace: "nowrap" }}
                  >
                    {inviting ? "…" : inviteSent ? "✓ Sent" : "Invite"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* No workspaces — show create immediately */}
      {workspaces.length === 0 && !creating && (
        <button
          className="btn-ghost"
          onClick={() => setCreating(true)}
          style={{ fontSize: 12 }}
        >
          + New Workspace
        </button>
      )}
      {workspaces.length === 0 && creating && (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            autoFocus
            type="text"
            placeholder="Workspace name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ fontSize: 12, padding: "7px 12px" }}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <button className="btn-primary" onClick={handleCreate} style={{ fontSize: 12 }}>
            Create
          </button>
          <button
            className="btn-ghost"
            onClick={() => setCreating(false)}
            style={{ fontSize: 12 }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}