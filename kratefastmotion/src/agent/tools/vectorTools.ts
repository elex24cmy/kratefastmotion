// Vector shape, path, icon and illustration tools.
//
// `compose_graphic` draws a *designed graphic* — a chart, a card, a bracket.
// These tools draw the primitives underneath that: a real vector shape, an
// arbitrary SVG path, a glyph from the icon library, or a whole named
// illustration. Every one of them goes through the same layout engine as
// `compose_graphic`, so an agent names *what* it wants and *roughly where* and
// the engine decides the exact pixel box — it can never land on top of existing
// content, and it can never fall outside the frame.
//
// Everything renders as a plain absolutely-positioned div whose geometry is a
// CSS `clip-path: path(...)`. That is deliberate: the preview, the editor and
// the export all render the same DOM, so a shape that looks right in one looks
// right in all three, with no SVG element to keep in sync.

import type { Keyframe, ToolName } from "@kratefastmotion/shared";
import { beat, beatHold } from "../../motion/filmBase.js";
import type { GraphicLayer, GraphicPalette } from "../../motion/filmGraphics.js";
import {
  ILLUSTRATIONS,
  findIllustration,
  findIcon,
  iconLayers,
  iconPath,
  illustrationColors,
  illustrationLayers,
  illustrationParts,
  listIcons,
  listIllustrations,
} from "../../motion/illustrations.js";
import {
  ANCHORS,
  type Anchor,
  type Area,
  type Box,
  type NamedBox,
  type Size,
  clearOf,
  describeBox,
  freeSpace,
  place,
} from "../../motion/layout.js";
import * as V from "../../motion/vectorPaths.js";
import { getProject } from "../../db/repositories/projects.js";
import { createId } from "../../utils/id.js";
import { obstacleBoxes } from "./obstacles.js";
import { persistLayers } from "./persistLayers.js";
import { projectLook } from "./projectLook.js";
import { projectArea, projectStage } from "./projectStage.js";
import type { ToolContext, ToolResult } from "./registry.js";

type Executor = (args: Record<string, unknown>, ctx: ToolContext) => ToolResult | Promise<ToolResult>;

function ok(summary: string, specChanged = true, data?: unknown): ToolResult {
  return { ok: true, summary, specChanged, data };
}
function fail(summary: string): ToolResult {
  return { ok: false, summary, specChanged: false };
}

/* --------------------------------------------------------------- shapes --- */

/** The shape vocabulary. Mirrors `SHAPE_KINDS` in the shared tool schema. */
export const SHAPE_KINDS = [
  "rectangle",
  "rounded-rectangle",
  "ellipse",
  "circle",
  "polygon",
  "star",
  "line",
  "arrow",
  "triangle",
  "pie",
  "arc",
  "blob",
  "squircle",
  "heart",
  "moon",
  "ring",
  "sparkle",
  "bubble",
] as const;

export type ShapeKind = (typeof SHAPE_KINDS)[number];

const SHAPE_PURPOSE: Record<ShapeKind, string> = {
  rectangle: "a plain rectangle",
  "rounded-rectangle": "a rectangle with rounded corners (cornerRadius)",
  ellipse: "an ellipse filling the box",
  circle: "a circle inscribed in the box",
  polygon: "a regular polygon (sides, default 6)",
  star: "a star (points, innerRatio, or straightArms for a crisp star)",
  line: "a horizontal line across the box (thickness)",
  arrow: "a horizontal arrow pointing right (thickness)",
  triangle: "an equilateral triangle pointing up",
  pie: "a pie slice (startAngle..endAngle degrees)",
  arc: "an open arc, drawn as a stroke (startAngle..endAngle, thickness)",
  blob: "an organic blob (seed, wobble)",
  squircle: "a superellipse — a soft-cornered square (exponent)",
  heart: "a heart",
  moon: "a crescent moon",
  ring: "a ring / annulus (thickness)",
  sparkle: "a four-point sparkle",
  bubble: "a speech bubble",
};

/** Default footprint per shape, so the agent only has to name the kind. */
const SHAPE_DEFAULT: Record<ShapeKind, Size> = {
  rectangle: { w: 320, h: 200 },
  "rounded-rectangle": { w: 320, h: 200 },
  ellipse: { w: 320, h: 220 },
  circle: { w: 220, h: 220 },
  polygon: { w: 220, h: 220 },
  star: { w: 240, h: 240 },
  line: { w: 420, h: 24 },
  arrow: { w: 420, h: 48 },
  triangle: { w: 220, h: 200 },
  pie: { w: 240, h: 240 },
  arc: { w: 240, h: 240 },
  blob: { w: 300, h: 260 },
  squircle: { w: 240, h: 240 },
  heart: { w: 240, h: 220 },
  moon: { w: 220, h: 220 },
  ring: { w: 220, h: 220 },
  sparkle: { w: 220, h: 220 },
  bubble: { w: 300, h: 220 },
};

/** Shapes that are drawn as a filled ribbon, never as fill+outline. */
const OPEN_SHAPES = new Set<ShapeKind>(["line", "arrow", "arc"]);

function num(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
function clampInt(v: unknown, lo: number, hi: number, fallback: number): number {
  const n = Math.round(num(v, fallback));
  return Math.max(lo, Math.min(hi, n));
}
function clamp01(v: number): number {
  return Math.max(0.05, Math.min(1, v));
}

interface ShapeOptions {
  sides?: unknown;
  points?: unknown;
  innerRatio?: unknown;
  straightArms?: unknown;
  cornerRadius?: unknown;
  exponent?: unknown;
  startAngle?: unknown;
  endAngle?: unknown;
  thickness?: unknown;
  strokeWidth?: unknown;
  seed?: unknown;
  wobble?: unknown;
}

/** Geometry for one shape, in the box's local 0..w × 0..h space. */
function shapeGeometry(kind: ShapeKind, w: number, h: number, o: ShapeOptions): V.VectorPath {
  const min = Math.min(w, h);
  switch (kind) {
    case "rectangle":
      return V.rectPath(w, h);
    case "rounded-rectangle":
      return V.roundedRectPath(w, h, Math.max(0, Math.min(num(o.cornerRadius, min * 0.18), min / 2)));
    case "ellipse":
      return V.ellipsePath(w, h);
    case "circle": {
      const d = min;
      return V.fitPath(V.ellipsePath(d, d), w, h, { padding: 0 });
    }
    case "polygon":
      return V.polygonPath(w, h, clampInt(o.sides, 3, 24, 6));
    case "triangle":
      return V.polygonPath(w, h, 3);
    case "star": {
      const points = clampInt(o.points, 3, 24, 5);
      const ratio = o.innerRatio != null ? clamp01(num(o.innerRatio, 0.5)) : o.straightArms ? V.straightStarInnerRadius(points) : 0.5;
      return V.starPath(w, h, points, ratio);
    }
    case "line": {
      const t = Math.max(2, num(o.thickness ?? o.strokeWidth, Math.max(3, Math.min(14, h * 0.5))));
      return V.strokePath(V.linePath(0, h / 2, w, h / 2), t);
    }
    case "arrow": {
      const t = Math.max(2, num(o.thickness ?? o.strokeWidth, Math.max(3, Math.min(16, h * 0.34))));
      const head = Math.max(t * 2.2, Math.min(w * 0.3, h * 0.94));
      const shaft = V.strokePath(V.linePath(0, h / 2, Math.max(1, w - head * 0.72), h / 2), t);
      const tri = V.transformPath(V.polygonPath(head, head * 0.86, 3, 90), { translateX: w - head, translateY: h / 2 - head * 0.43 });
      return V.unionPaths(shaft, tri);
    }
    case "pie":
      return V.piePath(w, h, num(o.startAngle, -60), num(o.endAngle, 60));
    case "arc": {
      const t = Math.max(2, num(o.thickness ?? o.strokeWidth, Math.max(4, min * 0.06)));
      return V.strokePath(V.arcPath(w, h, num(o.startAngle, 200), num(o.endAngle, 340)), t);
    }
    case "blob":
      return V.blobPath(w, h, Math.round(num(o.seed, 3)), Math.max(0.02, Math.min(0.5, num(o.wobble, 0.26))));
    case "squircle":
      return V.squirclePath(w, h, Math.max(2, Math.min(12, num(o.exponent, 4))));
    case "heart":
      return V.heartPath(w, h);
    case "moon":
      return V.moonPath(w, h);
    case "ring": {
      const t = Math.max(2, num(o.thickness, min * 0.18));
      return V.ringPath(w, h, t);
    }
    case "sparkle":
      return V.sparklePath(w, h);
    case "bubble":
      return V.bubblePath(w, h);
  }
}

/**
 * Inset a path by half a stroke and outline it, so the stroke's outer edge lands
 * on the box edge instead of spilling half a stroke past it.
 */
function outline(path: V.VectorPath, w: number, h: number, sw: number): V.VectorPath {
  const inner = V.fitPath(path, Math.max(1, w - sw), Math.max(1, h - sw), { padding: 0 });
  return V.strokePath(V.transformPath(inner, { translateX: sw / 2, translateY: sw / 2 }), sw);
}

/* ------------------------------------------------------------ placement --- */

/** Anchors tried, in order, when the agent asks for "auto". */
const AUTO_ORDER: Anchor[] = [
  "center",
  "top-center",
  "bottom-center",
  "middle-left",
  "middle-right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];
const ANCHOR_SET = new Set<string>(ANCHORS);

export interface Placement {
  box: Box;
  requested: string;
  moved: boolean;
  scale: number;
  /** Pixels of existing content the resolved footprint still covers. */
  covered: number;
}

/**
 * Decide where a box of `size` goes.
 *
 * With an explicit `x`/`y` the agent has made the call, so the box is used as
 * given — clamped only to the stage so nothing can land off-frame. Otherwise the
 * layout engine picks: the requested anchor first, then the free-space search,
 * stepping the size down when the stage is too full rather than parking the shape
 * on a neighbour.
 */
function resolvePlacement(
  projectId: string,
  base: Size,
  requested: string,
  avoid: boolean,
  explicit?: { x?: unknown; y?: unknown },
): Placement {
  const area: Area = projectArea(projectId);
  const stage = projectStage(projectId);

  if (explicit && (explicit.x != null || explicit.y != null)) {
    const wantX = num(explicit.x, 0);
    const wantY = num(explicit.y, 0);
    // A box that fits inside the safe area is kept inside it, so the result
    // always passes check_layout. A box too big for the safe area is only kept
    // on the stage — an agent that asks for a full-bleed shape gets one.
    const axis = (want: number, size: number, areaStart: number, areaSize: number, stageSize: number) => {
      const fits = size <= areaSize;
      const lo = fits ? areaStart : 0;
      const hi = fits ? areaStart + areaSize - size : stageSize - size;
      return Math.round(Math.max(lo, Math.min(hi, want)));
    };
    const x = axis(wantX, base.w, area.x, area.w, stage.width);
    const y = axis(wantY, base.h, area.y, area.h, stage.height);
    const box: Box = { x, y, w: base.w, h: base.h };
    const occupied = obstacleBoxes(projectId);
    const covered = occupied.reduce((sum, o) => sum + intersection(box, o), 0);
    return { box, requested: "explicit", moved: x !== Math.round(wantX) || y !== Math.round(wantY), scale: 1, covered };
  }

  const occupied: NamedBox[] = obstacleBoxes(projectId);
  const first: Anchor = requested === "auto" || !ANCHOR_SET.has(requested) ? (avoid ? AUTO_ORDER[0] : "center") : (requested as Anchor);
  const prefer = requested === "auto" || !ANCHOR_SET.has(requested) ? AUTO_ORDER : [requested as Anchor, ...AUTO_ORDER.filter((a) => a !== requested)];
  const preferred = place(first, base, { area });

  const attempt = (scale: number) => {
    const size: Size = { w: Math.max(4, Math.round(base.w * scale)), h: Math.max(4, Math.round(base.h * scale)) };
    const box = avoid ? freeSpace(size, occupied, { area, prefer, gap: 36 }) : place(first, size, { area });
    return { scale, box, clear: occupied.every((o) => clearOf(box, o, 0)) };
  };

  let chosen = attempt(1);
  if (avoid && !chosen.clear) {
    for (const scale of [0.85, 0.72, 0.6, 0.5, 0.42, 0.34]) {
      const candidate = attempt(scale);
      if (candidate.clear) {
        chosen = candidate;
        break;
      }
    }
  }
  const covered = occupied.reduce((sum, o) => sum + intersection(chosen.box, o), 0);
  const moved = chosen.scale < 1 || Math.round(chosen.box.x) !== Math.round(preferred.x) || Math.round(chosen.box.y) !== Math.round(preferred.y);
  return { box: chosen.box, requested, moved, scale: chosen.scale, covered };
}

function intersection(a: Box, b: Box): number {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

/** Where a scene starts, so a scene-scoped layer animates inside its own beat. */
function sceneStart(projectId: string, sceneId: string): { start: number; durationMs: number } | null {
  const project = getProject(projectId);
  if (!project) return null;
  let start = 0;
  for (const scene of project.scenes) {
    const duration = scene.durationMs ?? 0;
    if (scene.id === sceneId) return { start, durationMs: duration };
    start += duration;
  }
  return null;
}

/** Resolve scene timing once, for every tool that can attach to a scene. */
function sceneTiming(
  projectId: string,
  sceneId: string | null,
  args: Record<string, unknown>,
  fallbackMs: number,
): { timeOffset: number; durationMs: number } | null {
  if (!sceneId) {
    return { timeOffset: 0, durationMs: Math.max(400, Math.round(num(args.durationMs, fallbackMs))) };
  }
  const scene = sceneStart(projectId, sceneId);
  if (!scene) return null;
  return {
    timeOffset: scene.start,
    durationMs: scene.durationMs > 0 ? scene.durationMs : Math.max(400, Math.round(num(args.durationMs, fallbackMs))),
  };
}

function placementNote(p: Placement, layers: number, names: string[], box: Box): string {
  const how = `${p.requested === "auto" ? "auto" : p.requested}${p.moved ? " → moved" : ""}${p.scale < 1 ? `, scaled to ${Math.round(p.scale * 100)}% to fit` : ""}`;
  const overlap =
    p.covered > 0
      ? ` WARNING: the stage was too full — this spot still covers ${Math.round(p.covered)}px² of existing content; call check_layout and move or resize.`
      : "";
  return `${layers} layer(s) at ${describeBox(box)} (${how}): ${names.join(", ")}.${overlap}`;
}

/* ----------------------------------------------------------- draw_shape --- */

export const vectorExecutors: Partial<Record<ToolName, Executor>> = {
  draw_shape: (args, ctx) => {
    const kind = String(args.shape) as ShapeKind;
    if (!SHAPE_KINDS.includes(kind)) {
      return fail(
        `unknown shape "${args.shape}". Choose one of: ${SHAPE_KINDS.join(", ")}. ${SHAPE_KINDS.map((k) => `${k}: ${SHAPE_PURPOSE[k]}`).join(" ")}`,
      );
    }
    const sceneId = typeof args.sceneId === "string" && args.sceneId ? args.sceneId : null;
    const timing = sceneTiming(ctx.projectId, sceneId, args, 1800);
    if (!timing) return fail(`scene ${sceneId} not found in this project. Use list_scenes to get a valid sceneId, or omit it.`);

    const def = SHAPE_DEFAULT[kind];
    const base: Size = {
      w: Math.max(8, Math.round(num(args.width, def.w))),
      h: Math.max(8, Math.round(num(args.height, def.h))),
    };
    const avoid = args.avoidOverlap !== false;
    const requested = String(args.placement ?? "auto");
    const placement = resolvePlacement(ctx.projectId, base, requested, avoid, { x: args.x, y: args.y });
    const { box } = placement;

    let path = shapeGeometry(kind, box.w, box.h, args);
    if (args.rotation != null && num(args.rotation, 0) !== 0) {
      // Rotate, then re-fit so the rotated shape still lives inside the box.
      path = V.fitPath(V.transformPath(path, { rotate: num(args.rotation, 0) }), box.w, box.h, { padding: 0 });
    }
    if (V.isEmpty(path)) return fail(`shape "${kind}" produced no geometry at ${box.w}x${box.h} — try a larger width/height.`);

    const { palette, amp } = projectLook(ctx.projectId, typeof args.accent === "string" ? args.accent : undefined);
    const group = createId("g_");
    const z = clampInt(args.zIndex, 0, 90, 14);
    const opacity = args.opacity != null ? Math.max(0, Math.min(1, num(args.opacity, 1))) : undefined;
    const fillSpec = typeof args.fill === "string" ? args.fill.trim() : "";
    const noFill = fillSpec.toLowerCase() === "none";
    const fill = fillSpec && !noFill ? fillSpec : undefined;
    const fillTo = typeof args.fillTo === "string" ? args.fillTo : undefined;
    const strokeSpec = typeof args.stroke === "string" ? args.stroke.trim() : "";
    const stroke = strokeSpec && strokeSpec.toLowerCase() !== "none" ? strokeSpec : undefined;
    const strokeWidth = Math.max(1, num(args.strokeWidth, Math.max(3, Math.min(box.w, box.h) * 0.05)));
    const name = typeof args.name === "string" && args.name.trim() ? args.name.trim() : kind;

    const keyframes = shapeBeat(amp);
    const layers: GraphicLayer[] = [];

    const push = (layerName: string, geometry: V.VectorPath, paint: { fill?: string; fillTo?: string; color?: string }, order: number) => {
      const style: Record<string, string | number> = {
        position: "absolute",
        _content: "",
        clipPath: V.pathToClip(geometry),
        zIndex: z + order,
      };
      if (paint.fillTo && paint.fill) style.background = `linear-gradient(150deg, ${paint.fill}, ${paint.fillTo})`;
      else if (paint.color) style.backgroundColor = paint.color;
      else if (paint.fill) style.backgroundColor = paint.fill;
      if (opacity != null) style.opacity = opacity;
      layers.push({
        name: layers.length ? `${name} · ${layerName}` : name,
        delayMs: timing.timeOffset === 0 ? Math.max(0, Math.round(num(args.delayMs, 0))) : 0,
        durationMs: timing.durationMs,
        keyframes,
        style: { left: `${Math.round(box.x)}px`, top: `${Math.round(box.y)}px`, width: `${Math.round(box.w)}px`, height: `${Math.round(box.h)}px`, ...style },
        group,
      });
    };

    if (OPEN_SHAPES.has(kind)) {
      const color = stroke ?? fill ?? (noFill ? undefined : palette.accent);
      if (color || fillTo) push(name, path, { fill: color ?? fillTo, fillTo }, 0);
    } else {
      const fillColor = noFill ? undefined : fill ?? (stroke ? undefined : palette.accent);
      if (fillColor || fillTo) push("Fill", path, { fill: fillColor ?? fillTo, fillTo }, 0);
      if (stroke) push("Outline", outline(path, box.w, box.h, strokeWidth), { color: stroke }, 1);
    }

    if (!layers.length) return fail(`shape "${kind}" has nothing to draw — pass a fill or a stroke.`);

    persistLayers(ctx.projectId, sceneId, layers, 0);
    return ok(`drew ${kind} — ${placementNote(placement, layers.length, layers.map((l) => l.name), box)}`, true, {
      shape: kind,
      ...placementData(placement),
      layerNames: layers.map((l) => l.name),
      sceneId,
    });
  },

  /* ------------------------------------------------------------ add_path --- */

  add_path: (args, ctx) => {
    const d = String(args.d ?? "").trim();
    if (!d) return fail('add_path needs path data in `d`, e.g. "M10 90 C 40 10, 160 10, 190 90".');
    let parsed: V.VectorPath;
    try {
      parsed = V.parseSvgPath(d);
    } catch {
      return fail("that path data could not be parsed. Pass standard SVG path commands (M, L, H, V, C, S, Q, T, A, Z).");
    }
    if (V.isEmpty(parsed)) return fail("that path data is empty — check the coordinates.");

    const sceneId = typeof args.sceneId === "string" && args.sceneId ? args.sceneId : null;
    const timing = sceneTiming(ctx.projectId, sceneId, args, 1800);
    if (!timing) return fail(`scene ${sceneId} not found in this project. Use list_scenes to get a valid sceneId, or omit it.`);

    // A viewBox lets the agent hand over artwork authored in its own coordinate
    // space (an icon exported at 24x24, a map path in lon/lat).
    const vb = Array.isArray(args.viewBox) ? args.viewBox.map((n) => Number(n)) : null;
    let source = parsed;
    if (vb && vb.length === 4 && vb.every((n) => Number.isFinite(n))) {
      source = V.transformPath(source, { translateX: -vb[0], translateY: -vb[1] });
    }

    const b = V.bounds(source);
    const closed = parsed.subpaths.some((sp) => sp.closed);
    const defW = Math.max(24, Math.round(b.maxX - b.minX));
    const defH = Math.max(24, Math.round(b.maxY - b.minY));
    const base: Size = {
      w: Math.max(8, Math.round(num(args.width, defW))),
      h: Math.max(8, Math.round(num(args.height, defH))),
    };
    const avoid = args.avoidOverlap !== false;
    const requested = String(args.placement ?? "auto");
    const placement = resolvePlacement(ctx.projectId, base, requested, avoid, { x: args.x, y: args.y });
    const { box } = placement;

    let path = V.fitPath(source, box.w, box.h, { padding: 0 });
    if (args.rotation != null && num(args.rotation, 0) !== 0) {
      path = V.fitPath(V.transformPath(path, { rotate: num(args.rotation, 0) }), box.w, box.h, { padding: 0 });
    }

    const { palette, amp } = projectLook(ctx.projectId, typeof args.accent === "string" ? args.accent : undefined);
    const group = createId("g_");
    const z = clampInt(args.zIndex, 0, 90, 14);
    const opacity = args.opacity != null ? Math.max(0, Math.min(1, num(args.opacity, 1))) : undefined;
    const fillSpec = typeof args.fill === "string" ? args.fill.trim() : "";
    const noFill = fillSpec.toLowerCase() === "none";
    const fill = fillSpec && !noFill ? fillSpec : undefined;
    const fillTo = typeof args.fillTo === "string" ? args.fillTo : undefined;
    const strokeSpec = typeof args.stroke === "string" ? args.stroke.trim() : "";
    const stroke = strokeSpec && strokeSpec.toLowerCase() !== "none" ? strokeSpec : undefined;
    const strokeWidth = Math.max(1, num(args.strokeWidth, 4));
    const name = typeof args.name === "string" && args.name.trim() ? args.name.trim() : "Path";

    // An open path with no paint of its own reads as a line, so it defaults to a
    // stroke; a closed path defaults to a fill. An explicit fill: "none" turns
    // the fill off for good — if nothing else paints the path, that is an error
    // rather than a silent fall back to the accent colour.
    const fillColor = noFill ? undefined : fill ?? fillTo ?? (closed ? palette.accent : undefined);
    const strokeColor = stroke ?? (fillColor || noFill ? undefined : palette.accent);
    if (!fillColor && !strokeColor) {
      return fail('this path would be invisible — pass a `fill` or a `stroke`, or drop fill: "none".');
    }

    const keyframes = shapeBeat(amp);
    const layers: GraphicLayer[] = [];
    const styleFor = (geometry: V.VectorPath, order: number): Record<string, string | number> => {
      const style: Record<string, string | number> = {
        position: "absolute",
        _content: "",
        clipPath: V.pathToClip(geometry),
        zIndex: z + order,
        left: `${Math.round(box.x)}px`,
        top: `${Math.round(box.y)}px`,
        width: `${Math.round(box.w)}px`,
        height: `${Math.round(box.h)}px`,
      };
      if (opacity != null) style.opacity = opacity;
      return style;
    };
    const delay = timing.timeOffset === 0 ? Math.max(0, Math.round(num(args.delayMs, 0))) : 0;

    if (fillColor) {
      const style = styleFor(path, 0);
      if (fillTo) style.background = `linear-gradient(150deg, ${fillColor}, ${fillTo})`;
      else style.backgroundColor = fillColor;
      layers.push({ name: layers.length ? `${name} · Fill` : name, delayMs: delay, durationMs: timing.durationMs, keyframes, style, group });
    }
    if (strokeColor) {
      const style = styleFor(outline(path, box.w, box.h, strokeWidth), layers.length);
      style.backgroundColor = strokeColor;
      layers.push({ name: layers.length ? `${name} · Outline` : name, delayMs: delay, durationMs: timing.durationMs, keyframes, style, group });
    }

    persistLayers(ctx.projectId, sceneId, layers, 0);
    return ok(`drew a path — ${placementNote(placement, layers.length, layers.map((l) => l.name), box)}`, true, {
      closed,
      ...placementData(placement),
      layerNames: layers.map((l) => l.name),
      sceneId,
    });
  },

  /* ------------------------------------------------------------ add_icon --- */

  add_icon: (args, ctx) => {
    const query = String(args.icon ?? "").trim();
    const found = findIcon(query);
    if (!found) {
      const ids = listIcons().map((i) => i.id);
      return fail(`no icon matches "${query}". Available icons: ${ids.join(", ")}.`);
    }
    const sceneId = typeof args.sceneId === "string" && args.sceneId ? args.sceneId : null;
    const timing = sceneTiming(ctx.projectId, sceneId, args, 1800);
    if (!timing) return fail(`scene ${sceneId} not found in this project. Use list_scenes to get a valid sceneId, or omit it.`);

    const size = Math.max(12, Math.round(num(args.size, 160)));
    const base: Size = {
      w: Math.max(12, Math.round(num(args.width, size))),
      h: Math.max(12, Math.round(num(args.height, size))),
    };
    const avoid = args.avoidOverlap !== false;
    const requested = String(args.placement ?? "auto");
    const placement = resolvePlacement(ctx.projectId, base, requested, avoid, { x: args.x, y: args.y });
    const { box } = placement;

    const { palette, amp } = projectLook(ctx.projectId, typeof args.accent === "string" ? args.accent : undefined);
    const group = createId("g_");
    const layers = iconLayers(found.id, box, {
      durationMs: timing.durationMs,
      delayMs: timing.timeOffset === 0 ? Math.max(0, Math.round(num(args.delayMs, 0))) : 0,
      amp,
      zIndex: clampInt(args.zIndex, 0, 90, 20),
      group,
      namePrefix: typeof args.name === "string" && args.name.trim() ? args.name.trim() : found.spec.description,
      opacity: args.opacity != null ? Math.max(0, Math.min(1, num(args.opacity, 1))) : undefined,
      color: typeof args.color === "string" ? args.color : undefined,
      palette,
      rotation: args.rotation != null ? num(args.rotation, 0) : undefined,
    });
    if (!layers.length) return fail(`icon "${found.id}" produced no geometry at ${box.w}x${box.h}.`);

    persistLayers(ctx.projectId, sceneId, layers, 0);
    return ok(`drew the ${found.id} icon — ${placementNote(placement, layers.length, layers.map((l) => l.name), box)}`, true, {
      icon: found.id,
      ...placementData(placement),
      layerNames: layers.map((l) => l.name),
      sceneId,
    });
  },

  /* -------------------------------------------------- compose_illustration --- */

  compose_illustration: (args, ctx) => {
    const query = String(args.illustration ?? "").trim();
    const recipe = findIllustration(query);
    if (!recipe) {
      const ids = ILLUSTRATIONS.map((r) => r.id);
      return fail(`no illustration matches "${query}". Available: ${ids.join(", ")}. Call list_illustrations to search them.`);
    }
    const sceneId = typeof args.sceneId === "string" && args.sceneId ? args.sceneId : null;
    const timing = sceneTiming(ctx.projectId, sceneId, args, 3200);
    if (!timing) return fail(`scene ${sceneId} not found in this project. Use list_scenes to get a valid sceneId, or omit it.`);

    const base: Size = {
      w: Math.max(48, Math.round(num(args.width, 520))),
      h: Math.max(48, Math.round(num(args.height, 400))),
    };
    const avoid = args.avoidOverlap !== false;
    const requested = String(args.placement ?? "auto");
    const placement = resolvePlacement(ctx.projectId, base, requested, avoid, { x: args.x, y: args.y });
    const { box } = placement;

    const { palette, amp } = projectLook(ctx.projectId, typeof args.accent === "string" ? args.accent : undefined);
    const colors = illustrationColors(palette, typeof args.accent === "string" ? args.accent : undefined);
    if (typeof args.secondary === "string") colors.secondary = args.secondary;
    if (typeof args.ink === "string") colors.ink = args.ink;
    if (typeof args.muted === "string") colors.muted = args.muted;

    const parts = illustrationParts(recipe.id, box.w, box.h, colors);
    if (!parts.length) return fail(`illustration "${recipe.id}" produced no parts at ${box.w}x${box.h}.`);

    const group = createId("g_");
    const layers = illustrationLayers(parts, box, {
      durationMs: timing.durationMs,
      delayMs: timing.timeOffset === 0 ? Math.max(0, Math.round(num(args.delayMs, 0))) : 0,
      staggerMs: clampInt(args.staggerMs, 0, 600, 90),
      amp,
      zIndex: clampInt(args.zIndex, 0, 90, 20),
      group,
      namePrefix: typeof args.name === "string" && args.name.trim() ? args.name.trim() : recipe.name,
      opacity: args.opacity != null ? Math.max(0, Math.min(1, num(args.opacity, 1))) : undefined,
    });

    persistLayers(ctx.projectId, sceneId, layers, 0);
    return ok(
      `drew the "${recipe.name}" illustration — ${placementNote(placement, layers.length, layers.map((l) => l.name), box)}`,
      true,
      { illustration: recipe.id, parts: parts.length, ...placementData(placement), layerNames: layers.map((l) => l.name), sceneId },
    );
  },

  /* ------------------------------------------------------ list_illustrations --- */

  list_illustrations: (args) => {
    const query = String(args.query ?? "").trim().toLowerCase();
    const kind = String(args.kind ?? "all");
    const wantIllustrations = kind === "all" || kind === "illustration";
    const wantIcons = kind === "all" || kind === "icon";

    const matches = (fields: string[]) => !query || fields.some((f) => f.toLowerCase().includes(query));
    const illustrations = wantIllustrations
      ? listIllustrations().filter((r) => matches([r.id, r.name, r.description, ...r.keywords]))
      : [];
    const icons = wantIcons ? listIcons().filter((i) => matches([i.id, i.description, ...i.tags])) : [];

    if (!illustrations.length && !icons.length) {
      return ok(
        `nothing matches "${query}". ${ILLUSTRATIONS.length} illustrations and ${listIcons().length} icons are available — omit the query to list them all.`,
        false,
        { illustrations: [], icons: [] },
      );
    }
    const parts: string[] = [];
    if (illustrations.length) parts.push(`${illustrations.length} illustration(s): ${illustrations.map((r) => r.id).join(", ")}`);
    if (icons.length) parts.push(`${icons.length} icon(s): ${icons.map((i) => i.id).join(", ")}`);
    return ok(`${parts.join(". ")}.`, false, { illustrations, icons });
  },
};

/* --------------------------------------------------------------- helpers --- */

/** The entrance every shape shares: a small pop, then a slow creep while held. */
function shapeBeat(amp: number): Keyframe[] {
  const from: Record<string, string | number> = { opacity: 0, scale: 0.84 };
  const hold: Record<string, string | number> = { opacity: 1, scale: 1 };
  const drift: Record<string, string | number> = { scale: 1 + 0.02 * amp, translateY: -Math.round(4 * amp) };
  return beat(from, hold, {}, drift);
}

/** Kept for callers that want the shape to still be on screen at the end. */
export function shapeHoldBeat(amp: number): Keyframe[] {
  return beatHold({ opacity: 0, scale: 0.84 }, { opacity: 1, scale: 1 }, { translateY: -Math.round(4 * amp) });
}

function placementData(p: Placement) {
  return {
    placement: p.requested,
    moved: p.moved,
    scale: p.scale,
    coveredArea: Math.round(p.covered),
    box: { x: Math.round(p.box.x), y: Math.round(p.box.y), w: Math.round(p.box.w), h: Math.round(p.box.h) },
  };
}
