// app/api/invite/[token]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Workspace from "@/models/Workspace";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const workspace = await Workspace.findOne({ inviteToken: token });
    if (!workspace) {
      return NextResponse.json(
        { error: "Invalid invite link" },
        { status: 404 }
      );
    }

    // Check if already a member
    const alreadyMember = workspace.members
      .map(String)
      .includes(session.user.id);

    if (!alreadyMember) {
      workspace.members.push(session.user.id as any);
      await workspace.save();
    }

    return NextResponse.json({
      workspaceId: String(workspace._id),
      workspaceName: workspace.name,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to join workspace" },
      { status: 500 }
    );
  }
}