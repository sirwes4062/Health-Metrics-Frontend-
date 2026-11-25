"use client";

import { useState } from "react";
import { Check, Loader2, Mail } from "lucide-react";

interface SendReportButtonProps {
  patientId: string;
}

export default function SendReportButton({ patientId }: SendReportButtonProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleSend = async () => {
    setStatus("sending");
    setMessage(null);

    try {
      const res = await fetch(`/api/patients/${patientId}/send-report`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send email");
      }

      setStatus("sent");
      setMessage(`Sent to ${data.sentTo}`);

      setTimeout(() => {
        setStatus("idle");
        setMessage(null);
      }, 4000);
    } catch (err: unknown) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Could not send email report",
      );
    }
  };

  return (
    <div className="flex flex-col items-end flex-1 md:flex-none">
      <button
        type="button"
        onClick={handleSend}
        disabled={status === "sending"}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors w-full md:w-auto justify-center disabled:opacity-60 ${
          status === "sent" ?
            "bg-emerald-600 hover:bg-emerald-700 text-white"
          : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}>
        {status === "sending" ?
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        : status === "sent" ?
          <>
            <Check className="h-4 w-4" />
            Sent!
          </>
        : <>
            <Mail className="h-4 w-4" />
            Send to Email
          </>
        }
      </button>

      {message && (
        <span
          className={`mt-1 text-[11px] font-medium ${
            status === "error" ? "text-red-500" : "text-emerald-600"
          }`}>
          {message}
        </span>
      )}
    </div>
  );
}
