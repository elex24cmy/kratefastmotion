/**
 * Post-build layout fixups for the server workspace.
 *
 * `tsc` emits the compiled server to `dist/` (dist/index.js, dist/server/…,
 * dist/shared/…), but two things assume a different layout at runtime:
 *
 *   1. package.json "start" runs `node dist/src/index.js`, and app.ts resolves
 *      the web build as `dist/src/server/…/../../../../web/dist`. Both expect
 *      the compiled output to live under `dist/src/`.
 *   2. The `@kratefastmotion/shared` workspace is a symlink to `src/shared`, whose
 *      package.json points `main` at `./index.js`. In dev, tsx maps that to
 *      `index.ts`; in production there is no such mapping, so the compiled
 *      JavaScript has to exist next to the sources.
 *
 * This script moves the fresh compiler output under `dist/src` and copies the
 * compiled shared package into `src/shared` so `npm start` can boot.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const serverDir = join(scriptDir, "..");
const distDir = join(serverDir, "dist");
const nestedSrc = join(distDir, "src");

if (!existsSync(distDir)) {
  console.error("postbuild: dist/ not found — run tsc first");
  process.exit(1);
}

// 1. Move fresh output into dist/src. Remove any previous nested output first
//    so a rebuild never leaves stale modules behind.
rmSync(nestedSrc, { recursive: true, force: true });
mkdirSync(nestedSrc, { recursive: true });
for (const entry of readdirSync(distDir)) {
  if (entry === "src") continue;
  renameSync(join(distDir, entry), join(nestedSrc, entry));
}

// 2. Make the compiled shared package resolvable through the workspace symlink.
const compiledShared = join(nestedSrc, "shared");
const sharedSrc = join(serverDir, "src", "shared");
if (existsSync(compiledShared)) {
  cpSync(compiledShared, sharedSrc, { recursive: true });
}

console.log("postbuild: server output nested under dist/src and shared JS synced");
