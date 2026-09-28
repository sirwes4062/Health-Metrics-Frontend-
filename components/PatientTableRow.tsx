"use client";

import { useRouter } from "next/navigation";
import HardwareSessionButton from "./HardwareSessionButton";

// Import or define your patient type here if using TypeScript
export default function PatientTableRow({
  patient,
  index,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patient: any;
  index: number;
}) {
  const router = useRouter();

  // Helper Functions
  const getInitials = (name: string) => {
    if (!name) return "PT";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const timeAgo = (dateString: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) / 1000,
    );
    if (seconds < 60) return `${seconds} secs ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const avatarColors = [
    "bg-blue-100 text-blue-700",
    "bg-fuchsia-100 text-fuchsia-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
  ];
  const colorClass = avatarColors[index % avatarColors.length];

  return (
    <tr
      // 1. This triggers the navigation when any part of the row is clicked
      onClick={() => router.push(`/dashboard/patient/${patient.id}`)}
      className="border-b border-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
      <td className="py-5 flex items-center gap-3">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${colorClass}`}>
          {getInitials(patient.fullName)}
        </div>
        {/* Added group-hover to slightly highlight the name when hovering the row */}
        <span className="group-hover:text-blue-600 transition-colors">
          {patient.fullName}
        </span>
      </td>

      <td className="py-5">
        {patient.latestVital?.weightKg || "--"}
        <span className="text-[10px] text-slate-400 ml-1">kg</span>
      </td>
      <td className="py-5">
        {patient.latestVital?.heightCm || "--"}{" "}
        <span className="text-[10px] text-slate-400">cm</span>
      </td>
      <td className="py-5">
        {patient.latestVital?.bmi || "--"}{" "}
        <span className="text-[10px] text-slate-400">kg/m²</span>
      </td>
      <td className="py-5 text-emerald-600">
        {patient.latestVital?.heartRate || "--"}{" "}
        <span className="text-[10px] text-slate-400">bpm</span>
      </td>
      <td className="py-5">
        {patient.latestVital?.temperature || "--"}
        <span className="text-[10px] text-slate-400">°C</span>
      </td>
      <td className="py-5">{patient.latestVital?.spo2 || "--"}</td>

      <td className="py-5">
        {patient.latestVital ?
          <span className="bg-emerald-50 text-emerald-600 text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider">
            Active
          </span>
        : <span className="bg-slate-100 text-slate-500 text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider">
            Inactive
          </span>
        }
      </td>

      <td className="py-5 text-slate-400 font-semibold">
        {patient.latestVital ? timeAgo(patient.latestVital.createdAt) : "--"}
      </td>

      {/* 2. Stop Propagation: Prevents the row click from firing when the button is clicked */}
      <td className="py-5 text-right" onClick={(e) => e.stopPropagation()}>
        <HardwareSessionButton patientId={patient.id} />
      </td>
    </tr>
  );
}
