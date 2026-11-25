"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ChartPoint {
  label: string;
  bpm: number;
}

interface StatusItem {
  name: string;
  value: number;
  color: string;
}

const normalizeStatusData = (raw: StatusItem[] = []): StatusItem[] => {
  const base: StatusItem[] = [
    { name: "Healthy", value: 100, color: "#0F9D7D" },
    { name: "In-Review", value: 0, color: "#2563EB" },
    { name: "Critical", value: 0, color: "#DC2626" },
  ];

  if (!raw.length) {
    return base;
  }

  const byName = new Map(raw.map((item) => [item.name, item]));
  const normalized = [
    {
      name: "Healthy",
      value: Number(byName.get("Healthy")?.value ?? 100),
      color: "#0F9D7D",
    },
    {
      name: "In-Review",
      value: Number(byName.get("In-Review")?.value ?? 0),
      color: "#2563EB",
    },
    {
      name: "Critical",
      value: Number(byName.get("Critical")?.value ?? 0),
      color: "#DC2626",
    },
  ];

  const total = normalized.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) {
    normalized[0].value = 100;
  }

  return normalized;
};

export default function DashboardCharts() {
  const [timeframe, setTimeframe] = useState<"Daily" | "Weekly">("Weekly");
  const [hrData, setHrData] = useState<{
    Daily: ChartPoint[];
    Weekly: ChartPoint[];
  }>({
    Daily: [],
    Weekly: [],
  });
  const [statusData, setStatusData] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics/overview", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        setHrData(data.heartRateAnalytics);
        setStatusData(normalizeStatusData(data.healthStatus));
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="grid w-full grid-cols-1 gap-6 my-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(240px,1fr)]">
        <div className="h-80 w-full bg-white rounded-2xl p-6 animate-pulse border border-gray-100" />
        <div className="h-80 w-full bg-white rounded-2xl p-6 animate-pulse border border-gray-100" />
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 my-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(240px,1fr)]">
      {/* LEFT CARD: Heart Rate Analytics */}
      <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Heart Rate Analytics
            </h2>
            <p className="text-xs text-gray-500">
              Real-time clinical parameter tracking (BPM)
            </p>
          </div>

          {/* Daily / Weekly Pill Toggle */}
          <div className="flex bg-gray-100 rounded-full p-1 text-xs font-semibold">
            <button
              onClick={() => setTimeframe("Daily")}
              className={`px-4 py-1.5 rounded-full transition-all ${
                timeframe === "Daily" ?
                  "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
              }`}>
              Daily
            </button>
            <button
              onClick={() => setTimeframe("Weekly")}
              className={`px-4 py-1.5 rounded-full transition-all ${
                timeframe === "Weekly" ?
                  "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
              }`}>
              Weekly
            </button>
          </div>
        </div>

        {/* Smooth Gradient Area Chart */}
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={hrData[timeframe]}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="bpmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 600 }}
                dy={10}
              />
              <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  color: "#fff",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "#60A5FA" }}
              />
              <Area
                type="monotone"
                dataKey="bpm"
                stroke="#3B82F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#bpmGradient)"
                activeDot={{
                  r: 5,
                  fill: "#2563EB",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RIGHT CARD: Health Status Donut Chart */}
      <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Health Status</h2>
          <p className="text-xs text-gray-500">
            Patient distribution by status
          </p>
        </div>

        {/* Donut Chart with Centered Label */}
        <div className="h-48 w-full relative flex items-center justify-center my-2">
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-gray-900">100%</span>
            <span className="text-[10px] tracking-widest text-gray-400 font-bold uppercase">
              MONITORED
            </span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Legend */}
        <div className="space-y-2.5 mt-2">
          {statusData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2 text-gray-600">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
              <span className="text-gray-900 font-bold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
