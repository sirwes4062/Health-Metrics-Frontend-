export interface HealthReading {
  id: string;
  patientId: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  heartRate: number;
  temperature: number;
  spo2: number;
  createdAt: string;
}