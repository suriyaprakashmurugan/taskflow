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

const STATUS_COLORS = ["#3b82f6", "#f59e0b", "#10b981"];
const PRIORITY_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    background: "#1c2130",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#f1f5f9",
    fontSize: 12,
  },
  cursor: { fill: "rgba(255,255,255,0.04)" },
};

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "32px 0",
          color: "var(--text-muted)",
          fontSize: 13,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "2px solid var(--border-default)",
            borderTopColor: "var(--accent-indigo)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        Loading analytics…
      </div>
    );
  }

  if (!data) return null;

  const totalTasks = data.statusData.reduce((sum, s) => sum + s.value, 0);
  const doneTasks = data.statusData.find((s) => s.name === "Done")?.value || 0;
  const inProgressTasks =
    data.statusData.find((s) => s.name === "In Progress")?.value || 0;
  const completionRate = totalTasks
    ? Math.round((doneTasks / totalTasks) * 100)
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 14,
        }}
      >
        <StatCard
          label="Total Tasks"
          value={totalTasks}
          accentColor="#6366f1"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          }
        />
        <StatCard
          label="Done"
          value={doneTasks}
          accentColor="#10b981"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <StatCard
          label="In Progress"
          value={inProgressTasks}
          accentColor="#f59e0b"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <StatCard
          label="Completion"
          value={`${completionRate}%`}
          accentColor="#8b5cf6"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {/* By Status — Pie */}
        <div className="stat-card">
          <h3
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 16,
            }}
          >
            By Status
          </h3>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                data={data.statusData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
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
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE.contentStyle}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 14,
              marginTop: 8,
              flexWrap: "wrap",
            }}
          >
            {data.statusData.map((item, i) => (
              <div
                key={item.name}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: STATUS_COLORS[i],
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{ fontSize: 11, color: "var(--text-secondary)" }}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* By Priority — Bar */}
        <div className="stat-card">
          <h3
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 16,
            }}
          >
            By Priority
          </h3>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={data.priorityData} barSize={28}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE.contentStyle} cursor={CHART_TOOLTIP_STYLE.cursor} />
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

        {/* 7-Day Trend — Line */}
        <div className="stat-card">
          <h3
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 16,
            }}
          >
            Last 7 Days
          </h3>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={data.trendData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE.contentStyle} cursor={CHART_TOOLTIP_STYLE.cursor} />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#8b5cf6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accentColor,
  icon,
}: {
  label: string;
  value: number | string;
  accentColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="stat-card"
      style={{
        borderLeft: `3px solid ${accentColor}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 60,
          background: `linear-gradient(90deg, ${accentColor}18, transparent)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </p>
        <span style={{ color: accentColor, opacity: 0.7 }}>{icon}</span>
      </div>
      <p
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.2,
          marginTop: 8,
          position: "relative",
        }}
      >
        {value}
      </p>
    </div>
  );
}