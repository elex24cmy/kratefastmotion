import type { MotionSpec } from "@kratefastmotion/shared";
import { generateSpecCss } from "./css.js";
import { styleFlag } from "../units.js";

const RESERVED_STYLE_KEYS = new Set([
  "_content", "_tag", "_label", "_src", "_poster", "_loop", "_muted", "_autoplay", "_controls", "_group",
  // Timeline-synced media. A clip that declares `_start` is driven by the seek
  // protocol instead of free-running, so an exported frame is deterministic.
  "_start", "_rate", "_volume",
  // A layer that exists to be covered (a backdrop, a base video, a scrim). The
  // layout audit lets everything else sit on top of it.
  "_background",
]);

/** Style keys that indicate a component has been explicitly placed. */
const POSITION_KEYS = ["left", "top", "right", "bottom", "inset"] as const;

/** The design stage the film director composes against. */
const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;

/** Strip reserved (non-CSS) keys from a style record, returning CSS-only style + meta. */
function splitStyle(style: Record<string, string | number>): {
  cssStyle: Record<string, string | number>;
  content: string;
  /** True when the layer declares `_content` at all — including an explicit "". */
  hasContent: boolean;
  tag: string;
  src: string | null;
  poster: string | null;
  loop: boolean;
  muted: boolean;
  autoplay: boolean;
  controls: boolean;
  /** Source in-point in seconds for a timeline-synced clip. `null` means the
   *  clip free-runs (the pre-existing behaviour for simple media layers). */
  start: number | null;
  /** Playback rate of a timeline-synced clip. */
  rate: number;
  /** Static volume for a timeline-synced clip, or `null` to leave it alone. */
  volume: number | null;
} {
  const cssStyle: Record<string, string | number> = {};
  let content = "";
  let hasContent = false;
  let tag = "div";
  let src: string | null = null;
  let poster: string | null = null;
  let loop = false;
  let muted = false;
  let autoplay = true;
  let controls = false;
  let start: number | null = null;
  let rate = 1;
  let volume: number | null = null;
  for (const [k, v] of Object.entries(style)) {
    if (k === "_content") { content = String(v); hasContent = true; }
    else if (k === "_tag") tag = String(v);
    else if (k === "_src") src = String(v);
    else if (k === "_poster") poster = String(v);
    else if (k === "_loop") loop = styleFlag(v);
    else if (k === "_muted") muted = styleFlag(v);
    else if (k === "_autoplay") autoplay = styleFlag(v);
    else if (k === "_controls") controls = styleFlag(v);
    else if (k === "_start") {
      const n = Number(v);
      if (Number.isFinite(n)) start = n;
    } else if (k === "_rate") {
      const n = Number(v);
      if (Number.isFinite(n) && n > 0) rate = n;
    } else if (k === "_volume") {
      const n = Number(v);
      if (Number.isFinite(n)) volume = Math.max(0, Math.min(1, n));
    }
    else if (RESERVED_STYLE_KEYS.has(k)) continue;
    else cssStyle[k] = v;
  }
  return { cssStyle, content, hasContent, tag, src, poster, loop, muted, autoplay, controls, start, rate, volume };
}

interface WithMeta {
  id: string;
  name: string;
  selector: string | null;
  delayMs: number;
  durationMs: number;
  _meta: ReturnType<typeof splitStyle>;
}

/**
 * A spec is rendered on a fixed, scaled 16:9 stage when it has been
 * art-directed (any layer carries an explicit position, or the project sets
 * the `__stage` token). Everything else keeps the original auto-flow layout so
 * simple single-effect specs are unaffected.
 */
function detectStageMode(spec: MotionSpec, comps: WithMeta[]): boolean {
  if (String(spec.project.tokens.__stage ?? "") === "1") return true;
  return comps.some((c) => POSITION_KEYS.some((k) => k in c._meta.cssStyle));
}

/** Build a standalone, runnable HTML document from a MotionSpec. */
export function generateStandaloneHtml(spec: MotionSpec): string {
  const componentsWithMeta: WithMeta[] = [...spec.components]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((c) => ({
      id: c.id,
      name: c.name,
      selector: c.selector,
      delayMs: c.delayMs,
      durationMs: c.durationMs,
      _meta: splitStyle(c.style),
    }));

  // The artboard tokens are the single source of truth for the design stage.
  // Reading them here keeps the preview and the export in the same coordinate
  // space as the editor canvas, which already honours them — a portrait edit
  // would otherwise be letterboxed onto a 16:9 stage.
  const tokens = spec.project.tokens ?? {};
  const artW = Number(tokens.artboardWidth);
  const artH = Number(tokens.artboardHeight);
  const stageWidth = Number.isFinite(artW) && artW > 0 ? artW : STAGE_WIDTH;
  const stageHeight = Number.isFinite(artH) && artH > 0 ? artH : STAGE_HEIGHT;

  // Rebuild components with CSS-only styles for the stylesheet generator.
  const cssComponents = spec.components
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((c) => ({ ...c, style: splitStyle(c.style).cssStyle }));
  const css = generateSpecCss(cssComponents);

  const stageMode = detectStageMode(spec, componentsWithMeta);

  const bodyNodes = componentsWithMeta
    .map((c) => {
      const cls = c.selector ? "" : ` class="om-c-${c.id}"`;
      const meta = c._meta;
      const isMedia = meta.tag === "img" || meta.tag === "video" || meta.tag === "audio";
      const mediaAttrs: string[] = [];
      if (isMedia) {
        if (meta.src) mediaAttrs.push(`src="${escapeAttr(meta.src)}"`);
        if (meta.poster) mediaAttrs.push(`poster="${escapeAttr(meta.poster)}"`);
        if (meta.loop) mediaAttrs.push("loop");
        if (meta.muted) mediaAttrs.push("muted");
        // A timeline-synced clip must not free-run — the exporter drives its
        // currentTime — so autoplay is suppressed for it.
        if (meta.autoplay && meta.start === null) mediaAttrs.push("autoplay");
        if (meta.controls) mediaAttrs.push("controls");
        if (meta.tag !== "img") mediaAttrs.push('preload="auto"');
        mediaAttrs.push("playsinline");
        if (meta.start !== null) {
          mediaAttrs.push(`data-om-media="1"`);
          mediaAttrs.push(`data-om-delay="${c.delayMs}"`);
          mediaAttrs.push(`data-om-duration="${c.durationMs}"`);
          mediaAttrs.push(`data-om-start="${meta.start}"`);
          mediaAttrs.push(`data-om-rate="${meta.rate}"`);
          if (meta.volume !== null) mediaAttrs.push(`data-om-volume="${meta.volume}"`);
        }
      }
      const attrs = mediaAttrs.length > 0 ? " " + mediaAttrs.join(" ") : "";
      if (isMedia) {
        return `    <${meta.tag}${cls}${attrs} data-om-name="${escapeHtml(c.name)}"></${meta.tag}>`;
      }
      // Only fall back to the layer name when the layer never declared
      // `_content`. An explicit "" means "this is a shape, draw no text" —
      // matching the editor canvas, which renders the layer's content as-is.
      const content = meta.hasContent
        ? escapeHtml(meta.content)
        : escapeHtml(c.name);
      return `    <${meta.tag}${cls} data-om-name="${escapeHtml(c.name)}">${content}</${meta.tag}>`;
    })
    .join("\n");

  const title = escapeHtml(spec.project.name || "KrateFastMotion");

  const layoutCss = stageMode ? stageCss(stageWidth, stageHeight) : FLOW_CSS;
  const body = stageMode
    ? `  <div class="kfm-viewport">\n    <div class="kfm-stage">\n${bodyNodes}\n    </div>\n  </div>`
    : bodyNodes;

  const script = stageMode
    ? `${REPLAY_SCRIPT}\n${fitScript(stageWidth, stageHeight)}\n${MEDIA_SCRIPT}`
    : `${REPLAY_SCRIPT}\n${MEDIA_SCRIPT}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<style>
${layoutCss}

${css}
</style>
</head>
<body>
${body}
  <script>
${script}
  </script>
</body>
</html>`;
}

const FLOW_CSS = `  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    gap: 24px; flex-wrap: wrap;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: radial-gradient(120% 120% at 50% 0%, #1b2230 0%, #0b0e14 60%);
    color: #f4f6fb;
    padding: 48px;
  }
  [data-om-name] { will-change: transform, opacity; }`;

function stageCss(width: number, height: number): string {
  return `  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; height: 100%; background: #000; overflow: hidden; }
  body {
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: #f4f6fb;
  }
  .kfm-viewport {
    position: fixed; inset: 0; overflow: hidden; background: #000;
    display: flex; align-items: center; justify-content: center;
  }
  .kfm-stage {
    position: relative; flex: none;
    width: ${width}px; height: ${height}px;
    overflow: hidden; background: #000;
    transform-origin: center center;
  }
  .kfm-stage > [data-om-name] { position: absolute; }
  [data-om-name] { will-change: transform, opacity; }`;
}

const REPLAY_SCRIPT = `    // Replay helper: shift+R restarts all animations.
    document.addEventListener('keydown', (e) => {
      if (e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        document.querySelectorAll('[data-om-name]').forEach((el) => {
          el.style.animation = 'none';
          void el.offsetWidth;
          el.style.animation = '';
        });
      }
    });`;

function fitScript(width: number, height: number): string {
  return `    // Fit the fixed design stage to the viewport (letterboxed, never cropped).
    (function () {
      var stage = document.querySelector('.kfm-stage');
      if (!stage) return;
      var W = ${width}, H = ${height};
      function fit() {
        var s = Math.min(window.innerWidth / W, window.innerHeight / H);
        stage.style.transform = 'scale(' + s + ')';
      }
      fit();
      window.addEventListener('resize', fit);
    })();`;
}

/**
 * Deterministic media seeking.
 *
 * `document.getAnimations()` seeking handles every CSS layer, but a `<video>`
 * or `<audio>` is not a Web Animation: left to itself it free-runs in real
 * time, so an exported frame is whatever the decoder happened to be showing.
 * A timeline-synced clip declares `_start`, which stamps it with
 * `data-om-media` and the timing it needs. `seekMedia(ms)` maps the timeline
 * time onto the clip's own in-point, pauses it, and resolves only once every
 * element has actually landed on the requested frame — so the capture that
 * follows is deterministic.
 */
const MEDIA_SCRIPT = `    // --- deterministic media seeking (timeline-synced clips) ---
    window.__kfm = window.__kfm || {};
    window.__kfm.media = function () {
      return Array.prototype.slice.call(document.querySelectorAll('[data-om-media]'));
    };
    window.__kfm.ready = function () {
      var els = window.__kfm.media();
      if (!els.length) return Promise.resolve();
      return Promise.all(els.map(function (el) {
        if (el.readyState >= 2) return Promise.resolve();
        return new Promise(function (resolve) {
          var settled = false;
          var done = function () { if (settled) return; settled = true; resolve(); };
          el.addEventListener('loadeddata', done, { once: true });
          el.addEventListener('error', done, { once: true });
          setTimeout(done, 8000);
        });
      }));
    };
    window.__kfm.seekMedia = function (ms) {
      var els = window.__kfm.media();
      if (!els.length) return Promise.resolve();
      var waits = [];
      els.forEach(function (el) {
        // A clip that is not on screen has no frame to contribute, and seeking
        // it would stall the capture. Cutaways and held layers are skipped until
        // they become visible.
        var cs = window.getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return;
        var delay = Number(el.getAttribute('data-om-delay') || 0);
        var dur = Number(el.getAttribute('data-om-duration') || 0);
        var start = Number(el.getAttribute('data-om-start') || 0);
        var rate = Number(el.getAttribute('data-om-rate') || 1) || 1;
        var local = ms - delay;
        var t;
        if (local <= 0) t = start;
        else if (dur > 0 && local >= dur) t = start + (dur / 1000) * rate;
        else t = start + (local / 1000) * rate;
        var known = el.duration;
        if (isFinite(known) && known > 0) t = Math.min(t, Math.max(0, known - 0.04));
        if (!(t >= 0)) t = 0;
        try { el.pause(); } catch (e) {}
        // Already showing this frame and decoded? Nothing to wait for.
        if (Math.abs((el.currentTime || 0) - t) < 0.005 && el.readyState >= 2) return;
        waits.push(new Promise(function (resolve) {
          var settled = false;
          var done = function () {
            if (settled) return;
            settled = true;
            el.removeEventListener('seeked', done);
            resolve();
          };
          el.addEventListener('seeked', done);
          setTimeout(done, 6000);
          try { el.currentTime = t; } catch (e) { done(); }
        }));
      });
      return waits.length ? Promise.all(waits) : Promise.resolve();
    };`;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, "&quot;").replace(/&/g, "&amp;");
}
