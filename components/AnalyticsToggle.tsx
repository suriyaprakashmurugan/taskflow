// components/AnalyticsToggle.tsx
"use client";

import { useState } from "react";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default function AnalyticsToggle() {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setShow(!show)}
        className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition mb-4"
      >
        {show ? "Hide Analytics ↑" : "Show Analytics ↓"}
      </button>
      {show && <AnalyticsDashboard />}
    </div>
  );
}