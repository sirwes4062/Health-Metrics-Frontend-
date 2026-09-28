"use client";

import { useState } from "react";
import { startHardwareSession } from "../app/action/hardware";

export default function HardwareSessionButton({
  patientId,
}: {
  patientId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleTakeVitals = async () => {
    setLoading(true);
    try {
      await startHardwareSession(patientId);
      alert("Hardware activated. The ESP32 is now polling for this session.");
    } catch (error) {
      console.error(error);
      alert("Failed to connect to hardware.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleTakeVitals}
      disabled={loading}
      className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
      {loading ? "Activating..." : "Take Measurement"}
    </button>
  );
}
