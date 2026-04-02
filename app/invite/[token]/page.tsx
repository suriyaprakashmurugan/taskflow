// app/invite/[token]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function InvitePage() {
  const { token } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [workspaceName, setWorkspaceName] = useState("");

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    // Not logged in — redirect to login then back here
    if (!session) {
      signIn("github", { callbackUrl: `/invite/${token}` });
      return;
    }

    // Accept the invite
    const acceptInvite = async () => {
      try {
        const res = await fetch(`/api/invite/${token}`, {
          method: "POST",
        });

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        setWorkspaceName(data.workspaceName);
        setState("success");

        // Redirect to dashboard after 2 seconds
        setTimeout(() => router.push("/dashboard"), 2000);
      } catch {
        setState("error");
      }
    };

    acceptInvite();
  }, [session, status, token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-sm w-full text-center">
        {state === "loading" && (
          <>
            <div className="text-3xl mb-4">⏳</div>
            <p className="text-gray-500">Joining workspace...</p>
          </>
        )}
        {state === "success" && (
          <>
            <div className="text-3xl mb-4">🎉</div>
            <h2 className="font-bold text-gray-800 mb-2">You're in!</h2>
            <p className="text-gray-500">
              Joined <strong>{workspaceName}</strong>. Redirecting...
            </p>
          </>
        )}
        {state === "error" && (
          <>
            <div className="text-3xl mb-4">❌</div>
            <h2 className="font-bold text-gray-800 mb-2">Invalid invite</h2>
            <p className="text-gray-500">
              This invite link is invalid or expired.
            </p>
          </>
        )}
      </div>
    </div>
  );
}