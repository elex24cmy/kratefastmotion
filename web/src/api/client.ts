import { authHeaders } from "./auth.js";

const BASE = "/api";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(method: string, path: string, body?: unknown, timeoutMs?: number): Promise<T> {
  // An optional timeout lets short probes (e.g. health) fail fast and retry
  // instead of hanging while the backend finishes a cold start.
  const ctrl = timeoutMs ? new AbortController() : undefined;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : undefined;
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: body
        ? { "Content-Type": "application/json", ...authHeaders() }
        : { ...authHeaders() },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl?.signal,
    });
    if (!res.ok) {
      let msg = res.statusText;
      try {
        const j = await res.json();
        msg = j.error || msg;
      } catch {
        /* ignore */
      }
      if (res.status === 401) {
        msg = "unauthorized — set your KRATEFASTMOTION_API_KEY to access the backend";
      }
      throw new ApiError(res.status, msg);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export const apiGet = <T>(path: string): Promise<T> => request<T>("GET", path);
export const apiGetWithTimeout = <T>(path: string, timeoutMs: number): Promise<T> =>
  request<T>("GET", path, undefined, timeoutMs);
export const apiPost = <T>(path: string, body?: unknown): Promise<T> => request<T>("POST", path, body);
export const apiPut = <T>(path: string, body?: unknown): Promise<T> => request<T>("PUT", path, body);
export const apiPatch = <T>(path: string, body?: unknown): Promise<T> => request<T>("PATCH", path, body);
export const apiDelete = <T>(path: string, body?: unknown): Promise<T> => request<T>("DELETE", path, body);
