import express, { Router } from "express";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  assetsDir,
  deleteAssetFiles,
  findAsset,
  listAssets,
  MAX_UPLOAD,
  readAsset,
  storeAssetBytes,
  type StoredAsset,
} from "../../assets/store.js";
import { findComponentsReferencingAsset } from "../../db/repositories/components.js";
import { runAsync } from "../../utils/async.js";

export { assetsSummary } from "../../assets/store.js";

/**
 * Local asset library — images, video and audio imported from the user's
 * machine. Storage lives in ../../assets/store.ts so the agent tools and this
 * route import files exactly the same way.
 *
 * The bytes are uploaded as a raw request body (no multipart dependency):
 *   POST /api/assets?name=logo.png&width=512&height=512
 *   Content-Type: image/png
 *   <file bytes>
 */

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
    const declaredMime = String(req.get("content-type") ?? "");
    const width = Number(req.query.width);
    const height = Number(req.query.height);

    let asset: StoredAsset;
    try {
      asset = storeAssetBytes({ name: originalName, bytes: body, mime: declaredMime, width, height });
    } catch (err) {
      res.status(415).json({ error: err instanceof Error ? err.message : String(err) });
      return;
    }

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

    deleteAssetFiles(asset);
    res.json({ ok: true, id });
  }),
);

/** GET /api/assets/:id/meta — single asset lookup (handy for the agent). */
assetsRouter.get("/assets/:id/meta", (req, res) => {
  const asset = findAsset(String(req.params.id ?? ""));
  if (!asset) {
    res.status(404).json({ error: "asset not found" });
    return;
  }
  res.json(asset);
});
