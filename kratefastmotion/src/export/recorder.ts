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

/**
 * Render a deterministic frame sequence of the preview page.
 *
 * The previous implementation used CDP `Page.startScreencast`, which only
 * emits a frame when the compositor repaints — a slow or idle CSS animation
 * produced a one-frame "video". Instead we pause every Web Animation
 * (`document.getAnimations()`), seek it to the exact timestamp of each frame,
 * wait for the paint, and take a screenshot. This produces exactly
 * `round(durationSeconds * fps)` frames regardless of animation speed.
 *
 * JavaScript-driven animations (RAF loops) cannot be seeked this way; the
 * generated export page is CSS-only, so that limitation does not apply here.
 */
export async function recordFrames(opts: RecordOptions): Promise<string[]> {
  const exe = await getBrowserPath();
  if (!exe) throw new Error("recorder: no browser executable found");

  const puppeteer = (await import("puppeteer-core")).default;
  mkdirSync(opts.framesDir, { recursive: true });

  const fps = Math.max(1, Math.floor(opts.fps));
  const durationMs = Math.max(1, opts.durationMs);
  const expectedFrames = Math.min(
    MAX_FRAMES,
    Math.max(1, Math.round((durationMs / 1000) * fps)),
  );

  const browser = await puppeteer.launch({
    executablePath: exe,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: opts.width,
      height: opts.height,
      deviceScaleFactor: 1,
    });
    await page.goto(opts.previewUrl, { waitUntil: "networkidle0", timeout: 20000 });

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

    const animationCount = await page.evaluate(() => {
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
        // Two frames: one to apply the seeked style, one to flush the paint.
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
      }, timeMs);

      const filePath = join(opts.framesDir, `frame_${String(index).padStart(6, "0")}.png`);
      await page.screenshot({ path: filePath, type: "png" });
      frames.push(filePath);
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
