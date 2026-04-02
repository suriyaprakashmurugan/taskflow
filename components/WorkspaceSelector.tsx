// components/WorkspaceSelector.tsx
"use client";

import { useState, useEffect } from "react";

interface Workspace {
  _id: string;
  name: string;
  inviteToken: string;
}

export default function WorkspaceSelector() {  // 👈 no props
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  useEffect(() => {
    fetch("/api/workspaces")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setWorkspaces(data);
          setSelected(data[0]._id);
        }
      });
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
    setSelected(workspace._id);
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

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Workspace dropdown */}
      {workspaces.length > 0 && (
        <select
          aria-label="Select workspace"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
        >
          {workspaces.map((w) => (
            <option key={w._id} value={w._id}>
              {w.name}
            </option>
          ))}
        </select>
      )}

      {/* Create workspace */}
      {creating ? (
        <div className="flex gap-2">
          <input
            autoFocus
            type="text"
            placeholder="Workspace name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
          />
          <button
            onClick={handleCreate}
            className="text-sm bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600"
          >
            Create
          </button>
          <button
            onClick={() => setCreating(false)}
            className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          + New Workspace
        </button>
      )}

      {/* Invite teammate */}
      {selected && (
        <div className="flex gap-2 items-center">
          <input
            type="email"
            placeholder="Invite by email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
          />
          <button
            onClick={handleInvite}
            disabled={inviting || !inviteEmail.trim()}
            className="text-sm bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {inviting ? "Sending..." : inviteSent ? "Sent! ✅" : "Invite"}
          </button>
        </div>
      )}
    </div>
  );
}