import { apiFetch } from "./client";
import type { Patient } from "../types/patient";

export async function getPatients(
  token: string,
): Promise<Patient[]> {
  return apiFetch<Patient[]>("/patients", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}




export async function getPatient(
  patientId: string,
  token: string,
): Promise<Patient> {
  return apiFetch<Patient>(`/patients/${patientId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}