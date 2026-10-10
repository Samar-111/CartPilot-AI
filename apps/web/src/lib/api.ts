export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("cartpilot_token") : null;
  const headers = new Headers(options.headers || {});

  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
  } catch (netErr: any) {
    throw new Error(`Cannot reach backend at ${API_BASE}. Make sure the backend server is running and accessible.`);
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: `Server returned HTTP ${res.status}` }));
    throw new Error(errorBody.error || `HTTP ${res.status}`);
  }

  return res.json();
}
