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
  // --- look and lens -------------------------------------------------------
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
  | "flash"
  // --- light (Generate) ----------------------------------------------------
  | "lens_flare"
  | "light_rays"
  | "light_burst"
  | "beam"
  | "god_rays"
  | "neon"
  // --- pattern (Generate / Stylize) ---------------------------------------
  | "grid"
  | "checkerboard"
  | "cell_pattern"
  | "fractal_noise"
  | "gradient_ramp"
  | "halftone"
  | "duotone"
  | "bleach_bypass"
  // --- atmosphere (Simulation / Noise) ------------------------------------
  | "rain"
  | "snow"
  | "bubbles"
  | "particles"
  | "starfield"
  | "dust"
  | "bokeh"
  | "confetti"
  // --- motion and time -----------------------------------------------------
  | "speed_lines"
  | "motion_trail"
  | "zoom_blur"
  | "strobe"
  | "vhs"
  | "film_burn";

/** Every effect the kit can draw, in the order they are layered onto a film. */
export const EFFECT_KINDS: EffectKind[] = [
  "grade",
  "duotone",
  "bleach_bypass",
  "bloom",
  "light_leak",
  "lens_flare",
  "light_rays",
  "light_burst",
  "beam",
  "god_rays",
  "neon",
  "light_sweep",
  "gradient_ramp",
  "chromatic",
  "scanlines",
  "halftone",
  "grid",
  "checkerboard",
  "cell_pattern",
  "fractal_noise",
  "glitch",
  "vhs",
  "film_burn",
  "strobe",
  "speed_lines",
  "zoom_blur",
  "motion_trail",
  "rain",
  "snow",
  "bubbles",
  "particles",
  "starfield",
  "dust",
  "bokeh",
  "confetti",
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
  lens_flare:
    "An anamorphic lens flare — a horizontal light streak with a chain of flare orbs. Use for a hero shot or a bright product moment.",
  light_rays:
    "Soft shafts of light radiating from a point, slowly rotating. Use to make a title or a product feel heroic and lit.",
  light_burst:
    "Radial spokes of light bursting from the centre and pulsing. Use for a reveal, a beat drop, or a title hit.",
  beam: "A soft volumetric light beam raking across the frame. Use to add depth and atmosphere to a dark scene.",
  god_rays: "Warm shafts of light falling from the top of the frame. Use for an uplifting, cinematic, hopeful tone.",
  neon: "A coloured neon glow wash with a bright core. Use for a night, cyber or music-video look.",
  grid: "A fine technical grid drifting slowly. Use for a tech, blueprint or data feel.",
  checkerboard: "An animated checkerboard pattern. Use for a retro, playful or 'loading' motif.",
  cell_pattern: "An organic cell / membrane pattern that breathes. Use for a biological, energy or sci-fi look.",
  fractal_noise: "A living fractal cloud that swirls. Use as an abstract moving texture or a smoky backdrop.",
  gradient_ramp: "A large multi-colour gradient wash that drifts. Use for a colourful, modern, brand-forward look.",
  halftone: "A dot screen over the frame, like a printed comic. Use for a retro, print or pop-art feel.",
  duotone: "Maps the frame to two colours (accent and accent2). Use for a bold, poster-like brand look.",
  bleach_bypass:
    "A desaturated, high-contrast wash, like bleach-bypass film processing. Use for a gritty, cinematic tone.",
  rain: "Falling rain streaks with a wet sheen. Use for mood, melancholy or drama.",
  snow: "Falling snowflakes that drift. Use for winter, calm or festive tone.",
  bubbles: "Soft bubbles rising through the frame. Use for a playful, underwater or fizzy feel.",
  particles: "Drifting embers and specks that rise and glow. Use for heat, magic or a title moment.",
  starfield: "A field of twinkling stars, some streaking past. Use for a space, warp or dreamy look.",
  dust: "Floating dust motes in the light. Use for an interior, nostalgic or cinematic atmosphere.",
  bokeh: "Soft out-of-focus discs of light drifting. Use for a shallow-depth-of-field, romantic look.",
  confetti: "Falling colour chips that tumble. Use for celebration, a launch or a playful end card.",
  speed_lines:
    "Radial motion lines streaking past the centre. Use for speed, impact or an anime-style dash.",
  motion_trail:
    "Horizontal echo bands of the frame, like a slow-shutter smear. Use for speed or a dreamy transition feel.",
  zoom_blur: "A radial smear from the centre, like a fast lens snap. Use for impact and energy.",
  strobe: "Flashing bars of light. Use sparingly for a club, alert or beat-locked moment.",
  vhs: "Tracking bands, chroma shift and tape noise. Use for an 80s/90s retro-video look.",
  film_burn:
    "A warm orange burn creeping in from the frame edges, like film igniting. Use for a dramatic or vintage finish.",
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

/** The families the catalogue is grouped into, for `list_effects`. */
export type EffectCategory = "look" | "light" | "pattern" | "atmosphere" | "motion";

export const EFFECT_CATEGORIES: EffectCategory[] = ["look", "light", "pattern", "atmosphere", "motion"];

/** Which family each effect belongs to. */
export const EFFECT_CATEGORY: Record<EffectKind, EffectCategory> = {
  film_grain: "look",
  vignette: "look",
  grade: "look",
  bloom: "look",
  light_sweep: "look",
  scanlines: "look",
  letterbox: "look",
  chromatic: "look",
  glitch: "look",
  light_leak: "look",
  flash: "look",
  lens_flare: "light",
  light_rays: "light",
  light_burst: "light",
  beam: "light",
  god_rays: "light",
  neon: "light",
  grid: "pattern",
  checkerboard: "pattern",
  cell_pattern: "pattern",
  fractal_noise: "pattern",
  gradient_ramp: "pattern",
  halftone: "pattern",
  duotone: "pattern",
  bleach_bypass: "pattern",
  rain: "atmosphere",
  snow: "atmosphere",
  bubbles: "atmosphere",
  particles: "atmosphere",
  starfield: "atmosphere",
  dust: "atmosphere",
  bokeh: "atmosphere",
  confetti: "atmosphere",
  speed_lines: "motion",
  motion_trail: "motion",
  zoom_blur: "motion",
  strobe: "motion",
  vhs: "motion",
  film_burn: "motion",
};

/** Layer order for each effect, above the film's own content (which tops out at ~12). */
const Z: Record<EffectKind, number> = {
  vignette: 30,
  grade: 32,
  duotone: 33,
  bleach_bypass: 33,
  bloom: 34,
  light_leak: 36,
  lens_flare: 36,
  light_rays: 37,
  light_burst: 37,
  beam: 36,
  god_rays: 37,
  neon: 35,
  chromatic: 38,
  scanlines: 38,
  halftone: 38,
  grid: 37,
  checkerboard: 37,
  cell_pattern: 36,
  fractal_noise: 36,
  gradient_ramp: 34,
  glitch: 44,
  vhs: 44,
  film_burn: 45,
  strobe: 43,
  light_sweep: 42,
  speed_lines: 41,
  zoom_blur: 41,
  motion_trail: 41,
  rain: 39,
  snow: 39,
  bubbles: 39,
  particles: 39,
  starfield: 39,
  dust: 39,
  bokeh: 39,
  confetti: 40,
  flash: 46,
  film_grain: 48,
  letterbox: 50,
};

/** Sensible strength when the caller does not ask for one (0..1). */
export const DEFAULT_EFFECT_INTENSITY: Record<EffectKind, number> = {
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
  lens_flare: 0.6,
  light_rays: 0.5,
  light_burst: 0.6,
  beam: 0.5,
  god_rays: 0.55,
  neon: 0.55,
  grid: 0.35,
  checkerboard: 0.3,
  cell_pattern: 0.45,
  fractal_noise: 0.4,
  gradient_ramp: 0.5,
  halftone: 0.35,
  duotone: 0.5,
  bleach_bypass: 0.5,
  rain: 0.55,
  snow: 0.55,
  bubbles: 0.5,
  particles: 0.55,
  starfield: 0.6,
  dust: 0.45,
  bokeh: 0.5,
  confetti: 0.6,
  speed_lines: 0.5,
  motion_trail: 0.45,
  zoom_blur: 0.55,
  strobe: 0.4,
  vhs: 0.5,
  film_burn: 0.5,
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

/**
 * A soft, cloudy fractal field. `baseFrequency` is low so the noise reads as
 * smoke or a nebula rather than static, and the alpha matrix fades the dark end
 * to nothing so it composites as atmosphere.
 */
const FRACTAL = svgUrl(
  "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>" +
    "<filter id='f'>" +
    "<feTurbulence type='fractalNoise' baseFrequency='0.006 0.011' numOctaves='4' seed='7' stitchTiles='stitch'/>" +
    "<feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 0 0 -0.35'/>" +
    "</filter>" +
    "<rect width='100%' height='100%' filter='url(#f)'/>" +
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

/** Deterministic 0..1 from an index — keeps particles stable across renders. */
function noise(i: number): number {
  const x = Math.sin(i * 78.233 + 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Build one layer per particle. Particles are cheap CSS shapes — a div with a
 * gradient background and a looping drift — so a field of thirty of them costs
 * thirty small nodes and no JavaScript at all.
 */
function particleLayers(
  count: number,
  make: (i: number) => { name: string; style: Record<string, string | number>; keyframes: Keyframe[]; durationMs?: number; delayMs?: number; iterationCount?: number | "infinite" },
  durationMs: number,
  opts: { zIndex: number; group?: string; delayMs?: number },
): GraphicLayer[] {
  const out: GraphicLayer[] = [];
  for (let i = 0; i < count; i++) {
    const p = make(i);
    out.push(
      layer(p.name, p.style, p.keyframes, p.durationMs ?? durationMs, {
        zIndex: opts.zIndex,
        group: opts.group,
        delayMs: (opts.delayMs ?? 0) + (p.delayMs ?? 0),
        iterationCount: p.iterationCount ?? "infinite",
        easing: LINEAR,
      }),
    );
  }
  return out;
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
  const intensity = Math.max(0, Math.min(1, req.intensity ?? DEFAULT_EFFECT_INTENSITY[req.kind]));
  const amp = Math.max(0.3, req.amp);
  const z = req.zIndex ?? Z[req.kind];
  const { palette } = req;
  const dur = Math.max(400, req.durationMs);
  const group = req.group;

  /** A keyframe with a typed properties bag — keeps the big switch readable. */
  const kf = (offset: number, properties: Record<string, string | number>, easing?: Easing): Keyframe =>
    ({ offset, properties: properties as Keyframe["properties"], easing });

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

    // ---------------------------------------------------------------- light ---

    case "lens_flare": {
      const o = 0.35 + 0.5 * intensity;
      const cy = 30 + 10 * Math.min(amp, 3);
      const orbs = [0.12, 0.3, 0.46, 0.62, 0.78].map((f, i) =>
        layer(
          "Flare Orb",
          {
            left: `${f * 100}%`,
            top: `${cy + (i % 2 === 0 ? 5 : -6)}%`,
            width: `${4 + (i % 3) * 2}%`,
            aspectRatio: "1",
            marginLeft: `-${2 + (i % 3)}%`,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${withAlpha("#ffffff", o)} 0%, ${withAlpha(palette.accent2, o * 0.7)} 45%, transparent 72%)`,
            mixBlendMode: "screen",
            filter: "blur(3px)",
          },
          [
            kf(0, { opacity: o * 0.5, scale: 0.9 }, EASE_IN_OUT),
            kf(0.5, { opacity: o, scale: 1.12 }, EASE_IN_OUT),
            kf(1, { opacity: o * 0.5, scale: 0.9 }),
          ],
          5200 + i * 260,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
        ),
      );
      return [
        layer(
          "Flare Streak",
          {
            top: `${cy}%`,
            left: "-10%",
            width: "120%",
            height: "3%",
            background: `linear-gradient(90deg, transparent 0%, ${withAlpha(palette.glow, o)} 36%, ${withAlpha("#ffffff", o)} 50%, ${withAlpha(palette.glow, o)} 64%, transparent 100%)`,
            mixBlendMode: "screen",
            filter: "blur(7px)",
          },
          [
            kf(0, { opacity: 0.6, translateX: "-12%" }, EASE_IN_OUT),
            kf(0.5, { opacity: 1, translateX: "12%" }, EASE_IN_OUT),
            kf(1, { opacity: 0.6, translateX: "-12%" }),
          ],
          5200,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
        ),
        ...orbs,
      ];
    }

    case "light_rays": {
      const o = 0.22 + 0.4 * intensity;
      return [
        layer(
          "Light Rays",
          {
            background: `repeating-conic-gradient(from 0deg at 50% 50%, ${withAlpha(palette.glow, o)} 0deg, transparent 7deg, transparent 16deg, ${withAlpha(palette.accent2, o)} 23deg, transparent 30deg)`,
            mixBlendMode: "screen",
            filter: "blur(5px)",
            transformOrigin: "center center",
          },
          [
            kf(0, { opacity: 0.5, rotate: 0, scale: 1.5 }, EASE_IN_OUT),
            kf(0.5, { opacity: 1, rotate: 40, scale: 1.6 }, EASE_IN_OUT),
            kf(1, { opacity: 0.5, rotate: 80, scale: 1.5 }),
          ],
          9000,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
        ),
      ];
    }

    case "light_burst": {
      const o = 0.28 + 0.45 * intensity;
      return [
        layer(
          "Light Burst",
          {
            background: `repeating-conic-gradient(from 0deg at 50% 50%, ${withAlpha("#ffffff", o)} 0deg, transparent 2deg, transparent 9deg, ${withAlpha(palette.accent, o)} 11deg, transparent 14deg)`,
            mixBlendMode: "screen",
            filter: "blur(2px)",
            transformOrigin: "center center",
          },
          [
            kf(0, { opacity: 0.35, scale: 1, rotate: 0 }, EASE_IN_OUT),
            kf(0.5, { opacity: 1, scale: 1.14, rotate: 8 }, EASE_IN_OUT),
            kf(1, { opacity: 0.35, scale: 1, rotate: 0 }),
          ],
          3600,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
        ),
      ];
    }

    case "beam": {
      const o = 0.16 + 0.3 * intensity;
      return [
        layer(
          "Beam",
          {
            background: `linear-gradient(105deg, transparent 30%, ${withAlpha(palette.glow, o)} 45%, ${withAlpha("#ffffff", o * 0.9)} 52%, ${withAlpha(palette.glow, o)} 59%, transparent 74%)`,
            mixBlendMode: "screen",
            filter: "blur(16px)",
          },
          [
            kf(0, { opacity: 0.6, translateX: "-14%" }, EASE_IN_OUT),
            kf(0.5, { opacity: 1, translateX: "14%" }, EASE_IN_OUT),
            kf(1, { opacity: 0.6, translateX: "-14%" }),
          ],
          7000,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
        ),
      ];
    }

    case "god_rays": {
      const o = 0.18 + 0.34 * intensity;
      return [
        layer(
          "God Rays",
          {
            background: `repeating-linear-gradient(96deg, transparent 0px, ${withAlpha("#ffe9b0", o)} 26px, transparent 54px)`,
            mixBlendMode: "screen",
            filter: "blur(10px)",
            transformOrigin: "top center",
          },
          [
            kf(0, { opacity: 0.55, rotate: -4, scaleY: 1.1 }, EASE_IN_OUT),
            kf(0.5, { opacity: 1, rotate: 4, scaleY: 1.25 }, EASE_IN_OUT),
            kf(1, { opacity: 0.55, rotate: -4, scaleY: 1.1 }),
          ],
          9000,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
        ),
      ];
    }

    case "neon": {
      const o = 0.22 + 0.45 * intensity;
      return [
        layer(
          "Neon Wash",
          {
            background: `radial-gradient(70% 60% at 50% 50%, ${withAlpha(palette.accent, o * 0.55)} 0%, transparent 72%)`,
            mixBlendMode: "screen",
          },
          [
            kf(0, { opacity: 0.6 }, EASE_IN_OUT),
            kf(0.5, { opacity: 1 }, EASE_IN_OUT),
            kf(1, { opacity: 0.6 }),
          ],
          4200,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
        ),
        layer(
          "Neon Edge",
          {
            background: `linear-gradient(90deg, ${withAlpha(palette.accent, o)} 0%, transparent 12%, transparent 88%, ${withAlpha(palette.accent2, o)} 100%)`,
            mixBlendMode: "screen",
            filter: "blur(12px)",
          },
          [],
          dur,
          { zIndex: z + 1, group, delayMs: req.delayMs },
        ),
      ];
    }

    // -------------------------------------------------------------- pattern ---

    case "grid": {
      const o = 0.12 + 0.3 * intensity;
      return [
        layer(
          "Grid",
          {
            left: "-10%",
            top: "-10%",
            width: "120%",
            height: "120%",
            backgroundImage: `linear-gradient(${withAlpha(palette.accent, o)} 1px, transparent 1px), linear-gradient(90deg, ${withAlpha(palette.accent, o)} 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
            mixBlendMode: "screen",
          },
          [
            kf(0, { opacity: 0.8, translateX: 0, translateY: 0 }, LINEAR),
            kf(0.5, { opacity: 1, translateX: -32, translateY: -32 }, LINEAR),
            kf(1, { opacity: 0.8, translateX: -64, translateY: -64 }),
          ],
          4200,
          { zIndex: z, group, iterationCount: "infinite", easing: LINEAR, delayMs: req.delayMs },
        ),
      ];
    }

    case "checkerboard": {
      const o = 0.08 + 0.28 * intensity;
      return [
        layer(
          "Checkerboard",
          {
            left: "-10%",
            top: "-10%",
            width: "120%",
            height: "120%",
            backgroundImage: `linear-gradient(45deg, ${withAlpha(palette.accent, o)} 25%, transparent 25%, transparent 75%, ${withAlpha(palette.accent, o)} 75%), linear-gradient(45deg, ${withAlpha(palette.accent2, o)} 25%, transparent 25%, transparent 75%, ${withAlpha(palette.accent2, o)} 75%)`,
            backgroundSize: "80px 80px",
            backgroundPosition: "0px 0px, 40px 40px",
            mixBlendMode: "screen",
          },
          [
            kf(0, { opacity: 0.7, translateX: 0, translateY: 0 }, LINEAR),
            kf(0.5, { opacity: 1, translateX: -40, translateY: -40 }, LINEAR),
            kf(1, { opacity: 0.7, translateX: -80, translateY: -80 }),
          ],
          5000,
          { zIndex: z, group, iterationCount: "infinite", easing: LINEAR, delayMs: req.delayMs },
        ),
      ];
    }

    case "cell_pattern": {
      const o = 0.1 + 0.3 * intensity;
      return [
        layer(
          "Cell Pattern",
          {
            left: "-8%",
            top: "-8%",
            width: "116%",
            height: "116%",
            backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0%, transparent 62%, ${withAlpha(palette.accent, o)} 66%, transparent 72%)`,
            backgroundSize: "120px 120px",
            mixBlendMode: "screen",
          },
          [
            kf(0, { opacity: 0.6, scale: 1, translateX: 0, translateY: 0 }, EASE_IN_OUT),
            kf(0.5, { opacity: 1, scale: 1.06, translateX: -20, translateY: -14 }, EASE_IN_OUT),
            kf(1, { opacity: 0.6, scale: 1, translateX: -40, translateY: -28 }),
          ],
          8000,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
        ),
      ];
    }

    case "fractal_noise": {
      const o = 0.1 + 0.4 * intensity;
      return [
        layer(
          "Fractal Noise",
          {
            left: "-15%",
            top: "-15%",
            width: "130%",
            height: "130%",
            backgroundImage: FRACTAL,
            backgroundRepeat: "repeat",
            backgroundSize: "600px 600px",
            mixBlendMode: "screen",
          },
          [
            kf(0, { opacity: o * 0.7, scale: 1, translateX: 0, translateY: 0 }, EASE_IN_OUT),
            kf(0.5, { opacity: o, scale: 1.12, translateX: -40, translateY: 26 }, EASE_IN_OUT),
            kf(1, { opacity: o * 0.7, scale: 1, translateX: -80, translateY: 52 }),
          ],
          12000,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
        ),
      ];
    }

    case "gradient_ramp": {
      const o = 0.28 + 0.4 * intensity;
      return [
        layer(
          "Gradient Ramp",
          {
            left: "-20%",
            top: "-20%",
            width: "140%",
            height: "140%",
            background: `linear-gradient(120deg, ${withAlpha(palette.accent, o)} 0%, ${withAlpha(palette.accent2, o)} 35%, ${withAlpha(palette.glow, o)} 60%, ${withAlpha(palette.accent, o)} 100%)`,
            mixBlendMode: "overlay",
            filter: "blur(30px)",
          },
          [
            kf(0, { opacity: 0.6, rotate: 0, scale: 1 }, EASE_IN_OUT),
            kf(0.5, { opacity: 1, rotate: 6, scale: 1.08 }, EASE_IN_OUT),
            kf(1, { opacity: 0.6, rotate: 12, scale: 1 }),
          ],
          9000,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
        ),
      ];
    }

    case "halftone": {
      const o = 0.1 + 0.3 * intensity;
      return [
        layer(
          "Halftone",
          {
            backgroundImage: `radial-gradient(circle, ${withAlpha("#000000", o)} 26%, transparent 28%)`,
            backgroundSize: "10px 10px",
            mixBlendMode: "multiply",
          },
          [],
          dur,
          { zIndex: z, group, delayMs: req.delayMs },
        ),
        layer(
          "Halftone Colour",
          {
            backgroundImage: `radial-gradient(circle, ${withAlpha(palette.accent, o)} 24%, transparent 27%)`,
            backgroundSize: "10px 10px",
            backgroundPosition: "5px 5px",
            mixBlendMode: "screen",
          },
          [],
          dur,
          { zIndex: z + 1, group, delayMs: req.delayMs },
        ),
      ];
    }

    case "duotone": {
      const o = 0.3 + 0.4 * intensity;
      return [
        layer(
          "Duotone",
          {
            background: `linear-gradient(150deg, ${palette.bgFrom} 0%, ${palette.accent} 55%, ${palette.accent2} 100%)`,
            mixBlendMode: "color",
            opacity: o,
          },
          [],
          dur,
          { zIndex: z, group, delayMs: req.delayMs },
        ),
        layer(
          "Duotone Lift",
          {
            background: `radial-gradient(80% 80% at 50% 30%, ${withAlpha(palette.accent2, o * 0.5)} 0%, transparent 70%)`,
            mixBlendMode: "screen",
          },
          [],
          dur,
          { zIndex: z + 1, group, delayMs: req.delayMs },
        ),
      ];
    }

    case "bleach_bypass": {
      const o = 0.22 + 0.4 * intensity;
      return [
        layer(
          "Bleach Bypass",
          {
            background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(120,130,150,0.9) 100%)",
            mixBlendMode: "overlay",
            opacity: o,
          },
          [],
          dur,
          { zIndex: z, group, delayMs: req.delayMs },
        ),
        layer(
          "Bleach Contrast",
          {
            background: "radial-gradient(120% 120% at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)",
            mixBlendMode: "multiply",
            opacity: o * 0.8,
          },
          [],
          dur,
          { zIndex: z + 1, group, delayMs: req.delayMs },
        ),
      ];
    }

    // ------------------------------------------------------------ atmosphere ---

    case "rain": {
      const o = 0.18 + 0.34 * intensity;
      return particleLayers(
        28,
        (i) => {
          const speed = 0.7 + noise(i) * 1;
          const len = 8 + noise(i + 5) * 9; // streak length, as a % of the frame
          return {
            name: "Rain Drop",
            style: {
              left: `${noise(i) * 100}%`,
              top: "-100%",
              width: "2px",
              height: "100%",
              // A `translateY` percentage resolves against the element's own
              // box, so a short drop travelling 150% of itself moves a few
              // pixels and never crosses the frame. Each traveller is therefore
              // a full-height column with the mark painted at one end: moving
              // the column 100% sweeps the mark across a whole frame, at any
              // artboard size.
              background: `linear-gradient(180deg, transparent 0%, ${withAlpha(palette.text, o * 0.35)} ${100 - len}%, ${withAlpha(palette.text, o)} 100%)`,
              borderRadius: "2px",
            },
            keyframes: [
              kf(0, { translateY: "0%", opacity: 0 }, LINEAR),
              kf(0.08, { translateY: "18%", opacity: 1 }, LINEAR),
              kf(1, { translateY: "200%", opacity: 0.85 }),
            ],
            durationMs: Math.round(760 / speed),
            delayMs: Math.round(noise(i + 11) * 900),
          };
        },
        dur,
        { zIndex: z, group, delayMs: req.delayMs },
      );
    }

    case "snow": {
      const o = 0.34 + 0.45 * intensity;
      return particleLayers(
        55,
        (i) => {
          const size = 4 + noise(i) * 7;
          const sway = 10 + noise(i + 3) * 26;
          return {
            name: "Snowflake",
            style: {
              left: `${noise(i) * 100}%`,
              top: "-100%",
              width: `${size * 2}px`,
              height: "100%",
              // The flake is centred `size` px above the column's foot so the
              // whole disc stays inside the box (see "particles").
              background: `radial-gradient(circle ${size}px at 50% calc(100% - ${size}px), ${withAlpha("#ffffff", o)} 0%, ${withAlpha("#ffffff", o * 0.45)} 55%, transparent 100%)`,
              filter: "blur(0.6px)",
            },
            keyframes: [
              kf(0, { translateY: "0%", translateX: "0px", opacity: 0 }, EASE_IN_OUT),
              kf(0.12, { translateY: "18%", translateX: `${sway}px`, opacity: 1 }, EASE_IN_OUT),
              kf(0.6, { translateY: "110%", translateX: `${-sway}px`, opacity: 1 }, EASE_IN_OUT),
              kf(1, { translateY: "200%", translateX: `${sway * 0.6}px`, opacity: 0.7 }),
            ],
            durationMs: Math.round(4200 + noise(i + 7) * 3200),
            delayMs: Math.round(noise(i + 13) * 2400),
          };
        },
        dur,
        { zIndex: z, group, delayMs: req.delayMs },
      );
    }

    case "bubbles": {
      const o = 0.24 + 0.4 * intensity;
      return particleLayers(
        22,
        (i) => {
          const size = 9 + noise(i) * 24; // ring radius, px
          return {
            name: "Bubble",
            style: {
              left: `${noise(i) * 100}%`,
              top: "100%",
              width: `${size * 2}px`,
              height: "100%",
              // A ring at the head of a full-height column (see "rain"), centred
              // `size` px below the top edge so the whole ring stays inside the
              // box instead of being clipped in half.
              background: `radial-gradient(circle ${size}px at 50% ${size}px, transparent 58%, ${withAlpha("#ffffff", o)} 64%, ${withAlpha("#ffffff", o * 0.35)} 70%, transparent 76%)`,
            },
            keyframes: [
              kf(0, { translateY: "0%", translateX: "0px", opacity: 0 }, EASE_IN_OUT),
              kf(0.15, { translateY: "-18%", translateX: `${(noise(i + 3) - 0.5) * 40}px`, opacity: 1 }, EASE_IN_OUT),
              kf(1, { translateY: "-200%", translateX: `${(noise(i + 3) - 0.5) * 80}px`, opacity: 0 }),
            ],
            durationMs: Math.round(5000 + noise(i + 9) * 5000),
            delayMs: Math.round(noise(i + 17) * 4000),
          };
        },
        dur,
        { zIndex: z, group, delayMs: req.delayMs },
      );
    }

    case "particles": {
      const o = 0.42 + 0.5 * intensity;
      return particleLayers(
        52,
        (i) => {
          const r = 5 + noise(i) * 10; // ember radius, px
          return {
            name: "Ember",
            style: {
              left: `${noise(i) * 100}%`,
              top: "100%",
              width: `${r * 2}px`,
              height: "100%",
              // A glowing ember at the head of a full-height column (see "rain").
              // The disc is centred `r` px below the column's top edge: a
              // background painted on the edge itself would be clipped in half,
              // which is what made this effect read as a flicker, not embers.
              background: `radial-gradient(circle ${r}px at 50% ${r}px, ${withAlpha("#fff1d0", o)} 0%, ${withAlpha("#ffcf8a", o * 0.9)} 42%, ${withAlpha(palette.accent, o * 0.55)} 68%, transparent 100%)`,
              filter: "blur(0.5px)",
            },
            keyframes: [
              kf(0, { translateY: "0%", translateX: "0px", opacity: 0 }, EASE_IN_OUT),
              kf(0.2, { translateY: "-25%", translateX: `${(noise(i + 3) - 0.5) * 50}px`, opacity: 1 }, EASE_IN_OUT),
              kf(1, { translateY: "-200%", translateX: `${(noise(i + 3) - 0.5) * 120}px`, opacity: 0 }),
            ],
            durationMs: Math.round(3600 + noise(i + 9) * 4000),
            delayMs: Math.round(noise(i + 23) * 2000),
          };
        },
        dur,
        { zIndex: z, group, delayMs: req.delayMs },
      );
    }

    case "starfield": {
      const o = 0.35 + 0.5 * intensity;
      return particleLayers(
        44,
        (i) => {
          const bright = 0.4 + noise(i + 5) * 0.6;
          return {
            name: "Star",
            style: {
              left: `${noise(i) * 100}%`,
              top: `${noise(i + 2) * 100}%`,
              width: `${0.15 + noise(i) * 0.5}%`,
              aspectRatio: "1",
              borderRadius: "50%",
              background: withAlpha(palette.text, o * bright),
              boxShadow: `0 0 ${6 * bright}px ${withAlpha(palette.text, o * 0.7)}`,
            },
            keyframes: [
              kf(0, { opacity: 0.25, scale: 0.8 }, EASE_IN_OUT),
              kf(0.5, { opacity: 1, scale: 1.3 }, EASE_IN_OUT),
              kf(1, { opacity: 0.25, scale: 0.8 }),
            ],
            durationMs: Math.round(1600 + noise(i + 11) * 3600),
            delayMs: Math.round(noise(i + 31) * 2000),
          };
        },
        dur,
        { zIndex: z, group, delayMs: req.delayMs },
      );
    }

    case "dust": {
      const o = 0.14 + 0.3 * intensity;
      return particleLayers(
        30,
        (i) => ({
          name: "Mote",
          style: {
            left: `${noise(i) * 100}%`,
            top: `${noise(i + 4) * 100}%`,
            width: `${0.3 + noise(i) * 1.1}%`,
            aspectRatio: "1",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${withAlpha("#fff3d6", o)} 0%, transparent 70%)`,
            filter: "blur(1px)",
          },
          keyframes: [
            kf(0, { translateX: "0px", translateY: "0px", opacity: 0.2 }, EASE_IN_OUT),
            kf(0.5, { translateX: `${(noise(i + 7) - 0.5) * 90}px`, translateY: `${(noise(i + 9) - 0.5) * 70}px`, opacity: 1 }, EASE_IN_OUT),
            kf(1, { translateX: "0px", translateY: "0px", opacity: 0.2 }),
          ],
          durationMs: Math.round(6000 + noise(i + 13) * 6000),
          delayMs: Math.round(noise(i + 37) * 3000),
        }),
        dur,
        { zIndex: z, group, delayMs: req.delayMs },
      );
    }

    case "bokeh": {
      const o = 0.1 + 0.3 * intensity;
      return particleLayers(
        18,
        (i) => ({
          name: "Bokeh Disc",
          style: {
            left: `${noise(i) * 100}%`,
            top: `${noise(i + 2) * 100}%`,
            width: `${6 + noise(i) * 16}%`,
            aspectRatio: "1",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${withAlpha(palette.glow, o)} 0%, ${withAlpha(palette.accent2, o * 0.6)} 62%, transparent 78%)`,
            filter: "blur(6px)",
            mixBlendMode: "screen",
          },
          keyframes: [
            kf(0, { translateX: "0px", translateY: "0px", opacity: 0.5, scale: 1 }, EASE_IN_OUT),
            kf(0.5, { translateX: `${(noise(i + 3) - 0.5) * 60}px`, translateY: `${(noise(i + 5) - 0.5) * 50}px`, opacity: 1, scale: 1.15 }, EASE_IN_OUT),
            kf(1, { translateX: "0px", translateY: "0px", opacity: 0.5, scale: 1 }),
          ],
          durationMs: Math.round(7000 + noise(i + 9) * 5000),
          delayMs: Math.round(noise(i + 41) * 3000),
        }),
        dur,
        { zIndex: z, group, delayMs: req.delayMs },
      );
    }

    case "confetti": {
      const o = 0.5 + 0.4 * intensity;
      const chips = [palette.accent, palette.accent2, palette.glow, palette.text];
      const col = 24; // column height, % of the frame
      return particleLayers(
        40,
        (i) => {
          const chip = 2 + noise(i + 2) * 2; // chip height, % of the frame
          const stop = 100 - (chip / col) * 100; // where the chip starts in the column
          const fill = withAlpha(chips[i % 4], o);
          return {
            name: "Confetti",
            style: {
              left: `${noise(i) * 100}%`,
              top: `-${col}%`,
              width: `${1.1 + noise(i) * 1.4}%`,
              height: `${col}%`,
              // The chip rides at the foot of a short column, and the origin is
              // the chip itself — so the spin is in place while the column
              // carries it down the frame.
              background: `linear-gradient(180deg, transparent 0%, transparent ${stop}%, ${fill} ${stop}%, ${fill} 100%)`,
              borderRadius: "1px",
              transformOrigin: "50% 100%",
            },
            keyframes: [
              kf(0, { translateY: "0%", rotate: 0, opacity: 0 }, LINEAR),
              kf(0.1, { translateY: "12%", rotate: 120, opacity: 1 }, LINEAR),
              kf(1, { translateY: "560%", rotate: 540 + noise(i) * 360, opacity: 0.9 }),
            ],
            durationMs: Math.round(2600 + noise(i + 5) * 2600),
            delayMs: Math.round(noise(i + 19) * 2800),
          };
        },
        dur,
        { zIndex: z, group, delayMs: req.delayMs },
      );
    }

    // ------------------------------------------------------- motion and time ---

    case "speed_lines": {
      const o = 0.18 + 0.4 * intensity;
      return [
        layer(
          "Speed Lines",
          {
            background: `repeating-conic-gradient(from 0deg at 50% 50%, ${withAlpha("#ffffff", o)} 0deg, transparent 1.4deg, transparent 6deg)`,
            mixBlendMode: "screen",
            transformOrigin: "center center",
          },
          [
            kf(0, { opacity: 0, scale: 0.6, rotate: 0 }, EASE_IN_OUT),
            kf(0.5, { opacity: 1, scale: 1.5, rotate: 12 }, EASE_IN_OUT),
            kf(1, { opacity: 0, scale: 2.6, rotate: 22 }),
          ],
          1400,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
        ),
      ];
    }

    case "motion_trail": {
      const o = 0.1 + 0.3 * intensity;
      const bands: GraphicLayer[] = [];
      for (let i = 0; i < 6; i++) {
        bands.push(
          layer(
            "Trail Band",
            {
              top: `${i * 16.6}%`,
              height: "16.6%",
              background: `linear-gradient(90deg, transparent 0%, ${withAlpha(palette.accent, o)} 50%, transparent 100%)`,
              mixBlendMode: "screen",
            },
            [
              kf(0, { translateX: `${-60 - i * 6}%`, opacity: 0.2 }, LINEAR),
              kf(0.5, { translateX: `${30 + i * 6}%`, opacity: 1 }, LINEAR),
              kf(1, { translateX: `${-60 - i * 6}%`, opacity: 0.2 }),
            ],
            2600,
            { zIndex: z, group, iterationCount: "infinite", easing: LINEAR, delayMs: req.delayMs },
          ),
        );
      }
      return bands;
    }

    case "zoom_blur": {
      const o = 0.16 + 0.4 * intensity;
      return [
        layer(
          "Zoom Blur",
          {
            background: `radial-gradient(closest-side, ${withAlpha("#ffffff", o)} 0%, transparent 40%), repeating-conic-gradient(from 0deg at 50% 50%, ${withAlpha(palette.accent, o)} 0deg, transparent 3deg, transparent 8deg)`,
            mixBlendMode: "screen",
            filter: "blur(4px)",
            transformOrigin: "center center",
          },
          [
            kf(0, { opacity: 0, scale: 0.7 }, EASE_IN_OUT),
            kf(0.4, { opacity: 1, scale: 1.2 }, EASE_IN_OUT),
            kf(1, { opacity: 0, scale: 1.9 }),
          ],
          900,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
        ),
      ];
    }

    case "strobe": {
      const o = 0.18 + 0.4 * intensity;
      return [
        layer(
          "Strobe",
          {
            background: `repeating-linear-gradient(90deg, ${withAlpha(palette.text, o)} 0px, ${withAlpha(palette.text, o)} 40px, transparent 40px, transparent 96px)`,
            mixBlendMode: "screen",
          },
          [
            kf(0, { opacity: 0, translateX: "0%" }, LINEAR),
            kf(0.5, { opacity: 1, translateX: "-8%" }, LINEAR),
            kf(1, { opacity: 0, translateX: "-16%" }),
          ],
          520,
          { zIndex: z, group, iterationCount: "infinite", easing: LINEAR, delayMs: req.delayMs },
        ),
      ];
    }

    case "vhs": {
      const o = 0.1 + 0.3 * intensity;
      return [
        layer(
          "VHS Tracking",
          {
            background: `repeating-linear-gradient(0deg, ${withAlpha("#ffffff", o * 0.6)} 0px, transparent 2px, transparent 7px)`,
            mixBlendMode: "overlay",
          },
          [],
          dur,
          { zIndex: z, group, delayMs: req.delayMs },
        ),
        layer(
          "VHS Band",
          {
            top: "30%",
            height: "14%",
            background: `linear-gradient(180deg, transparent, ${withAlpha("#ffffff", o)} 40%, ${withAlpha(palette.accent, o)} 60%, transparent)`,
            mixBlendMode: "screen",
            filter: "blur(1px)",
          },
          [
            kf(0, { translateY: "-260%", opacity: 0 }, LINEAR),
            kf(0.15, { translateY: "0%", opacity: 1 }, LINEAR),
            kf(0.85, { translateY: "620%", opacity: 1 }, LINEAR),
            kf(1, { translateY: "880%", opacity: 0 }),
          ],
          3400,
          { zIndex: z + 1, group, iterationCount: "infinite", easing: LINEAR, delayMs: req.delayMs },
        ),
        layer(
          "VHS Chroma",
          {
            background: `linear-gradient(90deg, ${withAlpha("#ff0040", o * 0.7)} 0%, transparent 6%, transparent 94%, ${withAlpha("#00c8ff", o * 0.7)} 100%)`,
            mixBlendMode: "screen",
          },
          [],
          dur,
          { zIndex: z + 2, group, delayMs: req.delayMs },
        ),
      ];
    }

    case "film_burn": {
      const o = 0.22 + 0.45 * intensity;
      return [
        layer(
          "Film Burn",
          {
            background: `radial-gradient(120% 120% at 50% 50%, transparent 42%, ${withAlpha("#ff7a18", o)} 76%, ${withAlpha("#ffd36b", o)} 92%, ${withAlpha("#fff3c4", o)} 100%)`,
            mixBlendMode: "screen",
          },
          [
            kf(0, { opacity: 0.35, scale: 1 }, EASE_IN_OUT),
            kf(0.5, { opacity: 1, scale: 1.08 }, EASE_IN_OUT),
            kf(1, { opacity: 0.35, scale: 1 }),
          ],
          5200,
          { zIndex: z, group, iterationCount: "infinite", easing: EASE_IN_OUT, delayMs: req.delayMs },
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

  // Atmosphere sits lowest, so the grade and the grain pass over it.
  if (style === "tech") {
    out.push(...buildEffect({ kind: "grid", palette, amp, durationMs: totalMs, intensity: 0.3 }));
  }
  if (style === "cinematic") {
    out.push(...buildEffect({ kind: "god_rays", palette, amp, durationMs: totalMs, intensity: 0.42 }));
  }
  if (style === "energetic") {
    out.push(...buildEffect({ kind: "light_rays", palette, amp, durationMs: totalMs, intensity: 0.4 }));
  }
  if (kinetic) {
    out.push(...buildEffect({ kind: "speed_lines", palette, amp, durationMs: totalMs, intensity: 0.45 }));
    out.push(...buildEffect({ kind: "particles", palette, amp, durationMs: totalMs, intensity: 0.5 }));
  }

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
