import { useCallback, useEffect, useRef, useState } from "react";
import type { LocalAsset } from "../../api/endpoints.js";
import * as api from "../../api/endpoints.js";
import { ApiError } from "../../api/client.js";
import { useProjectStore } from "../../store/projectStore.js";
import { useUiStore } from "../../store/uiStore.js";

/**
 * Media panel — the local asset library. Files are uploaded to the API,
 * stored under the app data directory, then dropped onto the canvas as
 * <img> / <video> / <audio> layers (via the reserved _tag/_src style keys).
 */

const KIND_LABEL: Record<LocalAsset["kind"], string> = {
  image: "IMG",
  video: "VID",
  audio: "AUD",
};

const EXT_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  mp4: "video/mp4",
  m4v: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  ogv: "video/ogg",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  flac: "audio/flac",
};

function mimeOf(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_MIME[ext] ?? "";
}

function kindOf(mime: string): LocalAsset["kind"] | null {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Measure an image or video in the browser so layers are placed at real size. */
function measure(file: File): Promise<{ width?: number; height?: number }> {
  const mime = mimeOf(file);
  if (mime.startsWith("image/")) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth || undefined, height: img.naturalHeight || undefined });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        resolve({});
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  }
  if (mime.startsWith("video/")) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        resolve({ width: video.videoWidth || undefined, height: video.videoHeight || undefined });
        URL.revokeObjectURL(url);
      };
      video.onerror = () => {
        resolve({});
        URL.revokeObjectURL(url);
      };
      video.src = url;
    });
  }
  return Promise.resolve({});
}

interface UploadJob {
  name: string;
  percent: number;
}

export function MediaPanel() {
  const [assets, setAssets] = useState<LocalAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploads, setUploads] = useState<UploadJob[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const projectId = useProjectStore((s) => s.projectId);
  const loadProject = useProjectStore((s) => s.loadProject);
  const selectComponent = useUiStore((s) => s.selectComponent);
  const setRightPanelTab = useUiStore((s) => s.setRightPanelTab);
  const canvasSize = useUiStore((s) => s.canvasSize);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.listAssets();
      setAssets(res.assets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "could not load your media library");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const importFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;
      setError(null);
      for (const file of files) {
        const mime = mimeOf(file);
        const kind = kindOf(mime);
        if (!kind) {
          setError(`${file.name}: only image, video or audio files can be imported`);
          continue;
        }
        setUploads((prev) => [...prev, { name: file.name, percent: 0 }]);
        try {
          const dims = await measure(file);
          const asset = await api.uploadAsset(file, {
            ...dims,
            onProgress: (percent) =>
              setUploads((prev) =>
                prev.map((u) => (u.name === file.name ? { ...u, percent } : u)),
              ),
          });
          setAssets((prev) => [asset, ...prev.filter((a) => a.id !== asset.id)]);
        } catch (err) {
          setError(`${file.name}: ${err instanceof Error ? err.message : "upload failed"}`);
        } finally {
          setUploads((prev) => prev.filter((u) => u.name !== file.name));
        }
      }
    },
    [],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragActive(false);
      if (event.dataTransfer.files?.length) void importFiles(event.dataTransfer.files);
    },
    [importFiles],
  );

  const handleDelete = useCallback(async (asset: LocalAsset) => {
    const remove = async (force: boolean) => {
      await api.deleteAsset(asset.id, force);
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
    };
    try {
      await remove(false);
    } catch (err) {
      // 409 means the file is still referenced by one or more layers.
      if (err instanceof ApiError && err.status === 409) {
        const proceed = window.confirm(
          `${err.message}.\n\nDeleting it will leave those layers with a broken media source. Delete anyway?`,
        );
        if (!proceed) return;
        try {
          await remove(true);
        } catch (forceErr) {
          setError(forceErr instanceof Error ? forceErr.message : "could not delete the file");
        }
        return;
      }
      setError(err instanceof Error ? err.message : "could not delete the file");
    }
  }, []);

  const addToCanvas = useCallback(
    async (asset: LocalAsset) => {
      if (!projectId) {
        setError("open a project first — then click an asset to add it");
        return;
      }
      setBusyId(asset.id);
      setError(null);
      try {
        const canvasW = canvasSize.width || 640;
        const canvasH = canvasSize.height || 360;

        let width = asset.width ?? (asset.kind === "audio" ? 280 : 360);
        let height = asset.height ?? (asset.kind === "audio" ? 54 : 240);
        if (asset.kind !== "audio") {
          const scale = Math.min(1, (canvasW * 0.7) / width, (canvasH * 0.7) / height);
          width = Math.max(24, Math.round(width * scale));
          height = Math.max(24, Math.round(height * scale));
        } else {
          width = Math.min(width, Math.round(canvasW * 0.7));
        }

        const style: Record<string, string | number> = {
          position: "absolute",
          left: Math.round((canvasW - width) / 2),
          top: Math.round((canvasH - height) / 2),
          width,
          height,
          _tag: asset.kind === "image" ? "img" : asset.kind === "video" ? "video" : "audio",
          _src: asset.url,
        };
        if (asset.kind === "image") {
          style.objectFit = "cover";
          style.borderRadius = 8;
        }
        if (asset.kind === "video") {
          style.objectFit = "cover";
          style.borderRadius = 8;
          style._muted = 1;
          style._loop = 1;
          style._autoplay = 1;
        }
        if (asset.kind === "audio") {
          style._controls = 1;
        }

        const name = asset.name.replace(/\.[^.]+$/, "").slice(0, 48) || asset.name;
        const component = await api.createComponent(projectId, { name });
        await api.patchComponent(projectId, component.id, { style });
        await loadProject(projectId);
        selectComponent(component.id);
        setRightPanelTab("inspector");
      } catch (err) {
        setError(err instanceof Error ? err.message : "could not add the layer");
      } finally {
        setBusyId(null);
      }
    },
    [projectId, canvasSize, loadProject, selectComponent, setRightPanelTab],
  );

  const totalBytes = assets.reduce((sum, asset) => sum + asset.size, 0);

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-edge flex items-center gap-2 flex-shrink-0">
        <span className="text-[10px] uppercase tracking-wide text-gray-500 flex-1">
          Media{assets.length > 0 ? ` · ${assets.length}` : ""}
        </span>
        <button
          onClick={() => void refresh()}
          className="text-[10px] text-gray-500 hover:text-gray-200 px-1"
          title="Refresh library"
          aria-label="Refresh media library"
        >
          ↻
        </button>
        <button
          onClick={() => inputRef.current?.click()}
          className="text-[10px] px-2 py-1 rounded bg-panel2 border border-edge text-gray-200 hover:border-accent"
        >
          + Import
        </button>
        <input
          ref={inputRef}
          type="file"
          aria-label="Import media files"
          accept="image/*,video/*,audio/*"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) void importFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`m-2 rounded-lg border border-dashed px-3 py-3 text-center text-[10px] transition-colors flex-shrink-0 ${
          dragActive
            ? "border-accent text-gray-200 bg-panel2"
            : "border-edge text-gray-600"
        }`}
      >
        Drop images, video or audio here
        <div className="mt-1 text-[9px] text-gray-700">
          Files stay on this machine · stored in the app data folder
        </div>
      </div>

      {error && (
        <div className="mx-2 mb-2 text-[10px] text-red-400 leading-snug flex-shrink-0">{error}</div>
      )}

      {uploads.length > 0 && (
        <div className="mx-2 mb-2 space-y-1 flex-shrink-0">
          {uploads.map((job) => (
            <div key={job.name} className="text-[10px] text-gray-400">
              <div className="flex justify-between gap-2">
                <span className="truncate">{job.name}</span>
                <span className="font-mono text-gray-500">{job.percent}%</span>
              </div>
              <div className="h-0.5 bg-panel3 rounded overflow-hidden mt-0.5">
                <div className="h-full bg-accent transition-all" style={{ width: `${job.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2">
        {loading && <div className="p-3 text-xs text-gray-500">Loading…</div>}
        {!loading && assets.length === 0 && (
          <div className="p-3 text-[11px] text-gray-600 leading-relaxed">
            No files yet. Import a logo, photo or clip, then click it to add a layer to the canvas.
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="group relative rounded-lg border border-edge bg-panel2 overflow-hidden"
            >
              <button
                onClick={() => void addToCanvas(asset)}
                disabled={busyId === asset.id}
                className="block w-full text-left disabled:opacity-50"
                title={
                  projectId
                    ? `Add "${asset.name}" to the canvas`
                    : "Open a project to add this asset"
                }
                aria-label={`Add ${asset.name} as a layer`}
              >
                <div className="h-20 w-full flex items-center justify-center bg-ink overflow-hidden">
                  {asset.kind === "image" ? (
                    <img
                      src={asset.url}
                      alt=""
                      className="h-full w-full object-contain"
                      draggable={false}
                    />
                  ) : asset.kind === "video" ? (
                    <video
                      src={asset.url}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-contain pointer-events-none"
                    />
                  ) : (
                    <span className="text-lg text-gray-600" aria-hidden="true">
                      ♪
                    </span>
                  )}
                </div>
                <div className="px-1.5 py-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] font-mono text-gray-500 border border-edge rounded px-1">
                      {KIND_LABEL[asset.kind]}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono">
                      {formatBytes(asset.size)}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-300 truncate mt-0.5">{asset.name}</div>
                </div>
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  void handleDelete(asset);
                }}
                className="absolute top-1 right-1 w-4 h-4 rounded bg-ink/80 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-400 leading-none"
                title={`Remove ${asset.name}`}
                aria-label={`Remove ${asset.name} from the library`}
              >
                ×
              </button>
              {busyId === asset.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink/60 text-[10px] text-gray-300">
                  Adding…
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-3 py-1.5 border-t border-edge text-[9px] text-gray-600 flex justify-between flex-shrink-0">
        <span>{assets.length > 0 ? `${formatBytes(totalBytes)} stored` : "empty library"}</span>
        <span>{projectId ? "click to add" : "no project"}</span>
      </div>
    </div>
  );
}
