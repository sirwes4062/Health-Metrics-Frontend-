"use client";

import { useState } from "react";
import { Loader2, Printer } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PatientInfo {
  fullName: string;
  age?: number | string | null;
  gender?: string | null;
  bloodGroup?: string | null;
}

interface VitalReading {
  id: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  heartRate: number;
  temperature: number;
  spo2: number;
  createdAt: string;
}

interface PrintReportButtonProps {
  patient: PatientInfo;
  vitals: VitalReading[];
}

function formatDateTime(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export default function PrintReportButton({
  patient,
  vitals,
}: PrintReportButtonProps) {
  const [generating, setGenerating] = useState(false);

  const handleDownloadPdf = () => {
    setGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const latestVital = vitals.length > 0 ? vitals[0] : null;
      const generatedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date());

      // 1. Top Blue Header Banner
      doc.setFillColor(37, 99, 235); // Tailwind blue-600
      doc.rect(0, 0, pageWidth, 32, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("PulseLink Clinical Systems", 14, 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Patient Physiological Health Report", 14, 22);
      doc.text(`Generated: ${generatedDate}`, pageWidth - 14, 22, {
        align: "right",
      });

      // 2. Patient Profile Section
      doc.setTextColor(15, 23, 42); // slate-900
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(patient.fullName, 14, 44);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text(
        `Age: ${patient.age ?? "--"} yrs   |   Gender: ${patient.gender ?? "--"}   |   Blood Group: ${patient.bloodGroup ?? "--"}`,
        14,
        51,
      );
      doc.text(
        `Last Visit: ${latestVital ? formatDateTime(latestVital.createdAt) : "No records"}`,
        14,
        57,
      );

      // 3. Latest Vitals Summary Table
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Latest Recorded Vitals", 14, 68);

      autoTable(doc, {
        startY: 72,
        head: [
          ["Height", "Weight", "BMI", "Heart Rate", "Temperature", "SpO2"],
        ],
        body: [
          latestVital ?
            [
              `${latestVital.heightCm} cm`,
              `${latestVital.weightKg} kg`,
              `${latestVital.bmi} kg/m²`,
              `${latestVital.heartRate} bpm`,
              `${latestVital.temperature} °C`,
              `${latestVital.spo2}%`,
            ]
          : ["--", "--", "--", "--", "--", "--"],
        ],
        theme: "grid",
        headStyles: {
          fillColor: [241, 245, 249], // slate-100
          textColor: [51, 65, 85], // slate-700
          fontStyle: "bold",
          fontSize: 9,
        },
        bodyStyles: {
          textColor: [15, 23, 42],
          fontStyle: "bold",
          fontSize: 10,
        },
      });

      // 4. Save the PDF file
      const safeName = patient.fullName.trim().replace(/\s+/g, "_");
      doc.save(`${safeName}_Health_Report.pdf`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownloadPdf}
      disabled={generating}
      className="cursor-pointer flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex-1 md:flex-none justify-center disabled:opacity-60">
      {generating ?
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      : <>
          <Printer className="h-4 w-4" />
          Print Report
        </>
      }
    </button>
  );
}
