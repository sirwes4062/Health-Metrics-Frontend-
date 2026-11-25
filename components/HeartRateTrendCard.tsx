"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type TimeRange = "1W" | "1M" | "3M";

export interface HeartRateReading {
  id: string;
  heartRate: number;
  createdAt: string;
}

interface ChartPoint {
  date: string;
  fullDate: string;
  heartRate: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: ChartPoint;
  }>;
}

interface HeartRateTrendCardProps {
  readings: HeartRateReading[];
  className?: string;
}

const RANGES: readonly TimeRange[] = ["1W", "1M", "3M"];

const RANGE_DAYS: Record<TimeRange, number> = {
  "1W": 7,
  "1M": 30,
  "3M": 90,
};

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const value = payload[0].value;
  const fullDate = payload[0].payload?.fullDate;

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-center text-[10px] font-bold text-white shadow-xl">
        <span className="text-xs">{value} bpm</span>
        {fullDate && (
          <span className="block font-medium text-slate-400">{fullDate}</span>
        )}
      </div>
      <div className="h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-slate-900" />
    </div>
  );
}

export default function HeartRateTrendCard({
  readings,
  className = "",
}: HeartRateTrendCardProps) {
  const [range, setRange] = useState<TimeRange>("1W");

  const chartData = useMemo<ChartPoint[]>(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RANGE_DAYS[range]);

    return readings
      .filter(
        (r) =>
          typeof r.heartRate === "number" &&
          Number.isFinite(r.heartRate) &&
          new Date(r.createdAt) >= cutoff,
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .map((r) => {
        const d = new Date(r.createdAt);
        return {
          date: d
            .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
            .toUpperCase(),
          fullDate: d.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          heartRate: r.heartRate,
        };
      });
  }, [readings, range]);

  return (
    <div
      className={`bg-white rounded-4xl p-8 shadow-sm border border-slate-100/50 flex flex-col justify-between min-h-87.5 ${className}`}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">
            Heart Rate Trend
          </h3>
          <p className="text-[11px] text-slate-400 font-semibold">
            Detailed physiological spline tracking
          </p>
        </div>

        <div className="flex gap-2 bg-slate-50 p-1 rounded-lg">
          {RANGES.map((item) => {
            const isActive = range === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setRange(item)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${
                  isActive ?
                    "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
                }`}>
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full h-60 mt-6">
        {chartData.length === 0 ?
          <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-400">
            No heart rate readings recorded in the last {RANGE_DAYS[range]}{" "}
            days.
          </div>
        : <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 24, right: 12, left: 12, bottom: 0 }}>
              <defs>
                <linearGradient
                  id="patientHrGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="#f1f5f9" />

              <XAxis
                dataKey="date"
                axisLine={{ stroke: "#f1f5f9" }}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                dy={10}
              />

              <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />

              <Tooltip content={<CustomTooltip />} cursor={false} offset={14} />

              <Area
                type="monotone"
                dataKey="heartRate"
                stroke="#bfdbfe"
                strokeWidth={3.5}
                fill="url(#patientHrGradient)"
                dot={
                  chartData.length === 1 ?
                    {
                      r: 5,
                      fill: "#1d4ed8",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }
                  : false
                }
                activeDot={{
                  r: 5,
                  fill: "#1d4ed8",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        }
      </div>
    </div>
  );
}
