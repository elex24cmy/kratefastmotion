import { useExportStore } from "../../store/exportStore.js";
import { useUiStore } from "../../store/uiStore.js";

function etaLabel(ms: number | null): string | null {
  if (ms === null || !Number.isFinite(ms) || ms <= 0) return null;
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s left`;
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s left`;
}

/**
 * Floating indicator for an in-flight video export. Video exports take minutes,
 * so the job must stay visible even when the export dialog is closed — otherwise
 * a finished export is silently missed.
 */
export function ExportStatusPill() {
  const status = useExportStore((s) => s.status);
  const progress = useExportStore((s) => s.progress);
  const stage = useExportStore((s) => s.stage);
  const framesDone = useExportStore((s) => s.framesDone);
  const framesTotal = useExportStore((s) => s.framesTotal);
  const etaMs = useExportStore((s) => s.etaMs);
  const url = useExportStore((s) => s.url);
  const error = useExportStore((s) => s.error);
  const reset = useExportStore((s) => s.reset);
  const setExportOpen = useUiStore((s) => s.setExportOpen);

  if (status === "idle") return null;

  const running = status === "pending" || status === "running";
  const percent = Math.max(2, Math.round(progress * 100));
  const eta = etaLabel(etaMs);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-64 rounded-lg bg-panel2 border border-edge shadow-lg p-3 text-xs"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-gray-200 font-medium">
          {running ? "Exporting video" : status === "done" ? "Video ready" : "Export failed"}
        </div>
        <button
          onClick={reset}
          aria-label="Dismiss export status"
          className="text-gray-500 hover:text-gray-200 leading-none"
        >
          ×
        </button>
      </div>

      {running && (
        <>
          <div
            className="mt-2 h-1.5 w-full rounded-full bg-black/40 overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-label="Video export progress"
          >
            <div
              className="h-full bg-accent transition-[width] duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-500">
            <span>
              {stage === "encoding"
                ? "Encoding…"
                : framesTotal > 0
                  ? `${framesDone}/${framesTotal} frames`
                  : "Starting…"}
            </span>
            <span>
              {percent}%{eta ? ` · ${eta}` : ""}
            </span>
          </div>
        </>
      )}

      {status === "done" && url && (
        <div className="mt-2 flex items-center justify-between">
          <a href={url} download className="text-accent2 underline">
            Download video
          </a>
          <button
            onClick={() => setExportOpen(true)}
            className="text-[10px] text-gray-500 hover:text-gray-300"
          >
            Open export
          </button>
        </div>
      )}

      {status === "failed" && (
        <div className="mt-2 text-red-400 break-words">{error ?? "export failed"}</div>
      )}
    </div>
  );
}
