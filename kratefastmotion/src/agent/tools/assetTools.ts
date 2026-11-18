import {
  kindOf,
  listAssets,
  resolveMime,
  storeAssetBytes,
  type StoredAsset,
} from "../../assets/store.js";
import type { ToolContext, ToolResult } from "./registry.js";

type Executor = (args: Record<string, unknown>, ctx: ToolContext) => ToolResult | Promise<ToolResult>;

/** Hard ceiling for a remote import — mirrors the HTTP upload limit. */
const MAX_IMPORT_BYTES = 128 * 1024 * 1024;

function ok(summary: string, specChanged = true, data?: unknown): ToolResult {
  return { ok: true, summary, specChanged, data };
}
function fail(summary: string): ToolResult {
  return { ok: false, summary, specChanged: false };
}

/** Compact, model-friendly view of a library asset. */
function describe(asset: StoredAsset) {
  return {
    assetId: asset.id,
    name: asset.name,
    kind: asset.kind,
    url: asset.url,
    size: asset.size,
    width: asset.width,
    height: asset.height,
  };
}

/** Decode a `data:` URI into bytes + mime. Returns null when it is not one. */
function decodeDataUri(uri: string): { bytes: Buffer; mime: string } | null {
  const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(uri);
  if (!match) return null;
  const mime = match[1] || "application/octet-stream";
  const isBase64 = Boolean(match[2]);
  const payload = match[3] ?? "";
  const bytes = isBase64 ? Buffer.from(payload, "base64") : Buffer.from(decodeURIComponent(payload), "utf8");
  return { bytes, mime };
}

async function fetchRemote(url: string): Promise<{ bytes: Buffer; mime: string } | { error: string }> {
  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(30_000), redirect: "follow" });
  } catch (err) {
    return { error: `could not fetch ${url}: ${err instanceof Error ? err.message : String(err)}` };
  }
  if (!res.ok) return { error: `could not fetch ${url}: HTTP ${res.status}` };

  const declaredLength = Number(res.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_IMPORT_BYTES) {
    return { error: `file is too large (${Math.round(declaredLength / 1024 / 1024)} MB, limit 128 MB)` };
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length > MAX_IMPORT_BYTES) {
    return { error: `file is too large (${Math.round(buffer.length / 1024 / 1024)} MB, limit 128 MB)` };
  }
  const mime = (res.headers.get("content-type") ?? "").split(";")[0].trim();
  return { bytes: buffer, mime };
}

export const assetExecutors: Partial<Record<string, Executor>> = {
  list_assets: (args) => {
    const kind = args.kind ? String(args.kind) : "all";
    const all = listAssets();
    const filtered = kind === "all" ? all : all.filter((a) => a.kind === kind);
    if (filtered.length === 0) {
      return ok(
        all.length === 0
          ? "the asset library is empty — import a file with import_asset or upload it in the Media panel"
          : `no ${kind} assets in the library (${all.length} other file${all.length === 1 ? "" : "s"} present)`,
        false,
        { assets: [] },
      );
    }
    return ok(
      `${filtered.length} asset${filtered.length === 1 ? "" : "s"} in the library: ${filtered
        .map((a) => `${a.name} (${a.kind}, id ${a.id})`)
        .join(", ")}`,
      false,
      { assets: filtered.map(describe) },
    );
  },

  import_asset: async (args) => {
    const name = args.name != null ? String(args.name).trim() : "";
    if (!name) return fail("name is required — pass the filename to store under, e.g. 'acme-logo.png'");

    const explicitMime = args.mimeType != null ? String(args.mimeType) : undefined;
    let bytes: Buffer | null = null;
    let mime = explicitMime;

    const url = args.url != null ? String(args.url).trim() : "";
    if (url) {
      if (url.startsWith("data:")) {
        const decoded = decodeDataUri(url);
        if (!decoded) return fail("could not parse the data: URI — expected data:<mime>;base64,<bytes>");
        bytes = decoded.bytes;
        mime = mime ?? decoded.mime;
      } else if (/^https?:\/\//i.test(url)) {
        const remote = await fetchRemote(url);
        if ("error" in remote) return fail(remote.error);
        bytes = remote.bytes;
        mime = mime ?? remote.mime;
      } else {
        return fail(`unsupported url "${url}" — use an http(s) URL or a data: URI, or pass base64 bytes via data`);
      }
    } else if (args.data != null) {
      const raw = String(args.data).replace(/\s+/g, "");
      if (!/^[A-Za-z0-9+/=]+$/.test(raw)) return fail("data must be base64-encoded file bytes");
      bytes = Buffer.from(raw, "base64");
    } else {
      return fail("provide url (http(s) or data: URI) or data (base64 bytes)");
    }

    if (!bytes || bytes.length === 0) return fail("the file was empty");

    const resolvedMime = resolveMime(name, mime);
    if (!kindOf(resolvedMime)) {
      return fail(`unsupported file type "${resolvedMime}" — use an image, video or audio file`);
    }

    try {
      const asset = storeAssetBytes({
        name,
        bytes,
        mime: resolvedMime,
        width: args.width != null ? Number(args.width) : undefined,
        height: args.height != null ? Number(args.height) : undefined,
      });
      return ok(`imported ${asset.name} (${asset.kind}, id ${asset.id}, ${Math.round(asset.size / 1024)} KB)`, true, {
        assetId: asset.id,
        url: asset.url,
        name: asset.name,
        kind: asset.kind,
      });
    } catch (err) {
      return fail(err instanceof Error ? err.message : String(err));
    }
  },
};
