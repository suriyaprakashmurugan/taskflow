// app/api/workspaces/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Workspace from "@/models/Workspace";
import crypto from "crypto";

// GET /api/workspaces — get all workspaces for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find workspaces where user is owner OR member
    const workspaces = await Workspace.find({
      $or: [
        { ownerId: session.user.id },
        { members: session.user.id },
      ],
    }).lean();

    const serialized = workspaces.map((w) => ({
      _id: String(w._id),
      name: String(w.name),
      ownerId: String(w.ownerId),
      inviteToken: String(w.inviteToken),
      members: w.members.map((m: any) => String(m)),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status: 500 }
    );
  }
}

// POST /api/workspaces — create a new workspace
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate a random invite token
    const inviteToken = crypto.randomBytes(16).toString("hex");

    const workspace = await Workspace.create({
      name: name.trim(),
      ownerId: session.user.id,
      members: [],
      inviteToken,
    });

    return NextResponse.json({
      _id: String(workspace._id),
      name: workspace.name,
      ownerId: String(workspace.ownerId),
      inviteToken: workspace.inviteToken,
      members: [],
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 }
    );
  }
}