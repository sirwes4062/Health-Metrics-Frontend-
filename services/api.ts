import { cookies } from "next/headers";

export interface Patient {
  bloodGroup: string;
  gender?: string;
  age?: number;
  id: string;
  fullName: string;
  email: string;
}

export interface HealthReading {
  id: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  heartRate: number;
  temperature: number;
  spo2: number;
  createdAt: string;
}

export interface PatientWithVitals extends Patient {
  latestVital: HealthReading | null;
  hardwareSessionActive: boolean;
}

async function getActiveHardwarePatientId(token: string): Promise<string | null> {
  const res = await fetch("http://localhost:5000/hardware-session/active", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to fetch active hardware session: ${res.status}`);
  }

  const session: { patientId: string } = await res.json();
  return session.patientId;
}

export async function getCurrentActiveHardwarePatientId(): Promise<
  string | null
> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  return getActiveHardwarePatientId(token);
}

// ==========================================
// FETCH FUNCTIONS
// ==========================================
export async function getDashboardData(): Promise<PatientWithVitals[]> {
  // Grab the token directly from Next.js secure cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    console.log(
      "❌ DEBUG: No token found in cookies! Ensure your login function saves the cookie.",
    );
    return [];
  }

  const headers = { Authorization: `Bearer ${token}` };

  try {
    // Fetch the patient list and active session together.
    const [patientsRes, activePatientId] = await Promise.all([
      fetch("http://localhost:5000/patients", {
        headers,
        cache: "no-store",
      }),
      getActiveHardwarePatientId(token),
    ]);

    if (!patientsRes.ok) {
      console.log(
        `❌ DEBUG: Backend rejected request. Status: ${patientsRes.status}`,
      );
      return [];
    }

    const patients: Patient[] = await patientsRes.json();
    console.log(`✅ DEBUG: Successfully fetched ${patients.length} patients.`);

    // 2. Fetch the latest vital reading for each patient in parallel
    const patientsWithVitals = await Promise.all(
      patients.map(async (patient) => {
        const vitalsRes = await fetch(
          `http://localhost:5000/patients/${patient.id}/health-readings`,
          { headers, cache: "no-store" },
        );

        let latestVital = null;
        if (vitalsRes.ok) {
          const vitals: HealthReading[] = await vitalsRes.json();
          if (vitals.length > 0) {
            // Sort by date descending to get the absolute latest reading
            vitals.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
            latestVital = vitals[0];
          }
        } else {
          console.log(
            `⚠️ DEBUG: Could not fetch vitals for patient ${patient.id}. Status: ${vitalsRes.status}`,
          );
        }

        return {
          ...patient,
          latestVital,
          hardwareSessionActive: patient.id === activePatientId,
        };
      }),
    );

    return patientsWithVitals;
  } catch (error) {
    console.error("❌ Failed to fetch dashboard data:", error);
    return [];
  }
}

export async function isHardwareSessionActiveForPatient(
  patientId: string,
): Promise<boolean> {
  const activePatientId = await getCurrentActiveHardwarePatientId();
  return activePatientId === patientId;
}

// fetching a single patient's profile and their historical vitals.
export async function getPatientProfile(id: string): Promise<Patient | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`http://localhost:5000/patients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch patient ${id}:`, error);
    return null;
  }
}

export async function getPatientHistoricalVitals(
  id: string,
): Promise<HealthReading[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return [];

  try {
    const res = await fetch(
      `http://localhost:5000/patients/${id}/health-readings`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!res.ok) return [];

    const vitals: HealthReading[] = await res.json();
    // Sort from newest to oldest
    return vitals.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch (error) {
    console.error(`Failed to fetch vitals for patient ${id}:`, error);
    return [];
  }
}
