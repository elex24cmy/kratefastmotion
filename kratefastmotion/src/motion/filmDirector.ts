import type { Easing, Keyframe, Scene } from "@kratefastmotion/shared";
import { easingPreset } from "@kratefastmotion/shared";
import { createId } from "../utils/id.js";
import { draft, type ComponentDraft } from "./templates/helper.js";
import {
  auditLayout,
  type Box,
  boxToStyle,
  gridTrack,
  type GroupedBox,
  groupAllows,
  type LayoutAudit,
  safeArea,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  styleToBox,
} from "./layout.js";
import { buildGraphic, type GraphicKind, type GraphicLayer } from "./filmGraphics.js";
import { filmLookLayers } from "./filmEffects.js";
import { buildTransition, transitionSequence, type TransitionDirection } from "./filmTransitions.js";
import {
  EASE_ACCEL_EXIT,
  EASE_CRUISE,
  EASE_SNAP_SETTLE,
  EASE_SOFT_IN_OUT,
  EASE_SOFT_LAND,
  FONT_STACK,
  measuredBeat,
  measuredHold,
  MONO_STACK,
} from "./filmBase.js";
import { framesToMs, roleEntry, roleExit, roleStagger, type FilmBeat } from "./motionGrammar.js";

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
 *  - a motion-intensity dimension (`calm | balanced | kinetic`) that scales beat
 *    amplitudes and, when kinetic, adds a continuous-motion layer pack
 *  - every position comes from the layout engine (safe area + 12-column grid),
 *    and every scene carries real graphics from the graphic kit — so placement
 *    is computed and auditable rather than hand-tuned percentages
 */

// The stage size lives in the layout engine; re-exported here because the
// composer and the tests have always imported it from the director.
export { STAGE_WIDTH, STAGE_HEIGHT };

export type FilmStyle = "cinematic" | "tech" | "playful" | "calm" | "energetic" | "default";

/**
 * How much the film moves. Style changes the palette and the words; motion
 * intensity changes the choreography — beat amplitudes plus a continuous-motion
 * layer pack — so "make it kinetic" produces a visibly livelier film without
 * altering the restrained default.
 */
export type FilmMotion = "calm" | "balanced" | "kinetic";

export interface FilmPalette {
  bgFrom: string;
  bgTo: string;
  text: string;
  subtext: string;
  accent: string;
  accent2: string;
  glow: string;
}

/**
 * Art-direction palettes, one per style. Exported because the graphic kit and
 * the `compose_graphic` tool draw from the same colours as the film director —
 * a graphic added by the agent has to sit in the same world as the film.
 */
export const PALETTES: Record<FilmStyle, FilmPalette> = {
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
  motion: FilmMotion;
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
  motion: FilmMotion;
  title: string;
  /**
   * Design stage the plan was composed against. Defaults to 1920x1080; a social
   * edit composes against a portrait artboard, and the preview, editor and
   * export all read this back so the coordinate space stays consistent.
   */
  artboard?: { width: number; height: number };
}

/** A file from the asset library that a film can feature. */
export interface FilmAsset {
  /** Served URL (already resolved from an asset id by the caller). */
  src: string;
  name?: string;
  kind: "image" | "video";
}

export interface FilmAssets {
  /** Brand mark shown in the opening title and again on the end card. */
  logo?: FilmAsset;
  /** Media used as full-bleed b-roll behind the statement beats, in order. */
  media?: FilmAsset[];
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

const KINETIC_WORDS = [
  "kinetic", "energetic", "energy", "dynamic", "fast", "punchy", "explosive", "hyper",
  "intense", "extreme", "adrenaline", "racing", "wild", "frantic", "rapid", "snappy",
  "action", "sport", "sports", "hype", "powerful", "relentless", "nonstop", "non-stop",
  "lots of motion", "lots of movement", "high energy", "high-energy", "high impact",
  "high-impact", "dramatic movement", "sweeping", "whiplash", "electric", "buzz",
  "particle", "particles", "drifting", "drift", "glide", "swirl", "orbit", "streaming",
  "pulse", "zippy", "aggressive",
];

const CALM_WORDS = [
  "calm", "gentle", "soft", "slow", "serene", "zen", "subtle", "minimal", "quiet",
  "breathe", "breathing", "soothing", "relax", "peaceful", "still", "meditative",
  "understated", "restrained",
];

/**
 * Score motion vocabulary to pick a choreography intensity. An explicit style
 * nudges the result (an "energetic" brief is never calm) but never decides it,
 * so "a calm product film that feels kinetic" still reads as kinetic.
 */
export function detectMotion(prompt: string, style: FilmStyle): FilmMotion {
  const p = ` ${prompt.toLowerCase()} `;
  let kinetic = 0;
  let calm = 0;
  for (const w of KINETIC_WORDS) if (p.includes(w)) kinetic += w.length > 6 ? 2 : 1;
  for (const w of CALM_WORDS) if (p.includes(w)) calm += w.length > 6 ? 2 : 1;
  if (style === "energetic") kinetic += 3;
  if (style === "calm") calm += 3;
  if (kinetic > calm) return "kinetic";
  if (calm > kinetic) return "calm";
  return "balanced";
}

/** Multiplier applied to every beat amplitude. Balanced (1) is the default look. */
export function motionScale(m: FilmMotion): number {
  return m === "kinetic" ? 3 : m === "calm" ? 0.55 : 1;
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
      .slice(0, 6);
    if (parts.length >= 2) return parts.map((s) => titleCase(s));
  }
  switch (style) {
    case "cinematic":
      return ["Crafted frame by frame", "Sound-led pacing", "Colour-graded finish", "Anamorphic light", "Editorial type", "Deliberate cuts"];
    case "tech":
      return ["Real-time performance", "Composable layers", "Pixel-accurate timing", "Vector-crisp output", "Instant preview", "Deterministic renders"];
    case "playful":
      return ["Bright, bouncy motion", "Friendly type", "Delightful details", "Snappy transitions", "Loose easing", "Colour pops"];
    case "calm":
      return ["Gentle easing", "Open composition", "Breathing rhythm", "Muted palette", "Slow reveals", "Quiet pacing"];
    case "energetic":
      return ["High-contrast cuts", "Punchy accents", "Relentless pace", "Hard beats", "Big scale moves", "Zero dead air"];
    default:
      return ["Considered composition", "Clear hierarchy", "Confident timing", "Balanced rhythm", "Purposeful motion", "Restrained detail"];
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
    motion: detectMotion(prompt, style),
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

/**
 * A text block placed from an explicit pixel box. The director used to position
 * type with `top: 52%` and `width: 100%`, which renders fine but is impossible
 * to reason about: nothing can be measured, so nothing can be checked for
 * overlap. Giving every text block a real box is what lets the layout engine
 * find safe homes for graphics around it.
 */
function textBlock(box: Box, extra: Record<string, string | number> = {}): Record<string, string | number> {
  return boxToStyle(box, {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    ...extra,
  });
}

/** A box of `w` centred horizontally on the stage, at `top` with height `h`. */
function centreBox(w: number, top: number, h: number): Box {
  return { x: (STAGE_WIDTH - w) / 2, y: top, w, h };
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

/**
 * Kinetic typography: a short title breaks into one line per word so each word
 * can wipe in on its own beat — the "stacked type" look a motion designer uses
 * for a two- or three-word lockup. Longer titles stay on a single line so the
 * composition never overflows the stage.
 */
function headlineLines(title: string): string[] {
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 3) return [title];
  if (words.some((w) => w.replace(/[^\w]/g, "").length > 12)) return [title];
  return words;
}

/**
 * A measured beat for a scene content layer.
 *
 * The entrance and exit are absolute frame counts for the beat role (12 f in,
 * 13 f out at the medians) rather than a fraction of the layer's own length, so
 * a 6 s scene still enters as crisply as a 2 s one — which is the whole point of
 * a measured grammar. `dur` is the layer's animation length; the keyframe
 * offsets are derived from it, so the layer still spans exactly `dur`.
 */
function mb(
  role: FilmBeat,
  from: Record<string, string | number>,
  hold: Record<string, string | number>,
  dur: number,
  opts: {
    exit?: Record<string, string | number>;
    drift?: Record<string, string | number>;
    enterFrames?: number;
    exitFrames?: number;
    enterEase?: Easing;
    exitEase?: Easing;
    enterOpacity?: number;
  } = {},
): Keyframe[] {
  return measuredBeat(from, hold, opts.exit ?? {}, {
    durationMs: dur,
    enterFrames: opts.enterFrames ?? roleEntry(role),
    exitFrames: opts.exitFrames ?? roleExit(role),
    enterEase: opts.enterEase,
    exitEase: opts.exitEase,
    enterOpacity: opts.enterOpacity,
    drift: opts.drift,
  });
}

/** The measured entrance → hold, ending visible. Used by the closing scene. */
function mbHold(
  role: FilmBeat,
  from: Record<string, string | number>,
  hold: Record<string, string | number>,
  dur: number,
  opts: {
    drift?: Record<string, string | number>;
    enterFrames?: number;
    enterEase?: Easing;
    enterOpacity?: number;
  } = {},
): Keyframe[] {
  return measuredHold(from, hold, {
    durationMs: dur,
    enterFrames: opts.enterFrames ?? roleEntry(role),
    enterEase: opts.enterEase,
    enterOpacity: opts.enterOpacity,
    drift: opts.drift,
  });
}

/** Sibling onset gap in ms for a beat role — 1-3 f for a hook, 8 f for a CTA. */
function staggerMs(role: FilmBeat): number {
  return framesToMs(roleStagger(role));
}

/**
 * Headline beat: rises into place behind a vertical clip wipe (the glyphs are
 * revealed from the baseline upward), keeps drifting a touch while held so the
 * type is never completely still, then lifts out. `clipPath` is a first-class
 * animatable property, so the preview, the editor canvas, the code export and
 * the video export all render this identically.
 *
 * Measured: 14 frames in on a snapSettle (a hero arrival), a linear creep while
 * held, and an accelerating 13-frame lift-out.
 */
function headlineBeat(a: number, dur: number): Keyframe[] {
  const open = "inset(0% 0 0 0)";
  return mb(
    "hook",
    { translateY: 56 * a, scale: 0.97, clipPath: "inset(100% 0 0 0)" },
    { translateY: 0, scale: 1, clipPath: open },
    dur,
    {
      drift: { translateY: -6 * a, scale: 1 + 0.015 * a },
      exit: { translateY: -26 * a, scale: 1 + 0.03 * a },
      enterFrames: 14,
      enterEase: EASE_SNAP_SETTLE,
    },
  );
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
    direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
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
    easing: opts.easing ?? EASE_SOFT_LAND,
    keyframes: opts.keyframes ?? [],
    style,
    iterationCount: opts.iterationCount ?? 1,
    direction: opts.direction ?? "normal",
    fillMode: "both",
  });
  d.orderIndex = ctx.idx++;
  return d;
}

/**
 * Turn a graphic kit result into drafts on the stage. The kit works in stage
 * pixels and knows nothing about the director's ordering, so the only thing
 * that happens here is timing offset (scene start) and order allocation.
 */
function graphics(ctx: Ctx, sceneId: string | null, sceneStart: number, layers: GraphicLayer[]): ComponentDraft[] {
  return layers.map((layer) =>
    mk(ctx, layer.name, sceneId, {
      durationMs: layer.durationMs,
      delayMs: sceneStart + layer.delayMs,
      easing: layer.easing,
      keyframes: layer.keyframes,
      style: { ...layer.style, ...(layer.group ? { _group: layer.group } : {}) },
      iterationCount: layer.iterationCount,
      direction: layer.direction,
    }),
  );
}

function backgroundLayer(ctx: Ctx, totalMs: number): ComponentDraft {
  const { palette, brief } = ctx;
  const a = motionScale(brief.motion);
  return mk(ctx, "Backdrop", null, {
    durationMs: totalMs,
    delayMs: 0,
    easing: EASE_CRUISE,
    keyframes: [
      // A slow push across the whole film. Measured: drift is linear, never eased.
      { offset: 0, properties: { scale: 1 } as Keyframe["properties"], easing: EASE_CRUISE },
      { offset: 1, properties: { scale: 1 + 0.06 * a } as Keyframe["properties"] },
    ],
    style: fullBleed({
      background: `linear-gradient(135deg, ${palette.bgFrom} 0%, ${palette.bgTo} 100%)`,
      transformOrigin: "center center",
      _content: "",
      zIndex: "0",
    }),
  });
}

function vignetteLayer(ctx: Ctx, totalMs: number): ComponentDraft {
  return mk(ctx, "Vignette", null, {
    durationMs: totalMs,
    delayMs: 0,
    easing: EASE_CRUISE,
    keyframes: [
      { offset: 0, properties: { opacity: 0.75 } as Keyframe["properties"] },
      { offset: 1, properties: { opacity: 0.75 } as Keyframe["properties"] },
    ],
    style: fullBleed({
      background: "radial-gradient(120% 120% at 50% 45%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 100%)",
      pointerEvents: "none",
      _content: "",
      zIndex: "1",
    }),
  });
}

function glowLayer(ctx: Ctx, sceneId: string, sceneStart: number, sceneDuration: number, topPct = 48, size = 1500): ComponentDraft {
  const { palette, brief } = ctx;
  const a = motionScale(brief.motion);
  return mk(ctx, "Accent Glow", sceneId, {
    durationMs: sceneDuration,
    delayMs: sceneStart,
    easing: EASE_SOFT_IN_OUT,
    keyframes: [
      { offset: 0, properties: { opacity: 0, scale: 1 - 0.15 * a } as Keyframe["properties"], easing: EASE_SOFT_LAND },
      { offset: 0.3, properties: { opacity: 0.5, scale: 1 } as Keyframe["properties"], easing: EASE_SOFT_IN_OUT },
      { offset: 0.8, properties: { opacity: 0.42, scale: 1 + 0.04 * a } as Keyframe["properties"], easing: EASE_ACCEL_EXIT },
      { offset: 1, properties: { opacity: 0, scale: 1 + 0.08 * a } as Keyframe["properties"] },
    ],
    style: circle(size, topPct, {
      background: `radial-gradient(circle, ${palette.glow}66 0%, ${palette.glow}22 38%, rgba(0,0,0,0) 72%)`,
      filter: "blur(40px)",
      pointerEvents: "none",
      _content: "",
      zIndex: "2",
    }),
  });
}

/**
 * Brand mark from the asset library, shown above the opening title and again on
 * the end card. Sized with `object-fit: contain` so a wide logo and a square
 * icon both sit correctly in the same box.
 */
function logoLayer(
  ctx: Ctx,
  scene: FilmScene,
  start: number,
  asset: FilmAsset,
  opts: { topPct: number; width: number; height: number; delayMs?: number; hold?: boolean },
): ComponentDraft {
  const { brief } = ctx;
  const a = motionScale(brief.motion);
  const w = opts.width;
  // A pixel box (rather than `left: 50%`) so the mark is part of the measurable
  // composition — the layout engine can then place graphics around it.
  const box: Box = { x: (STAGE_WIDTH - w) / 2, y: (opts.topPct / 100) * STAGE_HEIGHT, w, h: opts.height };
  const dur = scene.durationMs - 400;
  // R3.6: an object with identity arrives from oversize and scales down to rest
  // on a snapSettle — it never grows from zero and never fades up.
  const entrance = opts.hold
    ? mbHold("cta", { scale: 1 + 0.5 * a }, { scale: 1 }, dur, {
        enterFrames: 18,
        enterEase: EASE_SNAP_SETTLE,
        enterOpacity: 1,
        drift: { scale: 1 + 0.01 * a },
      })
    : mb("hook", { scale: 1 + 0.5 * a }, { scale: 1 }, dur, {
        enterFrames: 18,
        enterEase: EASE_SNAP_SETTLE,
        enterOpacity: 1,
        drift: { scale: 1 + 0.01 * a },
      });
  return mk(ctx, "Brand Logo", scene.id, {
    durationMs: dur,
    delayMs: start + (opts.delayMs ?? 160),
    easing: EASE_SNAP_SETTLE,
    keyframes: entrance,
    style: boxToStyle(box, {
      objectFit: "contain",
      filter: `drop-shadow(0 18px 46px ${ctx.palette.accent}44)`,
      _tag: asset.kind === "video" ? "video" : "img",
      _src: asset.src,
      ...(asset.kind === "video" ? { _muted: 1, _loop: 1, _autoplay: 1 } : {}),
      _content: "",
      zIndex: "11",
    }),
  });
}

/**
 * Full-bleed b-roll behind a statement beat, plus a scrim so the overlaid
 * figure and label stay legible against arbitrary media. The media drifts
 * slowly for the whole scene, so the frame is never static.
 */
function mediaBackdrop(ctx: Ctx, scene: FilmScene, start: number, asset: FilmAsset): ComponentDraft[] {
  const { palette, brief } = ctx;
  const a = motionScale(brief.motion);
  const isVideo = asset.kind === "video";
  const out: ComponentDraft[] = [];
  out.push(
    mk(ctx, "Media Backdrop", scene.id, {
      durationMs: scene.durationMs,
      delayMs: start,
      easing: EASE_SOFT_IN_OUT,
      keyframes: [
        { offset: 0, properties: { opacity: 0, scale: 1 } as Keyframe["properties"], easing: EASE_SOFT_LAND },
        { offset: 0.22, properties: { opacity: 0.92, scale: 1 + 0.02 * a } as Keyframe["properties"], easing: EASE_CRUISE },
        { offset: 0.8, properties: { opacity: 0.92, scale: 1 + 0.05 * a } as Keyframe["properties"], easing: EASE_ACCEL_EXIT },
        { offset: 1, properties: { opacity: 0, scale: 1 + 0.07 * a } as Keyframe["properties"] },
      ],
      style: fullBleed({
        objectFit: "cover",
        _tag: isVideo ? "video" : "img",
        _src: asset.src,
        ...(isVideo ? { _muted: 1, _loop: 1, _autoplay: 1 } : {}),
        _content: "",
        zIndex: "1",
      }),
    }),
  );
  out.push(
    mk(ctx, "Media Scrim", scene.id, {
      durationMs: scene.durationMs,
      delayMs: start,
      easing: EASE_SOFT_IN_OUT,
      keyframes: [
        { offset: 0, properties: { opacity: 0 } as Keyframe["properties"], easing: EASE_SOFT_LAND },
        { offset: 0.22, properties: { opacity: 1 } as Keyframe["properties"], easing: EASE_CRUISE },
        { offset: 0.8, properties: { opacity: 1 } as Keyframe["properties"], easing: EASE_ACCEL_EXIT },
        { offset: 1, properties: { opacity: 0 } as Keyframe["properties"] },
      ],
      style: fullBleed({
        background: `linear-gradient(180deg, ${palette.bgFrom}e6 0%, ${palette.bgFrom}73 42%, ${palette.bgFrom}f2 100%)`,
        pointerEvents: "none",
        _content: "",
        zIndex: "2",
      }),
    }),
  );
  return out;
}

/**
 * A transition at a scene boundary. Real ads cut between beats with a wipe, a
 * dissolve or a whip pan; without a seam our scenes cross-fade into each other
 * and read as one long slide. The transition covers the frame on the cut and
 * clears either side, so the incoming scene is revealed as the panel leaves.
 */
function sceneTransition(
  ctx: Ctx,
  sceneId: string | null,
  kind: Parameters<typeof buildTransition>[0]["kind"],
  cutMs: number,
  durationMs: number,
  direction: TransitionDirection,
  group: string,
  cutIndex: number,
): ComponentDraft[] {
  const layers = buildTransition({
    kind,
    palette: ctx.palette,
    amp: motionScale(ctx.brief.motion),
    cutMs,
    durationMs,
    direction,
    group,
  });
  // Mark the director's own seams exactly like the `apply_transition` tool does,
  // so re-cutting a boundary with `replace` genuinely replaces it.
  for (const l of layers) {
    l.style._transition = kind;
    l.style._cut = String(cutIndex);
  }
  return graphics(ctx, sceneId, 0, layers);
}

function titleScene(ctx: Ctx, scene: FilmScene, start: number, assets: FilmAssets): ComponentDraft[] {
  const { palette, brief } = ctx;
  const a = motionScale(brief.motion);
  const base = scene.durationMs;
  const out: ComponentDraft[] = [];
  const area = safeArea();
  out.push(glowLayer(ctx, scene.id, start, base, 46, 1500));

  // Graphics: corner brackets frame the composition, so the opening beat reads
  // as a designed card instead of centred type floating on a gradient.
  out.push(
    ...graphics(ctx, scene.id, start, buildGraphic({
      kind: "bracket",
      box: { x: area.x, y: area.y, w: area.w, h: area.h },
      palette,
      amp: a,
      sceneDurationMs: base,
      delayMs: 140,
      zIndex: 4,
    })),
  );

  // Brand mark from the library, if the brief carried one — the film opens on
  // the user's own logo instead of a generic monogram.
  if (assets.logo) {
    out.push(logoLayer(ctx, scene, start, assets.logo, { topPct: 21, width: 340, height: 92, delayMs: 120 }));
  }

  // Kinetic typography: each word of a short title gets its own line, its own
  // stagger and its own clip wipe. A single long title stays on one line.
  const lines = headlineLines(brief.title);
  const stacked = lines.length > 1;
  const headlineSize = stacked ? (lines.length === 2 ? 118 : 96) : 132;
  const lineHeight = stacked ? 1.06 : 1.02;
  const lineHeightPx = Math.round(headlineSize * lineHeight);
  const blockHeight = lines.length * lineHeightPx;

  // The type stack is measured first and then centred as one block, so it stays
  // balanced whether the title is one line or three and whether a logo takes the
  // top third. Every block gets a real pixel box (see `textBlock`), which is what
  // makes the composition auditable instead of merely plausible.
  const EYEBROW_H = 30;
  const RULE_H = 6;
  const SUBHEAD_H = 40;
  const GAP_EYEBROW = 30;
  const GAP_RULE = 58;
  const GAP_SUBHEAD = 44;
  const stackHeight = EYEBROW_H + GAP_EYEBROW + blockHeight + GAP_RULE + RULE_H + GAP_SUBHEAD + SUBHEAD_H;
  const stackCentre = ((assets.logo ? 55 : 52) / 100) * STAGE_HEIGHT;
  let cursor = stackCentre - stackHeight / 2;
  const eyebrowBox = centreBox(1200, cursor, EYEBROW_H);
  cursor += EYEBROW_H + GAP_EYEBROW;
  const headlineBoxes = lines.map(() => {
    const box = centreBox(1500, cursor, lineHeightPx);
    cursor += lineHeightPx;
    return box;
  });
  cursor += GAP_RULE;
  const ruleBox = centreBox(220, cursor, RULE_H);
  cursor += RULE_H + GAP_SUBHEAD;
  const subheadBox = centreBox(1400, cursor, SUBHEAD_H);

  out.push(mk(ctx, "Eyebrow", scene.id, {
    durationMs: base - 200,
    delayMs: start + 200,
    keyframes: mb("hook", { translateY: 18 * a }, { translateY: 0 }, base - 200, { drift: { translateY: -5 * a } }),
    style: textBlock(eyebrowBox, {
      color: palette.accent,
      fontFamily: MONO_STACK,
      fontSize: "22px",
      fontWeight: "600",
      letterSpacing: "0.42em",
      textTransform: "uppercase",
      margin: "0px",
      _content: brief.tagline,
      zIndex: "10",
    }),
  }));

  lines.forEach((line, i) => {
    out.push(mk(ctx, stacked ? `Headline ${i + 1}` : "Headline", scene.id, {
      durationMs: base - 500 - i * 120,
      delayMs: start + 420 + i * staggerMs("hook"),
      keyframes: headlineBeat(a, base - 500 - i * 120),
      style: textBlock(headlineBoxes[i], {
        color: palette.text,
        fontFamily: FONT_STACK,
        fontSize: `${headlineSize}px`,
        fontWeight: "800",
        lineHeight: String(lineHeight),
        letterSpacing: "-0.02em",
        margin: "0px",
        textShadow: "0 18px 60px rgba(0,0,0,0.45)",
        _content: line,
        zIndex: "10",
      }),
    }));
  });
  out.push(mk(ctx, "Rule", scene.id, {
    durationMs: base - 700,
    delayMs: start + 720,
    keyframes: mb("hook", { scaleX: 0 }, { scaleX: 1 }, base - 700, { enterFrames: 10, exitFrames: 12 }),
    style: {
      ...boxToStyle(ruleBox),
      borderRadius: "3px",
      background: `linear-gradient(90deg, ${palette.accent}, ${palette.accent2})`,
      transformOrigin: "center center",
      _content: "",
      zIndex: "10",
    },
  }));
  out.push(mk(ctx, "Subhead", scene.id, {
    durationMs: base - 900,
    delayMs: start + 900,
    keyframes: mb("hook", { translateY: 20 * a }, { translateY: 0 }, base - 900, { drift: { translateY: -6 * a } }),
    style: textBlock(subheadBox, {
      color: palette.subtext,
      fontFamily: FONT_STACK,
      fontSize: "30px",
      fontWeight: "400",
      letterSpacing: "0.01em",
      margin: "0px",
      _content: brief.subtitle,
      zIndex: "10",
    }),
  }));
  return out;
}

function featuresScene(ctx: Ctx, scene: FilmScene, start: number, variant: number): ComponentDraft[] {
  const { palette, brief } = ctx;
  const a = motionScale(brief.motion);
  const base = scene.durationMs;
  const out: ComponentDraft[] = [];
  const area = safeArea();
  out.push(glowLayer(ctx, scene.id, start, base, 50, 1300));

  // Two columns on the 12-column grid: the copy owns the left seven, and the
  // right five hold a graphic panel. Putting both on the grid is what guarantees
  // the chart and the text can never collide, whatever the copy is.
  const left = gridTrack(0, 7, { area });
  const right = gridTrack(7, 5, { area });

  const labelBox: Box = { x: left.x, y: area.y + 96, w: left.w, h: 30 };
  const rowH = 96;
  const rowGap = 60;
  const rowStart = labelBox.y + labelBox.h + 92;

  const eyebrow = variant % 2 === 0 ? "What's inside" : "More to explore";
  out.push(mk(ctx, "Section Label", scene.id, {
    durationMs: base - 200,
    delayMs: start + 180,
    keyframes: mb("proof", { translateY: 16 * a }, { translateY: 0 }, base - 200, { drift: { translateY: -4 * a } }),
    style: textBlock(labelBox, {
      justifyContent: "flex-start",
      textAlign: "left",
      color: palette.accent,
      fontFamily: MONO_STACK,
      fontSize: "20px",
      fontWeight: "600",
      letterSpacing: "0.36em",
      textTransform: "uppercase",
      margin: "0px",
      _content: eyebrow,
      zIndex: "10",
    }),
  }));

  // A card panel groups the graphics on the right so they read as one object
  // rather than three floating shapes. Every layer shares the "panel" group, so
  // the layout audit treats the chart drawn on the card as composition, not as
  // a collision.
  const card: Box = { x: right.x, y: area.y + 96, w: right.w, h: 700 };
  const panel = "panel";
  out.push(
    ...graphics(ctx, scene.id, start, buildGraphic({
      kind: "card",
      box: card,
      palette,
      amp: a,
      sceneDurationMs: base,
      delayMs: 260,
      zIndex: 5,
      group: panel,
    })),
  );

  const tileSize = 148;
  const tile: Box = { x: card.x + 64, y: card.y + 64, w: tileSize, h: tileSize };
  out.push(
    ...graphics(ctx, scene.id, start, buildGraphic({
      kind: "iconTile",
      box: tile,
      palette,
      amp: a,
      sceneDurationMs: base,
      delayMs: 460,
      zIndex: 7,
      label: variant % 2 === 0 ? "Capability" : "Workflow",
      group: panel,
    })),
  );
  out.push(
    ...graphics(ctx, scene.id, start, buildGraphic({
      kind: "bars",
      box: { x: card.x + 64, y: card.y + 330, w: card.w - 128, h: 210 },
      palette,
      amp: a,
      sceneDurationMs: base,
      delayMs: 560,
      zIndex: 7,
      count: 6,
      group: panel,
    })),
  );
  out.push(
    ...graphics(ctx, scene.id, start, buildGraphic({
      kind: "progress",
      box: { x: card.x + 64, y: card.y + 620, w: card.w - 128, h: 14 },
      palette,
      amp: a,
      sceneDurationMs: base,
      delayMs: 720,
      zIndex: 7,
      amount: variant % 2 === 0 ? 0.82 : 0.64,
      group: panel,
    })),
  );

  // Successive feature scenes show successive thirds of the brief's features,
  // so a film with two feature scenes never repeats the same three lines.
  const chunk = variant * 3;
  const rows = brief.features.slice(chunk, chunk + 3).length
    ? brief.features.slice(chunk, chunk + 3)
    : brief.features.slice(0, 3);
  rows.forEach((label, i) => {
    const y = rowStart + i * (rowH + rowGap);
    out.push(mk(ctx, `Feature Bullet ${i + 1}`, scene.id, {
      durationMs: base - 500 - i * 120,
      delayMs: start + 420 + i * staggerMs("proof"),
      keyframes: mb("proof", { translateX: -26 * a }, { translateX: 0 }, base - 500 - i * 120, { drift: { translateX: 8 * a } }),
      style: boxToStyle({ x: left.x, y: y + 38, w: 18, h: 18 }, {
        borderRadius: "5px",
        background: i % 2 === 0 ? palette.accent : palette.accent2,
        boxShadow: `0 0 22px ${(i % 2 === 0 ? palette.accent : palette.accent2)}99`,
        _content: "",
        zIndex: "10",
      }),
    }));
    out.push(mk(ctx, `Feature ${i + 1}`, scene.id, {
      durationMs: base - 500 - i * 120,
      delayMs: start + 470 + i * staggerMs("proof"),
      keyframes: mb("proof", { translateX: 24 * a }, { translateX: 0 }, base - 500 - i * 120, { drift: { translateX: 8 * a } }),
      style: textBlock({ x: left.x + 48, y, w: left.w - 48, h: rowH }, {
        justifyContent: "flex-start",
        textAlign: "left",
        color: palette.text,
        fontFamily: FONT_STACK,
        fontSize: "44px",
        fontWeight: "600",
        letterSpacing: "-0.01em",
        margin: "0px",
        _content: label,
        zIndex: "10",
      }),
    }));
  });
  return out;
}

function statementScene(ctx: Ctx, scene: FilmScene, start: number, variant: number, media?: FilmAsset): ComponentDraft[] {
  const { palette, brief } = ctx;
  const a = motionScale(brief.motion);
  const base = scene.durationMs;
  const out: ComponentDraft[] = [];
  const area = safeArea();
  // Media b-roll sits under everything so the figure and label read on top.
  if (media) out.push(...mediaBackdrop(ctx, scene, start, media));
  out.push(glowLayer(ctx, scene.id, start, base, 48, 1700));
  // Each statement scene features a different headline stat so repeated
  // statement beats don't show the same number twice.
  const stat = brief.stats[variant % brief.stats.length];
  const line = stat ? stat.value : "—";
  const label = stat ? stat.label : "";

  // Graphics bracket the figure: a dot field in the top-right corner, a divider
  // under the label, and a rail that fills to a share of the width. Each sits in
  // its own band, so none of them can touch the type.
  const figureBox = centreBox(1500, 356, 210);
  const labelBox = centreBox(1400, 626, 34);
  const dividerBox = centreBox(640, 760, 26);
  const railBox = centreBox(640, 872, 14);

  out.push(
    ...graphics(ctx, scene.id, start, buildGraphic({
      kind: "dots",
      box: { x: area.x + area.w - 300, y: area.y + 40, w: 280, h: 170 },
      palette,
      amp: a,
      sceneDurationMs: base,
      delayMs: 320,
      zIndex: 5,
      count: 6,
    })),
  );
  out.push(
    ...graphics(ctx, scene.id, start, buildGraphic({
      kind: "divider",
      box: dividerBox,
      palette,
      amp: a,
      sceneDurationMs: base,
      delayMs: 780,
      zIndex: 8,
    })),
  );
  out.push(
    ...graphics(ctx, scene.id, start, buildGraphic({
      kind: "progress",
      box: railBox,
      palette,
      amp: a,
      sceneDurationMs: base,
      delayMs: 900,
      zIndex: 8,
      amount: [0.88, 0.64, 0.42][variant % 3],
    })),
  );

  out.push(mk(ctx, "Statement Figure", scene.id, {
    durationMs: base - 500,
    delayMs: start + 360,
    keyframes: mb("proof", { scale: 1 + 0.18 * a, translateY: 30 * a }, { scale: 1, translateY: 0 }, base - 500, {
      drift: { scale: 1 + 0.035 * a },
      enterFrames: 14,
      enterEase: EASE_SNAP_SETTLE,
      enterOpacity: 1,
    }),
    style: textBlock(figureBox, {
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
      _content: line,
      zIndex: "10",
    }),
  }));
  out.push(mk(ctx, "Statement Label", scene.id, {
    durationMs: base - 700,
    delayMs: start + 640,
    keyframes: mb("proof", { translateY: 18 * a }, { translateY: 0 }, base - 700, { drift: { translateY: -5 * a } }),
    style: textBlock(labelBox, {
      color: palette.subtext,
      fontFamily: MONO_STACK,
      fontSize: "24px",
      fontWeight: "500",
      letterSpacing: "0.34em",
      textTransform: "uppercase",
      margin: "0px",
      _content: label,
      zIndex: "10",
    }),
  }));
  return out;
}

function outroScene(ctx: Ctx, scene: FilmScene, start: number, assets: FilmAssets): ComponentDraft[] {
  const { palette, brief } = ctx;
  const a = motionScale(brief.motion);
  const base = scene.durationMs;
  const out: ComponentDraft[] = [];
  const area = safeArea();
  out.push(glowLayer(ctx, scene.id, start, base, 46, 1200));

  // Mirror the opening frame so the film closes on the same composition.
  out.push(
    ...graphics(ctx, scene.id, start, buildGraphic({
      kind: "bracket",
      box: { x: area.x, y: area.y, w: area.w, h: area.h },
      palette,
      amp: a,
      sceneDurationMs: base,
      delayMs: 220,
      zIndex: 4,
    })),
  );

  const markBox = centreBox(112, 336, 112);
  const wordmarkBox = centreBox(1500, 512, 86);
  const taglineBox = centreBox(1400, 630, 32);
  const outroRuleBox = centreBox(420, 716, 26);

  // The end card carries the user's own mark when the brief supplied one; the
  // composed monogram is the fallback so the card is never empty.
  if (assets.logo) {
    out.push(logoLayer(ctx, scene, start, assets.logo, { topPct: 30, width: 400, height: 118, delayMs: 300, hold: true }));
  } else {
    out.push(mk(ctx, "Logo Mark", scene.id, {
      durationMs: base - 500,
      delayMs: start + 300,
      easing: EASE_SNAP_SETTLE,
      keyframes: mbHold("cta", { scale: 1 + 0.6 * a, rotate: -6 * a }, { scale: 1, rotate: 0 }, base - 500, {
        enterFrames: 18,
        enterEase: EASE_SNAP_SETTLE,
        enterOpacity: 1,
        drift: { scale: 1 + 0.01 * a },
      }),
      style: boxToStyle(markBox, {
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
      }),
    }));
  }
  out.push(mk(ctx, "Wordmark", scene.id, {
    durationMs: base - 600,
    delayMs: start + 300 + staggerMs("cta"),
    keyframes: mbHold("cta", { translateY: 24 * a }, { translateY: 0 }, base - 600, { drift: { translateY: -6 * a } }),
    style: textBlock(wordmarkBox, {
      color: palette.text,
      fontFamily: FONT_STACK,
      fontSize: "72px",
      fontWeight: "800",
      letterSpacing: "-0.01em",
      margin: "0px",
      _content: brief.tagline,
      zIndex: "10",
    }),
  }));
  out.push(mk(ctx, "Tagline", scene.id, {
    durationMs: base - 800,
    delayMs: start + 300 + 2 * staggerMs("cta"),
    keyframes: mbHold("cta", { translateY: 18 * a }, { translateY: 0 }, base - 800, { drift: { translateY: -5 * a } }),
    style: textBlock(taglineBox, {
      color: palette.subtext,
      fontFamily: MONO_STACK,
      fontSize: "22px",
      fontWeight: "500",
      letterSpacing: "0.4em",
      textTransform: "uppercase",
      margin: "0px",
      _content: brief.subtitle,
      zIndex: "10",
    }),
  }));
  // The closing rule is the divider graphic — a hairline with a turning node —
  // which holds its final state so the film ends on a composed card.
  out.push(
    ...graphics(ctx, scene.id, start, buildGraphic({
      kind: "divider",
      box: outroRuleBox,
      palette,
      amp: a,
      sceneDurationMs: base,
      delayMs: 860,
      zIndex: 9,
    })),
  );
  return out;
}

// ---------------------------------------------------------------------------
// Kinetic motion pack
// ---------------------------------------------------------------------------
//
// Kinetic films get a layer of continuous motion under the scene beats: soft
// shapes that drift across the whole runtime, a field of particles streaming
// through every frame, and light sweeps cutting across the stage. These layers
// are global (no sceneId) and loop, so no frame of a kinetic film is ever
// static — even between beats. Balanced and calm films never get them.

/** Deterministic pseudo-random in [0,1) so the same brief always composes the same film. */
function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Large soft shapes that cross the stage once over the whole film. */
function driftField(ctx: Ctx, totalMs: number): ComponentDraft[] {
  const { palette } = ctx;
  const specs = [
    { left: "16%", top: "28%", size: 900, dx: 300, dy: -170, from: palette.accent, to: palette.accent2, op: 0.2 },
    { left: "84%", top: "72%", size: 1100, dx: -360, dy: 210, from: palette.accent2, to: palette.glow, op: 0.17 },
    { left: "52%", top: "46%", size: 1400, dx: -220, dy: -250, from: palette.glow, to: palette.accent, op: 0.12 },
  ];
  return specs.map((s, i) =>
    mk(ctx, `Drift ${i + 1}`, null, {
      durationMs: totalMs,
      delayMs: 0,
      easing: EASE_CRUISE,
      keyframes: [
        { offset: 0, properties: { translateX: -s.dx, translateY: -s.dy, scale: 0.85, opacity: 0 } as Keyframe["properties"], easing: EASE_CRUISE },
        { offset: 0.18, properties: { opacity: s.op } as Keyframe["properties"], easing: EASE_CRUISE },
        { offset: 0.82, properties: { opacity: s.op } as Keyframe["properties"], easing: EASE_CRUISE },
        { offset: 1, properties: { translateX: s.dx, translateY: s.dy, scale: 1.2, opacity: 0 } as Keyframe["properties"] },
      ],
      style: circle(s.size, 50, {
        left: s.left,
        top: s.top,
        background: `radial-gradient(circle, ${s.from}66 0%, ${s.to}22 46%, rgba(0,0,0,0) 74%)`,
        pointerEvents: "none",
        _content: "",
        zIndex: "1",
      }),
    }),
  );
}

/** A field of dots streaming bottom-to-top on staggered infinite loops. */
function particleField(ctx: Ctx): ComponentDraft[] {
  const { palette } = ctx;
  const colors = [palette.accent, palette.accent2, palette.text, palette.glow];
  const count = 12;
  const out: ComponentDraft[] = [];
  for (let i = 0; i < count; i++) {
    const r1 = rand(i + 1);
    const r2 = rand(i + 41.7);
    const r3 = rand(i + 97.3);
    const size = 8 + Math.round(r1 * 16);
    const left = 4 + r2 * 90;
    const dur = 2400 + Math.round(r3 * 2600);
    const delay = Math.round(r1 * dur);
    const dx = Math.round((r2 - 0.5) * 260);
    const rot = Math.round((r3 - 0.5) * 420);
    out.push(
      mk(ctx, `Particle ${i + 1}`, null, {
        durationMs: dur,
        delayMs: delay,
        iterationCount: "infinite",
        easing: easingPreset("linear"),
        keyframes: [
          { offset: 0, properties: { opacity: 0, translateY: 640, translateX: 0, scale: 0.5, rotate: 0 } as Keyframe["properties"] },
          { offset: 0.18, properties: { opacity: 0.85, scale: 1 } as Keyframe["properties"] },
          { offset: 0.82, properties: { opacity: 0.85, scale: 1 } as Keyframe["properties"] },
          { offset: 1, properties: { opacity: 0, translateY: -640, translateX: dx, scale: 0.7, rotate: rot } as Keyframe["properties"] },
        ],
        style: {
          left: `${left}%`,
          top: "50%",
          width: `${size}px`,
          height: `${size}px`,
          marginLeft: `${-size / 2}px`,
          marginTop: `${-size / 2}px`,
          borderRadius: i % 3 === 0 ? "50%" : "3px",
          background: colors[i % colors.length],
          pointerEvents: "none",
          _content: "",
          zIndex: "3",
        },
      }),
    );
  }
  return out;
}

/** Thin light streaks sweeping across the stage on infinite loops. */
function sweepField(ctx: Ctx): ComponentDraft[] {
  const { palette } = ctx;
  const specs = [
    { top: "30%", rotate: -16, dur: 3600, delay: 0, from: palette.accent },
    { top: "68%", rotate: 14, dur: 4400, delay: 900, from: palette.accent2 },
  ];
  return specs.map((s, i) =>
    mk(ctx, `Sweep ${i + 1}`, null, {
      durationMs: s.dur,
      delayMs: s.delay,
      iterationCount: "infinite",
      easing: easingPreset("linear"),
      keyframes: [
        { offset: 0, properties: { opacity: 0, translateX: -900, rotate: s.rotate } as Keyframe["properties"] },
        { offset: 0.15, properties: { opacity: 0.7, rotate: s.rotate } as Keyframe["properties"] },
        { offset: 0.85, properties: { opacity: 0.7, rotate: s.rotate } as Keyframe["properties"] },
        { offset: 1, properties: { opacity: 0, translateX: 900, rotate: s.rotate } as Keyframe["properties"] },
      ],
      style: {
        left: "50%",
        top: s.top,
        width: "70%",
        height: "3px",
        marginLeft: "-35%",
        borderRadius: "2px",
        background: `linear-gradient(90deg, rgba(0,0,0,0), ${s.from}, rgba(0,0,0,0))`,
        pointerEvents: "none",
        _content: "",
        zIndex: "4",
      },
    }),
  );
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
export function buildFilm(brief: FilmBrief, assets: FilmAssets = {}): FilmPlan {
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

  // Kinetic films carry a continuous-motion pack beneath the scene beats.
  if (brief.motion === "kinetic") {
    drafts.push(...driftField(ctx, brief.totalDurationMs));
    drafts.push(...particleField(ctx));
    drafts.push(...sweepField(ctx));
  }

  let start = 0;
  let featureVariant = 0;
  let statementVariant = 0;
  let mediaCursor = 0;
  const media = assets.media ?? [];
  const cutKinds = transitionSequence(brief.style, brief.motion, Math.max(0, scenes.length - 1));
  const cutDurationMs = brief.motion === "kinetic" ? 440 : brief.motion === "calm" ? 660 : 540;
  scenes.forEach((scene, i) => {
    if (scene.kind === "title") drafts.push(...titleScene(ctx, scene, start, assets));
    else if (scene.kind === "features") drafts.push(...featuresScene(ctx, scene, start, featureVariant++));
    else if (scene.kind === "statement") {
      // Media beats cycle through the supplied assets so each statement scene
      // shows different b-roll rather than repeating the first one.
      const asset = media.length ? media[mediaCursor++ % media.length] : undefined;
      drafts.push(...statementScene(ctx, scene, start, statementVariant++, asset));
    } else drafts.push(...outroScene(ctx, scene, start, assets));
    // Every boundary after the opening reads as a real cut, not a cross-fade.
    if (i > 0) {
      const kind = cutKinds[i - 1] ?? "linear_wipe";
      drafts.push(...sceneTransition(ctx, null, kind, start, cutDurationMs, i % 2 === 0 ? "right" : "left", `cut_${i}`, i));
    }
    start += scene.durationMs;
  });

  // The finish: a colour grade, a living grain, and the style's extra passes.
  // Appended last so the look sits above every content layer.
  drafts.push(
    ...graphics(
      ctx,
      null,
      0,
      filmLookLayers({
        palette,
        amp: motionScale(brief.motion),
        style: brief.style,
        totalMs: brief.totalDurationMs,
        motion: brief.motion,
      }),
    ),
  );

  return {
    scenes,
    drafts,
    totalDurationMs: brief.totalDurationMs,
    palette,
    style: brief.style,
    motion: brief.motion,
    title: brief.title,
  };
}

/** Convenience: brief → plan in one call. */
export function directFilm(prompt: string, fallbackName = "KrateFastMotion"): FilmPlan {
  return buildFilm(analyzeBrief(prompt, fallbackName));
}

// ---------------------------------------------------------------------------
// Layout audit
// ---------------------------------------------------------------------------

export interface SceneAudit {
  sceneId: string | null;
  name: string;
  audit: LayoutAudit;
}

export interface FilmAudit {
  ok: boolean;
  scenes: SceneAudit[];
  /** Layers with no measurable pixel box — full-bleed atmosphere by design. */
  unmeasured: string[];
  summary: string;
}

/**
 * Check a finished plan's geometry. The director now computes every content
 * layer's box, so this is a real verdict rather than a guess: it reports which
 * layers collide and which fall outside the safe area.
 *
 * The comparison is per scene. Two scenes share the stage but never share a
 * frame, so auditing the whole film at once would report every scene boundary
 * as a collision.
 */
export function auditFilm(plan: FilmPlan): FilmAudit {
  const groups = new Map<string, GroupedBox[]>();
  const unmeasured: string[] = [];

  for (const d of plan.drafts) {
    const box = styleToBox(d.style);
    if (!box || box.w <= 0 || box.h <= 0) {
      unmeasured.push(d.name);
      continue;
    }
    const group = typeof d.style._group === "string" ? d.style._group : undefined;
    // Two layers only collide if they share the stage *and* the moment. Passing
    // each layer's window lets a caption and a keyword pop live at the same
    // coordinates a second apart without the audit calling it a collision.
    const background = String(d.style._background ?? "0") === "1";
    const key = d.sceneId ?? "__global__";
    const list = groups.get(key) ?? [];
    list.push({
      name: d.name,
      group,
      background,
      startMs: d.delayMs,
      endMs: d.delayMs + d.durationMs,
      ...box,
    });
    groups.set(key, list);
  }

  const scenes: SceneAudit[] = plan.scenes
    .map((scene, i) => {
      const boxes = groups.get(scene.id) ?? [];
      return {
        sceneId: scene.id,
        name: `${i + 1}. ${scene.name}`,
        audit: auditLayout(boxes, { allow: groupAllows }),
      };
    })
    .filter((s) => s.audit.boxes > 0);

  const ok = scenes.every((s) => s.audit.ok);
  const summary = scenes.map((s) => `${s.name} — ${s.audit.summary}`).join(" | ") || "no measurable layers";

  return { ok, scenes, unmeasured, summary };
}
