// app/api/analytics/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // 1. Tasks by status
    const byStatus = await Task.aggregate([
      { $match: { userId: session.user.id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // 2. Tasks by priority
    const byPriority = await Task.aggregate([
      { $match: { userId: session.user.id } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    // 3. Tasks created last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const byDay = await Task.aggregate([
      {
        $match: {
          userId: session.user.id,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format for Recharts
    const statusData = [
      { name: "Todo", value: 0 },
      { name: "In Progress", value: 0 },
      { name: "Done", value: 0 },
    ].map((item) => {
      const found = byStatus.find(
        (s) =>
          s._id ===
          item.name.toLowerCase().replace(" ", "-")
      );
      return { ...item, value: found?.count || 0 };
    });

    const priorityData = [
      { name: "Low", value: 0 },
      { name: "Medium", value: 0 },
      { name: "High", value: 0 },
    ].map((item) => {
      const found = byPriority.find(
        (p) => p._id === item.name.toLowerCase()
      );
      return { ...item, value: found?.count || 0 };
    });

    // Fill missing days with 0
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const trendData = last7Days.map((date) => {
      const found = byDay.find((d) => d._id === date);
      return {
        date: date.slice(5), // show MM-DD only
        tasks: found?.count || 0,
      };
    });

    return NextResponse.json({ statusData, priorityData, trendData });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}