import cors from "cors";
import { config } from "../../config.js";

/** Hostnames that mean "this machine" for a locally hosted editor. */
const LOOPBACK_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

/**
 * Build the default origin allowlist.
 *
 * The editor runs in two shapes:
 *  - dev:  Vite serves the UI on :4000 and calls the API on :7000
 *  - prod: the API server also serves the built UI on :PORT
 *
 * In the prod shape the browser fetches the bundle with `crossorigin`, which
 * sends an Origin header even though the request is same-origin. If the
 * server's own origin is not allowed those bundles fail with a 500 and the app
 * never boots, so the server's own origin must always be on the list.
 */
function defaultAllowedOrigins(): string[] {
  const ports = new Set<number>([config.PORT, 4000]);
  const origins = new Set<string>();
  for (const host of LOOPBACK_HOSTS) {
    for (const port of ports) origins.add(`http://${host}:${port}`);
  }
  // A concrete HOST (not a wildcard bind address) is also a valid origin.
  if (config.HOST && config.HOST !== "0.0.0.0" && config.HOST !== "::") {
    for (const port of ports) origins.add(`http://${config.HOST}:${port}`);
  }
  if (config.PUBLIC_BASE_URL) {
    try {
      origins.add(new URL(config.PUBLIC_BASE_URL).origin);
    } catch {
      /* ignore a malformed PUBLIC_BASE_URL */
    }
  }
  return [...origins];
}

/** Origin allowlist driven by CORS_ORIGIN env (comma-separated). */
export const corsMiddleware = cors({
  origin: (origin, cb) => {
    const raw = config.CORS_ORIGIN;
    if (raw === "*") return cb(null, true);
    const allowlist = raw
      ? raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : defaultAllowedOrigins();
    if (!origin || allowlist.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
});
