/**
 * Effect kit — the graded, cinematic finish that sits on top of a film.
 *
 * The vocabulary is borrowed from professional compositors (After Effects, and
 * the open-source EffectCraft effect catalogue): film grain, colour grading,
 * glow/bloom, light sweeps, scanlines, letterboxing, chromatic fringing, glitch,
 * light leaks and flashes. Each effect is drawn in pure CSS — gradients, blend
 * modes and filters — so the preview, the editor and the exported video render
 * exactly the same pixels with no image or canvas dependency.
 *
 * Effects are full-bleed atmosphere. They are deliberately percentage-sized,
 * which is what tells the layout engine they are a finish rather than content:
 * they never show up in an overlap audit, and nothing ever has to dodge them.
 */
import type { Easing, Keyframe } from "@kratefastmotion/shared";
import { easingPreset } from "@kratefastmotion/shared";
import type { GraphicLayer, GraphicPalette } from "./filmGraphics.js";
import { EASE_IN_OUT, withAlpha } from "./filmBase.js";

export type EffectKind =
  | "film_grain"
  | "vignette"
  | "grade"
  | "bloom"
  | "light_sweep"
  | "scanlines"
  | "letterbox"
  | "chromatic"
  | "glitch"
  | "light_leak"
  | "flash";

/** Every effect the kit can draw, in the order they are layered onto a film. */
export const EFFECT_KINDS: EffectKind[] = [
  "grade",
  "bloom",
  "light_leak",
  "light_sweep",
  "chromatic",
  "scanlines",
  "glitch",
  "flash",
  "film_grain",
  "letterbox",
  "vignette",
];

/** What each effect is for, in the agent's own words. */
export const EFFECT_PURPOSE: Record<EffectKind, string> = {
  film_grain: "Animated film grain that sits over the whole frame. Use for texture and an analogue, tactile finish.",
  vignette: "A soft radial darkening at the frame edge that pulls the eye to the centre. Use to focus a composition.",
  grade:
    "A colour-grade wash over the whole frame. Pick a tone: 'teal-orange' (cinematic blockbuster), 'warm', 'cool', 'noir' or 'vibrant'. Use to make flat colour feel lit.",
  bloom: "A soft glowing haze around the bright part of the frame. Use to make light feel like it bleeds, not clips.",
  light_sweep:
    "A highlight that sweeps diagonally across the frame on a loop. Use for a premium, polished 'glass' pass over a logo or card.",
  scanlines: "Fine horizontal CRT lines. Use for a retro, screen, or techy look.",
  letterbox: "Cinematic bars top and bottom that letterbox the frame to a widescreen ratio. Use for a film/scope feel.",
  chromatic:
    "Red and cyan fringing at the frame edges, like a real lens. Use for an authentic, slightly imperfect camera look.",
  glitch:
    "Short bursts of horizontal tearing with an RGB tint. Use sparingly for a digital failure, a beat drop, or a hard cut.",
  light_leak:
    "A warm flare leaking in from a corner that breathes slowly. Use for nostalgia, film, or a romantic tone.",
  flash: "A quick white-to-accent flash at the start of the film. Use as a hard opening or to punctuate a cut.",
};

export type GradeTone = "teal-orange" | "warm" | "cool" | "noir" | "vibrant";

export const GRADE_TONES: GradeTone[] = ["teal-orange", "warm", "cool", "noir", "vibrant"];

/** Full-bleed geometry: percentage-sized so the layout audit reads it as atmosphere. */
const FULL: Record<string, string | number> = {
  left: "0px",
  top: "0px",
  width: "100%",
  height: "100%",
};

/** Layer order for each effect, above the film's own content (which tops out at ~12). */
const Z: Record<EffectKind, number> = {
  vignette: 30,
  grade: 32,
  bloom: 34,
  chromatic: 36,
  scanlines: 38,
  light_leak: 40,
  light_sweep: 42,
  glitch: 44,
  flash: 46,
  film_grain: 48,
  letterbox: 50,
};

/** Sensible strength when the caller does not ask for one (0..1). */
const DEFAULT_INTENSITY: Record<EffectKind, number> = {
  film_grain: 0.5,
  vignette: 0.6,
  grade: 0.6,
  bloom: 0.5,
  light_sweep: 0.5,
  scanlines: 0.4,
  letterbox: 1,
  chromatic: 0.5,
  glitch: 0.5,
  light_leak: 0.5,
  flash: 0.7,
};

const LINEAR: Easing = easingPreset("linear");

/** Per-style grade when the director applies a default look. */
const STYLE_TONE: Record<string, GradeTone> = {
  cinematic: "teal-orange",
  tech: "cool",
  playful: "warm",
  calm: "cool",
  energetic: "vibrant",
  default: "teal-orange",
};

export interface EffectRequest {
  kind: EffectKind;
  palette: GraphicPalette;
  /** Beat amplitude (calm 0.55 / balanced 1 / kinetic 3); scales how lively the effect is. */
  amp: number;
  /** Layer lifetime in ms. Looping effects use it as their loop length. */
  durationMs: number;
  delayMs?: number;
  /** 0..1, overrides the kind's default strength. */
  intensity?: number;
  /** Only read by `grade`. */
  tone?: GradeTone;
  zIndex?: number;
  group?: string;
}

function svgUrl(svg: string): string {
  const encoded = svg
    .replace(/\s+/g, " ")
    .replace(/"/g, "'")
    .replace(/#/g, "%23")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E");
  return `url("data:image/svg+xml,${encoded}")`;
}

/**
 * A tileable monochrome noise field. `stitchTiles` makes the 180px tile seamless,
 * so the grain has no visible repeat seam as it drifts.
 */
const GRAIN = svgUrl(
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>" +
    "<filter id='g'>" +
    "<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>" +
    "<feColorMatrix type='saturate' values='0'/>" +
    "</filter>" +
    "<rect width='100%' height='100%' filter='url(#g)'/>" +
    "</svg>",
);

function layer(
  name: string,
  style: Record<string, string | number>,
  keyframes: Keyframe[],
  durationMs: number,
  opts: {
    delayMs?: number;
    iterationCount?: number | "infinite";
    easing?: Easing;
    zIndex: number;
    group?: string;
  },
): GraphicLayer {
  return {
    name,
    delayMs: opts.delayMs ?? 0,
    durationMs,
    keyframes,
    style: {
      position: "absolute",
      ...FULL,
      ...style,
      zIndex: opts.zIndex,
      pointerEvents: "none",
      _content: "",
    },
    iterationCount: opts.iterationCount ?? 1,
    easing: opts.easing ?? EASE_IN_OUT,
    group: opts.group,
  };
}

function gradeStyle(palette: GraphicPalette, tone: GradeTone): {
  from: string;
  to: string;
  mode: string;
  opacity: number;
} {
  switch (tone) {
    case "warm":
      return { from: "#3a1206", to: "#ffb347", mode: "soft-light", opacity: 0.5 };
    case "cool":
      return { from: "#061a3a", to: "#6fd3ff", mode: "soft-light", opacity: 0.5 };
    case "noir":
      return { from: "#05060a", to: "#2b2b30", mode: "multiply", opacity: 0.62 };
    case "vibrant":
      return { from: palette.accent, to: palette.accent2, mode: "overlay", opacity: 0.34 };
    case "teal-orange":
    default:
      return { from: "#0b3a4d", to: "#ff8a3d", mode: "soft-light", opacity: 0.55 };
  }
}

/**
 * Build one effect as a single full-bleed layer. Pure and deterministic: the same
 * request always yields the same layer, which is what makes it safe to audit.
 */
export function buildEffect(req: EffectRequest): GraphicLayer[] {
  const intensity = Math.max(0, Math.min(1, req.intensity ?? DEFAULT_INTENSITY[req.kind]));
  const amp = Math.max(0.3, req.amp);
  const z = req.zIndex ?? Z[req.kind];
  const { palette } = req;
  const dur = Math.max(400, req.durationMs);
  const group = req.group;

  switch (req.kind) {
    case "vignette": {
      const opacity = 0.4 + 0.45 * intensity;
      return [
        layer(
          "Vignette",
          {
            background: "radial-gradient(120% 120% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)",
            mixBlendMode: "multiply",
            opacity,
          },
          [],
          dur,
          { zIndex: z, group, delayMs: req.delayMs },
        ),
      ];
    }

    case "grade": {
      const g = gradeStyle(palette, req.tone ?? "teal-orange");
      return [
        layer(
          "Colour Grade",
          {
            background: `linear-gradient(160deg, ${g.from} 0%, ${g.to} 100%)`,
            mixBlendMode: g.mode,
            opacity: g.opacity * (0.55 + 0.75 * intensity),
          },
          [],
          dur,
          { zIndex: z, group, delayMs: req.delayMs },
        ),
      ];
    }

    case "bloom": {
      const base = 0.1 + 0.16 * intensity;
      return [
        layer(
          "Bloom",
          {
            background: `radial-gradient(58% 46% at 50% 42%, ${withAlpha(palette.glow, 0.55)} 0%, rgba(0,0,0,0) 70%)`,
            mixBlendMode: "screen",
          },
          [
            { offset: 0, properties: { opacity: base * 0.7 } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 0.5, properties: { opacity: base * 1.35 } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 1, properties: { opacity: base * 0.7 } as Keyframe["properties"] },
          ],
          4200,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
        ),
      ];
    }

    case "light_sweep": {
      const opacity = 0.3 + 0.4 * intensity;
      const travel = 60 + 20 * Math.min(amp, 3);
      return [
        layer(
          "Light Sweep",
          {
            background: `linear-gradient(100deg, rgba(255,255,255,0) 44%, rgba(255,255,255,${opacity.toFixed(2)}) 50%, rgba(255,255,255,0) 56%)`,
            mixBlendMode: "screen",
          },
          [
            { offset: 0, properties: { translateX: "-70%", opacity: 0 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.14, properties: { translateX: "-30%", opacity: 1 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.34, properties: { translateX: `${travel}%`, opacity: 1 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.42, properties: { translateX: `${travel + 20}%`, opacity: 0 } as Keyframe["properties"], easing: LINEAR },
            { offset: 1, properties: { translateX: `${travel + 20}%`, opacity: 0 } as Keyframe["properties"] },
          ],
          5200,
          { zIndex: z, group, iterationCount: "infinite", easing: LINEAR, delayMs: req.delayMs },
        ),
      ];
    }

    case "scanlines": {
      const opacity = 0.3 + 0.4 * intensity;
      return [
        layer(
          "Scanlines",
          {
            background:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.30) 0px, rgba(0,0,0,0.30) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 5px)",
            mixBlendMode: "multiply",
            opacity,
          },
          [],
          dur,
          { zIndex: z, group, delayMs: req.delayMs },
        ),
      ];
    }

    case "letterbox": {
      const bar = 9 + 4 * intensity;
      return [
        layer(
          "Letterbox",
          {
            background: `linear-gradient(180deg, #000 0%, #000 ${bar}%, rgba(0,0,0,0) ${bar}%, rgba(0,0,0,0) ${100 - bar}%, #000 ${100 - bar}%, #000 100%)`,
          },
          [],
          dur,
          { zIndex: z, group, delayMs: req.delayMs },
        ),
      ];
    }

    case "chromatic": {
      const opacity = 0.35 + 0.45 * intensity;
      return [
        layer(
          "Chromatic Aberration",
          {
            background: `linear-gradient(90deg, rgba(255,0,64,${opacity.toFixed(2)}) 0%, rgba(255,0,64,0) 7%, rgba(0,0,0,0) 93%, rgba(0,180,255,${opacity.toFixed(2)}) 100%)`,
            mixBlendMode: "screen",
          },
          [],
          dur,
          { zIndex: z, group, delayMs: req.delayMs },
        ),
      ];
    }

    case "glitch": {
      const opacity = 0.35 + 0.4 * intensity;
      return [
        layer(
          "Glitch",
          {
            background: "linear-gradient(90deg, rgba(255,0,90,0.55), rgba(0,255,255,0.55))",
            mixBlendMode: "screen",
          },
          [
            { offset: 0, properties: { opacity: 0, clipPath: "inset(0% 0 0 0)", translateX: 0 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.04, properties: { opacity, clipPath: "inset(38% 0 42% 0)", translateX: -26 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.08, properties: { opacity: 0, translateX: 16 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.5, properties: { opacity: 0 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.54, properties: { opacity, clipPath: "inset(62% 0 24% 0)", translateX: 30 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.58, properties: { opacity: 0, translateX: -18 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.9, properties: { opacity: 0 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.94, properties: { opacity: opacity * 0.8, clipPath: "inset(20% 0 70% 0)", translateX: 22 } as Keyframe["properties"], easing: LINEAR },
            { offset: 1, properties: { opacity: 0 } as Keyframe["properties"] },
          ],
          3000,
          { zIndex: z, group, iterationCount: "infinite", easing: LINEAR, delayMs: req.delayMs },
        ),
      ];
    }

    case "light_leak": {
      const opacity = 0.3 + 0.4 * intensity;
      return [
        layer(
          "Light Leak",
          {
            background: `radial-gradient(38% 60% at 92% 8%, ${withAlpha("#ffb347", 0.6)} 0%, rgba(0,0,0,0) 62%)`,
            mixBlendMode: "screen",
          },
          [
            { offset: 0, properties: { opacity: opacity * 0.6 } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 0.5, properties: { opacity: opacity * 1.4 } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 1, properties: { opacity: opacity * 0.6 } as Keyframe["properties"] },
          ],
          9000,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
        ),
      ];
    }

    case "flash": {
      const peak = 0.55 + 0.4 * intensity;
      return [
        layer(
          "Opening Flash",
          {
            background: `linear-gradient(180deg, rgba(255,255,255,${peak.toFixed(2)}) 0%, ${withAlpha(palette.accent, peak * 0.6)} 100%)`,
            mixBlendMode: "screen",
          },
          [
            { offset: 0, properties: { opacity: 0 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.08, properties: { opacity: 1 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.45, properties: { opacity: 0.18 } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 1, properties: { opacity: 0 } as Keyframe["properties"] },
          ],
          640,
          { zIndex: z, group, easing: LINEAR, delayMs: req.delayMs },
        ),
      ];
    }

    case "film_grain":
    default: {
      const base = 0.09 + 0.13 * intensity;
      return [
        layer(
          "Film Grain",
          {
            backgroundImage: GRAIN,
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px",
            mixBlendMode: "overlay",
            opacity: base,
          },
          [
            { offset: 0, properties: { opacity: base * 0.72, translateX: -16, translateY: 10 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.25, properties: { opacity: base * 1.08, translateX: 13, translateY: -9 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.5, properties: { opacity: base * 0.84, translateX: -9, translateY: -5 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.75, properties: { opacity: base * 1.0, translateX: 15, translateY: 9 } as Keyframe["properties"], easing: LINEAR },
            { offset: 1, properties: { opacity: base * 0.72, translateX: -16, translateY: 10 } as Keyframe["properties"] },
          ],
          640,
          { zIndex: z, group, iterationCount: "infinite", easing: LINEAR, delayMs: req.delayMs },
        ),
      ];
    }
  }
}

export interface FilmLookOptions {
  palette: GraphicPalette;
  amp: number;
  /** The film's art-direction style; selects the default grade tone. */
  style: string;
  totalMs: number;
  /** Motion intensity of the film; a kinetic film gets a livelier finish. */
  motion?: "calm" | "balanced" | "kinetic";
}

/**
 * The default look a finished film gets. This is what makes a KrateFastMotion
 * film read as graded footage rather than flat vector shapes: a colour grade, a
 * living grain, and — for the styles that want it — a letterbox, a bloom and an
 * opening flash. The layers are returned lowest-first, so the director can append
 * them and know the finish sits on top of the content.
 */
export function filmLookLayers(opts: FilmLookOptions): GraphicLayer[] {
  const { palette, amp, style, totalMs } = opts;
  const out: GraphicLayer[] = [];
  const kinetic = opts.motion === "kinetic";

  out.push(
    ...buildEffect({
      kind: "grade",
      palette,
      amp,
      durationMs: totalMs,
      tone: STYLE_TONE[style] ?? "teal-orange",
      intensity: style === "cinematic" ? 0.7 : 0.55,
    }),
  );

  if (style === "cinematic" || style === "energetic" || kinetic) {
    out.push(...buildEffect({ kind: "bloom", palette, amp, durationMs: totalMs, intensity: 0.5 }));
  }
  if (style === "cinematic") {
    out.push(...buildEffect({ kind: "letterbox", palette, amp, durationMs: totalMs, intensity: 0.5 }));
    out.push(...buildEffect({ kind: "light_leak", palette, amp, durationMs: totalMs, intensity: 0.4 }));
  }
  if (style === "energetic" || kinetic) {
    out.push(...buildEffect({ kind: "chromatic", palette, amp, durationMs: totalMs, intensity: 0.4 }));
  }
  if (style === "energetic") {
    out.push(...buildEffect({ kind: "flash", palette, amp, durationMs: 640, intensity: 0.7 }));
  }

  out.push(
    ...buildEffect({
      kind: "film_grain",
      palette,
      amp,
      durationMs: totalMs,
      intensity: style === "cinematic" ? 0.6 : 0.42,
    }),
  );

  return out;
}

/** One-line human summary of an effect, used by tool output. */
export function describeEffect(kind: EffectKind, intensity?: number, tone?: GradeTone): string {
  const base = EFFECT_PURPOSE[kind].split(". ")[0];
  const bits = [base];
  if (kind === "grade" && tone) bits.push(`tone ${tone}`);
  if (intensity !== undefined) bits.push(`intensity ${Math.round(intensity * 100)}%`);
  return bits.join(" — ");
}
