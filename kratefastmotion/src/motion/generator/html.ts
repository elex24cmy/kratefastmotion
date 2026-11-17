import type { MotionSpec } from "@kratefastmotion/shared";
import { generateSpecCss } from "./css.js";

const RESERVED_STYLE_KEYS = new Set(["_content", "_tag", "_label", "_src", "_poster", "_loop", "_muted", "_autoplay", "_controls"]);

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
  for (const [k, v] of Object.entries(style)) {
    if (k === "_content") { content = String(v); hasContent = true; }
    else if (k === "_tag") tag = String(v);
    else if (k === "_src") src = String(v);
    else if (k === "_poster") poster = String(v);
    else if (k === "_loop") loop = Boolean(v);
    else if (k === "_muted") muted = Boolean(v);
    else if (k === "_autoplay") autoplay = Boolean(v);
    else if (k === "_controls") controls = Boolean(v);
    else if (RESERVED_STYLE_KEYS.has(k)) continue;
    else cssStyle[k] = v;
  }
  return { cssStyle, content, hasContent, tag, src, poster, loop, muted, autoplay, controls };
}

interface WithMeta {
  id: string;
  name: string;
  selector: string | null;
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
    .map((c) => ({ id: c.id, name: c.name, selector: c.selector, _meta: splitStyle(c.style) }));

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
        if (meta.autoplay) mediaAttrs.push("autoplay");
        if (meta.controls) mediaAttrs.push("controls");
        mediaAttrs.push("playsinline");
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

  const layoutCss = stageMode ? STAGE_CSS : FLOW_CSS;
  const body = stageMode
    ? `  <div class="kfm-viewport">\n    <div class="kfm-stage">\n${bodyNodes}\n    </div>\n  </div>`
    : bodyNodes;

  const script = stageMode
    ? `${REPLAY_SCRIPT}\n${FIT_SCRIPT}`
    : REPLAY_SCRIPT;

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

const STAGE_CSS = `  :root { color-scheme: dark; }
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
    width: ${STAGE_WIDTH}px; height: ${STAGE_HEIGHT}px;
    overflow: hidden; background: #000;
    transform-origin: center center;
  }
  .kfm-stage > [data-om-name] { position: absolute; }
  [data-om-name] { will-change: transform, opacity; }`;

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

const FIT_SCRIPT = `    // Fit the fixed design stage to the viewport (letterboxed, never cropped).
    (function () {
      var stage = document.querySelector('.kfm-stage');
      if (!stage) return;
      var W = ${STAGE_WIDTH}, H = ${STAGE_HEIGHT};
      function fit() {
        var s = Math.min(window.innerWidth / W, window.innerHeight / H);
        stage.style.transform = 'scale(' + s + ')';
      }
      fit();
      window.addEventListener('resize', fit);
    })();`;

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
