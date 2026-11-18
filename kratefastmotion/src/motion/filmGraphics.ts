/**
 * Graphic kit — the shapes and ornaments a film is built from.
 *
 * The director used to own only text and atmosphere. This module adds real
 * graphics: cards, chips, rings, framing brackets, connectors, progress rails,
 * bar charts, dot fields, chevrons, dividers, icon tiles and area charts — all
 * drawn in pure CSS (no images, no canvas) so they render identically in the
 * preview, the editor and the exported video.
 *
 * Every builder is handed a `Box` from the layout engine rather than inventing
 * its own coordinates, which is what keeps graphics from landing on top of the
 * text. The kit is pure: it returns layer descriptors, and the director decides
 * z-order and scene timing.
 */
import type { Easing, Keyframe } from "@kratefastmotion/shared";
import { type Box, boxToStyle } from "./layout.js";
import { beat, beatHold, EASE_BACK, EASE_IN, EASE_IN_OUT, EASE_OUT, FONT_STACK, MONO_STACK, withAlpha } from "./filmBase.js";

/** Colours a graphic needs. Structurally identical to the director's palette. */
export interface GraphicPalette {
  bgFrom: string;
  bgTo: string;
  text: string;
  subtext: string;
  accent: string;
  accent2: string;
  glow: string;
}

export type GraphicKind =
  | "card"
  | "chip"
  | "ring"
  | "bracket"
  | "connector"
  | "progress"
  | "bars"
  | "dots"
  | "chevrons"
  | "divider"
  | "iconTile"
  | "area";

export const GRAPHIC_KINDS: GraphicKind[] = [
  "card",
  "chip",
  "ring",
  "bracket",
  "connector",
  "progress",
  "bars",
  "dots",
  "chevrons",
  "divider",
  "iconTile",
  "area",
];

/** What a graphic is made of, which is what the agent actually asks for. */
export const GRAPHIC_PURPOSE: Record<GraphicKind, string> = {
  card: "A translucent panel that groups content — put text or stats on top of it.",
  chip: "A small pill with a status dot and a short label. Good for tags and categories.",
  ring: "An outlined circle with a rotating accent arc. Reads as processing, focus or a metric.",
  bracket: "Four corner brackets that frame a region, animating outward into place.",
  connector: "A line with a dot travelling along it, linking two points in a flow.",
  progress: "A track and a fill that grows to a share of the width. Good for a percentage.",
  bars: "A small bar chart that grows from the baseline with a stagger.",
  dots: "A grid of dots pulsing in a wave. Reads as data, a cluster or a signal.",
  chevrons: "Three chevrons pulsing in sequence, showing direction or momentum.",
  divider: "A hairline with a centre node — separates two blocks of a layout.",
  iconTile: "A rounded tile with a gradient and a bolt glyph. Good as a feature icon.",
  area: "An area chart that wipes upward into a rising profile.",
};

export type GraphicTone = "accent" | "neutral" | "muted";

export interface GraphicRequest {
  kind: GraphicKind;
  /** Where the graphic lives on the stage, from the layout engine. */
  box: Box;
  palette: GraphicPalette;
  /** Beat amplitude multiplier: calm 0.55 / balanced 1 / kinetic 3. */
  amp: number;
  sceneDurationMs: number;
  /** Short label (chip text, bar legend). */
  label?: string;
  /** Figure shown by the graphic (percentage, count). */
  value?: string;
  tone?: GraphicTone;
  /** Entrance delay relative to the scene start. */
  delayMs?: number;
  /** Base z-index; sub-layers sit just above it. */
  zIndex?: number;
  /** 0..1 share for `progress` and `area`. */
  amount?: number;
  /** Item count for `bars`, `dots` and `chevrons`. */
  count?: number;
  /**
   * Composed-graphic id. Layers sharing a group are allowed to overlap (a card
   * and the chart drawn on it). Defaults to a stable id from the kind + box, so
   * the layers of one `buildGraphic` call always group together.
   */
  group?: string;
}

/** A positioned, animated layer ready to be turned into a component. */
export interface GraphicLayer {
  name: string;
  delayMs: number;
  durationMs: number;
  keyframes: Keyframe[];
  style: Record<string, string | number>;
  iterationCount?: number | "infinite";
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
  easing?: Easing;
  /** Which composed graphic this layer belongs to (set by `buildGraphic`). */
  group?: string;
}

/* --------------------------------------------------------------- helpers --- */

/** Deterministic 0..1 from an index — keeps charts stable across renders. */
function noise(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function toneColor(palette: GraphicPalette, tone: GraphicTone): string {
  if (tone === "neutral") return palette.text;
  if (tone === "muted") return palette.subtext;
  return palette.accent;
}

/** A layer with no text of its own — a shape. */
function shape(
  name: string,
  box: Box,
  style: Record<string, string | number>,
  keyframes: Keyframe[],
  delayMs: number,
  durationMs: number,
): GraphicLayer {
  return {
    name,
    delayMs,
    durationMs,
    keyframes,
    style: boxToStyle(box, { position: "absolute", _content: "", ...style }),
  };
}

/** A layer that renders text, centred inside its box. */
function label(
  name: string,
  box: Box,
  content: string,
  style: Record<string, string | number>,
  keyframes: Keyframe[],
  delayMs: number,
  durationMs: number,
): GraphicLayer {
  return {
    name,
    delayMs,
    durationMs,
    keyframes,
    style: boxToStyle(box, {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      _content: content,
      zIndex: "10",
      ...style,
    }),
  };
}

/* -------------------------------------------------------------- builders --- */

function card(req: GraphicRequest): GraphicLayer[] {
  const { box, palette, amp } = req;
  const a = amp;
  const z = String(req.zIndex ?? 6);
  const base = req.delayMs ?? 0;
  const radius = Math.min(34, Math.max(16, box.h * 0.12));

  return [
    shape(
      "Card",
      box,
      {
        background: `linear-gradient(158deg, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.022) 58%, rgba(255,255,255,0.05) 100%)`,
        border: `1px solid ${withAlpha(palette.text, 0.11)}`,
        borderRadius: `${radius}px`,
        boxShadow: `0 34px 90px rgba(0,0,0,0.42), inset 0 1px 0 ${withAlpha(palette.text, 0.09)}`,
        backdropFilter: "blur(14px)",
        transformOrigin: "center center",
        zIndex: z,
      },
      beat({ translateY: 34 * a, scale: 1 - 0.03 * a }, { translateY: 0, scale: 1 }, {}, { translateY: -10 * a }),
      base,
      req.sceneDurationMs - 300,
    ),
    // A hairline of accent light along the top edge gives the panel a source.
    shape(
      "Card Edge",
      { x: box.x + radius, y: box.y, w: Math.max(24, box.w - radius * 2), h: 2 },
      {
        background: `linear-gradient(90deg, transparent, ${withAlpha(palette.accent, 0.75)}, transparent)`,
        borderRadius: "2px",
        transformOrigin: "center center",
        zIndex: String(Number(z) + 1),
      },
      [
        { offset: 0, properties: { opacity: 0, scaleX: 0 } as Keyframe["properties"], easing: EASE_OUT },
        { offset: 0.28, properties: { opacity: 1, scaleX: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.82, properties: { opacity: 1, scaleX: 1 } as Keyframe["properties"], easing: EASE_IN },
        { offset: 1, properties: { opacity: 0, scaleX: 1 } as Keyframe["properties"] },
      ],
      base + 220,
      req.sceneDurationMs - 520,
    ),
  ];
}

function chip(req: GraphicRequest): GraphicLayer[] {
  const { box, palette, amp } = req;
  const a = amp;
  const z = req.zIndex ?? 8;
  const base = req.delayMs ?? 0;
  const color = toneColor(palette, req.tone ?? "accent");
  const dot = Math.min(14, box.h * 0.24);
  const padLeft = dot + 26;

  return [
    shape(
      "Chip",
      box,
      {
        background: withAlpha(color, 0.12),
        border: `1px solid ${withAlpha(color, 0.36)}`,
        borderRadius: "999px",
        boxShadow: `0 12px 34px ${withAlpha(color, 0.18)}`,
        backdropFilter: "blur(8px)",
        transformOrigin: "center center",
        zIndex: String(z),
      },
      beat({ scale: 1 - 0.08 * a, translateY: 12 * a }, { scale: 1, translateY: 0 }, {}, { scale: 1 + 0.02 * a }),
      base,
      req.sceneDurationMs - 420,
    ),
    shape(
      "Chip Dot",
      { x: box.x + 16, y: box.y + (box.h - dot) / 2, w: dot, h: dot },
      {
        background: color,
        borderRadius: "50%",
        boxShadow: `0 0 16px ${withAlpha(color, 0.9)}`,
        transformOrigin: "center center",
        zIndex: String(z + 1),
      },
      [
        { offset: 0, properties: { scale: 0, opacity: 0 } as Keyframe["properties"], easing: EASE_BACK },
        { offset: 0.2, properties: { scale: 1, opacity: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.55, properties: { scale: 1, opacity: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.75, properties: { scale: 1.35, opacity: 0.75 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 1, properties: { scale: 1, opacity: 1 } as Keyframe["properties"] },
      ],
      base + 120,
      req.sceneDurationMs - 540,
    ),
    label(
      "Chip Label",
      { x: box.x + padLeft, y: box.y, w: Math.max(40, box.w - padLeft - 20), h: box.h },
      req.label ?? "New",
      {
        color: palette.text,
        fontFamily: MONO_STACK,
        fontSize: `${Math.max(14, Math.min(22, box.h * 0.4))}px`,
        fontWeight: "600",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        justifyContent: "flex-start",
        whiteSpace: "nowrap",
        zIndex: String(z + 2),
      },
      beat({ translateX: -10 * a }, { translateX: 0 }, {}, { translateX: 4 * a }),
      base + 180,
      req.sceneDurationMs - 600,
    ),
  ];
}

function ring(req: GraphicRequest): GraphicLayer[] {
  const { box, palette, amp } = req;
  const z = req.zIndex ?? 8;
  const base = req.delayMs ?? 0;
  const size = Math.min(box.w, box.h);
  const thickness = Math.max(6, size * 0.055);
  const centred: Box = { x: box.x + (box.w - size) / 2, y: box.y + (box.h - size) / 2, w: size, h: size };
  const core = Math.max(8, size * 0.11);

  return [
    shape(
      "Ring",
      centred,
      {
        border: `${thickness}px solid ${withAlpha(palette.text, 0.09)}`,
        borderTopColor: palette.accent,
        borderRightColor: palette.accent2,
        borderRadius: "50%",
        boxShadow: `0 0 ${Math.round(size * 0.22)}px ${withAlpha(palette.accent, 0.28)}`,
        transformOrigin: "center center",
        zIndex: String(z),
      },
      [
        { offset: 0, properties: { opacity: 0, scale: 1 - 0.2 * amp, rotate: -90 } as Keyframe["properties"], easing: EASE_OUT },
        { offset: 0.18, properties: { opacity: 1, scale: 1, rotate: 0 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.85, properties: { opacity: 1, scale: 1, rotate: 250 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 1, properties: { opacity: 0, scale: 1 + 0.06 * amp, rotate: 320 } as Keyframe["properties"] },
      ],
      base,
      req.sceneDurationMs - 200,
    ),
    shape(
      "Ring Core",
      { x: centred.x + size / 2 - core / 2, y: centred.y + size / 2 - core / 2, w: core, h: core },
      {
        background: palette.accent,
        borderRadius: "50%",
        boxShadow: `0 0 ${Math.round(core * 1.6)}px ${withAlpha(palette.accent, 0.95)}`,
        transformOrigin: "center center",
        zIndex: String(z + 1),
      },
      [
        { offset: 0, properties: { scale: 0, opacity: 0 } as Keyframe["properties"], easing: EASE_BACK },
        { offset: 0.22, properties: { scale: 1, opacity: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.6, properties: { scale: 1.25, opacity: 0.85 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 1, properties: { scale: 1, opacity: 1 } as Keyframe["properties"] },
      ],
      base + 160,
      req.sceneDurationMs - 360,
    ),
  ];
}

function bracket(req: GraphicRequest): GraphicLayer[] {
  const { box, palette, amp } = req;
  const z = req.zIndex ?? 9;
  const base = req.delayMs ?? 0;
  const arm = Math.min(96, Math.max(36, Math.min(box.w, box.h) * 0.2));
  const thickness = Math.max(3, Math.min(7, arm * 0.075));
  const color = palette.accent;
  const corners: Array<{ name: string; x: number; y: number; borders: Record<string, string>; radius: string; from: { x: number; y: number } }> = [
    {
      name: "Bracket Top Left",
      x: box.x,
      y: box.y,
      borders: { borderTop: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}` },
      radius: `${thickness * 2}px 0 0 0`,
      from: { x: arm * 0.7, y: arm * 0.7 },
    },
    {
      name: "Bracket Top Right",
      x: box.x + box.w - arm,
      y: box.y,
      borders: { borderTop: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}` },
      radius: `0 ${thickness * 2}px 0 0`,
      from: { x: -arm * 0.7, y: arm * 0.7 },
    },
    {
      name: "Bracket Bottom Left",
      x: box.x,
      y: box.y + box.h - arm,
      borders: { borderBottom: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}` },
      radius: `0 0 0 ${thickness * 2}px`,
      from: { x: arm * 0.7, y: -arm * 0.7 },
    },
    {
      name: "Bracket Bottom Right",
      x: box.x + box.w - arm,
      y: box.y + box.h - arm,
      borders: { borderBottom: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}` },
      radius: `0 0 ${thickness * 2}px 0`,
      from: { x: -arm * 0.7, y: -arm * 0.7 },
    },
  ];

  return corners.map((corner, i) =>
    shape(
      corner.name,
      { x: corner.x, y: corner.y, w: arm, h: arm },
      {
        ...corner.borders,
        borderRadius: corner.radius,
        filter: `drop-shadow(0 0 10px ${withAlpha(color, 0.55)})`,
        transformOrigin: "center center",
        zIndex: String(z),
      },
      beat(
        { translateX: corner.from.x * amp, translateY: corner.from.y * amp, scale: 1 - 0.2 * amp },
        { translateX: 0, translateY: 0, scale: 1 },
        {},
        { scale: 1 + 0.02 * amp },
      ),
      base + i * 70,
      req.sceneDurationMs - 300,
    ),
  );
}

function connector(req: GraphicRequest): GraphicLayer[] {
  const { box, palette, amp } = req;
  const z = req.zIndex ?? 7;
  const base = req.delayMs ?? 0;
  const lineH = Math.max(2, Math.min(4, box.h * 0.06));
  const dot = Math.max(10, Math.min(20, box.h * 0.3));
  const travel = Math.max(1, box.w - dot);

  return [
    shape(
      "Connector Line",
      { x: box.x, y: box.y + box.h / 2 - lineH / 2, w: box.w, h: lineH },
      {
        background: `linear-gradient(90deg, ${withAlpha(palette.accent, 0.15)}, ${withAlpha(palette.accent, 0.85)} 50%, ${withAlpha(palette.accent2, 0.15)})`,
        borderRadius: "999px",
        transformOrigin: "left center",
        zIndex: String(z),
      },
      [
        { offset: 0, properties: { scaleX: 0, opacity: 0 } as Keyframe["properties"], easing: EASE_OUT },
        { offset: 0.22, properties: { scaleX: 1, opacity: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.85, properties: { scaleX: 1, opacity: 1 } as Keyframe["properties"], easing: EASE_IN },
        { offset: 1, properties: { scaleX: 1, opacity: 0 } as Keyframe["properties"] },
      ],
      base,
      req.sceneDurationMs - 320,
    ),
    shape(
      "Connector Dot",
      { x: box.x, y: box.y + box.h / 2 - dot / 2, w: dot, h: dot },
      {
        background: palette.text,
        borderRadius: "50%",
        boxShadow: `0 0 ${Math.round(dot * 1.4)}px ${withAlpha(palette.accent, 0.95)}`,
        transformOrigin: "center center",
        zIndex: String(z + 1),
      },
      [
        { offset: 0, properties: { translateX: 0, opacity: 0, scale: 0.6 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.14, properties: { opacity: 1, scale: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.72, properties: { translateX: travel, opacity: 1, scale: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.92, properties: { translateX: travel, opacity: 0.9, scale: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 1, properties: { translateX: travel, opacity: 0, scale: 0.6 } as Keyframe["properties"] },
      ],
      base + 120,
      req.sceneDurationMs - 420,
    ),
  ];
}

function progress(req: GraphicRequest): GraphicLayer[] {
  const { box, palette, amp } = req;
  const z = req.zIndex ?? 8;
  const base = req.delayMs ?? 0;
  const amount = Math.max(0, Math.min(1, req.amount ?? 0.72));
  const pad = Math.max(3, box.h * 0.16);
  const innerH = Math.max(4, box.h - pad * 2);
  const innerW = Math.max(8, box.w - pad * 2);
  const target = Math.round(innerW * amount);
  const out: GraphicLayer[] = [
    shape(
      "Progress Track",
      box,
      {
        background: withAlpha(palette.text, 0.1),
        border: `1px solid ${withAlpha(palette.text, 0.07)}`,
        borderRadius: "999px",
        overflow: "hidden",
        zIndex: String(z),
      },
      beat({ scaleX: 1 - 0.06 * amp }, { scaleX: 1 }, {}, {}),
      base,
      req.sceneDurationMs - 320,
    ),
    shape(
      "Progress Fill",
      { x: box.x + pad, y: box.y + pad, w: target, h: innerH },
      {
        background: `linear-gradient(90deg, ${palette.accent}, ${palette.accent2})`,
        borderRadius: "999px",
        boxShadow: `0 0 22px ${withAlpha(palette.accent, 0.65)}`,
        transformOrigin: "left center",
        zIndex: String(z + 1),
      },
      [
        { offset: 0, properties: { width: 0, opacity: 0 } as Keyframe["properties"], easing: EASE_OUT },
        { offset: 0.12, properties: { opacity: 1 } as Keyframe["properties"], easing: EASE_OUT },
        { offset: 0.6, properties: { width: target, opacity: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.88, properties: { width: target, opacity: 1 } as Keyframe["properties"], easing: EASE_IN },
        { offset: 1, properties: { width: target, opacity: 0 } as Keyframe["properties"] },
      ],
      base + 180,
      req.sceneDurationMs - 420,
    ),
  ];
  if (req.value) {
    out.push(
      label(
        "Progress Value",
        { x: box.x, y: box.y - Math.max(34, box.h * 2.2), w: box.w, h: Math.max(30, box.h * 1.9) },
        req.value,
        {
          color: palette.text,
          fontFamily: MONO_STACK,
          fontSize: `${Math.max(18, box.h * 1.15)}px`,
          fontWeight: "700",
          letterSpacing: "0.02em",
          justifyContent: "flex-end",
          zIndex: String(z + 2),
        },
        beat({ translateY: 14 * amp }, { translateY: 0 }, {}, { translateY: -4 * amp }),
        base + 260,
        req.sceneDurationMs - 520,
      ),
    );
  }
  return out;
}

function bars(req: GraphicRequest): GraphicLayer[] {
  const { box, palette, amp } = req;
  const z = req.zIndex ?? 7;
  const base = req.delayMs ?? 0;
  const count = Math.max(3, Math.min(9, req.count ?? 6));
  const gap = Math.max(12, box.w * 0.035);
  const barW = (box.w - gap * (count - 1)) / count;
  const out: GraphicLayer[] = [];

  for (let i = 0; i < count; i++) {
    const share = 0.34 + noise(i) * 0.66;
    const h = Math.max(12, box.h * share);
    out.push(
      shape(
        `Bar ${i + 1}`,
        { x: box.x + i * (barW + gap), y: box.y + box.h - h, w: barW, h },
        {
          background: `linear-gradient(180deg, ${palette.accent} 0%, ${withAlpha(palette.accent2, 0.85)} 100%)`,
          borderRadius: `${Math.min(10, barW * 0.3)}px ${Math.min(10, barW * 0.3)}px 3px 3px`,
          boxShadow: `0 8px 26px ${withAlpha(palette.accent, 0.24)}`,
          transformOrigin: "center bottom",
          zIndex: String(z),
        },
        beat(
          { scaleY: 0.02, opacity: 0, translateY: 18 * amp },
          { scaleY: 1, opacity: 1, translateY: 0 },
          {},
          { scaleY: 1 + 0.03 * amp },
        ),
        base + i * 90,
        req.sceneDurationMs - 380 - i * 60,
      ),
    );
  }
  return out;
}

function dots(req: GraphicRequest): GraphicLayer[] {
  const { box, palette, amp } = req;
  const z = req.zIndex ?? 7;
  const base = req.delayMs ?? 0;
  const size = Math.max(10, Math.min(22, Math.min(box.w, box.h) * 0.1));
  const gap = size * 1.7;
  const perRow = Math.max(2, Math.min(10, Math.floor((box.w + gap) / (size + gap))));
  const rows = Math.max(1, Math.min(6, Math.floor((box.h + gap) / (size + gap))));
  const gridW = perRow * size + (perRow - 1) * gap;
  const gridH = rows * size + (rows - 1) * gap;
  const originX = box.x + (box.w - gridW) / 2;
  const originY = box.y + (box.h - gridH) / 2;
  const out: GraphicLayer[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < perRow; c++) {
      const i = r * perRow + c;
      const strength = 0.35 + noise(i) * 0.65;
      out.push(
        shape(
          `Dot ${r + 1}-${c + 1}`,
          { x: originX + c * (size + gap), y: originY + r * (size + gap), w: size, h: size },
          {
            background: palette.accent,
            borderRadius: "50%",
            opacity: strength,
            boxShadow: `0 0 ${Math.round(size * 0.8)}px ${withAlpha(palette.accent, 0.45)}`,
            transformOrigin: "center center",
            zIndex: String(z),
          },
          [
            { offset: 0, properties: { scale: 0.2, opacity: 0 } as Keyframe["properties"], easing: EASE_BACK },
            { offset: 0.24, properties: { scale: 1, opacity: strength } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 0.55, properties: { scale: 1 + 0.16 * amp, opacity: Math.min(1, strength + 0.25) } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 0.82, properties: { scale: 1, opacity: strength } as Keyframe["properties"], easing: EASE_IN_OUT },
            { offset: 1, properties: { scale: 1, opacity: 0 } as Keyframe["properties"] },
          ],
          base + i * 46,
          req.sceneDurationMs - 300,
        ),
      );
    }
  }
  return out;
}

function chevrons(req: GraphicRequest): GraphicLayer[] {
  const { box, palette, amp } = req;
  const z = req.zIndex ?? 8;
  const base = req.delayMs ?? 0;
  const count = Math.max(2, Math.min(5, req.count ?? 3));
  const size = Math.min(box.h * 0.72, box.w / (count * 1.5));
  const gap = size * 0.5;
  const totalW = count * size + (count - 1) * gap;
  const originX = box.x + (box.w - totalW) / 2;
  const thickness = Math.max(3, size * 0.16);
  const out: GraphicLayer[] = [];

  for (let i = 0; i < count; i++) {
    out.push(
      shape(
        `Chevron ${i + 1}`,
        { x: originX + i * (size + gap), y: box.y + (box.h - size) / 2, w: size, h: size },
        {
          borderTop: `${thickness}px solid ${palette.accent}`,
          borderRight: `${thickness}px solid ${palette.accent}`,
          borderRadius: `0 ${thickness * 2}px 0 0`,
          filter: `drop-shadow(0 0 10px ${withAlpha(palette.accent, 0.6)})`,
          transformOrigin: "center center",
          zIndex: String(z),
        },
        [
          { offset: 0, properties: { rotate: 45, opacity: 0, translateX: -12 * amp } as Keyframe["properties"], easing: EASE_OUT },
          { offset: 0.2, properties: { rotate: 45, opacity: 1, translateX: 0 } as Keyframe["properties"], easing: EASE_IN_OUT },
          { offset: 0.5, properties: { rotate: 45, opacity: 0.5, translateX: 6 * amp } as Keyframe["properties"], easing: EASE_IN_OUT },
          { offset: 0.8, properties: { rotate: 45, opacity: 1, translateX: 0 } as Keyframe["properties"], easing: EASE_IN_OUT },
          { offset: 1, properties: { rotate: 45, opacity: 0, translateX: -12 * amp } as Keyframe["properties"] },
        ],
        base + i * 170,
        req.sceneDurationMs - 320,
      ),
    );
  }
  return out;
}

function divider(req: GraphicRequest): GraphicLayer[] {
  const { box, palette, amp } = req;
  const z = req.zIndex ?? 9;
  const base = req.delayMs ?? 0;
  const node = Math.max(10, Math.min(26, box.h * 0.9));
  const lineH = Math.max(1, Math.min(3, box.h * 0.12));
  const midY = box.y + box.h / 2;

  return [
    shape(
      "Divider Line",
      { x: box.x, y: midY - lineH / 2, w: box.w, h: lineH },
      {
        background: `linear-gradient(90deg, transparent, ${withAlpha(palette.accent, 0.65)} 50%, transparent)`,
        transformOrigin: "center center",
        zIndex: String(z),
      },
      [
        { offset: 0, properties: { scaleX: 0, opacity: 0 } as Keyframe["properties"], easing: EASE_OUT },
        { offset: 0.3, properties: { scaleX: 1, opacity: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.85, properties: { scaleX: 1, opacity: 1 } as Keyframe["properties"], easing: EASE_IN },
        { offset: 1, properties: { scaleX: 1, opacity: 0 } as Keyframe["properties"] },
      ],
      base,
      req.sceneDurationMs - 300,
    ),
    shape(
      "Divider Node",
      { x: box.x + box.w / 2 - node / 2, y: midY - node / 2, w: node, h: node },
      {
        background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
        borderRadius: "5px",
        boxShadow: `0 0 ${Math.round(node)}px ${withAlpha(palette.accent, 0.7)}`,
        transformOrigin: "center center",
        zIndex: String(z + 1),
      },
      [
        { offset: 0, properties: { rotate: 45, scale: 0, opacity: 0 } as Keyframe["properties"], easing: EASE_BACK },
        { offset: 0.26, properties: { rotate: 45, scale: 1, opacity: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.82, properties: { rotate: 135, scale: 1 + 0.06 * amp, opacity: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 1, properties: { rotate: 180, scale: 1, opacity: 0 } as Keyframe["properties"] },
      ],
      base + 200,
      req.sceneDurationMs - 460,
    ),
  ];
}

function iconTile(req: GraphicRequest): GraphicLayer[] {
  const { box, palette, amp } = req;
  const z = req.zIndex ?? 8;
  const base = req.delayMs ?? 0;
  const size = Math.min(box.w, box.h);
  const tile: Box = { x: box.x + (box.w - size) / 2, y: box.y, w: size, h: size };
  const glyph = size * 0.44;
  const out: GraphicLayer[] = [
    shape(
      "Icon Tile",
      tile,
      {
        background: `linear-gradient(150deg, ${withAlpha(palette.accent, 0.22)} 0%, ${withAlpha(palette.accent2, 0.08)} 100%)`,
        border: `1px solid ${withAlpha(palette.accent, 0.3)}`,
        borderRadius: `${Math.round(size * 0.26)}px`,
        boxShadow: `0 22px 60px ${withAlpha(palette.accent, 0.2)}, inset 0 1px 0 ${withAlpha(palette.text, 0.12)}`,
        transformOrigin: "center center",
        zIndex: String(z),
      },
      beat({ translateY: 26 * amp, scale: 1 - 0.08 * amp }, { translateY: 0, scale: 1 }, {}, { translateY: -8 * amp }),
      base,
      req.sceneDurationMs - 340,
    ),
    shape(
      "Icon Glyph",
      {
        x: tile.x + (size - glyph) / 2,
        y: tile.y + (size - glyph) / 2,
        w: glyph,
        h: glyph,
      },
      {
        background: `linear-gradient(150deg, ${palette.accent}, ${palette.accent2})`,
        clipPath: "polygon(58% 0%, 20% 56%, 46% 56%, 40% 100%, 80% 42%, 52% 42%)",
        filter: `drop-shadow(0 0 14px ${withAlpha(palette.accent, 0.85)})`,
        transformOrigin: "center center",
        zIndex: String(z + 1),
      },
      [
        { offset: 0, properties: { scale: 0.4, opacity: 0, rotate: -18 } as Keyframe["properties"], easing: EASE_BACK },
        { offset: 0.24, properties: { scale: 1, opacity: 1, rotate: 0 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.6, properties: { scale: 1 + 0.05 * amp, opacity: 1, rotate: 0 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.86, properties: { scale: 1, opacity: 1, rotate: 0 } as Keyframe["properties"], easing: EASE_IN },
        { offset: 1, properties: { scale: 0.9, opacity: 0, rotate: 8 } as Keyframe["properties"] },
      ],
      base + 180,
      req.sceneDurationMs - 460,
    ),
  ];
  if (req.label) {
    out.push(
      label(
        "Icon Label",
        { x: box.x, y: tile.y + size + 18, w: box.w, h: Math.max(28, size * 0.34) },
        req.label,
        {
          color: palette.subtext,
          fontFamily: MONO_STACK,
          fontSize: `${Math.max(15, size * 0.17)}px`,
          fontWeight: "600",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          zIndex: String(z + 2),
        },
        beat({ translateY: 12 * amp }, { translateY: 0 }, {}, { translateY: -4 * amp }),
        base + 280,
        req.sceneDurationMs - 520,
      ),
    );
  }
  return out;
}

function area(req: GraphicRequest): GraphicLayer[] {
  const { box, palette, amp } = req;
  const z = req.zIndex ?? 7;
  const base = req.delayMs ?? 0;
  const amount = Math.max(0.1, Math.min(1, req.amount ?? 0.78));
  const points = 8;
  const flat: string[] = ["0% 100%"];
  const rise: string[] = ["0% 100%"];
  for (let i = 0; i <= points; i++) {
    const x = `${((i / points) * 100).toFixed(2)}%`;
    flat.push(`${x} 100%`);
    const y = 100 - (0.18 + noise(i) * 0.5 + (i / points) * 0.3) * amount * 100;
    rise.push(`${x} ${Math.max(4, y).toFixed(2)}%`);
  }
  flat.push("100% 100%");
  rise.push("100% 100%");

  return [
    shape(
      "Area Chart",
      box,
      {
        background: `linear-gradient(180deg, ${withAlpha(palette.accent, 0.85)} 0%, ${withAlpha(palette.accent2, 0.12)} 100%)`,
        clipPath: `polygon(${rise.join(", ")})`,
        transformOrigin: "center bottom",
        zIndex: String(z),
      },
      [
        { offset: 0, properties: { clipPath: `polygon(${flat.join(", ")})`, opacity: 0 } as Keyframe["properties"], easing: EASE_OUT },
        { offset: 0.16, properties: { opacity: 1 } as Keyframe["properties"], easing: EASE_OUT },
        { offset: 0.68, properties: { clipPath: `polygon(${rise.join(", ")})`, opacity: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.9, properties: { clipPath: `polygon(${rise.join(", ")})`, opacity: 1 } as Keyframe["properties"], easing: EASE_IN },
        { offset: 1, properties: { clipPath: `polygon(${rise.join(", ")})`, opacity: 0 } as Keyframe["properties"] },
      ],
      base,
      req.sceneDurationMs - 320,
    ),
    shape(
      "Area Baseline",
      { x: box.x, y: box.y + box.h - 2, w: box.w, h: 2 },
      {
        background: `linear-gradient(90deg, ${withAlpha(palette.text, 0.05)}, ${withAlpha(palette.text, 0.3)}, ${withAlpha(palette.text, 0.05)})`,
        transformOrigin: "left center",
        zIndex: String(z + 1),
      },
      [
        { offset: 0, properties: { scaleX: 0, opacity: 0 } as Keyframe["properties"], easing: EASE_OUT },
        { offset: 0.3, properties: { scaleX: 1, opacity: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.88, properties: { scaleX: 1, opacity: 1 } as Keyframe["properties"], easing: EASE_IN },
        { offset: 1, properties: { scaleX: 1, opacity: 0 } as Keyframe["properties"] },
      ],
      base + 140,
      req.sceneDurationMs - 440,
    ),
  ];
}

/** Build every layer of one graphic, stamped with the group they belong to. */
export function buildGraphic(req: GraphicRequest): GraphicLayer[] {
  const group = req.group ?? `${req.kind}:${Math.round(req.box.x)},${Math.round(req.box.y)}`;
  const layers = buildLayers(req);
  return layers.map((layer) => ({ ...layer, group }));
}

function buildLayers(req: GraphicRequest): GraphicLayer[] {
  switch (req.kind) {
    case "card":
      return card(req);
    case "chip":
      return chip(req);
    case "ring":
      return ring(req);
    case "bracket":
      return bracket(req);
    case "connector":
      return connector(req);
    case "progress":
      return progress(req);
    case "bars":
      return bars(req);
    case "dots":
      return dots(req);
    case "chevrons":
      return chevrons(req);
    case "divider":
      return divider(req);
    case "iconTile":
      return iconTile(req);
    case "area":
      return area(req);
  }
}
