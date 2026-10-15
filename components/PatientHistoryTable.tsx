"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PatientTableRow from "./PatientTableRow";
import type { PatientWithVitals } from "@/services/api";

const PATIENTS_PER_PAGE = 10;

export default function PatientHistoryTable({
  patients,
}: {
  patients: PatientWithVitals[];
}) {
  const [showAllPatients, setShowAllPatients] = useState(false);
  const sortedPatients = [...patients].sort(
    (a, b) => Number(b.hardwareSessionActive) - Number(a.hardwareSessionActive),
  );
  const visiblePatients =
    showAllPatients ? sortedPatients : sortedPatients.slice(0, PATIENTS_PER_PAGE);

  return (
    <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Recent Vitals
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            Live feed from connected clinical device
          </p>
        </div>
        {patients.length > PATIENTS_PER_PAGE && (
          <button
            type="button"
            onClick={() => setShowAllPatients((showAll) => !showAll)}
            aria-expanded={showAllPatients}
            className="flex items-center cursor-pointer gap-1 text-sm font-bold text-blue-700 hover:text-blue-800 transition-colors whitespace-nowrap"
          >
            {showAllPatients ?
              <>
                <ArrowLeft className="h-4 w-4" />
                Show Less
              </>
            : <>
                Show More
                <ArrowRight className="h-4 w-4" />
              </>
            }
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                User Name
              </th>
              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Weight
              </th>
              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Height
              </th>
              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                BMI
              </th>
              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Heart Rate
              </th>
              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Temperature
              </th>
              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                spo2
              </th>
              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Status
              </th>
              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Timestamp
              </th>
              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold text-slate-900">
            {visiblePatients.map((patient, index) => (
              <PatientTableRow
                key={patient.id}
                patient={patient}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
