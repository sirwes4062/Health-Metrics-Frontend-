import {
  Users,
  BarChart2,
  Heart,
  AlertTriangle,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import PatientHistoryTable from "@/components/PatientHistoryTable";
import HardwareSessionStatusSync from "@/components/HardwareSessionStatusSync";

import { getDashboardData } from "../../../services/api";

export default async function AdminDashboard() {
  const patients = await getDashboardData();
  const activePatientId =
    patients.find((patient) => patient.hardwareSessionActive)?.id ?? null;
  const ages = patients
    .map((patient) => patient.age)
    .filter(
      (age): age is number =>
        typeof age === "number" &&
        Number.isInteger(age) &&
        age >= 0 &&
        age <= 120,
    );
  const ageGroups = [
    {
      label: "0-17",
      count: ages.filter((age) => age < 18).length,
      color: "bg-blue-600",
    },
    {
      label: "18-44",
      count: ages.filter((age) => age >= 18 && age < 45).length,
      color: "bg-blue-500",
    },
    {
      label: "45-64",
      count: ages.filter((age) => age >= 45 && age < 65).length,
      color: "bg-blue-400",
    },
    {
      label: "65+",
      count: ages.filter((age) => age >= 65).length,
      color: "bg-blue-300",
    },
  ];
  const latestHeartRates = patients
    .map((patient) => patient.latestVital?.heartRate)
    .filter((heartRate): heartRate is number => Number.isFinite(heartRate));
  const averageHeartRate =
    latestHeartRates.length > 0 ?
      Math.round(
        latestHeartRates.reduce((total, heartRate) => total + heartRate, 0) /
          latestHeartRates.length,
      )
    : null;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 p-6 lg:p-8 relative pb-24">
      <HardwareSessionStatusSync activePatientId={activePatientId} />
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl shadow-sm"></div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
              PulseLink
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Clinical Systems
            </span>
          </div>
        </div>

        <LogoutButton />
      </header>

      {/* TOP METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Users */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Registered
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Users
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900">
            {patients.length.toLocaleString()}
          </h2>
        </div>

        {/* Age Dist */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Age Distribution
            </p>
            <BarChart2 className="h-4 w-4 text-slate-400" />
          </div>
          <div className="space-y-4">
            {ageGroups.map((group) => {
              const percentage =
                ages.length > 0 ?
                  Math.round((group.count / ages.length) * 100)
                : 0;

              return (
                <div key={group.label}>
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1.5">
                    <span>{group.label}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${group.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <p className="text-[10px] text-slate-400">
              Based on {ages.length} of {patients.length} patients with age
              recorded
            </p>
          </div>
        </div>

        {/* Avg Heart Rate */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <div className="h-10 w-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center">
              <Heart className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Avg Heart Rate
          </p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-3xl font-extrabold text-slate-900">
              {averageHeartRate ?? "--"}
            </h2>
            <span className="text-xs font-bold text-slate-400">BPM</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            From {latestHeartRates.length} latest patient reading
            {latestHeartRates.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Alerts / Warnings */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <div className="h-10 w-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
              -2% ↘
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Alerts/Warnings
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900">14</h2>
        </div>
      </div>

      {/* MIDDLE SECTION: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Heart Rate Analytics (Line Chart) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col min-h-100">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Heart Rate Analytics
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                Real-time clinical parameter tracking (BPM)
              </p>
            </div>
            <div className="flex bg-slate-100 rounded-full p-1">
              <button className="px-5 py-1.5 text-xs font-bold text-slate-500 rounded-full">
                Daily
              </button>
              <button className="px-5 py-1.5 text-xs font-bold bg-blue-700 text-white rounded-full shadow-sm">
                Weekly
              </button>
            </div>
          </div>

          <div className="flex-1 relative w-full flex flex-col justify-end mt-4">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none mb-6">
              <div className="border-t border-slate-100 border-dashed w-full h-0"></div>
              <div className="border-t border-slate-100 border-dashed w-full h-0"></div>
              <div className="border-t border-slate-100 border-dashed w-full h-0"></div>
            </div>

            {/* SVG Spline Chart */}
            <div className="relative w-full h-50 mb-4">
              <svg
                viewBox="0 0 800 200"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none">
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 150 C 100 150, 150 170, 250 140 C 350 110, 400 40, 500 110 C 600 180, 650 150, 750 60 L 800 50 L 800 200 L 0 200 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M 0 150 C 100 150, 150 170, 250 140 C 350 110, 400 40, 500 110 C 600 180, 650 150, 750 60 L 800 50"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
                {/* Data Points */}
                <circle
                  cx="200"
                  cy="155"
                  r="4"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="450"
                  cy="72"
                  r="4"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="800"
                  cy="50"
                  r="4"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">
              <span>60 BPM</span>
              <span>70 BPM</span>
              <span>80 BPM</span>
              <span>90 BPM</span>
              <span>100 BPM</span>
              <span>110 BPM</span>
              <span>120 BPM</span>
            </div>
          </div>
        </div>

        {/* Health Status (Donut Chart) */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-extrabold text-slate-900">
              Health Status
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              Patient distribution by status
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Donut Chart (CSS Conic Gradient) */}
            <div
              className="w-48 h-48 rounded-full relative flex items-center justify-center mb-8"
              style={{
                background: `conic-gradient(
                  #059669 0% 72%, 
                  #1d4ed8 72% 90%, 
                  #dc2626 90% 100%
                )`,
              }}>
              {/* Inner White Circle */}
              <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl font-extrabold text-slate-900">
                  100%
                </span>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider">
                  MONITORED
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-3 px-4">
              <div className="flex justify-between items-center text-sm font-semibold">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>{" "}
                  Healthy
                </div>
                <span className="text-slate-900 font-bold">72%</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-700"></span>{" "}
                  In-Review
                </div>
                <span className="text-slate-900 font-bold">18%</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-600"></span>{" "}
                  Critical
                </div>
                <span className="text-slate-900 font-bold">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PatientHistoryTable patients={patients} />
    </div>
  );
}
