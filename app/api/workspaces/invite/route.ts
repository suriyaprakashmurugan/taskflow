// app/api/workspaces/invite/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Workspace from "@/models/Workspace";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, workspaceId } = await request.json();

    if (!email || !workspaceId) {
      return NextResponse.json(
        { error: "Email and workspaceId required" },
        { status: 400 }
      );
    }

    await connectDB();

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // Only workspace owner can invite
    if (String(workspace.ownerId) !== session.user.id) {
      return NextResponse.json(
        { error: "Only the owner can invite members" },
        { status: 403 }
      );
    }

    const inviteUrl = `${process.env.NEXTAUTH_URL}/invite/${workspace.inviteToken}`;

    // Send email via Resend
    await resend.emails.send({
      from: "TaskFlow <onboarding@resend.dev>", // use this for testing
      to: email,
      subject: `You've been invited to ${workspace.name} on TaskFlow`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>You're invited to join <strong>${workspace.name}</strong></h2>
          <p>${session.user?.name} has invited you to collaborate on TaskFlow.</p>
          <a 
            href="${inviteUrl}" 
            style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;"
          >
            Accept Invitation
          </a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            If you didn't expect this email, you can ignore it.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Invite sent" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send invite" },
      { status: 500 }
    );
  }
}