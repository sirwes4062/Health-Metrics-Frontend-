import {
  Activity,
  Bell,
  History,
  Printer,
  Heart,
  Thermometer,
  Scale,
  Search,
  ChevronDown,
  ArrowRight,
  Ruler,
  Weight,
} from "lucide-react";

import {
  getPatientProfile,
  getPatientHistoricalVitals,
  isHardwareSessionActiveForPatient,
} from "@/services/api";
import HardwareSessionStatusSync from "@/components/HardwareSessionStatusSync";
import HeartRateTrendCard from "@/components/HeartRateTrendCard";
import AiHealthSummaryCard from "@/components/AiHealthSummaryCard";
import SendReportButton from "@/components/SendReportButton";
import PrintReportButton from "@/components/PrintReportButton";

function getInitials(name: string) {
  if (!name) return "PT";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatTime(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export default async function PatientDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Await params to extract the ID from the URL (Next.js 15+ requirement)
  const { id } = await params;

  // 2. Fetch the specific patient's profile and their full history in parallel
  const [patient, vitals, isHardwareSessionActive] = await Promise.all([
    getPatientProfile(id),
    getPatientHistoricalVitals(id),
    isHardwareSessionActiveForPatient(id),
  ]);

  // 3. Handle the case where the patient ID doesn't exist
  if (!patient) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <h2 className="text-xl font-bold text-slate-500">
          Patient not found or unauthorized.
        </h2>
      </div>
    );
  }

  // 4. Get the most recent vital for the top summary cards
  const latestVital = vitals.length > 0 ? vitals[0] : null;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 p-4 md:p-8 relative pb-24">
      <HardwareSessionStatusSync
        activePatientId={isHardwareSessionActive ? id : null}
      />

      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
              PulseLink
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Clinical Systems
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-slate-400">
            <Bell className="h-5 w-5 cursor-pointer hover:text-slate-600" />
            <History className="h-5 w-5 cursor-pointer hover:text-slate-600" />
          </div>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-900 leading-none">
                Dr. Sarah Miller
              </div>
              <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mt-1">
                Attending Physician
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
              SM
            </div>
          </div>
        </div>
      </header>

      {/* PATIENT PROFILE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <div className="h-20 w-20 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
              {getInitials(patient.fullName)}
            </div>
            <span
              className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#f8fafc] ${
                isHardwareSessionActive ? "bg-emerald-600" : "bg-slate-500"
              }`}>
              {isHardwareSessionActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
              {patient.fullName}
            </h1>
            <div className="flex gap-4 text-xs font-semibold mt-2 text-slate-500 uppercase tracking-wide">
              <span>
                Age <br />
                <span className="text-slate-900">
                  {patient.age || "--"} Years
                </span>
              </span>
              <span>
                Gender <br />
                <span className="text-slate-900">
                  {patient.gender || "----"}
                </span>
              </span>
              <span>
                Blood <br />
                <span className="text-red-600">
                  {patient.bloodGroup || "-------"}
                </span>
              </span>
              <span>
                Last Visit <br />
                <span className="text-slate-900">
                  {latestVital ?
                    formatDate(latestVital.createdAt)
                  : "No records"}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <PrintReportButton patient={patient} vitals={vitals} />
          <SendReportButton patientId={id} />
        </div>
      </div>

      {/* VITALS GRID (Top Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {/* 1. HEIGHT */}
        <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100/50 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Ruler className="h-5 w-5" />
            </div>
            {latestVital && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                Recorded
              </span>
            )}
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Height
          </p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-extrabold text-slate-900">
              {latestVital?.heightCm || "--"}
            </h2>
            <span className="text-sm font-semibold text-slate-400">cm</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: latestVital ? "75%" : "0%" }}
            />
          </div>
        </div>

        {/* 2. WEIGHT */}
        <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100/50 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-2xl bg-teal-50 text-teal-500 flex items-center justify-center">
              <Weight className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Weight
          </p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-extrabold text-slate-900">
              {latestVital?.weightKg || "--"}
            </h2>
            <span className="text-sm font-semibold text-slate-400">kg</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4">
            <div
              className="h-full bg-teal-500 rounded-full"
              style={{ width: latestVital ? "65%" : "0%" }}
            />
          </div>
        </div>

        {/* 3. BMI */}
        <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100/50 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Scale className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            BMI
          </p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-extrabold text-slate-900">
              {latestVital?.bmi || "--"}
            </h2>
            <span className="text-sm font-semibold text-slate-400">kg/m²</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: latestVital ? "45%" : "0%" }}
            />
          </div>
        </div>

        {/* 4. HEART RATE */}
        <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100/50 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <Heart className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Heart Rate
          </p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-extrabold text-slate-900">
              {latestVital?.heartRate || "--"}
            </h2>
            <span className="text-sm font-semibold text-slate-400">bpm</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4">
            <div
              className="h-full bg-red-500 rounded-full"
              style={{ width: latestVital ? "60%" : "0%" }}
            />
          </div>
        </div>

        {/* 5. TEMPERATURE */}
        <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100/50 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Thermometer className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Temperature
          </p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-extrabold text-slate-900">
              {latestVital?.temperature || "--"}
            </h2>
            <span className="text-sm font-semibold text-slate-400">°C</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: latestVital ? "70%" : "0%" }}
            />
          </div>
        </div>

        {/* 6. SPO2 (OXYGEN) */}
        <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100/50 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Oxygen Saturation
          </p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-extrabold text-slate-900">
              {latestVital?.spo2 || "--"}
            </h2>
            <span className="text-sm font-semibold text-slate-400">%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: latestVital ? "85%" : "0%" }}
            />
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION (Chart & AI Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <HeartRateTrendCard readings={vitals} className="lg:col-span-2" />
        <AiHealthSummaryCard patientId={id} patientName={patient.fullName} />

        {/* AI Health Summary */}
        {/* <div className="bg-blue-600 rounded-4xl p-8 shadow-lg text-white flex flex-col justify-between h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                <ActivitySquare className="h-5 w-5 text-blue-100" />
              </div>
              <h3 className="text-lg font-bold">AI Health Summary</h3>
            </div>
            <p className="text-sm text-blue-100 leading-relaxed mb-6 font-medium">
              {patient.fullName} cardiovascular stability has improved by{" "}
              <strong className="text-white">4.2%</strong> since last month. BMI
              is within optimal range, but systolic pressure shows mild spikes
              during late evening hours.
            </p>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-2">
                    <Activity className="h-3 w-3" /> Risk Indicator
                  </span>
                  <span className="bg-amber-400 text-amber-950 text-[9px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    Moderate
                  </span>
                </div>
                <p className="text-xs font-medium text-white">
                  Late-stage hypertension risk based on sleep cycle data.
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-2 mb-1">
                  <Utensils className="h-3 w-3" /> Dietary Recommendation
                </span>
                <p className="text-xs font-medium text-white">
                  Increase magnesium-rich intake; reduce sodium to &lt;2g/day.
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-2 mb-1">
                  <Heart className="h-3 w-3" /> Exercise Plan
                </span>
                <p className="text-xs font-medium text-white">
                  30 min Low Intensity Steady State (LISS) cardio 4x/week.
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* HISTORICAL READINGS TABLE */}
      <div className="bg-white rounded-4xl p-8 shadow-sm border border-slate-100/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-lg font-extrabold text-slate-900">
            Historical Readings
          </h3>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search parameters or date"
                className="w-full bg-slate-50 border-none rounded-xl py-2 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <button className="flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors whitespace-nowrap">
              All Parameters <ChevronDown className="h-4 w-4" />
            </button>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-800 transition-colors whitespace-nowrap">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Date & Time
                </th>
                <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Weight
                </th>
                <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Height
                </th>
                <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  BMI
                </th>
                <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Heart Rate
                </th>
                <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Temperature
                </th>
                <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  SPO2
                </th>
                <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-semibold text-slate-900">
              {vitals.length === 0 ?
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-slate-400 font-medium">
                    No historical readings found for this patient.
                  </td>
                </tr>
              : vitals.map((vital) => (
                  <tr
                    key={vital.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <div className="block">{formatDate(vital.createdAt)}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {formatTime(vital.createdAt)}
                      </div>
                    </td>
                    <td className="py-4">
                      {vital.weightKg}{" "}
                      <span className="text-[10px] text-slate-400 ml-1">
                        kg
                      </span>
                    </td>
                    <td className="py-4">
                      {vital.heightCm}{" "}
                      <span className="text-[10px] text-slate-400">cm</span>
                    </td>
                    <td className="py-4">
                      {vital.bmi}{" "}
                      <span className="text-[10px] text-slate-400">kg/m²</span>
                    </td>
                    <td className="py-4">
                      {vital.heartRate}{" "}
                      <span className="text-[10px] text-slate-400">bpm</span>
                    </td>
                    <td className="py-4">
                      {vital.temperature}{" "}
                      <span className="text-[10px] text-slate-400">°C</span>
                    </td>
                    <td className="py-4">{vital.spo2}</td>
                    <td className="py-4">
                      {vital.temperature > 37.5 || vital.heartRate > 100 ?
                        <span className="bg-amber-100 text-amber-700 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                          Elevated
                        </span>
                      : <span className="bg-emerald-100 text-emerald-700 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                          Normal
                        </span>
                      }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {vitals.length > 0 && (
          <div className="mt-6 flex justify-center border-t border-slate-100 pt-6">
            <button className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors">
              View All Historical Data <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
