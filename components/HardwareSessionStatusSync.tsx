"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getHardwareSessionPatientId } from "@/app/action/hardware";

export default function HardwareSessionStatusSync({
  activePatientId,
}: {
  activePatientId: string | null;
}) {
  const router = useRouter();
  const lastKnownPatientId = useRef(activePatientId);

  useEffect(() => {
    const intervalId = window.setInterval(async () => {
      try {
        const currentPatientId = await getHardwareSessionPatientId();
        if (currentPatientId !== lastKnownPatientId.current) {
          lastKnownPatientId.current = currentPatientId;
          router.refresh();
        }
      } catch (error) {
        console.error("Failed to refresh hardware session status:", error);
      }
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [router]);

  return null;
}
