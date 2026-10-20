const API_URL = process.env.NEST_API_URL;

export function getApiUrl(endpoint: string): string {
  if (!API_URL) {
    throw new Error("NEST_API_URL is not configured");
  }

  return `${API_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(getApiUrl(endpoint), {
    ...options,

    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `API request failed: ${response.status} ${errorBody}`,
    );
  }

  return response.json();
}