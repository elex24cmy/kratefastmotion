import { logger } from "./logger.js";

let _puppeteerOk: boolean | null = null;
let _ffmpegOk: boolean | null = null;

/** Lazily check whether a usable puppeteer-core + browser is available. */
export async function hasPuppeteer(): Promise<boolean> {
  if (_puppeteerOk !== null) return _puppeteerOk;
  // Resolve the browser first: importing puppeteer-core pulls a large module
  // graph and can take tens of seconds, so skip it entirely when there is no
  // browser for it to drive.
  const exe = await findBrowserExecutable();
  if (!exe) {
    _puppeteerOk = false;
    logger.warn("Video export disabled: no browser executable found for puppeteer.");
    return false;
  }
  try {
    const puppeteer = await import("puppeteer-core");
    _puppeteerOk = !!puppeteer;
    return _puppeteerOk;
  } catch {
    _puppeteerOk = false;
    logger.warn("Video export disabled: puppeteer-core not installed.");
    return false;
  }
}

export async function hasFfmpeg(): Promise<boolean> {
  if (_ffmpegOk !== null) return _ffmpegOk;
  try {
    const ffmpegPath = (await import("ffmpeg-static")).default;
    _ffmpegOk = !!ffmpegPath;
    return _ffmpegOk;
  } catch {
    _ffmpegOk = false;
    return false;
  }
}

export async function getFfmpegPath(): Promise<string | null> {
  if (!(await hasFfmpeg())) return null;
  try {
    return (await import("ffmpeg-static")).default as string;
  } catch {
    return null;
  }
}

/** Public accessor for the discovered browser executable path (or null). */
export async function getBrowserPath(): Promise<string | null> {
  return findBrowserExecutable();
}

async function findBrowserExecutable(): Promise<string | null> {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const programFiles = process.env["ProgramFiles"] ?? "C:\\Program Files";
  const programFilesX86 = process.env["ProgramFiles(x86)"] ?? "C:\\Program Files (x86)";
  const localAppData = process.env["LOCALAPPDATA"];
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium",
    // Windows
    `${programFiles}\\Google\\Chrome\\Application\\chrome.exe`,
    `${programFilesX86}\\Google\\Chrome\\Application\\chrome.exe`,
    localAppData ? `${localAppData}\\Google\\Chrome\\Application\\chrome.exe` : "",
    `${programFiles}\\Microsoft\\Edge\\Application\\msedge.exe`,
    `${programFilesX86}\\Microsoft\\Edge\\Application\\msedge.exe`,
  ].filter(Boolean);
  const fs = await import("node:fs");
  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) return c;
    } catch {
      /* ignore */
    }
  }
  return null;
}

export async function hasNodeSqlite(): Promise<boolean> {
  try {
    const m = await import("node:sqlite");
    return !!m.DatabaseSync;
  } catch {
    return false;
  }
}
