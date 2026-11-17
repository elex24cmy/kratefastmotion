import { create } from "zustand";
import * as api from "../api/endpoints.js";

export type VideoExportStatus = "idle" | "pending" | "running" | "done" | "failed";

interface ExportState {
  jobId: string | null;
  projectId: string | null;
  status: VideoExportStatus;
  stage: string;
  progress: number;
  framesDone: number;
  framesTotal: number;
  etaMs: number | null;
  error: string | null;
  /** Relative URL of the finished file, e.g. /api/exports/files/xyz.mp4 */
  url: string | null;
  startedAt: number | null;
  finishedAt: number | null;

  start: (projectId: string, jobId: string) => void;
  applyJob: (job: api.VideoJobStatus) => void;
  fail: (message: string) => void;
  reset: () => void;
}

/**
 * Video exports run server-side and can take minutes. Tracking the job here —
 * rather than in the ExportDialog's local state — means closing the dialog no
 * longer discards an in-flight export: the poll keeps running and the result
 * stays available when the dialog is reopened.
 */
export const useExportStore = create<ExportState>((set, get) => ({
  jobId: null,
  projectId: null,
  status: "idle",
  stage: "queued",
  progress: 0,
  framesDone: 0,
  framesTotal: 0,
  etaMs: null,
  error: null,
  url: null,
  startedAt: null,
  finishedAt: null,

  start: (projectId, jobId) => {
    set({
      jobId,
      projectId,
      status: "pending",
      stage: "queued",
      progress: 0,
      framesDone: 0,
      framesTotal: 0,
      etaMs: null,
      error: null,
      url: null,
      startedAt: Date.now(),
      finishedAt: null,
    });
    pollRef = setInterval(() => {
      void tick(set, get);
    }, 1000);
  },

  applyJob: (job) => {
    set({
      status: job.status,
      stage: job.stage,
      progress: job.progress,
      framesDone: job.framesDone,
      framesTotal: job.framesTotal,
      etaMs: job.etaMs,
      error: job.error,
      url: job.status === "done" && job.filePath ? `/api/exports/files/${job.filePath}` : null,
      finishedAt: job.status === "done" || job.status === "failed" ? Date.now() : get().finishedAt,
    });
    if (job.status === "done" || job.status === "failed") stopPolling();
  },

  fail: (message) => {
    stopPolling();
    set({ status: "failed", stage: "failed", error: message, etaMs: null, finishedAt: Date.now() });
  },

  reset: () => {
    stopPolling();
    set({
      jobId: null,
      projectId: null,
      status: "idle",
      stage: "queued",
      progress: 0,
      framesDone: 0,
      framesTotal: 0,
      etaMs: null,
      error: null,
      url: null,
      startedAt: null,
      finishedAt: null,
    });
  },
}));

let pollRef: ReturnType<typeof setInterval> | null = null;

function stopPolling(): void {
  if (pollRef) {
    clearInterval(pollRef);
    pollRef = null;
  }
}

async function tick(
  set: (partial: Partial<ExportState>) => void,
  get: () => ExportState,
): Promise<void> {
  const jobId = get().jobId;
  if (!jobId) {
    stopPolling();
    return;
  }
  try {
    const job = await api.getVideoJob(jobId);
    useExportStore.getState().applyJob(job);
  } catch (err) {
    // Transient network errors keep the poll alive; the job is still running
    // server-side and the next tick usually recovers.
    const message = err instanceof Error ? err.message : String(err);
    if (/not found|404/i.test(message)) {
      stopPolling();
      set({ status: "failed", stage: "failed", error: message, finishedAt: Date.now() });
    }
  }
}
