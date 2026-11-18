import { spawn } from "node:child_process";
import { getFfmpegPath } from "../utils/env.js";

/**
 * Read a media file's duration in milliseconds.
 *
 * `ffmpeg-static` ships no ffprobe, but `ffmpeg -i <input>` prints the container
 * header — including `Duration:` — to stderr before failing on the missing
 * output file, so one short-lived process is enough. Resolves `null` when the
 * duration cannot be determined, so callers fall back to an estimate rather than
 * fail the whole edit.
 */
export function probeDurationMs(url: string): Promise<number | null> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value: number | null) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    void (async () => {
      const ffmpeg = await getFfmpegPath();
      if (!ffmpeg) return finish(null);

      let stderr = "";
      const proc = spawn(ffmpeg, ["-hide_banner", "-i", url], { stdio: ["ignore", "ignore", "pipe"] });
      proc.stderr?.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
      });
      proc.on("error", () => finish(null));
      proc.on("close", () => {
        const match = /Duration:\s*(\d+):(\d{2}):(\d{2})\.(\d{1,3})/.exec(stderr);
        if (!match) return finish(null);
        const ms =
          ((Number(match[1]) * 60 + Number(match[2])) * 60 + Number(match[3])) * 1000 +
          Number(match[4].padEnd(3, "0"));
        finish(ms > 0 ? ms : null);
      });
      // ffmpeg with no output exits on its own; guard against a hung network read.
      const timer = setTimeout(() => {
        try {
          proc.kill();
        } catch {
          /* already gone */
        }
        finish(null);
      }, 20_000);
      timer.unref?.();
    })();
  });
}
