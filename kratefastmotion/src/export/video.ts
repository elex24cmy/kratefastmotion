import { spawn } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";
import type { MotionSpec } from "@kratefastmotion/shared";
import { getProjectSpec } from "../db/repositories/projects.js";
import {
  createExportJob,
  updateExportJob,
} from "../db/repositories/exports.js";
import { exportsDir, renderedDir } from "../db/index.js";
import { publicBaseUrl } from "../config.js";
import { now } from "../utils/id.js";
import { logger } from "../utils/logger.js";
import { hasPuppeteer, hasFfmpeg, getFfmpegPath } from "../utils/env.js";
import { styleFlag } from "../motion/units.js";
import { recordFrames, framePattern, expectedFrameCount } from "./recorder.js";

export type VideoFormat = "mp4" | "gif" | "webm";

export interface VideoExportOptions {
  format?: VideoFormat;
  fps?: number;
  width?: number;
  height?: number;
}

export interface VideoExportHandle {
  jobId: string;
  status: "pending";
}

/** Audio source extracted from a component for mixing into the export. */
interface AudioSource {
  url: string;
  delayMs: number;
  /** In-point into the source, in milliseconds. */
  startMs: number;
  /** How much of the source to take, in milliseconds. 0 means "to the end". */
  durationMs: number;
  loop: boolean;
  /** Linear gain, 0..1. */
  volume: number;
}

function computeTotalDuration(spec: MotionSpec): number {
  let max = 0;
  for (const c of spec.components) {
    const iters = c.iterationCount === "infinite" ? 1 : Number(c.iterationCount) || 1;
    max = Math.max(max, c.delayMs + c.durationMs * iters);
  }
  // A composed film declares its own runtime on the project; never cut it short.
  const declared = spec.project.globalTiming?.totalDurationMs ?? 0;
  return Math.max(max, declared, 500);
}

/**
 * Extract audio sources from components with _tag audio or video.
 *
 * A muted layer contributes no audio — that is what `_muted` means to a viewer,
 * and a decorative b-roll clip should not bleed over the voice track. A layer
 * that declares `_start` is trimmed to its in-point and window, so a clip that
 * plays 4s into an edit takes 4s into the file rather than restarting it.
 */
function extractAudioSources(spec: MotionSpec): AudioSource[] {
  const sources: AudioSource[] = [];
  for (const c of spec.components) {
    const style = c.style as Record<string, string | number>;
    const tag = String(style._tag ?? "div");
    const src = style._src ? String(style._src) : null;
    if (!src) continue;
    if (tag !== "audio" && tag !== "video") continue;
    const muted = styleFlag(style._muted);
    if (muted) continue;
    const startSeconds = Number(style._start);
    const startMs = Number.isFinite(startSeconds) && startSeconds > 0 ? startSeconds * 1000 : 0;
    const volumeRaw = Number(style._volume);
    const volume = Number.isFinite(volumeRaw) ? Math.max(0, Math.min(1, volumeRaw)) : 1;
    sources.push({
      url: src,
      delayMs: c.delayMs,
      startMs,
      durationMs: Math.max(0, c.durationMs),
      loop: styleFlag(style._loop) || c.iterationCount === "infinite",
      volume,
    });
  }
  return sources;
}

/** Build ffmpeg arguments with audio mixing support. */
function ffmpegArgs(
  framesDir: string,
  outFile: string,
  format: VideoFormat,
  fps: number,
  width: number,
  height: number,
  audioSources: AudioSource[],
): string[] {
  const input = framePattern(framesDir);
  const args: string[] = ["-y", "-framerate", String(fps), "-i", input];

  // Add audio inputs
  for (const src of audioSources) {
    args.push("-i", src.url);
  }

  if (audioSources.length > 0 && format !== "gif") {
    // Build filter complex for audio delay and mixing
    const filterParts: string[] = [];
    const mixInputs: string[] = [];
    audioSources.forEach((src, i) => {
      const inputIdx = i + 1; // offset by 1 because 0 is the video
      const delay = Math.round(src.delayMs);
      const label = `a${i}`;
      const chain: string[] = [];
      if (src.loop) chain.push("aloop=loop=-1:size=2e9");
      const trimmed = src.startMs > 0 || src.durationMs > 0;
      if (trimmed) {
        const parts = [`start=${(src.startMs / 1000).toFixed(3)}`];
        if (src.durationMs > 0) parts.push(`duration=${(src.durationMs / 1000).toFixed(3)}`);
        chain.push(`atrim=${parts.join(":")}`);
        // A trimmed stream keeps its original timestamps unless we reset them,
        // which would push the clip late by its in-point.
        chain.push("asetpts=PTS-STARTPTS");
      }
      if (src.volume < 1) chain.push(`volume=${src.volume.toFixed(3)}`);
      chain.push(delay > 0 ? `adelay=${delay}|${delay}` : "anull");
      filterParts.push(`[${inputIdx}:a]${chain.join(",")}[${label}]`);
      mixInputs.push(`[${label}]`);
    });
    const mixLabel = mixInputs.length > 1
      ? `${mixInputs.join("")}amix=inputs=${mixInputs.length}[aout]`
      : `${mixInputs.join("")}anull[aout]`;
    filterParts.push(mixLabel);

    args.push("-filter_complex", filterParts.join(";"));

    if (format === "mp4") {
      args.push(
        "-map", "0:v",
        "-map", "[aout]",
        "-c:v", "libx264",
        // veryfast is ~3x faster than the default medium preset at this
        // resolution with no visible difference at CRF 20.
        "-preset", "veryfast",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        `-vf`, `scale=${width}:${height}`,
        "-c:a", "aac",
        "-b:a", "128k",
        "-shortest",
        outFile,
      );
    } else {
      // webm
      args.push(
        "-map", "0:v",
        "-map", "[aout]",
        "-c:v", "libvpx-vp9",
        "-b:v", "0",
        "-crf", "40",
        `-vf`, `scale=${width}:${height}`,
        "-c:a", "libopus",
        "-b:a", "128k",
        "-shortest",
        outFile,
      );
    }
  } else {
    // No audio — use the original video-only args
    if (format === "mp4") {
      args.push(
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        `-vf`, `scale=${width}:${height}`,
        outFile,
      );
    } else if (format === "webm") {
      args.push(
        "-c:v", "libvpx-vp9",
        "-b:v", "0",
        "-crf", "40",
        "-row-mt", "1",
        "-cpu-used", "4",
        `-vf`, `scale=${width}:${height}`,
        outFile,
      );
    } else {
      // gif
      args.push("-lavfi", `fps=${fps},scale=${width}:${height}:flags=lanczos`, outFile);
    }
  }

  // Stream machine-readable progress on stdout so the job can report encode %.
  // (Inserted before the output file, which is always the last argument.)
  args.splice(args.length - 1, 0, "-progress", "pipe:1", "-nostats");

  return args;
}

function runFfmpeg(
  args: string[],
  opts?: { totalMs?: number; onProgress?: (fraction: number) => void },
): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(args[0], args.slice(1), { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    let stdoutBuf = "";
    proc.stdout?.on("data", (chunk) => {
      stdoutBuf += chunk.toString();
      let newline = stdoutBuf.indexOf("\n");
      while (newline >= 0) {
        const line = stdoutBuf.slice(0, newline).trim();
        stdoutBuf = stdoutBuf.slice(newline + 1);
        const match = /^out_time_ms=(\d+)$/.exec(line);
        if (match && opts?.totalMs && opts.onProgress) {
          opts.onProgress(Math.min(1, Number(match[1]) / 1000 / opts.totalMs));
        }
        newline = stdoutBuf.indexOf("\n");
      }
    });
    proc.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-400)}`));
    });
  });
}

/** Create a video export job and kick off background processing. Returns immediately. */
export async function exportProjectVideo(
  projectId: string,
  opts: VideoExportOptions = {},
): Promise<VideoExportHandle> {
  const format = opts.format ?? "mp4";
  const fps = opts.fps ?? 30;
  const width = opts.width ?? 1280;
  const height = opts.height ?? 720;

  const job = createExportJob(projectId, format, { fps, width, height });

  // Fire and forget — the route returns the jobId immediately.
  void _runVideoJob(job.id, projectId, { format, fps, width, height }).catch((err) => {
    logger.error("video job crashed", { jobId: job.id, error: String(err) });
    updateExportJob(job.id, {
      status: "failed",
      stage: "failed",
      error: String(err),
      completedAt: now(),
    });
  });

  return { jobId: job.id, status: "pending" };
}

async function _runVideoJob(
  jobId: string,
  projectId: string,
  opts: { format: VideoFormat; fps: number; width: number; height: number },
): Promise<void> {
  const [puppet, ffmpeg] = await Promise.all([hasPuppeteer(), hasFfmpeg()]);
  if (!puppet || !ffmpeg) {
    updateExportJob(jobId, {
      status: "failed",
      stage: "failed",
      error: `video export requires puppeteer + ffmpeg (puppeteer=${puppet}, ffmpeg=${ffmpeg})`,
      completedAt: now(),
    });
    return;
  }

  const spec = getProjectSpec(projectId);
  if (!spec) {
    updateExportJob(jobId, {
      status: "failed",
      stage: "failed",
      error: "project not found",
      completedAt: now(),
    });
    return;
  }

  updateExportJob(jobId, { status: "running" });

  const totalDurationMs = computeTotalDuration(spec);
  const totalFrames = expectedFrameCount(totalDurationMs, opts.fps);
  const framesDir = join(renderedDir, "jobs", jobId);
  const filename = `${projectId}-${jobId}.${opts.format}`;
  const outFile = join(exportsDir, filename);
  const ffmpegPath = await getFfmpegPath();
  if (!ffmpegPath) {
    updateExportJob(jobId, {
      status: "failed",
      stage: "failed",
      error: "ffmpeg binary not found",
      completedAt: now(),
    });
    return;
  }

  // Capture owns 2%..90% of the bar; encoding owns the rest.
  const CAPTURE_START = 0.02;
  const CAPTURE_END = 0.9;
  let captureStartedAt = Date.now();
  let lastReported = 0;
  let lastEncodeReport = 0;
  const reportProgress = (done: number, total: number): void => {
    const nowMs = Date.now();
    // Throttle to ~4 writes/second so a 900-frame export does not hammer SQLite.
    if (done < total && nowMs - lastReported < 250) return;
    lastReported = nowMs;
    const elapsed = nowMs - captureStartedAt;
    const perFrame = done > 0 ? elapsed / done : 0;
    const etaMs = done > 0 && done < total ? Math.round(perFrame * (total - done)) : null;
    updateExportJob(jobId, {
      progress: CAPTURE_START + (CAPTURE_END - CAPTURE_START) * (done / Math.max(1, total)),
      stage: "capturing",
      framesDone: done,
      framesTotal: total,
      etaMs,
    });
  };

  updateExportJob(jobId, {
    stage: "capturing",
    progress: CAPTURE_START,
    framesDone: 0,
    framesTotal: totalFrames,
    etaMs: null,
  });

  try {
    const previewUrl = `${publicBaseUrl()}/api/projects/${projectId}/preview`;
    captureStartedAt = Date.now();
    await recordFrames({
      previewUrl,
      width: opts.width,
      height: opts.height,
      fps: opts.fps,
      durationMs: totalDurationMs,
      framesDir,
      onProgress: reportProgress,
    });

    updateExportJob(jobId, {
      stage: "encoding",
      progress: CAPTURE_END,
      framesDone: totalFrames,
      framesTotal: totalFrames,
      etaMs: null,
    });

    const audioSources = extractAudioSources(spec);
    const args = ffmpegArgs(framesDir, outFile, opts.format, opts.fps, opts.width, opts.height, audioSources);
    if (audioSources.length > 0) {
      logger.info(`Video export includes ${audioSources.length} audio source(s)`, { jobId });
    }
    await runFfmpeg([ffmpegPath, ...args], {
      totalMs: totalDurationMs,
      onProgress: (fraction) => {
        const nowMs = Date.now();
        if (nowMs - lastEncodeReport < 250) return;
        lastEncodeReport = nowMs;
        updateExportJob(jobId, {
          stage: "encoding",
          progress: CAPTURE_END + (1 - CAPTURE_END) * fraction,
          etaMs: null,
        });
      },
    });

    updateExportJob(jobId, {
      status: "done",
      stage: "done",
      progress: 1,
      etaMs: 0,
      filePath: filename,
      completedAt: now(),
    });
    logger.info("video job done", { jobId, filename });
  } catch (err) {
    updateExportJob(jobId, {
      status: "failed",
      stage: "failed",
      error: err instanceof Error ? err.message : String(err),
      etaMs: null,
      completedAt: now(),
    });
  } finally {
    rmSync(framesDir, { recursive: true, force: true });
  }
}
