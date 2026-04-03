// components/AnalyticsDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface AnalyticsData {
  statusData: { name: string; value: number }[];
  priorityData: { name: string; value: number }[];
  trendData: { date: string; tasks: number }[];
}

const STATUS_COLORS = ["#94a3b8", "#3b82f6", "#22c55e"];
const PRIORITY_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-gray-400 py-8 text-center">
        Loading analytics...
      </div>
    );
  }

  if (!data) return null;

  const totalTasks = data.statusData.reduce((sum, s) => sum + s.value, 0);
  const doneTasks = data.statusData.find((s) => s.name === "Done")?.value || 0;
  const completionRate = totalTasks
    ? Math.round((doneTasks / totalTasks) * 100)
    : 0;

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={totalTasks} color="bg-blue-50 text-blue-600" />
        <StatCard label="Done" value={doneTasks} color="bg-green-50 text-green-600" />
        <StatCard
          label="In Progress"
          value={data.statusData.find((s) => s.name === "In Progress")?.value || 0}
          color="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          label="Completion"
          value={`${completionRate}%`}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Tasks by Status — Pie */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            By Status
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data.statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {data.statusData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex justify-center gap-3 mt-2">
            {data.statusData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: STATUS_COLORS[i] }}
                />
                <span className="text-xs text-gray-500">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks by Priority — Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            By Priority
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.priorityData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.priorityData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 7 Day Trend — Line */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Last 7 Days
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data.trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Reusable stat card
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className={`${color} rounded-2xl p-4`}>
      <p className="text-xs font-medium opacity-70">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}