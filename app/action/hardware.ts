'use server'

import { cookies } from 'next/headers'

export async function startHardwareSession(patientId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    throw new Error('Unauthorized: No access token found')
  }

  const res = await fetch('http://localhost:5000/hardware-session/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ patientId }),
  })

  if (!res.ok) {
    throw new Error(`Failed to start hardware session: ${res.statusText}`)
  }

  return await res.json()
}