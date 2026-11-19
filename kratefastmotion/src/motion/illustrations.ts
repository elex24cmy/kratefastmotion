/**
 * Illustration kit — composed vector artwork an agent can just ask for.
 *
 * A graphic kit draws one ornament at a time. An illustration is a *scene*: a
 * rocket is a body, a nose, a window, two fins, a flame and three stars, and
 * each of those is a curve in a shared coordinate space. This module owns that
 * vocabulary — a catalogue of named illustrations and a library of icons, all
 * built from the vector engine in `vectorPaths.ts` — plus the one function that
 * turns a set of parts into animatable layers the renderer already understands.
 *
 * Everything here is pure: a recipe is handed a width, a height and a colour
 * set and returns geometry. The caller (a tool, or the film director) decides
 * where the whole illustration goes, using the layout engine, so a scene can
 * never land on top of the text.
 *
 * The idea of a named-illustration catalogue with an icon set comes from
 * VectorCraft's MCP prompt library; the artwork below is original.
 */
import type { Easing, Keyframe } from "@kratefastmotion/shared";
import type { GraphicLayer, GraphicPalette } from "./filmGraphics.js";
import { type Box, boxToStyle } from "./layout.js";
import { beat, beatHold, EASE_BACK, EASE_IN, EASE_IN_OUT, EASE_OUT } from "./filmBase.js";
import * as V from "./vectorPaths.js";

/* ------------------------------------------------------------------ types --- */

export interface IllustrationColors {
  /** Main colour — the thing the illustration is "about". */
  primary: string;
  /** Supporting colour, used for a second element. */
  secondary: string;
  /** High-contrast ink for line work and details. */
  ink: string;
  /** Low-contrast tone for backdrops and secondary shapes. */
  muted: string;
}

export interface IllustrationPart {
  name: string;
  /** Geometry in the illustration's local `w`×`h` space. */
  path: V.VectorPath;
  /** Solid fill, or the start of a vertical gradient when `fillTo` is set. */
  fill?: string;
  fillTo?: string;
  opacity?: number;
  /** Stagger slot — parts animate in this order. */
  order?: number;
  /** Where the part enters from. */
  from?: "left" | "right" | "up" | "down" | "scale" | "fade";
}

export interface IllustrationContext {
  w: number;
  h: number;
  colors: IllustrationColors;
}

export interface IllustrationRecipe {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  build(ctx: IllustrationContext): IllustrationPart[];
}

/* ---------------------------------------------------------------- helpers --- */

function at(path: V.VectorPath, x: number, y: number): V.VectorPath {
  return V.transformPath(path, { translateX: x, translateY: y });
}

function scaled(path: V.VectorPath, w: number, h: number): V.VectorPath {
  return V.fitPath(path, w, h, { padding: 0 });
}

function dot(cx: number, cy: number, r: number): V.VectorPath {
  return at(V.ellipsePath(r * 2, r * 2), cx - r, cy - r);
}

function bar(x: number, y: number, w: number, h: number, radius = 0): V.VectorPath {
  return at(radius > 0 ? V.roundedRectPath(w, h, radius) : V.rectPath(w, h), x, y);
}

function line(x1: number, y1: number, x2: number, y2: number, width: number): V.VectorPath {
  return V.strokePath(V.linePath(x1, y1, x2, y2), width);
}

/**
 * A smooth ridge: a Catmull-Rom crest closed down to a baseline. The crest's
 * outer handles are dropped so the closing edges are straight — otherwise the
 * curve swings past the edge of the box before it meets the baseline.
 */
function ridge(points: Array<{ x: number; y: number }>, baseline: number, w: number): V.VectorPath {
  const crest = V.catmullRom(points, false);
  crest[0] = { ...crest[0], in: undefined };
  crest[crest.length - 1] = { ...crest[crest.length - 1], out: undefined };
  return { subpaths: [{ anchors: [...crest, { x: w, y: baseline }, { x: 0, y: baseline }], closed: true }] };
}

function poly(points: Array<[number, number]>): V.VectorPath {
  return V.pathFromPoints(
    points.map(([x, y]) => ({ x, y })),
    true,
  );
}

/** A chevron/tick drawn as a stroke. */
function tick(points: Array<[number, number]>, width: number, closed = false): V.VectorPath {
  return V.strokePath(
    V.pathFromPoints(
      points.map(([x, y]) => ({ x, y })),
      closed,
    ),
    width,
  );
}

function dPath(d: string, w: number, h: number): V.VectorPath {
  return scaled(V.parseSvgPath(d), w, h);
}

/** A right-pointing arrowhead at (x,y) with the given size. */
function arrowHead(x: number, y: number, size: number, angleDeg = 0): V.VectorPath {
  const head = V.pathFromPoints(
    [
      { x: -size * 0.5, y: -size * 0.5 },
      { x: size * 0.5, y: 0 },
      { x: -size * 0.5, y: size * 0.5 },
    ],
    true,
  );
  return at(V.transformPath(head, { rotate: angleDeg }), x, y);
}

/* ------------------------------------------------------------ illustration --- */

const HILLS_FAR = (w: number, h: number): Array<{ x: number; y: number }> => [
  { x: 0, y: h * 0.72 },
  { x: w * 0.16, y: h * 0.5 },
  { x: w * 0.34, y: h * 0.62 },
  { x: w * 0.55, y: h * 0.4 },
  { x: w * 0.78, y: h * 0.58 },
  { x: w, y: h * 0.46 },
];

export const ILLUSTRATIONS: IllustrationRecipe[] = [
  {
    id: "mountains",
    name: "Mountain range",
    description: "Layered hills with a sun and two birds — reads as landscape, journey, horizon.",
    keywords: ["mountain", "hill", "landscape", "sun", "nature", "journey", "horizon", "outdoors", "travel"],
    build: ({ w, h, colors: c }) => {
      const sun = Math.min(w, h) * 0.22;
      return [
        { name: "Sun", path: dot(w * 0.74, h * 0.24, sun / 2), fill: c.primary, order: 0, from: "scale" },
        {
          name: "Far hills",
          path: ridge(HILLS_FAR(w, h), h, w),
          fill: c.secondary,
          opacity: 0.55,
          order: 1,
          from: "up",
        },
        {
          name: "Near hills",
          path: ridge(
            [
              { x: 0, y: h * 0.86 },
              { x: w * 0.22, y: h * 0.66 },
              { x: w * 0.46, y: h * 0.82 },
              { x: w * 0.7, y: h * 0.62 },
              { x: w, y: h * 0.8 },
            ],
            h,
            w,
          ),
          fill: c.primary,
          order: 2,
          from: "up",
        },
        { name: "Ground", path: bar(0, h * 0.92, w, h * 0.08), fill: c.ink, opacity: 0.85, order: 3, from: "up" },
        {
          name: "Bird",
          path: tick(
            [
              [w * 0.2, h * 0.3],
              [w * 0.245, h * 0.255],
              [w * 0.29, h * 0.3],
            ],
            Math.min(w, h) * 0.018,
          ),
          fill: c.ink,
          order: 4,
          from: "left",
        },
        {
          name: "Bird 2",
          path: tick(
            [
              [w * 0.32, h * 0.2],
              [w * 0.355, h * 0.165],
              [w * 0.39, h * 0.2],
            ],
            Math.min(w, h) * 0.015,
          ),
          fill: c.ink,
          opacity: 0.8,
          order: 5,
          from: "left",
        },
      ];
    },
  },
  {
    id: "rocket",
    name: "Rocket launch",
    description: "A rocket with fins and exhaust flame, plus stars — reads as launch, speed, shipping.",
    keywords: ["rocket", "launch", "ship", "startup", "fast", "speed", "space", "boost", "release"],
    build: ({ w, h, colors: c }) => {
      const m = Math.min(w, h);
      const bodyW = w * 0.34;
      const bodyX = (w - bodyW) / 2;
      const bodyH = h * 0.62;
      const bodyY = h * 0.06;
      return [
        {
          name: "Flame",
          path: at(scaled(V.parseSvgPath("M50 100 C30 70 12 48 12 32 A38 38 0 0 1 88 32 C88 48 70 70 50 100 Z"), bodyW * 0.8, bodyH * 0.5), bodyX + bodyW * 0.1, bodyY + bodyH * 0.92),
          fill: c.secondary,
          order: 0,
          from: "down",
        },
        {
          name: "Fin left",
          path: poly([
            [bodyX, bodyY + bodyH * 0.62],
            [bodyX - bodyW * 0.42, bodyY + bodyH * 0.98],
            [bodyX, bodyY + bodyH * 0.98],
          ]),
          fill: c.secondary,
          order: 1,
          from: "left",
        },
        {
          name: "Fin right",
          path: poly([
            [bodyX + bodyW, bodyY + bodyH * 0.62],
            [bodyX + bodyW + bodyW * 0.42, bodyY + bodyH * 0.98],
            [bodyX + bodyW, bodyY + bodyH * 0.98],
          ]),
          fill: c.secondary,
          order: 1,
          from: "right",
        },
        {
          name: "Body",
          path: at(
            scaled(
              V.parseSvgPath("M50 0 C68 18 78 44 78 64 L78 100 L22 100 L22 64 C22 44 32 18 50 0 Z"),
              bodyW,
              bodyH,
            ),
            bodyX,
            bodyY,
          ),
          fill: c.primary,
          fillTo: c.secondary,
          order: 2,
          from: "up",
        },
        {
          name: "Window",
          path: at(V.ringPath(bodyW * 0.34, bodyW * 0.34, Math.max(2, bodyW * 0.07)), bodyX + bodyW * 0.33, bodyY + bodyH * 0.24),
          fill: c.ink,
          order: 3,
          from: "scale",
        },
        { name: "Star", path: at(V.sparklePath(m * 0.12, m * 0.12), w * 0.08, h * 0.12), fill: c.ink, opacity: 0.85, order: 4, from: "scale" },
        { name: "Star 2", path: at(V.sparklePath(m * 0.08, m * 0.08), w * 0.86, h * 0.2), fill: c.ink, opacity: 0.7, order: 5, from: "scale" },
        { name: "Star 3", path: at(V.sparklePath(m * 0.06, m * 0.06), w * 0.14, h * 0.86), fill: c.ink, opacity: 0.6, order: 6, from: "scale" },
      ];
    },
  },
  {
    id: "orbit",
    name: "Planet and orbit",
    description: "A ringed planet with two moons — reads as system, platform, ecosystem, space.",
    keywords: ["orbit", "planet", "space", "system", "ring", "moon", "universe", "platform", "ecosystem"],
    build: ({ w, h, colors: c }) => {
      const m = Math.min(w, h);
      const cx = w / 2;
      const cy = h / 2;
      const r = m * 0.26;
      const ring = V.ellipsePath(r * 3.1, r * 1.05);
      return [
        {
          name: "Ring",
          path: at(V.transformPath(V.strokePath(ring, Math.max(3, m * 0.022)), { rotate: -18 }), cx - r * 1.55, cy - r * 0.52),
          fill: c.muted,
          opacity: 0.9,
          order: 0,
          from: "scale",
        },
        { name: "Planet", path: dot(cx, cy, r), fill: c.primary, fillTo: c.secondary, order: 1, from: "scale" },
        {
          name: "Highlight",
          path: dot(cx - r * 0.3, cy - r * 0.32, r * 0.32),
          fill: c.ink,
          opacity: 0.28,
          order: 2,
          from: "fade",
        },
        { name: "Moon", path: dot(cx + r * 1.28, cy - r * 0.34, r * 0.16), fill: c.ink, order: 3, from: "right" },
        { name: "Moon 2", path: dot(cx - r * 1.32, cy + r * 0.4, r * 0.11), fill: c.muted, order: 4, from: "left" },
      ];
    },
  },
  {
    id: "growth",
    name: "Growth chart",
    description: "Rising bars with a trend line and arrow — reads as growth, results, revenue, progress.",
    keywords: ["growth", "chart", "bar", "graph", "increase", "revenue", "results", "progress", "analytics", "up"],
    build: ({ w, h, colors: c }) => {
      const base = h * 0.88;
      const bw = w * 0.14;
      const gap = w * 0.06;
      const heights = [0.2, 0.34, 0.48, 0.64];
      const bars: IllustrationPart[] = heights.map((f, i) => ({
        name: `Bar ${i + 1}`,
        path: bar(w * 0.1 + i * (bw + gap), base - h * f, bw, h * f, Math.min(bw * 0.16, 8)),
        fill: i === heights.length - 1 ? c.primary : c.secondary,
        opacity: i === heights.length - 1 ? 1 : 0.5 + i * 0.1,
        order: i,
        from: "up",
      }));
      const trend: Array<[number, number]> = heights.map((f, i) => [w * 0.1 + i * (bw + gap) + bw / 2, base - h * f - h * 0.03]);
      return [
        ...bars,
        {
          name: "Trend",
          path: tick(trend, Math.max(3, Math.min(w, h) * 0.016)),
          fill: c.ink,
          order: 4,
          from: "left",
        },
        {
          name: "Arrow",
          path: arrowHead(trend[3][0] + w * 0.05, trend[3][1] - h * 0.04, Math.min(w, h) * 0.09, 55),
          fill: c.ink,
          order: 5,
          from: "scale",
        },
        { name: "Baseline", path: bar(w * 0.08, base, w * 0.84, Math.max(2, h * 0.008)), fill: c.muted, order: 6, from: "fade" },
      ];
    },
  },
  {
    id: "network",
    name: "Node network",
    description: "Connected nodes — reads as network, integration, teamwork, distributed system.",
    keywords: ["network", "nodes", "graph", "connect", "integration", "team", "system", "mesh", "links", "api"],
    build: ({ w, h, colors: c }) => {
      const nodes: Array<[number, number, number]> = [
        [0.5, 0.16, 0.085],
        [0.2, 0.42, 0.075],
        [0.8, 0.42, 0.075],
        [0.35, 0.78, 0.065],
        [0.68, 0.8, 0.065],
        [0.5, 0.5, 0.05],
      ];
      const edges: Array<[number, number]> = [
        [0, 1],
        [0, 2],
        [1, 5],
        [2, 5],
        [1, 3],
        [2, 4],
        [5, 3],
        [5, 4],
        [3, 4],
      ];
      const m = Math.min(w, h);
      const linkWidth = Math.max(2, m * 0.014);
      const edgePaths = edges.map(([a, b]) =>
        V.linePath(nodes[a][0] * w, nodes[a][1] * h, nodes[b][0] * w, nodes[b][1] * h),
      );
      const links = V.strokePath(V.unionPaths(...edgePaths), linkWidth);
      return [
        { name: "Links", path: links, fill: c.muted, opacity: 0.75, order: 0, from: "fade" },
        ...nodes.map(([nx, ny, r], i) => ({
          name: `Node ${i + 1}`,
          path: dot(nx * w, ny * h, r * m),
          fill: i === 0 || i === 5 ? c.primary : c.secondary,
          order: 1 + i,
          from: "scale" as const,
        })),
      ];
    },
  },
  {
    id: "cloud-sync",
    name: "Cloud sync",
    description: "A cloud with a circular refresh — reads as cloud, sync, backup, storage, always-on.",
    keywords: ["cloud", "sync", "backup", "storage", "refresh", "update", "server", "saas", "upload"],
    build: ({ w, h, colors: c }) => {
      const m = Math.min(w, h);
      const cy = h * 0.42;
      const cw = w * 0.72;
      const cx = (w - cw) / 2;
      const cloud = V.unionPaths(
        dot(cx + cw * 0.28, cy, m * 0.16),
        dot(cx + cw * 0.52, cy - m * 0.06, m * 0.2),
        dot(cx + cw * 0.74, cy, m * 0.15),
        bar(cx + cw * 0.2, cy, cw * 0.62, m * 0.16, m * 0.08),
      );
      const ringR = m * 0.18;
      const ringCx = w / 2;
      const ringCy = h * 0.78;
      const gap = 62;
      return [
        {
          name: "Cloud",
          path: cloud,
          fill: c.primary,
          fillTo: c.secondary,
          order: 0,
          from: "up",
        },
        {
          name: "Sync ring",
          path: at(
            V.strokePath(V.arcPath(ringR * 2, ringR * 2, gap / 2, 360 - gap / 2), Math.max(3, m * 0.026)),
            ringCx - ringR,
            ringCy - ringR,
          ),
          fill: c.ink,
          opacity: 0.85,
          order: 1,
          from: "scale",
        },
        {
          name: "Sync arrow",
          path: arrowHead(ringCx + ringR * 0.86, ringCy - ringR * 0.5, m * 0.12, 30),
          fill: c.ink,
          order: 2,
          from: "scale",
        },
        {
          name: "Sync arrow 2",
          path: arrowHead(ringCx - ringR * 0.86, ringCy + ringR * 0.5, m * 0.12, 210),
          fill: c.ink,
          order: 3,
          from: "scale",
        },
      ];
    },
  },
  {
    id: "shield-check",
    name: "Secure shield",
    description: "A shield with a tick — reads as security, privacy, safe, compliant, protected.",
    keywords: ["shield", "secure", "security", "safe", "privacy", "protect", "compliance", "trust", "check"],
    build: ({ w, h, colors: c }) => {
      const m = Math.min(w, h);
      const sw = w * 0.66;
      const sh = h * 0.82;
      const sx = (w - sw) / 2;
      const sy = (h - sh) / 2;
      return [
        {
          name: "Shield",
          path: at(
            dPath("M50 2 L94 18 V50 C94 74 74 92 50 98 C26 92 6 74 6 50 V18 Z", sw, sh),
            sx,
            sy,
          ),
          fill: c.primary,
          fillTo: c.secondary,
          order: 0,
          from: "up",
        },
        {
          name: "Tick",
          path: at(
            tick(
              [
                [sw * 0.28, sh * 0.5],
                [sw * 0.44, sh * 0.66],
                [sw * 0.74, sh * 0.34],
              ],
              Math.max(3, m * 0.06),
            ),
            sx,
            sy,
          ),
          fill: c.ink,
          order: 1,
          from: "scale",
        },
      ];
    },
  },
  {
    id: "idea",
    name: "Idea bulb",
    description: "A glowing bulb with rays — reads as idea, insight, inspiration, tip, invention.",
    keywords: ["idea", "bulb", "light", "insight", "inspiration", "tip", "brainstorm", "invention", "creative"],
    build: ({ w, h, colors: c }) => {
      const m = Math.min(w, h);
      const cx = w / 2;
      const cy = h * 0.46;
      const r = m * 0.24;
      const rays: V.VectorPath[] = [];
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 - Math.PI / 2;
        const r0 = r * 1.3;
        const r1 = r * 1.6;
        rays.push(
          V.linePath(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1),
        );
      }
      return [
        {
          name: "Rays",
          path: V.strokePath(V.unionPaths(...rays), Math.max(2.5, m * 0.022)),
          fill: c.secondary,
          opacity: 0.85,
          order: 0,
          from: "scale",
        },
        { name: "Bulb", path: dot(cx, cy, r), fill: c.primary, fillTo: c.secondary, order: 1, from: "scale" },
        { name: "Base", path: bar(cx - r * 0.42, cy + r * 0.86, r * 0.84, r * 0.34, r * 0.1), fill: c.ink, order: 2, from: "up" },
        { name: "Filament", path: at(tick([[cx - r * 0.24, cy - r * 0.05], [cx, cy + r * 0.24], [cx + r * 0.24, cy - r * 0.05]], Math.max(2, m * 0.02)), 0, 0), fill: c.ink, opacity: 0.6, order: 3, from: "fade" },
      ];
    },
  },
  {
    id: "target",
    name: "Bullseye",
    description: "Concentric rings hit by an arrow — reads as goal, target, focus, accuracy, aim.",
    keywords: ["target", "goal", "aim", "focus", "bullseye", "accuracy", "precision", "objective", "hit"],
    build: ({ w, h, colors: c }) => {
      const m = Math.min(w, h);
      const r = m * 0.32;
      const cx = w * 0.46;
      const cy = h * 0.58;
      return [
        { name: "Ring 1", path: at(V.ringPath(r * 2, r * 2, Math.max(3, r * 0.16)), cx - r, cy - r), fill: c.muted, order: 0, from: "scale" },
        { name: "Ring 2", path: at(V.ringPath(r * 1.4, r * 1.4, Math.max(3, r * 0.16)), cx - r * 0.7, cy - r * 0.7), fill: c.secondary, order: 1, from: "scale" },
        { name: "Centre", path: dot(cx, cy, r * 0.28), fill: c.primary, order: 2, from: "scale" },
        {
          name: "Arrow",
          path: at(
            tick(
              [
                [cx + r * 1.35, cy - r * 1.35],
                [cx + r * 0.1, cy - r * 0.1],
              ],
              Math.max(3, m * 0.026),
            ),
            0,
            0,
          ),
          fill: c.ink,
          order: 3,
          from: "right",
        },
        { name: "Arrow head", path: arrowHead(cx, cy, m * 0.14, 135), fill: c.ink, order: 4, from: "scale" },
      ];
    },
  },
  {
    id: "pulse",
    name: "Pulse line",
    description: "A heartbeat trace — reads as health, activity, live, signal, monitoring.",
    keywords: ["pulse", "heartbeat", "health", "activity", "live", "signal", "monitor", "ecg", "vitality"],
    build: ({ w, h, colors: c }) => {
      const m = Math.min(w, h);
      const mid = h * 0.5;
      const pts: Array<[number, number]> = [
        [w * 0.02, mid],
        [w * 0.22, mid],
        [w * 0.3, mid - h * 0.06],
        [w * 0.38, mid + h * 0.22],
        [w * 0.46, mid - h * 0.34],
        [w * 0.54, mid + h * 0.1],
        [w * 0.62, mid - h * 0.04],
        [w * 0.72, mid],
        [w * 0.98, mid],
      ];
      return [
        { name: "Baseline", path: bar(w * 0.02, mid - h * 0.005, w * 0.96, Math.max(2, h * 0.01)), fill: c.muted, opacity: 0.4, order: 0, from: "fade" },
        { name: "Trace", path: tick(pts, Math.max(3, m * 0.028)), fill: c.primary, order: 1, from: "left" },
        { name: "Marker", path: dot(w * 0.46, mid - h * 0.34, m * 0.055), fill: c.secondary, order: 2, from: "scale" },
      ];
    },
  },
  {
    id: "blobs",
    name: "Organic blobs",
    description: "Three soft shapes — reads as abstract, creative, playful, decorative background.",
    keywords: ["blob", "abstract", "organic", "shape", "decor", "playful", "soft", "background", "creative"],
    build: ({ w, h, colors: c }) => {
      const m = Math.min(w, h);
      return [
        { name: "Blob 1", path: at(V.blobPath(m * 0.68, m * 0.68, 3, 0.3), w * 0.02, h * 0.08), fill: c.primary, opacity: 0.95, order: 0, from: "scale" },
        { name: "Blob 2", path: at(V.blobPath(m * 0.52, m * 0.52, 9, 0.34), w * 0.42, h * 0.34), fill: c.secondary, opacity: 0.85, order: 1, from: "scale" },
        { name: "Blob 3", path: at(V.blobPath(m * 0.4, m * 0.4, 17, 0.38), w * 0.24, h * 0.54), fill: c.muted, opacity: 0.7, order: 2, from: "scale" },
      ];
    },
  },
  {
    id: "layers-stack",
    name: "Stacked layers",
    description: "Three isometric plates — reads as layers, stack, architecture, platform, depth.",
    keywords: ["layers", "stack", "architecture", "platform", "depth", "structure", "levels", "framework"],
    build: ({ w, h, colors: c }) => {
      const plateW = w * 0.72;
      const plateH = h * 0.2;
      const x = (w - plateW) / 2;
      const plates: IllustrationPart[] = [];
      const colors = [c.muted, c.secondary, c.primary];
      for (let i = 0; i < 3; i++) {
        const y = h * 0.66 - i * h * 0.2;
        plates.push({
          name: `Plate ${i + 1}`,
          path: at(
            poly([
              [0, plateH * 0.5],
              [plateW * 0.5, 0],
              [plateW, plateH * 0.5],
              [plateW * 0.5, plateH],
            ]),
            x,
            y,
          ),
          fill: colors[i],
          opacity: 0.95,
          order: i,
          from: "up",
        });
      }
      return plates;
    },
  },
  {
    id: "flow",
    name: "Process flow",
    description: "Three connected steps — reads as process, workflow, pipeline, steps, how it works.",
    keywords: ["flow", "process", "workflow", "pipeline", "steps", "how", "sequence", "diagram", "integration"],
    build: ({ w, h, colors: c }) => {
      const m = Math.min(w, h);
      const cy = h / 2;
      const bw = w * 0.22;
      const bh = h * 0.34;
      const xs = [w * 0.04, w * 0.39, w * 0.74];
      const parts: IllustrationPart[] = [];
      xs.forEach((x, i) => {
        parts.push({
          name: `Step ${i + 1}`,
          path: at(V.roundedRectPath(bw, bh, Math.min(bw, bh) * 0.22), x, cy - bh / 2),
          fill: i === 1 ? c.primary : c.secondary,
          opacity: i === 1 ? 1 : 0.85,
          order: i * 2,
          from: "scale",
        });
        parts.push({
          name: `Step mark ${i + 1}`,
          path: dot(x + bw / 2, cy, m * 0.05),
          fill: c.ink,
          opacity: 0.5,
          order: i * 2 + 1,
          from: "fade",
        });
        if (i < xs.length - 1) {
          const from = x + bw + w * 0.012;
          const to = xs[i + 1] - w * 0.012;
          parts.push({
            name: `Connector ${i + 1}`,
            path: V.unionPaths(
              tick(
                [
                  [from, cy],
                  [to, cy],
                ],
                Math.max(2.5, m * 0.018),
              ),
              arrowHead(to, cy, m * 0.08, 90),
            ),
            fill: c.muted,
            order: i * 2 + 1,
            from: "left",
          });
        }
      });
      return parts;
    },
  },
  {
    id: "waveform",
    name: "Audio waveform",
    description: "A symmetric waveform — reads as audio, music, voice, podcast, sound, recording.",
    keywords: ["waveform", "audio", "sound", "music", "voice", "podcast", "recording", "volume", "listen"],
    build: ({ w, h, colors: c }) => {
      const mid = h / 2;
      const count = 22;
      const bw = (w * 0.96) / count;
      // A stable pseudo-audio envelope: tall in the middle, tapering at the ends.
      const envelope = (i: number) => 0.28 + 0.72 * Math.abs(Math.sin((i / (count - 1)) * Math.PI * 1.6 + 0.4));
      const placed: V.VectorPath[] = [];
      for (let i = 0; i < count; i++) {
        const amp = h * 0.42 * envelope(i);
        placed.push(at(V.roundedRectPath(bw * 0.6, amp * 2, bw * 0.3), w * 0.02 + i * bw, mid - amp));
      }
      return [
        {
          name: "Waveform",
          path: V.unionPaths(...placed),
          fill: c.primary,
          fillTo: c.secondary,
          order: 0,
          from: "up",
        },
        { name: "Centre line", path: bar(w * 0.02, mid - Math.max(1, h * 0.004), w * 0.96, Math.max(2, h * 0.008)), fill: c.ink, opacity: 0.3, order: 1, from: "fade" },
      ];
    },
  },
];

/**
 * Score a query against a set of keys.
 *
 * Deliberately strict about short keys. A loose `query.includes(key)` test turns
 * any long query into a hit on whatever two-letter tag happens to be in it —
 * "definitely-not-an-icon" contains "no", which is a tag on the close icon — and
 * a confident wrong answer is worse than no answer. Short keys therefore only
 * ever match whole, and substring matching needs three characters on both sides.
 */
function scoreKeys(query: string, keys: string[]): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  // Words of four characters or more, with a naive de-pluralisation so
  // "notifications" still reaches the "notification" tag.
  const words = q
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 4)
    .flatMap((w) => (w.endsWith("s") && w.length >= 5 ? [w, w.slice(0, -1)] : [w]));
  let score = 0;
  for (const raw of keys) {
    const key = raw.trim().toLowerCase();
    if (!key) continue;
    if (key === q) {
      score = Math.max(score, 12);
      continue;
    }
    // The query is a prefix of the key: "chart" -> "chart-line".
    if (q.length >= 4 && key.length > q.length && key.startsWith(q)) score = Math.max(score, 9);
    // A long key contained in the query: "lightning" -> "bolt" is a description
    // match, not this; this is for whole compound names like "cloud-sync".
    else if (key.length >= 6 && q.includes(key)) score = Math.max(score, 8);
    for (const w of words) {
      if (key === w) score = Math.max(score, 10);
      else if (key.length >= 4 && key.startsWith(w)) score = Math.max(score, 6);
    }
  }
  return score;
}

const ILLUSTRATION_BY_ID = new Map(ILLUSTRATIONS.map((r) => [r.id, r]));

export function findIllustration(query: string): IllustrationRecipe | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const exact = ILLUSTRATION_BY_ID.get(q);
  if (exact) return exact;
  let best: { recipe: IllustrationRecipe; score: number } | null = null;
  for (const recipe of ILLUSTRATIONS) {
    let score = scoreKeys(q, [recipe.id, recipe.name, ...recipe.keywords]);
    if (recipe.description.toLowerCase().includes(q)) score = Math.max(score, 4);
    if (score > (best?.score ?? 0)) best = { recipe, score };
  }
  return best && best.score > 0 ? best.recipe : null;
}

export function listIllustrations(): Array<{ id: string; name: string; description: string; keywords: string[] }> {
  return ILLUSTRATIONS.map((r) => ({ id: r.id, name: r.name, description: r.description, keywords: r.keywords }));
}

/* ------------------------------------------------------------------ icons --- */

export interface IconSpec {
  description: string;
  tags: string[];
  /** Build the glyph inside a `w`×`h` box. */
  build(w: number, h: number): V.VectorPath;
}

/** Author an icon in a 100×100 space, then fit it to the requested box. */
function icon(description: string, tags: string[], native: () => V.VectorPath): IconSpec {
  return { description, tags, build: (w, h) => scaled(native(), w, h) };
}

function rotateUnion(parts: V.VectorPath[]): V.VectorPath {
  return V.unionPaths(...parts);
}

function teeth(cx: number, cy: number, count: number, inner: number, outer: number, width: number): V.VectorPath[] {
  const out: V.VectorPath[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i * 360) / count;
    const bar_ = V.rectPath(outer - inner, width);
    out.push(at(V.transformPath(bar_, { rotate: a, pivot: { x: 0, y: 0 } }), cx + inner, cy - width / 2));
  }
  return out;
}

export const ICONS: Record<string, IconSpec> = {
  bolt: icon("Lightning bolt", ["bolt", "flash", "power", "energy", "fast", "electric", "speed"], () =>
    poly([
      [60, 2],
      [16, 56],
      [44, 56],
      [36, 98],
      [86, 40],
      [54, 40],
    ]),
  ),
  check: icon("Tick / confirmation", ["check", "tick", "done", "ok", "yes", "confirm", "success", "complete"], () =>
    tick(
      [
        [16, 52],
        [40, 76],
        [86, 24],
      ],
      13,
    ),
  ),
  close: icon("Cross / dismiss", ["close", "x", "cross", "dismiss", "cancel", "delete", "no"], () =>
    rotateUnion([at(V.transformPath(V.roundedRectPath(12, 84, 5), { rotate: 45, pivot: { x: 6, y: 42 } }), 50, 8), at(V.transformPath(V.roundedRectPath(12, 84, 5), { rotate: -45, pivot: { x: 6, y: 42 } }), 38, 8)]),
  ),
  plus: icon("Plus / add", ["plus", "add", "new", "create", "more", "insert"], () =>
    rotateUnion([bar(44, 12, 12, 76, 4), bar(12, 44, 76, 12, 4)]),
  ),
  minus: icon("Minus / remove", ["minus", "remove", "subtract", "less", "collapse"], () => bar(12, 44, 76, 12, 4)),
  "arrow-right": icon("Right arrow", ["arrow", "right", "next", "forward", "go", "continue", "send"], () =>
    rotateUnion([bar(8, 42, 58, 16, 6), poly([[60, 24], [94, 50], [60, 76]])]),
  ),
  "arrow-up-right": icon("Diagonal arrow", ["arrow", "up", "right", "diagonal", "external", "link", "open", "growth"], () =>
    rotateUnion([at(V.transformPath(V.roundedRectPath(76, 16, 6), { rotate: -45, pivot: { x: 38, y: 8 } }), 12, 34), at(V.transformPath(poly([[0, 0], [34, 0], [17, 26]]), { rotate: 45, pivot: { x: 17, y: 13 } }), 58, 4)]),
  ),
  "arrow-up": icon("Up arrow", ["arrow", "up", "upload", "increase", "top", "rise"], () =>
    rotateUnion([bar(42, 30, 16, 62, 6), poly([[50, 6], [82, 42], [18, 42]])]),
  ),
  "arrow-down": icon("Down arrow", ["arrow", "down", "download", "decrease", "bottom", "fall"], () =>
    rotateUnion([bar(42, 8, 16, 62, 6), poly([[50, 94], [82, 58], [18, 58]])]),
  ),
  "chevron-right": icon("Chevron", ["chevron", "next", "more", "forward", "expand", "breadcrumb"], () =>
    tick(
      [
        [34, 16],
        [68, 50],
        [34, 84],
      ],
      14,
    ),
  ),
  "chevron-down": icon("Chevron down", ["chevron", "down", "expand", "open", "menu", "dropdown"], () =>
    tick(
      [
        [16, 34],
        [50, 68],
        [84, 34],
      ],
      14,
    ),
  ),
  play: icon("Play", ["play", "start", "video", "run", "watch", "media"], () => poly([[24, 10], [90, 50], [24, 90]])),
  pause: icon("Pause", ["pause", "stop", "hold", "media"], () => rotateUnion([bar(26, 16, 16, 68, 4), bar(58, 16, 16, 68, 4)])),
  star: icon("Star", ["star", "favourite", "rating", "quality", "bookmark", "featured"], () => V.starPath(100, 100, 5, 0.46)),
  sparkle: icon("Sparkle", ["sparkle", "ai", "magic", "shine", "new", "gleam", "wand"], () => V.sparklePath(100, 100)),
  heart: icon("Heart", ["heart", "love", "like", "favourite", "care", "health"], () => V.heartPath(100, 100)),
  sun: icon("Sun", ["sun", "light", "day", "bright", "weather", "theme", "light-mode"], () =>
    rotateUnion([
      ...teeth(50, 50, 8, 30, 48, 9),
      dot(50, 50, 22),
    ]),
  ),
  moon: icon("Moon", ["moon", "night", "dark", "theme", "dark-mode", "sleep"], () => V.moonPath(100, 100)),
  cloud: icon("Cloud", ["cloud", "weather", "server", "hosting", "saas", "storage", "internet"], () =>
    rotateUnion([dot(32, 60, 20), dot(54, 46, 25), dot(74, 62, 18), bar(24, 58, 54, 22, 11)]),
  ),
  lock: icon("Padlock", ["lock", "secure", "private", "password", "protected", "encrypted"], () =>
    rotateUnion([bar(20, 44, 60, 50, 10), tick([[32, 44], [32, 26], [50, 12], [68, 26], [68, 44]], 10)]),
  ),
  unlock: icon("Open padlock", ["unlock", "open", "access", "public", "insecure"], () =>
    rotateUnion([bar(20, 44, 60, 50, 10), tick([[68, 44], [68, 26], [50, 12], [32, 26]], 10)]),
  ),
  gear: icon("Settings gear", ["gear", "settings", "config", "preferences", "options", "cog", "setup"], () =>
    V.withHole(rotateUnion([...teeth(50, 50, 8, 26, 46, 14), dot(50, 50, 30)]), dot(50, 50, 14)),
  ),
  search: icon("Magnifier", ["search", "find", "lookup", "zoom", "explore", "query"], () =>
    rotateUnion([V.ringPath(62, 62, 11), at(V.transformPath(V.roundedRectPath(34, 12, 6), { rotate: 45, pivot: { x: 17, y: 6 } }), 46, 42)]),
  ),
  target: icon("Target", ["target", "goal", "aim", "focus", "bullseye", "objective"], () =>
    rotateUnion([V.ringPath(96, 96, 14), V.ringPath(58, 58, 12), dot(50, 50, 12)]),
  ),
  clock: icon("Clock", ["clock", "time", "schedule", "duration", "timer", "wait"], () =>
    rotateUnion([V.ringPath(96, 96, 12), bar(44, 24, 12, 30, 6), bar(50, 44, 26, 12, 6)]),
  ),
  bell: icon("Bell", ["bell", "notification", "alert", "reminder", "subscribe", "news"], () =>
    rotateUnion([V.piePath(76, 76, 180, 360), bar(12, 62, 76, 12, 6), dot(50, 84, 9)]),
  ),
  mail: icon("Envelope", ["mail", "email", "message", "inbox", "contact", "newsletter"], () =>
    rotateUnion([V.roundedRectPath(96, 68, 10), tick([[6, 12], [50, 44], [94, 12]], 9)]),
  ),
  pin: icon("Map pin", ["pin", "location", "map", "place", "address", "where", "geo"], () =>
    rotateUnion([dot(50, 38, 30), poly([[28, 52], [72, 52], [50, 96]])]),
  ),
  "chart-bar": icon("Bar chart", ["chart", "bar", "graph", "data", "analytics", "stats", "report"], () =>
    rotateUnion([bar(14, 54, 18, 40, 5), bar(41, 34, 18, 60, 5), bar(68, 14, 18, 80, 5)]),
  ),
  "chart-line": icon("Line chart", ["chart", "line", "graph", "trend", "growth", "analytics", "metrics"], () =>
    rotateUnion([tick([[10, 76], [36, 48], [58, 62], [90, 22]], 11), dot(36, 48, 9), dot(58, 62, 9)]),
  ),
  globe: icon("Globe", ["globe", "world", "global", "language", "internet", "web", "international"], () =>
    rotateUnion([V.ringPath(96, 96, 11), V.ringPath(44, 96, 9), bar(2, 44, 96, 11, 5)]),
  ),
  shield: icon("Shield", ["shield", "security", "safe", "protect", "privacy", "trust", "defence"], () =>
    dPath("M50 2 L94 18 V50 C94 74 74 92 50 98 C26 92 6 74 6 50 V18 Z", 100, 100),
  ),
  key: icon("Key", ["key", "access", "unlock", "password", "security", "login", "api"], () =>
    rotateUnion([V.ringPath(50, 50, 13), bar(44, 46, 12, 44, 4), bar(56, 74, 22, 12, 4), bar(56, 54, 16, 12, 4)]),
  ),
  layers: icon("Layers", ["layers", "stack", "levels", "structure", "architecture", "z-index"], () =>
    rotateUnion([
      poly([[50, 4], [96, 28], [50, 52], [4, 28]]),
      poly([[50, 40], [96, 64], [50, 88], [4, 64]]),
    ]),
  ),
  grid: icon("Grid", ["grid", "layout", "dashboard", "tiles", "apps", "menu", "modules"], () =>
    rotateUnion([bar(8, 8, 38, 38, 6), bar(54, 8, 38, 38, 6), bar(8, 54, 38, 38, 6), bar(54, 54, 38, 38, 6)]),
  ),
  list: icon("List", ["list", "items", "menu", "bullets", "rows", "queue", "tasks"], () =>
    rotateUnion([
      dot(14, 24, 8),
      dot(14, 50, 8),
      dot(14, 76, 8),
      bar(32, 18, 60, 12, 6),
      bar(32, 44, 60, 12, 6),
      bar(32, 70, 60, 12, 6),
    ]),
  ),
  users: icon("People", ["users", "team", "people", "community", "audience", "group", "customers"], () =>
    rotateUnion([dot(50, 30, 19), V.piePath(72, 72, 180, 360), dot(20, 40, 13), dot(80, 40, 13)]),
  ),
  code: icon("Code brackets", ["code", "dev", "developer", "api", "programming", "syntax", "build"], () =>
    rotateUnion([
      tick([[38, 20], [12, 50], [38, 80]], 12),
      tick([[62, 20], [88, 50], [62, 80]], 12),
    ]),
  ),
  camera: icon("Camera", ["camera", "photo", "image", "picture", "capture", "screenshot"], () =>
    rotateUnion([V.roundedRectPath(96, 66, 10), V.ringPath(40, 40, 11), bar(34, 12, 32, 12, 5)]),
  ),
  cpu: icon("Processor", ["cpu", "chip", "processor", "hardware", "compute", "performance", "ai"], () =>
    rotateUnion([
      V.roundedRectPath(64, 64, 10),
      bar(28, 6, 10, 14, 3),
      bar(45, 6, 10, 14, 3),
      bar(62, 6, 10, 14, 3),
      bar(28, 80, 10, 14, 3),
      bar(45, 80, 10, 14, 3),
      bar(62, 80, 10, 14, 3),
      bar(6, 28, 14, 10, 3),
      bar(6, 45, 14, 10, 3),
      bar(6, 62, 14, 10, 3),
      bar(80, 28, 14, 10, 3),
      bar(80, 45, 14, 10, 3),
      bar(80, 62, 14, 10, 3),
    ]),
  ),
  wifi: icon("Signal", ["wifi", "signal", "network", "connection", "online", "live"], () =>
    rotateUnion([
      V.strokePath(V.arcPath(88, 88, 315, 405), 11),
      V.strokePath(V.arcPath(58, 58, 320, 400), 11),
      dot(50, 82, 9),
    ]),
  ),
  refresh: icon("Refresh", ["refresh", "reload", "sync", "update", "retry", "loop"], () =>
    rotateUnion([V.strokePath(V.arcPath(84, 84, 30, 320), 12), arrowHead(88, 26, 26, 140)]),
  ),
  download: icon("Download", ["download", "save", "export", "get", "file", "receive"], () =>
    rotateUnion([bar(42, 8, 16, 54, 6), poly([[50, 90], [84, 52], [16, 52]]), bar(10, 88, 80, 10, 5)]),
  ),
  upload: icon("Upload", ["upload", "import", "send", "share", "publish", "submit"], () =>
    rotateUnion([bar(42, 30, 16, 54, 6), poly([[50, 6], [84, 44], [16, 44]]), bar(10, 88, 80, 10, 5)]),
  ),
  filter: icon("Filter", ["filter", "funnel", "sort", "refine", "segment", "narrow"], () =>
    rotateUnion([poly([[6, 12], [94, 12], [60, 52], [60, 92], [40, 78], [40, 52]])]),
  ),
  bookmark: icon("Bookmark", ["bookmark", "save", "favourite", "later", "pin", "keep"], () =>
    poly([
      [18, 4],
      [82, 4],
      [82, 96],
      [50, 72],
      [18, 96],
    ]),
  ),
  flag: icon("Flag", ["flag", "milestone", "goal", "report", "country", "mark"], () =>
    rotateUnion([bar(14, 4, 12, 92, 5), poly([[26, 10], [92, 30], [26, 50]])]),
  ),
  fire: icon("Flame", ["fire", "hot", "trending", "popular", "energy", "streak"], () =>
    rotateUnion([dPath("M50 2 C70 26 86 44 86 62 A36 36 0 0 1 14 62 C14 44 30 26 50 2 Z", 100, 100), dot(50, 66, 16)]),
  ),
  trophy: icon("Trophy", ["trophy", "award", "win", "achievement", "prize", "best", "leader"], () =>
    rotateUnion([
      V.piePath(64, 64, 180, 360),
      bar(42, 48, 16, 26, 4),
      bar(26, 74, 48, 12, 5),
      V.ringPath(30, 30, 10),
    ]),
  ),
  tag: icon("Tag", ["tag", "label", "category", "price", "meta", "keyword"], () =>
    V.withHole(poly([[6, 34], [34, 6], [94, 6], [94, 66], [66, 94]]), dot(74, 26, 10)),
  ),
  eye: icon("Eye", ["eye", "view", "visible", "preview", "watch", "show"], () =>
    rotateUnion([
      V.withHole(
        dPath("M4 50 C24 20 76 20 96 50 C76 80 24 80 4 50 Z", 100, 100),
        dot(50, 50, 15),
      ),
      dot(50, 50, 15),
    ]),
  ),
  wand: icon("Wand", ["wand", "magic", "ai", "generate", "auto", "enchant", "smart"], () =>
    rotateUnion([at(V.transformPath(V.roundedRectPath(78, 13, 6), { rotate: 45, pivot: { x: 39, y: 6.5 } }), 8, 74), V.sparklePath(34, 34)]),
  ),
  gauge: icon("Gauge", ["gauge", "speed", "performance", "meter", "score", "benchmark", "dashboard"], () =>
    rotateUnion([V.strokePath(V.arcPath(90, 90, 145, 395), 12), bar(48, 26, 8, 32, 4), dot(50, 58, 10)]),
  ),
  calendar: icon("Calendar", ["calendar", "date", "schedule", "event", "plan", "when"], () =>
    rotateUnion([
      V.roundedRectPath(92, 84, 12),
      bar(8, 26, 84, 12, 0),
      bar(26, 6, 11, 22, 4),
      bar(63, 6, 11, 22, 4),
    ]),
  ),
  music: icon("Music note", ["music", "audio", "sound", "song", "track", "melody"], () =>
    rotateUnion([dot(24, 76, 16), dot(66, 68, 16), bar(36, 20, 10, 58, 3), bar(78, 12, 10, 58, 3), bar(36, 18, 52, 12, 3)]),
  ),
  lightbulb: icon("Lightbulb", ["bulb", "idea", "insight", "tip", "invent", "learn"], () =>
    rotateUnion([dot(50, 40, 28), bar(38, 62, 24, 12, 4), bar(40, 76, 20, 10, 4), bar(43, 88, 14, 8, 3)]),
  ),
  compass: icon("Compass", ["compass", "direction", "navigate", "explore", "guide", "find"], () =>
    V.withHole(V.ringPath(96, 96, 11), poly([[64, 26], [42, 58], [36, 74], [58, 42]])),
  ),
  megaphone: icon("Megaphone", ["megaphone", "announce", "marketing", "promote", "broadcast", "campaign"], () =>
    rotateUnion([poly([[6, 38], [54, 14], [54, 86], [6, 62]]), bar(58, 40, 34, 20, 8), bar(30, 64, 14, 30, 5)]),
  ),
  chat: icon("Chat bubble", ["chat", "comment", "message", "talk", "feedback", "support", "dm"], () => V.bubblePath(100, 100)),
  rocket: icon("Rocket", ["rocket", "launch", "startup", "ship", "fast", "grow", "release"], () =>
    rotateUnion([
      dPath("M50 2 C68 20 78 44 78 62 L78 96 L22 96 L22 62 C22 44 32 20 50 2 Z", 100, 100),
      poly([[22, 66], [2, 98], [22, 94]]),
      poly([[78, 66], [98, 98], [78, 94]]),
    ]),
  ),
};

const ICON_BY_KEY = new Map(Object.keys(ICONS).map((k) => [k, k]));

export function listIcons(): Array<{ id: string; description: string; tags: string[] }> {
  return Object.entries(ICONS).map(([id, spec]) => ({ id, description: spec.description, tags: spec.tags }));
}

export function findIcon(query: string): { id: string; spec: IconSpec } | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const exact = ICON_BY_KEY.get(q);
  if (exact) return { id: exact, spec: ICONS[exact] };
  let best: { id: string; spec: IconSpec; score: number } | null = null;
  for (const [id, spec] of Object.entries(ICONS)) {
    let score = scoreKeys(q, [id, ...spec.tags]);
    if (spec.description.toLowerCase().includes(q)) score = Math.max(score, 4);
    if (score > (best?.score ?? 0)) best = { id, spec, score };
  }
  return best && best.score > 0 ? { id: best.id, spec: best.spec } : null;
}

/* ------------------------------------------------------------- rendering --- */

export interface IllustrationRenderOptions {
  /** Total lifetime in ms. */
  durationMs: number;
  /** Entrance delay relative to the parent (scene offset applied by the caller). */
  delayMs?: number;
  /** Stagger between parts, in ms. Defaults to 90. */
  staggerMs?: number;
  /** Beat amplitude: calm 0.55 / balanced 1 / kinetic 3. */
  amp?: number;
  /** Base z-index. Parts stack upward from it. */
  zIndex?: number;
  /** Composed-graphic group id. */
  group?: string;
  /** Name prefix. */
  namePrefix?: string;
  /** End visible instead of exiting — for a closing composition. */
  holdEnd?: boolean;
  /** Overall opacity. */
  opacity?: number;
}

function entrance(
  part: IllustrationPart,
  amp: number,
  holdEnd: boolean,
): { keyframes: Keyframe[]; easing: Easing } {
  const from: Record<string, string | number> = { opacity: 0 };
  const hold: Record<string, string | number> = { opacity: 1 };
  const drift: Record<string, string | number> = { translateY: -Math.round(4 * amp) };
  const travel = Math.round(56 * amp);
  let pop = false;
  switch (part.from ?? "scale") {
    case "left":
      from.translateX = -travel;
      break;
    case "right":
      from.translateX = travel;
      break;
    case "up":
      from.translateY = travel;
      break;
    case "down":
      from.translateY = -travel;
      break;
    case "scale":
      from.scale = 0.6;
      pop = true;
      break;
    case "fade":
      break;
  }
  if (holdEnd) return { keyframes: beatHold(from, hold, drift), easing: EASE_OUT };
  if (pop) {
    // Overshoot on the way in — the entrance a designed mark has.
    const keyframes: Keyframe[] = [
      { offset: 0, properties: { opacity: 0, ...from } as Keyframe["properties"], easing: EASE_BACK },
      { offset: 0.22, properties: { opacity: 1, ...hold } as Keyframe["properties"], easing: EASE_IN_OUT },
      { offset: 0.8, properties: { opacity: 1, ...hold, ...drift } as Keyframe["properties"], easing: EASE_IN },
      { offset: 1, properties: { opacity: 0, ...hold, ...drift } as Keyframe["properties"] },
    ];
    return { keyframes, easing: EASE_BACK };
  }
  return { keyframes: beat(from, hold, {}, drift), easing: EASE_OUT };
}

/** Round a part's bounds outward so no geometry is lost to integer rounding. */
function partBox(path: V.VectorPath, box: Box): Box {
  const b = V.bounds(path);
  const left = Math.max(box.x, Math.floor(box.x + b.minX));
  const top = Math.max(box.y, Math.floor(box.y + b.minY));
  const right = Math.min(box.x + box.w, Math.ceil(box.x + b.maxX));
  const bottom = Math.min(box.y + box.h, Math.ceil(box.y + b.maxY));
  return { x: left, y: top, w: Math.max(1, right - left), h: Math.max(1, bottom - top) };
}

/**
 * Turn illustration parts into animatable layers.
 *
 * Each part becomes one absolutely-positioned layer whose box is the part's own
 * tight bounds, and whose `clip-path` is the part's geometry in local
 * coordinates. That keeps the composition inside the box the layout engine
 * chose, lets each part scale about its own centre, and needs no SVG element —
 * so the preview, the editor and the export all render it identically.
 */
export function illustrationLayers(
  parts: IllustrationPart[],
  box: Box,
  opts: IllustrationRenderOptions,
): GraphicLayer[] {
  const amp = opts.amp ?? 1;
  const stagger = opts.staggerMs ?? 90;
  const duration = Math.max(600, Math.round(opts.durationMs));
  const baseDelay = Math.max(0, Math.round(opts.delayMs ?? 0));
  const baseZ = opts.zIndex ?? 20;
  const layers: GraphicLayer[] = [];

  parts.forEach((part, index) => {
    const pb = partBox(part.path, box);
    // Parts are authored in the illustration's local 0..w space, so shifting
    // the geometry into the layer's own box means subtracting the layer's
    // offset from the box origin — not the absolute origin.
    const local = V.transformPath(part.path, { translateX: -(pb.x - box.x), translateY: -(pb.y - box.y) });
    const fill = part.fill;
    const gradient = part.fillTo
      ? `linear-gradient(160deg, ${fill ?? part.fillTo}, ${part.fillTo})`
      : undefined;
    const style: Record<string, string | number> = {
      position: "absolute",
      _content: "",
      clipPath: V.pathToClip(local),
      zIndex: baseZ + (part.order ?? index),
    };
    if (gradient) style.background = gradient;
    else if (fill) style.backgroundColor = fill;
    if (part.opacity != null) style.opacity = part.opacity;
    if (opts.opacity != null) style.opacity = (part.opacity ?? 1) * opts.opacity;

    const order = part.order ?? index;
    const delay = baseDelay + order * stagger;
    const lifetime = Math.max(400, duration - order * stagger);
    const { keyframes, easing } = entrance(part, amp, opts.holdEnd ?? false);

    layers.push({
      name: opts.namePrefix ? `${opts.namePrefix} · ${part.name}` : part.name,
      delayMs: delay,
      durationMs: lifetime,
      keyframes,
      style: boxToStyle(pb, style),
      easing,
      group: opts.group,
    });
  });

  return layers;
}

/** The parts of a named illustration, resolved to a box and a colour set. */
export function illustrationParts(recipeId: string, w: number, h: number, colors: IllustrationColors): IllustrationPart[] {
  const recipe = ILLUSTRATION_BY_ID.get(recipeId) ?? findIllustration(recipeId);
  if (!recipe) return [];
  return recipe.build({ w, h, colors });
}

/** The geometry of a named icon, fitted to a box. */
export function iconPath(iconId: string, w: number, h: number): V.VectorPath | null {
  const found = findIcon(iconId);
  if (!found) return null;
  return found.spec.build(w, h);
}

/** Default colours for an illustration, derived from a film palette. */
export function illustrationColors(palette: GraphicPalette, override?: string): IllustrationColors {
  return {
    primary: override ?? palette.accent,
    secondary: palette.accent2,
    ink: palette.text,
    muted: palette.subtext,
  };
}

/** A glyph rendered as a single layer — the icon counterpart of a graphic. */
export function iconLayers(
  iconId: string,
  box: Box,
  opts: IllustrationRenderOptions & { color?: string; palette: GraphicPalette; rotation?: number },
): GraphicLayer[] {
  const path = iconPath(iconId, box.w, box.h);
  if (!path) return [];
  const rotated = opts.rotation ? V.transformPath(path, { rotate: opts.rotation }) : path;
  const fitted = V.fitPath(rotated, box.w, box.h, { padding: 0 });
  const part: IllustrationPart = {
    name: opts.namePrefix ?? findIcon(iconId)?.spec.description ?? iconId,
    path: fitted,
    fill: opts.color ?? opts.palette.accent,
    order: 0,
    from: "scale",
  };
  return illustrationLayers([part], box, { ...opts, namePrefix: opts.namePrefix ?? undefined });
}
