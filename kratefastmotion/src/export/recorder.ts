import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { getBrowserPath } from "../utils/env.js";
import { logger } from "../utils/logger.js";

export interface RecordOptions {
  previewUrl: string;
  width: number;
  height: number;
  fps: number;
  durationMs: number;
  framesDir: string;
  /** Called after each frame is written; must not throw and must stay synchronous. */
  onProgress?: (framesDone: number, framesTotal: number) => void;
}

/** Frames are written as JPEG: ~1.8x faster to capture than PNG, and 53 dB PSNR (visually lossless). */
export const FRAME_EXTENSION = "jpg";
export const FRAME_QUALITY = 92;

/** ffmpeg image-sequence input pattern matching the files written by {@link recordFrames}. */
export function framePattern(framesDir: string): string {
  return join(framesDir, `frame_%06d.${FRAME_EXTENSION}`);
}

/**
 * Guard against pathological exports. The previous 2400-frame ceiling silently
 * truncated anything longer than 40s at 60fps, which cut composed films short.
 * The limit is now generous (10 minutes at 30fps / 5 minutes at 60fps) and can
 * be tuned with KRATEFASTMOTION_MAX_FRAMES.
 */
const MAX_FRAMES = Math.max(
  300,
  Number(process.env.KRATEFASTMOTION_MAX_FRAMES) || 18_000,
);

/** Frame count an export of `durationMs` at `fps` will capture, clamped to the guard rail. */
export function expectedFrameCount(durationMs: number, fps: number): number {
  const f = Math.max(1, Math.floor(fps));
  const d = Math.max(1, durationMs);
  return Math.min(MAX_FRAMES, Math.max(1, Math.round((d / 1000) * f)));
}

/**
 * Render a deterministic frame sequence of the preview page.
 *
 * The previous implementation used CDP `Page.startScreencast`, which only
 * emits a frame when the compositor repaints — a slow or idle CSS animation
 * produced a one-frame "video". Instead we pause every Web Animation
 * (`document.getAnimations()`), seek it to the exact timestamp of each frame,
 * and take a screenshot. This produces exactly `round(durationSeconds * fps)`
 * frames regardless of animation speed.
 *
 * JavaScript-driven animations (RAF loops) cannot be seeked this way; the
 * generated export page is CSS-only, so that limitation does not apply here.
 *
 * Two capture details matter for throughput (this is the whole cost of an
 * export, ~0.3-0.5s per frame):
 *  - No `requestAnimationFrame` wait after seeking. `Page.captureScreenshot`
 *    already forces a fresh compositor frame, and measurements show the
 *    resulting pixels are identical to the old double-rAF capture.
 *  - JPEG rather than PNG. Software PNG encoding dominated the frame time;
 *    JPEG at quality 92 is ~1.8x faster and visually indistinguishable.
 */
export async function recordFrames(opts: RecordOptions): Promise<string[]> {
  const exe = await getBrowserPath();
  if (!exe) throw new Error("recorder: no browser executable found");

  const puppeteer = (await import("puppeteer-core")).default;
  mkdirSync(opts.framesDir, { recursive: true });

  const fps = Math.max(1, Math.floor(opts.fps));
  const durationMs = Math.max(1, opts.durationMs);
  const expectedFrames = expectedFrameCount(durationMs, fps);

  const browser = await puppeteer.launch({
    executablePath: exe,
    headless: true,
    // A busy machine can push a single screenshot past the default 180s when
    // several exports run at once; keep a generous ceiling.
    protocolTimeout: 600_000,
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      "--mute-audio",
      "--autoplay-policy=no-user-gesture-required",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: opts.width,
      height: opts.height,
      deviceScaleFactor: 1,
    });
    // `networkidle0` never settles while a `preload="auto"` clip streams: the
    // video keeps a connection open for its whole length, so a media export
    // timed out before the first frame. Wait for the document, then for fonts,
    // images and decoded media explicitly below.
    await page.goto(opts.previewUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Wait for webfonts and images so later frames do not shift.
    await page
      .evaluate(async () => {
        const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
        if (fonts) await fonts.ready;
        const pending = Array.from(document.images).filter((img) => !img.complete);
        await Promise.all(
          pending.map(
            (img) =>
              new Promise<void>((resolve) => {
                const done = () => resolve();
                img.addEventListener("load", done, { once: true });
                img.addEventListener("error", done, { once: true });
              }),
          ),
        );
      })
      .catch(() => {
        /* assets optional */
      });

    // Timeline-synced media must be decodable before the first seek, otherwise
    // frame 0 captures a poster or a black element.
    await page
      .evaluate(() => {
        const kfm = (window as unknown as { __kfm?: { ready?: () => Promise<void> } }).__kfm;
        return kfm && typeof kfm.ready === "function" ? kfm.ready() : undefined;
      })
      .catch(() => {
        /* no media, or the page predates the seek protocol */
      });

    const animationCount = await page.evaluate(() => {
      // A synced clip that slipped through with `autoplay` would keep playing
      // under the seek loop; pause everything first.
      document.querySelectorAll("[data-om-media]").forEach((el) => {
        const media = el as HTMLMediaElement;
        try {
          media.pause();
        } catch {
          /* not seekable */
        }
      });
      const animations = document.getAnimations();
      for (const animation of animations) {
        animation.pause();
        animation.currentTime = 0;
      }
      return animations.length;
    });

    const frames: string[] = [];
    for (let index = 0; index < expectedFrames; index += 1) {
      const timeMs = (index / fps) * 1000;
      await page.evaluate(async (time) => {
        for (const animation of document.getAnimations()) {
          animation.pause();
          try {
            animation.currentTime = time;
          } catch {
            /* animation detached mid-render */
          }
        }
        // Seek `<video>`/`<audio>` and wait for the decoder to land on the
        // requested frame before the screenshot is taken.
        const kfm = (
          window as unknown as { __kfm?: { seekMedia?: (ms: number) => Promise<void> } }
        ).__kfm;
        if (kfm && typeof kfm.seekMedia === "function") {
          await kfm.seekMedia(time);
        }
      }, timeMs);

      const filePath = join(
        opts.framesDir,
        `frame_${String(index).padStart(6, "0")}.${FRAME_EXTENSION}`,
      );
      await page.screenshot({ path: filePath, type: "jpeg", quality: FRAME_QUALITY });
      frames.push(filePath);
      try {
        opts.onProgress?.(frames.length, expectedFrames);
      } catch {
        /* progress reporting must never break the capture */
      }
    }

    logger.info("recorder captured frames", {
      count: frames.length,
      expectedFrames,
      animations: animationCount,
      fps,
      durationMs,
    });

    if (frames.length !== expectedFrames) {
      throw new Error(
        `recorder produced ${frames.length} frames but ${expectedFrames} were expected`,
      );
    }
    return frames;
  } finally {
    await browser.close().catch(() => {
      /* ignore */
    });
  }
}
