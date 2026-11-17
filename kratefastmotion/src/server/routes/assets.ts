import express, { Router } from "express";
import { randomBytes } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { extname, join } from "node:path";
import { config } from "../../config.js";
import { dataDir } from "../../db/index.js";
import { findComponentsReferencingAsset } from "../../db/repositories/components.js";
import { logger } from "../../utils/logger.js";
import { runAsync } from "../../utils/async.js";

/**
 * Local asset library — images, video and audio imported from the user's
 * machine. Files live next to the SQLite database (data/assets) so they are
 * not part of the repo and never wake the dev file watcher.
 *
 * The bytes are uploaded as a raw request body (no multipart dependency):
 *   POST /api/assets?name=logo.png&width=512&height=512
 *   Content-Type: image/png
 *   <file bytes>
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

const assetsDir = join(dataDir, "assets");
try {
  mkdirSync(assetsDir, { recursive: true });
} catch (err) {
  logger.warn("Could not create assets dir", { path: assetsDir, error: String(err) });
}

const MAX_UPLOAD = "128mb";

const MIME_BY_EXT: Record<string, string> = {
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

const EXT_BY_MIME: Record<string, string> = {
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

function kindOf(mime: string): AssetKind | null {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return null;
}

function slugify(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "asset";
}

function metaPath(id: string) {
  return join(assetsDir, `${id}.json`);
}

function publicBase(): string {
  const configured = process.env.PUBLIC_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return `http://localhost:${config.PORT}`;
}

function assetUrl(fileName: string): string {
  return `${publicBase()}/api/assets/file/${encodeURIComponent(fileName)}`;
}

function readAsset(id: string): StoredAsset | null {
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

function listAssets(): StoredAsset[] {
  if (!existsSync(assetsDir)) return [];
  const assets: StoredAsset[] = [];
  for (const entry of readdirSync(assetsDir)) {
    if (!entry.endsWith(".json")) continue;
    const asset = readAsset(entry.slice(0, -5));
    if (asset) assets.push(asset);
  }
  return assets.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/**
 * File server. Mounted before the API-key gate because <img>/<video> requests
 * from the canvas and from the puppeteer exporter cannot send custom headers.
 */
export const assetsFileRouter = Router();

assetsFileRouter.get("/:fileName", (req, res) => {
  const fileName = req.params.fileName ?? "";
  // Strict shape check doubles as path-traversal protection.
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(fileName) || fileName.includes("..")) {
    res.status(400).json({ error: "invalid asset name" });
    return;
  }
  const fullPath = join(assetsDir, fileName);
  if (!existsSync(fullPath)) {
    res.status(404).json({ error: "asset not found" });
    return;
  }
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.sendFile(fullPath);
});

export const assetsRouter = Router();

/** GET /api/assets — list everything imported so far. */
assetsRouter.get("/assets", (_req, res) => {
  res.json({ assets: listAssets() });
});

/**
 * POST /api/assets — store one file.
 * Query: name (original filename), width, height (optional, measured client-side).
 */
assetsRouter.post(
  "/assets",
  express.raw({ type: () => true, limit: MAX_UPLOAD }),
  runAsync(async (req, res) => {
    const body = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
    if (body.length === 0) {
      res.status(400).json({ error: "empty request body — send the file bytes as the body" });
      return;
    }

    const originalName = String(req.query.name ?? "asset").trim() || "asset";
    const extFromName = extname(originalName).toLowerCase();
    const declaredMime = String(req.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    const mime = MIME_BY_EXT[extFromName] || declaredMime || "application/octet-stream";
    const kind = kindOf(mime);

    if (!kind) {
      res.status(415).json({
        error: `unsupported file type: ${mime || "unknown"} — use an image, video or audio file`,
      });
      return;
    }

    const ext = MIME_BY_EXT[extFromName] ? extFromName : EXT_BY_MIME[mime] ?? ".bin";
    const id = randomBytes(6).toString("hex");
    const fileName = `${id}-${slugify(originalName)}${ext}`;
    const width = Number(req.query.width);
    const height = Number(req.query.height);

    writeFileSync(join(assetsDir, fileName), body);

    const asset: StoredAsset = {
      id,
      name: originalName,
      fileName,
      url: assetUrl(fileName),
      mime,
      size: body.length,
      kind,
      ...(Number.isFinite(width) && width > 0 ? { width: Math.round(width) } : {}),
      ...(Number.isFinite(height) && height > 0 ? { height: Math.round(height) } : {}),
      createdAt: new Date().toISOString(),
    };
    writeFileSync(metaPath(id), JSON.stringify(asset, null, 2));

    logger.info("Asset imported", { id, fileName, kind, size: body.length });
    res.status(201).json(asset);
  }),
);

/** DELETE /api/assets/:id — remove the file and its metadata. */
assetsRouter.delete(
  "/assets/:id",
  runAsync(async (req, res) => {
    const id = String(req.params.id ?? "");
    if (!/^[a-f0-9]{6,}$/i.test(id)) {
      res.status(400).json({ error: "invalid asset id" });
      return;
    }
    const asset = readAsset(id);
    if (!asset) {
      res.status(404).json({ error: "asset not found" });
      return;
    }

    // Refuse to silently break layers that still point at this file. The
    // client can retry with ?force=1 after warning the user.
    const force = req.query.force === "1" || req.query.force === "true";
    if (!force) {
      const references = findComponentsReferencingAsset(asset.fileName);
      if (references.length > 0) {
        res.status(409).json({
          error: `this file is used by ${references.length} layer${references.length === 1 ? "" : "s"}`,
          references: references.map((r) => r.name),
          hint: "retry with ?force=1 to delete anyway",
        });
        return;
      }
    }

    try {
      unlinkSync(join(assetsDir, asset.fileName));
    } catch {
      /* already gone */
    }
    try {
      unlinkSync(metaPath(id));
    } catch {
      /* already gone */
    }
    res.json({ ok: true, id });
  }),
);

/** GET /api/assets/:id/meta — single asset lookup (handy for the agent). */
assetsRouter.get("/assets/:id/meta", (req, res) => {
  const asset = readAsset(String(req.params.id ?? ""));
  if (!asset) {
    res.status(404).json({ error: "asset not found" });
    return;
  }
  res.json(asset);
});

/** Total library size, surfaced in the Media panel footer. */
export function assetsSummary() {
  const assets = listAssets();
  return {
    count: assets.length,
    bytes: assets.reduce((sum, a) => sum + (statSyncSafe(join(assetsDir, a.fileName)) ?? a.size), 0),
  };
}

function statSyncSafe(path: string): number | null {
  try {
    return statSync(path).size;
  } catch {
    return null;
  }
}
