import { apiFetch } from "./client";
import type { HealthReading } from "../types/health-reading";

export async function getPatientHealthReadings(
  patientId: string,
  token: string,
): Promise<HealthReading[]> {
  return apiFetch<HealthReading[]>(
    `/patients/${patientId}/health-readings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}


export async function getHealthReading(
  readingId: string,
  token: string,
): Promise<HealthReading> {
  return apiFetch<HealthReading>(
    `/patients/health-readings/${readingId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}