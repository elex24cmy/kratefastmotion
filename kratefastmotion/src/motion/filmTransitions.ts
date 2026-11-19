/**
 * Transition kit — the seam between two scenes.
 *
 * A film that hard-cuts from beat to beat reads as one long slide. Real edits
 * wipe, dissolve, flip and punch between shots, so the vocabulary here is
 * borrowed from the compositors (After Effects' Transition category and the
 * open-source EffectCraft effect catalogue): linear/gradient/radial/iris wipes,
 * block and grid dissolves, venetian blinds, glass and light wipes, a serrated
 * jaw, a twist, scale and blob wipes, a card flip, and the punctuation cuts —
 * whip pan, glitch, flash and zoom punch.
 *
 * Every transition is drawn in pure CSS as a full-bleed overlay, so the
 * preview, the editor and the exported video render exactly the same pixels.
 * The overlay is deliberately percentage-sized, which is what tells the layout
 * engine it is a seam rather than content: it never shows up in an overlap
 * audit and nothing ever has to dodge it.
 *
 * A transition is anchored on the cut: it covers the frame at its midpoint
 * (`cutMs`) and clears on either side, so the incoming scene is revealed as the
 * panel leaves.
 */
import type { Easing, Keyframe } from "@kratefastmotion/shared";
import { easingPreset } from "@kratefastmotion/shared";
import type { GraphicLayer, GraphicPalette } from "./filmGraphics.js";
import { EASE_BACK, EASE_IN, EASE_IN_OUT, EASE_OUT, withAlpha } from "./filmBase.js";

export type TransitionKind =
  | "linear_wipe"
  | "gradient_wipe"
  | "radial_wipe"
  | "iris_wipe"
  | "block_dissolve"
  | "grid_wipe"
  | "venetian"
  | "shutter"
  | "glass_wipe"
  | "light_wipe"
  | "line_sweep"
  | "serrated"
  | "twist"
  | "scale_wipe"
  | "blob_wipe"
  | "card_wipe"
  | "whip_pan"
  | "glitch_cut"
  | "flash_cut"
  | "zoom_punch";

/** Every transition the kit can draw. */
export const TRANSITION_KINDS: TransitionKind[] = [
  "linear_wipe",
  "gradient_wipe",
  "radial_wipe",
  "iris_wipe",
  "block_dissolve",
  "grid_wipe",
  "venetian",
  "shutter",
  "glass_wipe",
  "light_wipe",
  "line_sweep",
  "serrated",
  "twist",
  "scale_wipe",
  "blob_wipe",
  "card_wipe",
  "whip_pan",
  "glitch_cut",
  "flash_cut",
  "zoom_punch",
];

/** What each transition looks like, in the agent's own words. */
export const TRANSITION_PURPOSE: Record<TransitionKind, string> = {
  linear_wipe: "A solid panel sweeps across the frame, covering the outgoing scene and revealing the incoming one. The workhorse cut — crisp and graphic.",
  gradient_wipe: "A soft-edged coloured band sweeps across the frame. Softer than a linear wipe, good for a calm or premium feel.",
  radial_wipe: "A conic sweep of colour rotates around the centre and covers the frame. Reads as a radar sweep or a spin.",
  iris_wipe: "A circle opens from the centre to cover the frame and closes again. Classic, playful, very readable.",
  block_dissolve: "A grid of tiles pops in and out to dissolve one scene into the next. Good for a digital or pixel theme.",
  grid_wipe: "Horizontal bands slide across the frame in sequence. A bold, structural cut.",
  venetian: "Horizontal slats close and open like blinds. Clean and mechanical.",
  shutter: "Vertical slats close and open like a shutter. Clean and mechanical.",
  glass_wipe: "A translucent, blurred glass panel sweeps across with a bright edge. Premium and tactile.",
  light_wipe: "A glowing band of light sweeps across the frame. Warm and luminous.",
  line_sweep: "A single bright line streaks across the frame on the cut. Minimal and fast.",
  serrated: "A jagged, saw-tooth edge sweeps across. Energetic and aggressive.",
  twist: "A swirling conic panel rotates in and covers the frame. Playful and kinetic.",
  scale_wipe: "A panel grows from a corner to cover the frame, then shrinks away to the opposite corner.",
  blob_wipe: "Soft organic blobs grow to cover the frame. A fluid, hand-drawn feel.",
  card_wipe: "The frame flips away like a card in 3D, revealing the next scene. Strong for a playful or product reveal.",
  whip_pan: "A fast horizontal motion smear whips across the cut, like a camera pan. Perfect for fast-cut edits.",
  glitch_cut: "Short RGB tears and horizontal displacement at the cut. Digital, abrupt, great on a beat.",
  flash_cut: "A quick white-to-accent flash at the cut. The simplest, punchiest seam.",
  zoom_punch: "A radial streak and scale punch on the cut, like a fast lens snap. High energy.",
};

export type TransitionDirection = "left" | "right" | "up" | "down";

export const TRANSITION_DIRECTIONS: TransitionDirection[] = ["left", "right", "up", "down"];

export interface TransitionRequest {
  kind: TransitionKind;
  palette: GraphicPalette;
  /** Beat amplitude (calm 0.55 / balanced 1 / kinetic 3); scales travel and drama. */
  amp: number;
  /** Absolute time of the cut, in ms, from the film's start. */
  cutMs: number;
  /** Total transition length. The cut sits at its midpoint. Defaults to ~520ms. */
  durationMs?: number;
  /** Travel direction for the directional wipes. Defaults to "right". */
  direction?: TransitionDirection;
  /** 0..1, overrides the kind's default strength. */
  intensity?: number;
  /** Panel colour. Defaults to the palette accent. */
  accent?: string;
  /** Composed-transition id; every layer of one call shares it. */
  group?: string;
  /** Base z-index. Defaults to 20 (above content, below the film finish). */
  zIndex?: number;
}

/** Full-bleed geometry: percentage-sized so the layout audit reads it as a seam. */
const FULL: Record<string, string | number> = {
  position: "absolute",
  left: "0px",
  top: "0px",
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  _content: "",
};

const LINEAR: Easing = easingPreset("linear");

/** The four states of a directional wipe, as `inset()` clip paths. */
function wipeInsets(direction: TransitionDirection): { hiddenIn: string; hiddenOut: string } {
  switch (direction) {
    case "left":
      return { hiddenIn: "inset(0 100% 0 0)", hiddenOut: "inset(0 0 0 100%)" };
    case "up":
      return { hiddenIn: "inset(0 0 100% 0)", hiddenOut: "inset(100% 0 0 0)" };
    case "down":
      return { hiddenIn: "inset(100% 0 0 0)", hiddenOut: "inset(0 0 100% 0)" };
    case "right":
    default:
      return { hiddenIn: "inset(0 0 0 100%)", hiddenOut: "inset(0 100% 0 0)" };
  }
}

/** A wipe travel vector, as a percentage of the frame, for translate-based kinds. */
function travel(direction: TransitionDirection): { x: number; y: number } {
  switch (direction) {
    case "left":
      return { x: -1, y: 0 };
    case "up":
      return { x: 0, y: -1 };
    case "down":
      return { x: 0, y: 1 };
    case "right":
    default:
      return { x: 1, y: 0 };
  }
}

function layer(
  name: string,
  style: Record<string, string | number>,
  keyframes: Keyframe[],
  durationMs: number,
  opts: { delayMs?: number; iterationCount?: number | "infinite"; easing?: Easing; zIndex: number; group?: string },
): GraphicLayer {
  return {
    name,
    delayMs: opts.delayMs ?? 0,
    durationMs,
    keyframes,
    style: { ...FULL, ...style, zIndex: opts.zIndex },
    iterationCount: opts.iterationCount ?? 1,
    easing: opts.easing ?? EASE_IN_OUT,
    group: opts.group,
  };
}

/** A cover beat: hidden → covered → covered → hidden, with the cut at the middle. */
function coverBeat(
  hiddenIn: Record<string, string | number>,
  covered: Record<string, string | number>,
  hiddenOut: Record<string, string | number>,
  inEnd = 0.44,
  holdEnd = 0.58,
): Keyframe[] {
  return [
    { offset: 0, properties: { opacity: 1, ...hiddenIn } as Keyframe["properties"], easing: EASE_OUT },
    { offset: inEnd, properties: { opacity: 1, ...covered } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: holdEnd, properties: { opacity: 1, ...covered } as Keyframe["properties"], easing: EASE_IN },
    { offset: 1, properties: { opacity: 1, ...hiddenOut } as Keyframe["properties"] },
  ];
}

/** A one-shot beat that peaks at the cut and is gone either side. */
function popBeat(peak: Record<string, string | number>, inAt = 0.34, outAt = 0.66): Keyframe[] {
  return [
    { offset: 0, properties: { opacity: 0 } as Keyframe["properties"], easing: EASE_OUT },
    { offset: inAt, properties: { opacity: 1, ...peak } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: outAt, properties: { opacity: 1, ...peak } as Keyframe["properties"], easing: EASE_IN },
    { offset: 1, properties: { opacity: 0, ...peak } as Keyframe["properties"] },
  ];
}

/** Deterministic 0..1 from an index — keeps a dissolve's tile order stable. */
function hash(i: number): number {
  const x = Math.sin(i * 91.7 + 41.3) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Build one transition as a full-bleed overlay composition. Pure and
 * deterministic: the same request always yields the same layers, which is what
 * makes it safe to audit.
 */
export function buildTransition(req: TransitionRequest): GraphicLayer[] {
  const { palette, kind } = req;
  const amp = Math.max(0.3, req.amp);
  const intensity = Math.max(0, Math.min(1, req.intensity ?? 0.75));
  const base = req.zIndex ?? 20;
  const accent = req.accent ?? palette.accent;
  const dir = req.direction ?? "right";
  const group = req.group;
  const durationMs = Math.max(160, Math.round(req.durationMs ?? 520));
  const delayMs = Math.round(req.cutMs - durationMs / 2);
  const common = { delayMs, zIndex: base, group };

  // Motion intensity scales how far a wipe travels and how hard a punch lands,
  // so a calm film gets a gentle seam and a kinetic one gets a big sweep.
  const drama = Math.min(1.6, Math.max(0.6, 1 + (amp - 1) * 0.25));

  const panel = (deg: number, a = accent): string =>
    `linear-gradient(${deg}deg, ${palette.bgFrom} 0%, ${a} 58%, ${palette.accent2} 100%)`;

  switch (kind) {
    case "linear_wipe": {
      const { hiddenIn, hiddenOut } = wipeInsets(dir);
      return [
        layer(
          "Wipe",
          { background: panel(90) },
          coverBeat({ clipPath: hiddenIn }, { clipPath: "inset(0 0 0 0)" }, { clipPath: hiddenOut }),
          durationMs,
          common,
        ),
        layer(
          "Wipe Edge",
          { background: `linear-gradient(90deg, transparent 0%, ${withAlpha("#ffffff", 0.5)} 50%, transparent 100%)`, width: "6%", left: dir === "left" ? "0%" : "94%", mixBlendMode: "screen" },
          [
            { offset: 0, properties: { opacity: 0 } as Keyframe["properties"], easing: EASE_OUT },
            { offset: 0.44, properties: { opacity: 0.8 } as Keyframe["properties"], easing: EASE_IN },
            { offset: 0.56, properties: { opacity: 0.8 } as Keyframe["properties"], easing: EASE_OUT },
            { offset: 1, properties: { opacity: 0 } as Keyframe["properties"] },
          ],
          durationMs,
          { ...common, zIndex: base + 1 },
        ),
      ];
    }

    case "gradient_wipe": {
      const t = travel(dir);
      const x = t.x, y = t.y;
      const w = x !== 0 ? "200%" : "100%";
      const h = y !== 0 ? "200%" : "100%";
      const edge = x !== 0
        ? `linear-gradient(${x > 0 ? 90 : 270}deg, transparent 0%, ${accent} 22%, ${palette.accent2} 78%, transparent 100%)`
        : `linear-gradient(${y > 0 ? 180 : 0}deg, transparent 0%, ${accent} 22%, ${palette.accent2} 78%, transparent 100%)`;
      return [
        layer(
          "Gradient Wipe",
          { background: edge, width: w, height: h, left: x !== 0 ? "-50%" : "0%", top: y !== 0 ? "-50%" : "0%" },
          [
            { offset: 0, properties: { opacity: 1, translateX: `${-100 * x * drama}%`, translateY: `${-100 * y * drama}%` } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 0.5, properties: { opacity: 1, translateX: "0%", translateY: "0%" } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 1, properties: { opacity: 1, translateX: `${100 * x * drama}%`, translateY: `${100 * y * drama}%` } as Keyframe["properties"] },
          ],
          durationMs,
          common,
        ),
      ];
    }

    case "radial_wipe": {
      return [
        layer(
          "Radial Wipe",
          { background: `conic-gradient(from 0deg, ${palette.bgFrom}, ${accent}, ${palette.accent2}, ${palette.bgFrom})` },
          [
            { offset: 0, properties: { opacity: 1, clipPath: "circle(0% at 50% 50%)", rotate: 0 } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 0.5, properties: { opacity: 1, clipPath: "circle(78% at 50% 50%)", rotate: 180 } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 1, properties: { opacity: 1, clipPath: "circle(0% at 50% 50%)", rotate: 360 } as Keyframe["properties"] },
          ],
          durationMs,
          common,
        ),
      ];
    }

    case "iris_wipe": {
      return [
        layer(
          "Iris Wipe",
          { background: panel(135) },
          [
            { offset: 0, properties: { clipPath: "circle(0% at 50% 50%)" } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 0.5, properties: { clipPath: "circle(78% at 50% 50%)" } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 1, properties: { clipPath: "circle(0% at 50% 50%)" } as Keyframe["properties"] },
          ],
          durationMs,
          common,
        ),
        layer(
          "Iris Ring",
          { border: `6px solid ${withAlpha("#ffffff", 0.55)}`, borderRadius: "50%", left: "50%", top: "50%", width: "8%", height: "8%", marginLeft: "-4%", marginTop: "-4%" },
          [
            { offset: 0, properties: { opacity: 0, scale: 1 } as Keyframe["properties"], easing: EASE_OUT },
            { offset: 0.5, properties: { opacity: 0.9, scale: 12 } as Keyframe["properties"], easing: EASE_IN },
            { offset: 1, properties: { opacity: 0, scale: 24 } as Keyframe["properties"] },
          ],
          durationMs,
          { ...common, zIndex: base + 1 },
        ),
      ];
    }

    case "block_dissolve": {
      const cols = 5;
      const rows = 3;
      const total = cols * rows;
      const out: GraphicLayer[] = [];
      for (let i = 0; i < total; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const order = hash(i);
        const inAt = 0.04 + 0.34 * order;
        const outAt = 0.62 + 0.34 * hash(i + 97);
        out.push(
          layer(
            "Block",
            {
              left: `${(col * 100) / cols}%`,
              top: `${(row * 100) / rows}%`,
              width: `${100 / cols + 0.5}%`,
              height: `${100 / rows + 0.5}%`,
              background: i % 2 === 0 ? accent : palette.accent2,
            },
            [
              { offset: 0, properties: { opacity: 0, scale: 0.6 } as Keyframe["properties"], easing: EASE_BACK },
              { offset: inAt, properties: { opacity: 1, scale: 1 } as Keyframe["properties"], easing: EASE_IN },
              { offset: outAt, properties: { opacity: 1, scale: 1 } as Keyframe["properties"], easing: EASE_IN },
              { offset: 1, properties: { opacity: 0, scale: 0.6 } as Keyframe["properties"] },
            ],
            durationMs,
            common,
          ),
        );
      }
      return out;
    }

    case "grid_wipe": {
      const rows = 6;
      const out: GraphicLayer[] = [];
      const t = travel(dir);
      for (let r = 0; r < rows; r++) {
        const stagger = 0.03 * (r % 3);
        out.push(
          layer(
            "Band",
            {
              top: `${(r * 100) / rows}%`,
              height: `${100 / rows + 0.6}%`,
              background: r % 2 === 0 ? accent : palette.accent2,
            },
            [
              { offset: 0, properties: { opacity: 1, translateX: `${-110 * t.x * drama}%`, translateY: `${-110 * t.y * drama}%` } as Keyframe["properties"], easing: EASE_OUT },
              { offset: 0.34 + stagger, properties: { opacity: 1, translateX: "0%", translateY: "0%" } as Keyframe["properties"], easing: EASE_IN_OUT },
              { offset: 0.66 - stagger, properties: { opacity: 1, translateX: "0%", translateY: "0%" } as Keyframe["properties"], easing: EASE_IN },
              { offset: 1, properties: { opacity: 1, translateX: `${110 * t.x * drama}%`, translateY: `${110 * t.y * drama}%` } as Keyframe["properties"] },
            ],
            durationMs,
            common,
          ),
        );
      }
      return out;
    }

    case "venetian":
    case "shutter": {
      const slats = 9;
      const horizontal = kind === "venetian";
      const out: GraphicLayer[] = [];
      for (let i = 0; i < slats; i++) {
        out.push(
          layer(
            horizontal ? "Slat" : "Blade",
            {
              left: horizontal ? "0%" : `${(i * 100) / slats}%`,
              top: horizontal ? `${(i * 100) / slats}%` : "0%",
              width: horizontal ? "100%" : `${100 / slats + 0.5}%`,
              height: horizontal ? `${100 / slats + 0.5}%` : "100%",
              background: i % 2 === 0 ? palette.bgFrom : accent,
              transformOrigin: horizontal ? "center center" : "center center",
            },
            [
              { offset: 0, properties: { opacity: 1, scaleX: horizontal ? 1 : 0, scaleY: horizontal ? 0 : 1 } as Keyframe["properties"], easing: EASE_OUT },
              { offset: 0.42, properties: { opacity: 1, scaleX: 1, scaleY: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
              { offset: 0.58, properties: { opacity: 1, scaleX: 1, scaleY: 1 } as Keyframe["properties"], easing: EASE_IN },
              { offset: 1, properties: { opacity: 1, scaleX: horizontal ? 1 : 0, scaleY: horizontal ? 0 : 1 } as Keyframe["properties"] },
            ],
            durationMs,
            common,
          ),
        );
      }
      return out;
    }

    case "glass_wipe": {
      const t = travel(dir);
      return [
        layer(
          "Glass",
          {
            background: `linear-gradient(90deg, ${withAlpha("#ffffff", 0.08)} 0%, ${withAlpha("#ffffff", 0.3)} 40%, ${withAlpha(accent, 0.85)} 62%, ${withAlpha("#ffffff", 0.35)} 100%)`,
            backdropFilter: "blur(10px)",
            filter: "blur(2px)",
          },
          [
            { offset: 0, properties: { opacity: 1, translateX: `${-110 * t.x * drama}%`, translateY: `${-110 * t.y * drama}%` } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 0.5, properties: { opacity: 1, translateX: "0%", translateY: "0%" } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 1, properties: { opacity: 1, translateX: `${110 * t.x * drama}%`, translateY: `${110 * t.y * drama}%` } as Keyframe["properties"] },
          ],
          durationMs,
          common,
        ),
      ];
    }

    case "light_wipe": {
      const t = travel(dir);
      return [
        layer(
          "Light Wipe",
          {
            background: `linear-gradient(90deg, transparent 0%, ${withAlpha(accent, 0.75)} 45%, ${withAlpha("#ffffff", 0.95)} 55%, ${withAlpha(palette.accent2, 0.7)} 70%, transparent 100%)`,
            mixBlendMode: "screen",
            filter: "blur(6px)",
          },
          [
            { offset: 0, properties: { opacity: 0, translateX: `${-120 * t.x * drama}%`, translateY: `${-120 * t.y * drama}%` } as Keyframe["properties"], easing: EASE_OUT },
            { offset: 0.2, properties: { opacity: 1, translateX: `${-60 * t.x * drama}%`, translateY: `${-60 * t.y * drama}%` } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 0.5, properties: { opacity: 1, translateX: "0%", translateY: "0%" } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 0.8, properties: { opacity: 1, translateX: `${60 * t.x * drama}%`, translateY: `${60 * t.y * drama}%` } as Keyframe["properties"], easing: EASE_IN },
            { offset: 1, properties: { opacity: 0, translateX: `${120 * t.x * drama}%`, translateY: `${120 * t.y * drama}%` } as Keyframe["properties"] },
          ],
          durationMs,
          common,
        ),
      ];
    }

    case "line_sweep": {
      const vertical = dir === "up" || dir === "down";
      return [
        layer(
          "Sweep Line",
          vertical
            ? { top: "50%", height: "5%", width: "100%", background: `linear-gradient(0deg, transparent, ${withAlpha("#ffffff", 0.95)}, ${accent}, transparent)`, mixBlendMode: "screen", filter: "blur(2px)" }
            : { left: "50%", width: "5%", height: "100%", background: `linear-gradient(90deg, transparent, ${withAlpha("#ffffff", 0.95)}, ${accent}, transparent)`, mixBlendMode: "screen", filter: "blur(2px)" },
          [
            { offset: 0, properties: (vertical ? { opacity: 0, scaleY: 0.1, translateY: `${(dir === "up" ? 900 : -900) * drama}%` } : { opacity: 0, scaleX: 0.1, translateX: `${(dir === "left" ? 900 : -900) * drama}%` }) as Keyframe["properties"], easing: EASE_OUT },
            { offset: 0.5, properties: (vertical ? { opacity: 1, scaleY: 1, translateY: "0%" } : { opacity: 1, scaleX: 1, translateX: "0%" }) as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 1, properties: (vertical ? { opacity: 0, scaleY: 0.1, translateY: `${(dir === "up" ? -900 : 900) * drama}%` } : { opacity: 0, scaleX: 0.1, translateX: `${(dir === "left" ? -900 : 900) * drama}%` }) as Keyframe["properties"] },
          ],
          durationMs,
          common,
        ),
      ];
    }

    case "serrated": {
      const teeth = 10;
      const points: string[] = [];
      for (let i = 0; i <= teeth; i++) {
        const x = (i * 100) / teeth;
        const y = i % 2 === 0 ? 0 : 9;
        points.push(`${x}% ${y}%`);
      }
      points.push("100% 100%", "0% 100%");
      const jagged = `polygon(${points.join(", ")})`;
      return [
        layer(
          "Serrated Wipe",
          { background: panel(90), clipPath: jagged, transformOrigin: "left center" },
          [
            { offset: 0, properties: { opacity: 1, scaleX: 0 } as Keyframe["properties"], easing: EASE_OUT },
            { offset: 0.5, properties: { opacity: 1, scaleX: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 1, properties: { opacity: 1, scaleX: 0 } as Keyframe["properties"], easing: EASE_IN },
          ],
          durationMs,
          common,
        ),
      ];
    }

    case "twist": {
      return [
        layer(
          "Twist",
          { background: `conic-gradient(from 0deg, ${accent}, ${palette.bgFrom}, ${palette.accent2}, ${palette.bgFrom}, ${accent})` },
          [
            { offset: 0, properties: { opacity: 1, clipPath: "circle(0% at 50% 50%)", rotate: 0 } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 0.5, properties: { opacity: 1, clipPath: "circle(80% at 50% 50%)", rotate: 220 } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 1, properties: { opacity: 1, clipPath: "circle(0% at 50% 50%)", rotate: 440 } as Keyframe["properties"] },
          ],
          durationMs,
          common,
        ),
      ];
    }

    case "scale_wipe": {
      return [
        layer(
          "Scale In",
          { background: panel(90), transformOrigin: "0% 0%" },
          [
            { offset: 0, properties: { opacity: 1, scale: 0 } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 0.5, properties: { opacity: 1, scale: 1 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.501, properties: { opacity: 0, scale: 1 } as Keyframe["properties"], easing: LINEAR },
            { offset: 1, properties: { opacity: 0, scale: 1 } as Keyframe["properties"] },
          ],
          durationMs,
          common,
        ),
        layer(
          "Scale Out",
          { background: panel(90), transformOrigin: "100% 100%" },
          [
            { offset: 0, properties: { opacity: 0, scale: 1 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.499, properties: { opacity: 0, scale: 1 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.5, properties: { opacity: 1, scale: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 1, properties: { opacity: 1, scale: 0 } as Keyframe["properties"] },
          ],
          durationMs,
          { ...common, zIndex: base + 1 },
        ),
      ];
    }

    case "blob_wipe": {
      const blobs = 4;
      const out: GraphicLayer[] = [];
      for (let i = 0; i < blobs; i++) {
        const x = 22 + 56 * hash(i * 13);
        const y = 22 + 56 * hash(i * 29 + 7);
        out.push(
          layer(
            "Blob",
            {
              left: `${x}%`,
              top: `${y}%`,
              width: "135%",
              height: "135%",
              marginLeft: "-67.5%",
              marginTop: "-67.5%",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accent} 0%, ${palette.accent2} 62%, transparent 100%)`,
              transformOrigin: "center center",
            },
            [
              { offset: 0, properties: { opacity: 0, scale: 0 } as Keyframe["properties"], easing: EASE_OUT },
              { offset: 0.4 + 0.06 * hash(i), properties: { opacity: 1, scale: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
              { offset: 0.6 - 0.06 * hash(i), properties: { opacity: 1, scale: 1 } as Keyframe["properties"], easing: EASE_IN },
              { offset: 1, properties: { opacity: 0, scale: 0 } as Keyframe["properties"] },
            ],
            durationMs,
            common,
          ),
        );
      }
      return out;
    }

    case "card_wipe": {
      return [
        layer(
          "Card",
          {
            background: panel(120),
            perspective: "1400px",
            transformOrigin: "center center",
            backfaceVisibility: "hidden",
          },
          [
            { offset: 0, properties: { opacity: 1, rotateY: 92 } as Keyframe["properties"], easing: EASE_OUT },
            { offset: 0.5, properties: { opacity: 1, rotateY: 0 } as Keyframe["properties"], easing: EASE_IN },
            { offset: 1, properties: { opacity: 1, rotateY: -92 } as Keyframe["properties"] },
          ],
          durationMs,
          common,
        ),
      ];
    }

    case "whip_pan": {
      const t = travel(dir);
      const vertical = t.y !== 0;
      const streaks = vertical
        ? `repeating-linear-gradient(0deg, ${withAlpha(accent, 0.9)} 0px, ${withAlpha(palette.bgFrom, 0.9)} 3px, ${withAlpha(accent, 0.9)} 7px)`
        : `repeating-linear-gradient(90deg, ${withAlpha(accent, 0.9)} 0px, ${withAlpha(palette.bgFrom, 0.9)} 3px, ${withAlpha(accent, 0.9)} 7px)`;
      return [
        layer(
          "Whip Streaks",
          { background: streaks, filter: "blur(3px)", opacity: 0.85 },
          [
            { offset: 0, properties: { opacity: 0, translateX: `${-120 * t.x * drama}%`, translateY: `${-120 * t.y * drama}%`, scaleX: vertical ? 1 : 0.4, scaleY: vertical ? 0.4 : 1 } as Keyframe["properties"], easing: EASE_OUT },
            { offset: 0.28, properties: { opacity: 1, translateX: `${-40 * t.x * drama}%`, translateY: `${-40 * t.y * drama}%`, scaleX: 1, scaleY: 1 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.5, properties: { opacity: 1, translateX: "0%", translateY: "0%", scaleX: 1, scaleY: 1 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.72, properties: { opacity: 1, translateX: `${40 * t.x * drama}%`, translateY: `${40 * t.y * drama}%`, scaleX: 1, scaleY: 1 } as Keyframe["properties"], easing: EASE_IN },
            { offset: 1, properties: { opacity: 0, translateX: `${120 * t.x * drama}%`, translateY: `${120 * t.y * drama}%`, scaleX: vertical ? 1 : 0.4, scaleY: vertical ? 0.4 : 1 } as Keyframe["properties"] },
          ],
          durationMs,
          common,
        ),
        layer(
          "Whip Panel",
          { background: panel(90), opacity: 0.55 },
          [
            { offset: 0, properties: { opacity: 0 } as Keyframe["properties"], easing: EASE_OUT },
            { offset: 0.42, properties: { opacity: 0.7 } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 0.58, properties: { opacity: 0.7 } as Keyframe["properties"], easing: EASE_IN },
            { offset: 1, properties: { opacity: 0 } as Keyframe["properties"] },
          ],
          durationMs,
          { ...common, zIndex: base + 1 },
        ),
      ];
    }

    case "glitch_cut": {
      const out: GraphicLayer[] = [];
      const bands = 5;
      for (let i = 0; i < bands; i++) {
        const at = 0.3 + 0.08 * i;
        out.push(
          layer(
            "Glitch Band",
            {
              top: `${8 + i * 18}%`,
              height: "10%",
              background: i % 2 === 0 ? `linear-gradient(90deg, ${withAlpha("#ff2d6b", 0.85)}, ${withAlpha("#22d3ee", 0.85)})` : withAlpha(accent, 0.8),
              mixBlendMode: "screen",
            },
            [
              // An explicit t=0 hold keeps every transition layer's keyframes
              // spanning the full beat, so a band is never mid-burst on entry.
              { offset: 0, properties: { opacity: 0, translateX: 0 } as Keyframe["properties"], easing: LINEAR },
              { offset: Math.max(0, at - 0.09), properties: { opacity: 0, translateX: 0 } as Keyframe["properties"], easing: LINEAR },
              { offset: at, properties: { opacity: 1, translateX: i % 2 === 0 ? -40 : 46 } as Keyframe["properties"], easing: LINEAR },
              { offset: Math.min(1, at + 0.09), properties: { opacity: 0, translateX: i % 2 === 0 ? 30 : -34 } as Keyframe["properties"], easing: LINEAR },
              { offset: 1, properties: { opacity: 0 } as Keyframe["properties"] },
            ],
            durationMs,
            common,
          ),
        );
      }
      out.push(
        layer(
          "Glitch Flash",
          { background: `linear-gradient(180deg, ${withAlpha("#ffffff", 0.35)}, ${withAlpha(accent, 0.4)})`, mixBlendMode: "screen" },
          popBeat({}),
          durationMs,
          { ...common, zIndex: base + 1 },
        ),
      );
      return out;
    }

    case "flash_cut": {
      const peak = 0.6 + 0.35 * intensity;
      return [
        layer(
          "Cut Flash",
          { background: `linear-gradient(180deg, ${withAlpha("#ffffff", peak)} 0%, ${withAlpha(accent, peak * 0.7)} 100%)`, mixBlendMode: "screen" },
          [
            { offset: 0, properties: { opacity: 0 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.42, properties: { opacity: 1 } as Keyframe["properties"], easing: LINEAR },
            { offset: 0.58, properties: { opacity: 1 } as Keyframe["properties"], easing: EASE_IN },
            { offset: 1, properties: { opacity: 0 } as Keyframe["properties"] },
          ],
          durationMs,
          common,
        ),
      ];
    }

    case "zoom_punch": {
      return [
        layer(
          "Zoom Streaks",
          {
            background: `repeating-conic-gradient(from 0deg at 50% 50%, ${withAlpha("#ffffff", 0.5)} 0deg, transparent 3deg, ${withAlpha(accent, 0.5)} 6deg, transparent 10deg)`,
            mixBlendMode: "screen",
            transformOrigin: "center center",
          },
          [
            { offset: 0, properties: { opacity: 0, scale: 0.8 } as Keyframe["properties"], easing: EASE_OUT },
            { offset: 0.5, properties: { opacity: 0.9, scale: 1 + 0.15 * drama } as Keyframe["properties"], easing: EASE_IN },
            { offset: 1, properties: { opacity: 0, scale: 1 + 0.5 * drama } as Keyframe["properties"] },
          ],
          durationMs,
          common,
        ),
        layer(
          "Zoom Wash",
          { background: panel(90), opacity: 0.35 },
          popBeat({}, 0.42, 0.58),
          durationMs,
          { ...common, zIndex: base + 1 },
        ),
      ];
    }

    default:
      return [];
  }
}

/**
 * The transition a film reaches for when nobody asks for one. Kinetic films get
 * the punchy cuts; calm films get the soft dissolves.
 */
export function defaultTransition(style: string, motion: string): TransitionKind {
  if (motion === "kinetic") return "whip_pan";
  if (style === "cinematic") return "gradient_wipe";
  if (style === "playful") return "iris_wipe";
  if (style === "tech") return "glitch_cut";
  if (style === "calm" || motion === "calm") return "gradient_wipe";
  return "linear_wipe";
}

/** One-line human summary of a transition, used by tool output. */
export function describeTransition(kind: TransitionKind, direction?: TransitionDirection, durationMs?: number): string {
  const base = TRANSITION_PURPOSE[kind].split(". ")[0];
  const bits = [base];
  if (direction && kind.includes("wipe")) bits.push(`direction ${direction}`);
  if (durationMs !== undefined) bits.push(`${Math.round(durationMs)}ms`);
  return bits.join(" — ");
}

/**
 * A short, style-appropriate rotation of transitions, so consecutive cuts in a
 * film differ from one another instead of repeating the same seam.
 */
export function transitionSequence(style: string, motion: string, count: number): TransitionKind[] {
  const pools: Record<string, TransitionKind[]> = {
    kinetic: ["whip_pan", "glitch_cut", "zoom_punch", "flash_cut", "block_dissolve"],
    cinematic: ["gradient_wipe", "light_wipe", "linear_wipe", "blob_wipe"],
    tech: ["glitch_cut", "grid_wipe", "line_sweep", "block_dissolve"],
    playful: ["iris_wipe", "card_wipe", "blob_wipe", "twist"],
    calm: ["gradient_wipe", "glass_wipe", "light_wipe"],
    energetic: ["whip_pan", "zoom_punch", "light_wipe", "scale_wipe"],
    default: ["linear_wipe", "gradient_wipe", "iris_wipe"],
  };
  const pool = motion === "kinetic" ? pools.kinetic : (pools[style] ?? pools.default);
  const out: TransitionKind[] = [];
  for (let i = 0; i < count; i++) out.push(pool[i % pool.length]);
  return out;
}
