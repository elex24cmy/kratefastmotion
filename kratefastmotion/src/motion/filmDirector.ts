import type { Easing, Keyframe, Scene } from "@kratefastmotion/shared";
import { easingBezier } from "@kratefastmotion/shared";
import { createId } from "../utils/id.js";
import { draft, type ComponentDraft } from "./templates/helper.js";

/**
 * Film Director — turns a natural-language brief into a real, art-directed,
 * multi-scene motion composition on a fixed 1920x1080 stage.
 *
 * This is deliberately deterministic and LLM-free. Its job is to guarantee the
 * agent always has a genuinely composed, non-empty result: a background, an
 * accent light, a typographic hierarchy, staggered entrances and clean exits,
 * laid out on a stage the renderer understands. An LLM (or the user) can refine
 * it afterwards, but nothing about the pipeline can degrade to an empty canvas.
 *
 * Design rules applied here:
 *  - every layer is absolutely positioned with explicit units
 *  - content animates in AND out (`fillMode: both`) so scenes read as beats
 *  - per-keyframe bezier easing: fast-out entrance, accelerated exit
 *  - one global background with a slow Ken-Burns drift, per-scene accent glow
 *  - a type scale with a clear hierarchy (eyebrow / headline / subhead / rule)
 */

export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

export type FilmStyle = "cinematic" | "tech" | "playful" | "calm" | "energetic" | "default";

export interface FilmPalette {
  bgFrom: string;
  bgTo: string;
  text: string;
  subtext: string;
  accent: string;
  accent2: string;
  glow: string;
}

const PALETTES: Record<FilmStyle, FilmPalette> = {
  cinematic: { bgFrom: "#05070f", bgTo: "#141b33", text: "#f7f8fc", subtext: "#9aa6bd", accent: "#d8b45a", accent2: "#7c8cff", glow: "#d8b45a" },
  tech: { bgFrom: "#04070d", bgTo: "#0b1626", text: "#eef4ff", subtext: "#8fa3bf", accent: "#38bdf8", accent2: "#a78bfa", glow: "#38bdf8" },
  playful: { bgFrom: "#1a0f33", bgTo: "#3a1b52", text: "#fff7fb", subtext: "#d7b7e8", accent: "#f472b6", accent2: "#fbbf24", glow: "#f472b6" },
  calm: { bgFrom: "#06120f", bgTo: "#0f2a22", text: "#eefaf5", subtext: "#9fc4b6", accent: "#34d399", accent2: "#7dd3fc", glow: "#34d399" },
  energetic: { bgFrom: "#160708", bgTo: "#331012", text: "#fff5f0", subtext: "#e8b3a3", accent: "#fb7185", accent2: "#fbbf24", glow: "#fb7185" },
  default: { bgFrom: "#080b14", bgTo: "#151d33", text: "#f4f6fb", subtext: "#9aa4b2", accent: "#6366f1", accent2: "#22d3ee", glow: "#6366f1" },
};

const STYLE_LABELS: Record<FilmStyle, string> = {
  cinematic: "A cinematic piece",
  tech: "Built for what's next",
  playful: "Play. Create. Repeat.",
  calm: "Breathe. Move. Be.",
  energetic: "Made to move you",
  default: "Motion, composed",
};

/** Fast-out entrance, accelerated exit, and a neutral hold. */
const EASE_OUT: Easing = easingBezier([0.16, 1], [0.3, 1]);
const EASE_IN: Easing = easingBezier([0.7, 0], [0.84, 0]);
const EASE_IN_OUT: Easing = easingBezier([0.65, 0], [0.35, 1]);
const EASE_BACK: Easing = easingBezier([0.34, 1.56], [0.64, 1]);

const FONT_STACK = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO_STACK = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

export interface FilmStat {
  value: string;
  label: string;
}

export interface FilmBrief {
  title: string;
  subtitle: string;
  tagline: string;
  mark: string;
  features: string[];
  stats: FilmStat[];
  style: FilmStyle;
  sceneCount: number;
  sceneDurationMs: number;
  totalDurationMs: number;
}

export type FilmSceneKind = "title" | "features" | "statement" | "outro";

export interface FilmScene extends Omit<Scene, "durationMs"> {
  durationMs: number;
  kind: FilmSceneKind;
}

export interface FilmPlan {
  scenes: FilmScene[];
  drafts: ComponentDraft[];
  totalDurationMs: number;
  palette: FilmPalette;
  style: FilmStyle;
  title: string;
}

// ---------------------------------------------------------------------------
// Brief analysis
// ---------------------------------------------------------------------------

function titleCase(s: string): string {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (/^[A-Z0-9]{2,}$/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

const STOP_WORDS = new Set([
  "create", "make", "build", "design", "generate", "produce", "give", "show", "me", "us",
  "a", "an", "the", "of", "for", "with", "and", "or", "that", "this", "these", "those",
  "please", "using", "use", "into", "about", "full", "short", "quick", "simple",
  "premium", "quality", "professional", "polished", "beautiful", "stunning", "sleek",
  "modern", "clean", "elegant", "bold", "cinematic", "epic", "nice", "good", "great",
  "motion", "film", "video", "animation", "animated", "graphic", "sequence", "piece",
  "second", "seconds", "sec", "minute", "minutes", "min", "long",
]);

function deriveTitle(prompt: string, fallback: string): string {
  const quoted = prompt.match(/["“”'‘’]([^"“”'‘’]{2,60})["“”'‘’]/);
  if (quoted) return titleCase(quoted[1].trim());

  const named = prompt.match(/\b(?:called|named|titled|title|about|for)\s+([^.,;:!?()]{2,60})/i);
  if (named) {
    // Cut the captured phrase at the first clause boundary so a trailing
    // qualifier doesn't leak into the title
    // ("... about deep ocean exploration with three scenes" -> "deep ocean exploration").
    const head = named[1].split(/\b(?:with|featuring|using|that|which|showing|and|plus)\b/i)[0];
    const words = head
      .trim()
      .replace(/\b(the|a|an)\b/gi, " ")
      .split(/\s+/)
      .filter((w) => w.length > 1 && !STOP_WORDS.has(w.toLowerCase()))
      .slice(0, 4);
    if (words.length) return titleCase(words.join(" "));
  }

  const words = prompt
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w.toLowerCase()));
  if (words.length) return titleCase(words.slice(0, 3).join(" "));
  return fallback;
}

const STYLE_KEYWORDS: Record<Exclude<FilmStyle, "default">, string[]> = {
  cinematic: [
    "luxury", "luxurious", "cinematic", "cinema", "film noir", "premium", "elegant", "gold",
    "editorial", "classy", "dramatic", "noir", "sophisticated", "refined", "opulent", "heritage",
  ],
  tech: [
    "tech", "technology", "artificial intelligence", "saas", "startup", "software", "futuristic",
    "cyber", "developer", "code", "dashboard", "api", "digital", "neon", "algorithm", "quantum",
  ],
  playful: [
    "playful", "fun", "kids", "toy", "party", "candy", "colorful", "colourful", "cute",
    "birthday", "game", "bubbly", "whimsical", "silly", "cheerful",
  ],
  calm: [
    "calm", "serene", "zen", "nature", "organic", "wellness", "meditation", "spa", "garden",
    "ocean", "forest", "gentle", "soothing", "mindful", "breathing", "minimal", "quiet", "soft",
  ],
  energetic: [
    "energetic", "sport", "sports", "gym", "fitness", "action", "bold", "loud", "explosive",
    "hype", "fast", "racing", "extreme", "intense", "punchy", "sneaker", "adrenaline",
  ],
};

/**
 * Score every style by keyword hits and take the strongest signal. Scoring
 * (rather than first-match ordering) means a prompt like "a calm meditation
 * intro for an app" reads as calm instead of being captured by a generic
 * technology keyword.
 */
function detectStyle(prompt: string): FilmStyle {
  const p = ` ${prompt.toLowerCase()} `;
  const order: Array<Exclude<FilmStyle, "default">> = [
    "cinematic",
    "tech",
    "playful",
    "calm",
    "energetic",
  ];
  let best: FilmStyle = "default";
  let bestScore = 0;
  for (const style of order) {
    let score = 0;
    for (const kw of STYLE_KEYWORDS[style]) {
      if (p.includes(kw)) score += kw.length > 5 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = style;
    }
  }
  return best;
}

function detectDurationMs(prompt: string): number {
  const p = prompt.toLowerCase();
  const min = p.match(/(\d+(?:\.\d+)?)\s*(?:-|\s)?\s*(?:minute|minutes|min)\b/);
  if (min) return Math.round(Number(min[1]) * 60_000);
  const sec = p.match(/(\d+(?:\.\d+)?)\s*(?:-|\s)?\s*(?:second|seconds|sec|s)\b/);
  if (sec) return Math.round(Number(sec[1]) * 1000);
  if (/\bfeature[- ]?length\b|\bfull\b.*\bfilm\b/.test(p)) return 45_000;
  return 12_000;
}

function deriveFeatures(prompt: string, style: FilmStyle): string[] {
  const m = prompt.match(/\bwith\s+([^.!?]{6,180})/i) ?? prompt.match(/\bfeaturing\s+([^.!?]{6,180})/i);
  if (m) {
    const parts = m[1]
      .split(/,|\band\b|\bplus\b|&|\//i)
      .map((s) => s.trim().replace(/^(a|an|the)\s+/i, ""))
      .filter((s) => s.length > 2 && s.split(/\s+/).length <= 6)
      .slice(0, 3);
    if (parts.length >= 2) return parts.map((s) => titleCase(s));
  }
  switch (style) {
    case "cinematic":
      return ["Crafted frame by frame", "Sound-led pacing", "Colour-graded finish"];
    case "tech":
      return ["Real-time performance", "Composable layers", "Pixel-accurate timing"];
    case "playful":
      return ["Bright, bouncy motion", "Friendly type", "Delightful details"];
    case "calm":
      return ["Gentle easing", "Open composition", "Breathing rhythm"];
    case "energetic":
      return ["High-contrast cuts", "Punchy accents", "Relentless pace"];
    default:
      return ["Considered composition", "Clear hierarchy", "Confident timing"];
  }
}

function deriveStats(style: FilmStyle): FilmStat[] {
  switch (style) {
    case "cinematic":
      return [{ value: "24", label: "frames per second" }, { value: "2.39:1", label: "scope ratio" }, { value: "10-bit", label: "colour depth" }];
    case "tech":
      return [{ value: "60", label: "frames per second" }, { value: "4K", label: "ready output" }, { value: "100%", label: "vector layers" }];
    case "energetic":
      return [{ value: "3-2-1", label: "countdown" }, { value: "0.2s", label: "beat length" }, { value: "MAX", label: "intensity" }];
    default:
      return [{ value: "3", label: "acts" }, { value: "12s", label: "runtime" }, { value: "1", label: "idea" }];
  }
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/** Parse a free-form brief into a structured film plan description. */
export function analyzeBrief(prompt: string, fallbackName = "KrateFastMotion"): FilmBrief {
  const style = detectStyle(prompt);
  const totalDurationMs = clamp(detectDurationMs(prompt), 6_000, 180_000);
  const baseSceneMs = totalDurationMs >= 30_000 ? 5_000 : totalDurationMs >= 20_000 ? 4_500 : 4_000;
  const sceneCount = clamp(Math.round(totalDurationMs / baseSceneMs), 3, 8);
  // Distribute the requested runtime evenly across scenes (rounded to 100ms)
  // so "20 second" yields 4 × 5000ms rather than 4 × 4500ms.
  const sceneDurationMs = Math.max(1_500, Math.round(totalDurationMs / sceneCount / 100) * 100);
  const title = deriveTitle(prompt, fallbackName);
  const mark = title
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "KF";

  return {
    title,
    subtitle: STYLE_LABELS[style],
    tagline: fallbackName,
    mark,
    features: deriveFeatures(prompt, style),
    stats: deriveStats(style),
    style,
    sceneCount,
    sceneDurationMs,
    totalDurationMs: sceneCount * sceneDurationMs,
  };
}

// ---------------------------------------------------------------------------
// Composition builders
// ---------------------------------------------------------------------------

function fullBleed(extra: Record<string, string | number> = {}): Record<string, string | number> {
  return { left: "0px", top: "0px", width: "100%", height: "100%", ...extra };
}

/** Full-width, horizontally centred text block anchored at a vertical percent. */
function centeredText(top: string, extra: Record<string, string | number> = {}): Record<string, string | number> {
  return { left: "0px", width: "100%", textAlign: "center", top, ...extra };
}

function circle(size: number, topPct: number, extra: Record<string, string | number> = {}): Record<string, string | number> {
  return {
    left: "50%",
    top: `${topPct}%`,
    width: `${size}px`,
    height: `${size}px`,
    marginLeft: `${-size / 2}px`,
    marginTop: `${-size / 2}px`,
    borderRadius: "50%",
    ...extra,
  };
}

/** Entrance → hold → exit, with fast-out in and accelerated out. */
function beat(
  from: Record<string, string | number>,
  hold: Record<string, string | number>,
  exit: Record<string, string | number> = {},
): Keyframe[] {
  return [
    { offset: 0, properties: { opacity: 0, ...from } as Keyframe["properties"], easing: EASE_OUT },
    { offset: 0.18, properties: { opacity: 1, ...hold } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: 0.82, properties: { opacity: 1, ...hold } as Keyframe["properties"], easing: EASE_IN },
    { offset: 1, properties: { opacity: 0, ...hold, ...exit } as Keyframe["properties"] },
  ];
}

/**
 * Entrance → hold, ending visible. Used by the closing scene so the film — and
 * the editor canvas at rest, which keeps each layer's final `fill-mode: both`
 * state — ends on a composed end card instead of a blank stage after every
 * layer has faded out.
 */
function beatHold(
  from: Record<string, string | number>,
  hold: Record<string, string | number>,
): Keyframe[] {
  return [
    { offset: 0, properties: { opacity: 0, ...from } as Keyframe["properties"], easing: EASE_OUT },
    { offset: 0.22, properties: { opacity: 1, ...hold } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: 1, properties: { opacity: 1, ...hold } as Keyframe["properties"] },
  ];
}

interface Ctx {
  palette: FilmPalette;
  brief: FilmBrief;
  idx: number;
}

function mk(
  ctx: Ctx,
  name: string,
  sceneId: string | null,
  opts: {
    durationMs: number;
    delayMs: number;
    easing?: Easing;
    keyframes?: Keyframe[];
    style: Record<string, string | number>;
    iterationCount?: number | "infinite";
  },
): ComponentDraft {
  // Every film layer is pinned to the 1920x1080 stage. Without an explicit
  // `position`, the editor canvas lays layers out in normal flow and stacks
  // them below the artboard — so only the backdrop is visible and the canvas
  // looks blank even though the spec is full of content. An explicit
  // `position` in the caller's style still wins.
  const style: Record<string, string | number> = { position: "absolute", ...opts.style };
  const d = draft(name, {
    sceneId,
    durationMs: opts.durationMs,
    delayMs: opts.delayMs,
    easing: opts.easing ?? EASE_OUT,
    keyframes: opts.keyframes ?? [],
    style,
    iterationCount: opts.iterationCount ?? 1,
    fillMode: "both",
  });
  d.orderIndex = ctx.idx++;
  return d;
}

function backgroundLayer(ctx: Ctx, totalMs: number): ComponentDraft {
  const { palette } = ctx;
  return mk(ctx, "Backdrop", null, {
    durationMs: totalMs,
    delayMs: 0,
    easing: EASE_IN_OUT,
    keyframes: [
      { offset: 0, properties: { scale: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
      { offset: 1, properties: { scale: 1.06 } as Keyframe["properties"] },
    ],
    style: fullBleed({
      background: `linear-gradient(135deg, ${palette.bgFrom} 0%, ${palette.bgTo} 100%)`,
      transformOrigin: "center center",
      zIndex: "0",
    }),
  });
}

function vignetteLayer(ctx: Ctx, totalMs: number): ComponentDraft {
  return mk(ctx, "Vignette", null, {
    durationMs: totalMs,
    delayMs: 0,
    easing: EASE_IN_OUT,
    keyframes: [
      { offset: 0, properties: { opacity: 0.75 } as Keyframe["properties"] },
      { offset: 1, properties: { opacity: 0.75 } as Keyframe["properties"] },
    ],
    style: fullBleed({
      background: "radial-gradient(120% 120% at 50% 45%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 100%)",
      pointerEvents: "none",
      zIndex: "1",
    }),
  });
}

function glowLayer(ctx: Ctx, sceneId: string, sceneStart: number, sceneDuration: number, topPct = 48, size = 1500): ComponentDraft {
  const { palette } = ctx;
  return mk(ctx, "Accent Glow", sceneId, {
    durationMs: sceneDuration,
    delayMs: sceneStart,
    easing: EASE_IN_OUT,
    keyframes: [
      { offset: 0, properties: { opacity: 0, scale: 0.85 } as Keyframe["properties"], easing: EASE_OUT },
      { offset: 0.3, properties: { opacity: 0.5, scale: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
      { offset: 0.8, properties: { opacity: 0.42, scale: 1.04 } as Keyframe["properties"], easing: EASE_IN },
      { offset: 1, properties: { opacity: 0, scale: 1.08 } as Keyframe["properties"] },
    ],
    style: circle(size, topPct, {
      background: `radial-gradient(circle, ${palette.glow}66 0%, ${palette.glow}22 38%, rgba(0,0,0,0) 72%)`,
      filter: "blur(40px)",
      pointerEvents: "none",
      zIndex: "2",
    }),
  });
}

function titleScene(ctx: Ctx, scene: FilmScene, start: number): ComponentDraft[] {
  const { palette, brief } = ctx;
  const base = scene.durationMs;
  const out: ComponentDraft[] = [];
  out.push(glowLayer(ctx, scene.id, start, base, 46, 1500));

  out.push(mk(ctx, "Eyebrow", scene.id, {
    durationMs: base - 200,
    delayMs: start + 200,
    keyframes: beat({ translateY: 18 }, { translateY: 0 }),
    style: centeredText("34%", {
      color: palette.accent,
      fontFamily: MONO_STACK,
      fontSize: "22px",
      fontWeight: "600",
      letterSpacing: "0.42em",
      textTransform: "uppercase",
      margin: "0px",
      zIndex: "10",
    }),
  }));
  out.push(mk(ctx, "Headline", scene.id, {
    durationMs: base - 500,
    delayMs: start + 420,
    keyframes: beat({ translateY: 46, scale: 0.97 }, { translateY: 0, scale: 1 }, { translateY: -22 }),
    style: centeredText("41%", {
      color: palette.text,
      fontFamily: FONT_STACK,
      fontSize: "132px",
      fontWeight: "800",
      lineHeight: "1.02",
      letterSpacing: "-0.02em",
      margin: "0px",
      textShadow: "0 18px 60px rgba(0,0,0,0.45)",
      zIndex: "10",
    }),
  }));
  out.push(mk(ctx, "Rule", scene.id, {
    durationMs: base - 700,
    delayMs: start + 720,
    easing: EASE_IN_OUT,
    keyframes: [
      { offset: 0, properties: { scaleX: 0, opacity: 0 } as Keyframe["properties"], easing: EASE_OUT },
      { offset: 0.25, properties: { scaleX: 1, opacity: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
      { offset: 0.82, properties: { scaleX: 1, opacity: 1 } as Keyframe["properties"], easing: EASE_IN },
      { offset: 1, properties: { scaleX: 1, opacity: 0 } as Keyframe["properties"] },
    ],
    style: {
      left: "50%",
      top: "62%",
      width: "220px",
      height: "5px",
      marginLeft: "-110px",
      borderRadius: "3px",
      background: `linear-gradient(90deg, ${palette.accent}, ${palette.accent2})`,
      transformOrigin: "center center",
      zIndex: "10",
    },
  }));
  out.push(mk(ctx, "Subhead", scene.id, {
    durationMs: base - 900,
    delayMs: start + 900,
    keyframes: beat({ translateY: 20 }, { translateY: 0 }),
    style: centeredText("68%", {
      color: palette.subtext,
      fontFamily: FONT_STACK,
      fontSize: "30px",
      fontWeight: "400",
      letterSpacing: "0.01em",
      margin: "0px",
      zIndex: "10",
    }),
  }));
  return out;
}

function featuresScene(ctx: Ctx, scene: FilmScene, start: number, variant: number): ComponentDraft[] {
  const { palette, brief } = ctx;
  const base = scene.durationMs;
  const out: ComponentDraft[] = [];
  out.push(glowLayer(ctx, scene.id, start, base, 50, 1300));

  const eyebrow = variant % 2 === 0 ? "What's inside" : "Why it works";
  out.push(mk(ctx, "Section Label", scene.id, {
    durationMs: base - 200,
    delayMs: start + 180,
    keyframes: beat({ translateY: 16 }, { translateY: 0 }),
    style: { left: "14%", top: "26%", width: "72%", color: palette.accent, fontFamily: MONO_STACK, fontSize: "20px", fontWeight: "600", letterSpacing: "0.36em", textTransform: "uppercase", margin: "0px", zIndex: "10" },
  }));

  const rows = brief.features.slice(0, 3);
  rows.forEach((label, i) => {
    const top = 40 + i * 13;
    out.push(mk(ctx, `Feature Bullet ${i + 1}`, scene.id, {
      durationMs: base - 500 - i * 120,
      delayMs: start + 420 + i * 180,
      keyframes: beat({ translateX: -26 }, { translateX: 0 }),
      style: {
        left: "14%",
        top: `${top}%`,
        width: "14px",
        height: "14px",
        borderRadius: "4px",
        background: i % 2 === 0 ? palette.accent : palette.accent2,
        boxShadow: `0 0 22px ${(i % 2 === 0 ? palette.accent : palette.accent2)}99`,
        zIndex: "10",
      },
    }));
    out.push(mk(ctx, `Feature ${i + 1}`, scene.id, {
      durationMs: base - 500 - i * 120,
      delayMs: start + 470 + i * 180,
      keyframes: beat({ translateX: 24 }, { translateX: 0 }),
      style: {
        left: "17.5%",
        top: `${top - 1.2}%`,
        width: "68%",
        color: palette.text,
        fontFamily: FONT_STACK,
        fontSize: "44px",
        fontWeight: "600",
        letterSpacing: "-0.01em",
        margin: "0px",
        zIndex: "10",
      },
    }));
  });
  return out;
}

function statementScene(ctx: Ctx, scene: FilmScene, start: number): ComponentDraft[] {
  const { palette, brief } = ctx;
  const base = scene.durationMs;
  const out: ComponentDraft[] = [];
  out.push(glowLayer(ctx, scene.id, start, base, 48, 1700));
  const line = brief.stats[0] ? brief.stats[0].value : "—";
  const label = brief.stats[0] ? brief.stats[0].label : "";

  out.push(mk(ctx, "Statement Figure", scene.id, {
    durationMs: base - 500,
    delayMs: start + 360,
    keyframes: beat({ scale: 0.92, translateY: 30 }, { scale: 1, translateY: 0 }),
    style: centeredText("36%", {
      color: palette.text,
      fontFamily: FONT_STACK,
      fontSize: "200px",
      fontWeight: "800",
      lineHeight: "1",
      letterSpacing: "-0.03em",
      margin: "0px",
      background: `linear-gradient(180deg, ${palette.text}, ${palette.accent})`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
      zIndex: "10",
    }),
  }));
  out.push(mk(ctx, "Statement Label", scene.id, {
    durationMs: base - 700,
    delayMs: start + 640,
    keyframes: beat({ translateY: 18 }, { translateY: 0 }),
    style: centeredText("64%", {
      color: palette.subtext,
      fontFamily: MONO_STACK,
      fontSize: "24px",
      fontWeight: "500",
      letterSpacing: "0.34em",
      textTransform: "uppercase",
      margin: "0px",
      zIndex: "10",
    }),
  }));
  void line;
  void label;
  return out;
}

function outroScene(ctx: Ctx, scene: FilmScene, start: number): ComponentDraft[] {
  const { palette, brief } = ctx;
  const base = scene.durationMs;
  const out: ComponentDraft[] = [];
  out.push(glowLayer(ctx, scene.id, start, base, 46, 1200));

  out.push(mk(ctx, "Logo Mark", scene.id, {
    durationMs: base - 500,
    delayMs: start + 300,
    easing: EASE_BACK,
    keyframes: beatHold({ scale: 0.4, rotate: -12 }, { scale: 1, rotate: 0 }),
    style: {
      left: "50%",
      top: "36%",
      width: "112px",
      height: "112px",
      marginLeft: "-56px",
      borderRadius: "28px",
      background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
      color: "#0b0e14",
      fontFamily: FONT_STACK,
      fontSize: "46px",
      fontWeight: "800",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 24px 70px ${palette.accent}55`,
      _content: brief.mark,
      _tag: "div",
      zIndex: "10",
    },
  }));
  out.push(mk(ctx, "Wordmark", scene.id, {
    durationMs: base - 600,
    delayMs: start + 500,
    keyframes: beatHold({ translateY: 24 }, { translateY: 0 }),
    style: centeredText("52%", {
      color: palette.text,
      fontFamily: FONT_STACK,
      fontSize: "72px",
      fontWeight: "800",
      letterSpacing: "-0.01em",
      margin: "0px",
      zIndex: "10",
    }),
  }));
  out.push(mk(ctx, "Tagline", scene.id, {
    durationMs: base - 800,
    delayMs: start + 700,
    keyframes: beatHold({ translateY: 18 }, { translateY: 0 }),
    style: centeredText("63%", {
      color: palette.subtext,
      fontFamily: MONO_STACK,
      fontSize: "22px",
      fontWeight: "500",
      letterSpacing: "0.4em",
      textTransform: "uppercase",
      margin: "0px",
      zIndex: "10",
    }),
  }));
  out.push(mk(ctx, "Outro Rule", scene.id, {
    durationMs: base - 900,
    delayMs: start + 860,
    easing: EASE_IN_OUT,
    keyframes: [
      { offset: 0, properties: { scaleX: 0, opacity: 0 } as Keyframe["properties"], easing: EASE_OUT },
      { offset: 0.25, properties: { scaleX: 1, opacity: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
      { offset: 1, properties: { scaleX: 1, opacity: 1 } as Keyframe["properties"] },
    ],
    style: {
      left: "50%",
      top: "70%",
      width: "160px",
      height: "4px",
      marginLeft: "-80px",
      borderRadius: "3px",
      background: palette.accent,
      transformOrigin: "center center",
      zIndex: "10",
    },
  }));
  return out;
}

/** Choose the scene kind sequence for a given scene count. */
function sceneSequence(count: number): FilmSceneKind[] {
  const kinds: FilmSceneKind[] = ["title"];
  const middle = count - 2;
  for (let i = 0; i < middle; i++) {
    kinds.push(i % 2 === 0 ? "features" : "statement");
  }
  kinds.push("outro");
  return kinds;
}

/** Build a complete film (scenes + component drafts) from a brief. */
export function buildFilm(brief: FilmBrief): FilmPlan {
  const palette = PALETTES[brief.style];
  const kinds = sceneSequence(brief.sceneCount);

  const scenes: FilmScene[] = kinds.map((kind, i) => ({
    id: createId("s_"),
    name: kind === "title" ? "Opening Title" : kind === "features" ? "Feature Highlights" : kind === "statement" ? "Statement" : "Logo Outro",
    durationMs: brief.sceneDurationMs,
    kind,
  }));

  const ctx: Ctx = { palette, brief, idx: 0 };
  const drafts: ComponentDraft[] = [];

  // Global layers span the whole film.
  drafts.push(backgroundLayer(ctx, brief.totalDurationMs));
  drafts.push(vignetteLayer(ctx, brief.totalDurationMs));

  let start = 0;
  let featureVariant = 0;
  scenes.forEach((scene) => {
    if (scene.kind === "title") drafts.push(...titleScene(ctx, scene, start));
    else if (scene.kind === "features") drafts.push(...featuresScene(ctx, scene, start, featureVariant++));
    else if (scene.kind === "statement") drafts.push(...statementScene(ctx, scene, start));
    else drafts.push(...outroScene(ctx, scene, start));
    start += scene.durationMs;
  });

  return {
    scenes,
    drafts,
    totalDurationMs: brief.totalDurationMs,
    palette,
    style: brief.style,
    title: brief.title,
  };
}

/** Convenience: brief → plan in one call. */
export function directFilm(prompt: string, fallbackName = "KrateFastMotion"): FilmPlan {
  return buildFilm(analyzeBrief(prompt, fallbackName));
}
