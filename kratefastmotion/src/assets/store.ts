import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { config } from "../config.js";
import { dataDir } from "../db/index.js";
import { logger } from "../utils/logger.js";

/**
 * Local asset library — images, video and audio imported from the user's
 * machine. Files live next to the SQLite database (data/assets) so they are
 * not part of the repo and never wake the dev file watcher.
 *
 * Shared by the HTTP upload route and the agent tools, so a file imported
 * through the UI and a file imported by an AI are stored identically and are
 * interchangeable everywhere (canvas, preview, export).
 */

export type AssetKind = "image" | "video" | "audio";

export interface StoredAsset {
  id: string;
  name: string;
  fileName: string;
  url: string;
  mime: string;
  size: number;
  kind: AssetKind;
  width?: number;
  height?: number;
  createdAt: string;
}

export const MAX_UPLOAD = "128mb";

export const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".ogv": "video/ogg",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".m4a": "audio/mp4",
  ".aac": "audio/aac",
  ".flac": "audio/flac",
};

export const EXT_BY_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
  "image/bmp": ".bmp",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
  "video/ogg": ".ogv",
  "audio/mpeg": ".mp3",
  "audio/wav": ".wav",
  "audio/ogg": ".ogg",
  "audio/mp4": ".m4a",
  "audio/aac": ".aac",
  "audio/flac": ".flac",
};

export const assetsDir = join(dataDir, "assets");
try {
  mkdirSync(assetsDir, { recursive: true });
} catch (err) {
  logger.warn("Could not create assets dir", { path: assetsDir, error: String(err) });
}

export function kindOf(mime: string): AssetKind | null {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return null;
}

export function slugify(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "asset";
}

/** Best-effort mime for a filename extension, falling back to the declared type. */
export function resolveMime(name: string, declared?: string): string {
  const ext = extname(name).toLowerCase();
  return MIME_BY_EXT[ext] || (declared ?? "").split(";")[0].trim().toLowerCase() || "application/octet-stream";
}

function metaPath(id: string) {
  return join(assetsDir, `${id}.json`);
}

function publicBase(): string {
  const configured = process.env.PUBLIC_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return `http://localhost:${config.PORT}`;
}

export function assetUrl(fileName: string): string {
  return `${publicBase()}/api/assets/file/${encodeURIComponent(fileName)}`;
}

export function readAsset(id: string): StoredAsset | null {
  const file = metaPath(id);
  if (!existsSync(file)) return null;
  try {
    const asset = JSON.parse(readFileSync(file, "utf8")) as StoredAsset;
    if (!asset?.fileName || !existsSync(join(assetsDir, asset.fileName))) return null;
    return asset;
  } catch {
    return null;
  }
}

export function listAssets(): StoredAsset[] {
  if (!existsSync(assetsDir)) return [];
  const assets: StoredAsset[] = [];
  for (const entry of readdirSync(assetsDir)) {
    if (!entry.endsWith(".json")) continue;
    const asset = readAsset(entry.slice(0, -5));
    if (asset) assets.push(asset);
  }
  return assets.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/** Find an asset by exact id, or by filename/display name (case-insensitive). */
export function findAsset(ref: string): StoredAsset | null {
  const direct = readAsset(ref);
  if (direct) return direct;
  const needle = ref.trim().toLowerCase();
  return (
    listAssets().find(
      (a) => a.name.toLowerCase() === needle || a.fileName.toLowerCase() === needle || a.fileName.toLowerCase().startsWith(`${needle}-`),
    ) ?? null
  );
}

export interface StoreAssetInput {
  name: string;
  bytes: Buffer;
  /** Declared mime (e.g. from an HTTP header). The extension wins when known. */
  mime?: string;
  width?: number;
  height?: number;
}

/**
 * Persist raw bytes as a library asset. Throws on an unsupported type so both
 * callers can surface the same message.
 */
export function storeAssetBytes(input: StoreAssetInput): StoredAsset {
  const originalName = input.name.trim() || "asset";
  const extFromName = extname(originalName).toLowerCase();
  const mime = resolveMime(originalName, input.mime);
  const kind = kindOf(mime);
  if (!kind) {
    throw new Error(`unsupported file type: ${mime || "unknown"} — use an image, video or audio file`);
  }

  const ext = MIME_BY_EXT[extFromName] ? extFromName : EXT_BY_MIME[mime] ?? ".bin";
  const id = randomBytes(6).toString("hex");
  const fileName = `${id}-${slugify(originalName)}${ext}`;

  writeFileSync(join(assetsDir, fileName), input.bytes);

  const asset: StoredAsset = {
    id,
    name: originalName,
    fileName,
    url: assetUrl(fileName),
    mime,
    size: input.bytes.length,
    kind,
    ...(Number.isFinite(input.width) && (input.width ?? 0) > 0 ? { width: Math.round(input.width as number) } : {}),
    ...(Number.isFinite(input.height) && (input.height ?? 0) > 0 ? { height: Math.round(input.height as number) } : {}),
    createdAt: new Date().toISOString(),
  };
  writeFileSync(metaPath(id), JSON.stringify(asset, null, 2));

  logger.info("Asset imported", { id, fileName, kind, size: input.bytes.length });
  return asset;
}

/** Remove an asset's file and metadata. Missing files are ignored. */
export function deleteAssetFiles(asset: StoredAsset): void {
  try {
    unlinkSync(join(assetsDir, asset.fileName));
  } catch {
    /* already gone */
  }
  try {
    unlinkSync(metaPath(asset.id));
  } catch {
    /* already gone */
  }
}

function statSyncSafe(path: string): number | null {
  try {
    return statSync(path).size;
  } catch {
    return null;
  }
}

/** Total library size, surfaced in the Media panel footer. */
export function assetsSummary() {
  const assets = listAssets();
  return {
    count: assets.length,
    bytes: assets.reduce((sum, a) => sum + (statSyncSafe(join(assetsDir, a.fileName)) ?? a.size), 0),
  };
}
