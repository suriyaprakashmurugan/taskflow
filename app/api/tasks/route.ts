// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

// GET /api/tasks — fetch all tasks for logged in user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    await connectDB();

    const query: any = { userId: session.user.id };
    if (workspaceId) query.workspaceId = workspaceId;

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 }); // newest first

    return NextResponse.json(tasks);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks — create a new task
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, status, priority, workspaceId } = body;

    // Basic validation
    if (!title || title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const task = await Task.create({
      title: title.trim(),
      description,
      status: status || "todo",
      priority: priority || "medium",
      userId: session.user.id,
      workspaceId, // 👈 included
    });

    return NextResponse.json(task, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}