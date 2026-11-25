"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ActivitySquare,
  Heart,
  RefreshCw,
  Utensils,
} from "lucide-react";

type RiskLevel = "LOW" | "MODERATE" | "HIGH";

interface AiHealthSummary {
  overview: string;
  riskLevel: RiskLevel;
  riskIndicator: string;
  dietaryRecommendation: string;
  exercisePlan: string;
  basedOnReadingsCount: number;
  generatedAt: string;
}

interface AiHealthSummaryCardProps {
  patientId: string;
  patientName: string;
}

const RISK_BADGE_STYLES: Record<RiskLevel, string> = {
  LOW: "bg-emerald-400 text-emerald-950",
  MODERATE: "bg-amber-400 text-amber-950",
  HIGH: "bg-red-500 text-white",
};

async function requestAiSummary(
  patientId: string,
  signal?: AbortSignal,
): Promise<AiHealthSummary> {
  const res = await fetch(`/api/patients/${patientId}/ai-summary`, {
    cache: "no-store",
    signal,
  });

  if (!res.ok) {
    throw new Error(`Unable to generate summary (${res.status})`);
  }

  return res.json() as Promise<AiHealthSummary>;
}

export default function AiHealthSummaryCard({
  patientId,
  patientName,
}: AiHealthSummaryCardProps) {
  const [summary, setSummary] = useState<AiHealthSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    async function loadInitialSummary() {
      try {
        const data = await requestAiSummary(patientId, controller.signal);
        setSummary(data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(
          err instanceof Error ?
            err.message
          : "Failed to load AI health summary.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadInitialSummary();

    return () => controller.abort();
  }, [patientId]);

  const handleRefresh = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await requestAiSummary(patientId, controller.signal);
      setSummary(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(
        err instanceof Error ?
          err.message
        : "Failed to load AI health summary.",
      );
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-blue-600 rounded-4xl p-8 shadow-lg text-white flex flex-col justify-between h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                <ActivitySquare className="h-5 w-5 text-blue-100" />
              </div>
              <h3 className="text-lg font-bold">AI Health Summary</h3>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              title="Regenerate AI Summary"
              className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-50">
              <RefreshCw
                className={`h-4 w-4 text-blue-100 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {/* Body */}
          {loading ?
            <div className="space-y-4 animate-pulse">
              <div className="space-y-2 mb-6">
                <div className="h-3 bg-white/20 rounded w-full" />
                <div className="h-3 bg-white/20 rounded w-5/6" />
                <div className="h-3 bg-white/20 rounded w-4/6" />
              </div>
              <div className="h-16 bg-white/10 rounded-2xl" />
              <div className="h-16 bg-white/10 rounded-2xl" />
              <div className="h-16 bg-white/10 rounded-2xl" />
            </div>
          : error ?
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 text-xs">
              <p className="text-blue-100 mb-3">{error}</p>
              <button
                type="button"
                onClick={handleRefresh}
                className="bg-white text-blue-700 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-blue-50 transition-colors">
                Try Again
              </button>
            </div>
          : summary ?
            <>
              <p className="text-sm text-blue-100 leading-relaxed mb-6 font-medium">
                {summary.overview.replace(/^The patient/i, patientName)}
              </p>

              <div className="space-y-3">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-2">
                      <Activity className="h-3 w-3" /> Risk Indicator
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider ${RISK_BADGE_STYLES[summary.riskLevel]}`}>
                      {summary.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-white">
                    {summary.riskIndicator}
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-2 mb-1">
                    <Utensils className="h-3 w-3" /> Dietary Recommendation
                  </span>
                  <p className="text-xs font-medium text-white">
                    {summary.dietaryRecommendation}
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-2 mb-1">
                    <Heart className="h-3 w-3" /> Exercise Plan
                  </span>
                  <p className="text-xs font-medium text-white">
                    {summary.exercisePlan}
                  </p>
                </div>
              </div>
            </>
          : null}
        </div>
      </div>
    </div>
  );
}
