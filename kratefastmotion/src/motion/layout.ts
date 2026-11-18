/**
 * Spatial layout engine.
 *
 * Every film layer is absolutely positioned on a fixed 1920x1080 stage, so
 * "where does this graphic go?" is a real geometry problem — and until now it
 * was answered by hand-tuned percentages scattered across the director. That
 * does not scale: add a logo, or a three-word title, and two blocks quietly
 * overlap on top of each other.
 *
 * This module turns placement into a deterministic, testable decision:
 *   - a safe area and a 12-column grid that everything snaps to
 *   - named anchors ("top-right", "bottom-center", ...) and fractional points
 *   - stacking helpers that flow a list of items without ever overlapping
 *   - a collision audit, so a bad layout is caught before it ships
 *
 * It is pure geometry with no rendering knowledge, so the film director and the
 * agent tools can both ask the same engine where something belongs.
 */

export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

/** Margin kept clear on every edge — titles and graphics never touch the frame. */
export const STAGE_MARGIN = 96;
export const GRID_COLUMNS = 12;
export const GRID_GUTTER = 24;

/** An axis-aligned rectangle in stage pixels. */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A box with a name, so audits can report which layers collide. */
export interface NamedBox extends Box {
  name: string;
  /**
   * When the layer is on screen. Two layers whose windows never overlap cannot
   * collide, so an audit that knows the timing stops reporting a caption and a
   * keyword pop as an overlap when they are merely a second apart.
   */
  startMs?: number;
  endMs?: number;
  /**
   * A layer that exists to be covered — a backdrop, a base video, a scrim.
   * Everything else is allowed to sit on top of it, so it never counts as a
   * collision and never hides a real one.
   */
  background?: boolean;
}

export interface Size {
  w: number;
  h: number;
}

/** The content rectangle inside the stage margin. */
export interface Area {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Anchor =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export const ANCHORS: Anchor[] = [
  "top-left",
  "top-center",
  "top-right",
  "middle-left",
  "center",
  "middle-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export function safeArea(margin = STAGE_MARGIN): Area {
  return stageArea(STAGE_WIDTH, STAGE_HEIGHT, margin);
}

/**
 * The content rectangle for an arbitrary stage size. The layout engine defaults
 * to the 1920x1080 film stage, but a social edit composes against a portrait
 * artboard, and every placement helper already accepts an explicit `area`.
 */
export function stageArea(width: number, height: number, margin = STAGE_MARGIN): Area {
  return {
    x: margin,
    y: margin,
    w: Math.max(1, width - margin * 2),
    h: Math.max(1, height - margin * 2),
  };
}

/**
 * The margin a stage keeps clear on every edge.
 *
 * The film stage keeps its fixed 96px margin, so films composed before the
 * social work audit exactly as they always did. Every other artboard gets a
 * margin proportional to its short side, which is what reads as a safe area at
 * social sizes. This is the one place the rule lives: the layout engine, the
 * caption engine and the graphics tool all derive their content rectangle from
 * it, so a caption is never placed a few pixels outside the area the audit
 * measures it against.
 */
export function contentMargin(width: number, height: number): number {
  if (width === STAGE_WIDTH && height === STAGE_HEIGHT) return STAGE_MARGIN;
  return Math.round(Math.min(width, height) * 0.055);
}

/** The content rectangle for a stage, using {@link contentMargin}. */
export function contentArea(width: number, height: number): Area {
  return stageArea(width, height, contentMargin(width, height));
}

/** The width of a single grid column. */
export function columnWidth(area: Area = safeArea(), columns = GRID_COLUMNS, gutter = GRID_GUTTER): number {
  return (area.w - gutter * (columns - 1)) / columns;
}

/**
 * Horizontal band for `span` grid columns starting at `index` (0-based).
 * Snapping to this is what makes two different scenes feel like one design.
 */
export function gridTrack(
  index: number,
  span = 1,
  opts: { area?: Area; columns?: number; gutter?: number } = {},
): { x: number; w: number } {
  const area = opts.area ?? safeArea();
  const columns = opts.columns ?? GRID_COLUMNS;
  const gutter = opts.gutter ?? GRID_GUTTER;
  const start = Math.max(0, Math.min(columns - 1, Math.round(index)));
  const width = Math.max(1, Math.min(columns - start, Math.round(span)));
  const col = columnWidth(area, columns, gutter);
  return {
    x: area.x + start * (col + gutter),
    w: width * col + (width - 1) * gutter,
  };
}

/** The point on `area` that `anchor` refers to. */
export function anchorPoint(anchor: Anchor, area: Area = safeArea()): { x: number; y: number } {
  const left = area.x;
  const centreX = area.x + area.w / 2;
  const right = area.x + area.w;
  const top = area.y;
  const middleY = area.y + area.h / 2;
  const bottom = area.y + area.h;

  switch (anchor) {
    case "top-left":
      return { x: left, y: top };
    case "top-center":
      return { x: centreX, y: top };
    case "top-right":
      return { x: right, y: top };
    case "middle-left":
      return { x: left, y: middleY };
    case "center":
      return { x: centreX, y: middleY };
    case "middle-right":
      return { x: right, y: middleY };
    case "bottom-left":
      return { x: left, y: bottom };
    case "bottom-center":
      return { x: centreX, y: bottom };
    case "bottom-right":
      return { x: right, y: bottom };
  }
}

function horizontalAlign(anchor: Anchor): "start" | "center" | "end" {
  if (anchor.endsWith("left")) return "start";
  if (anchor.endsWith("right")) return "end";
  return "center";
}

function verticalAlign(anchor: Anchor): "start" | "center" | "end" {
  if (anchor.startsWith("top")) return "start";
  if (anchor.startsWith("bottom")) return "end";
  return "center";
}

export interface PlaceOptions {
  /** Nudge in stage pixels, applied after anchoring. */
  offset?: { x?: number; y?: number };
  /** Restrict placement to this rectangle instead of the safe area. */
  area?: Area;
  /** Keep the result inside the area (default true). */
  clamp?: boolean;
}

/**
 * Place a box of `size` against `anchor`. "top-left" pins the box's top-left
 * corner to the area's top-left; "center" centres it; "bottom-right" pins its
 * bottom-right corner. The result is clamped into the area unless told not to.
 */
export function place(anchor: Anchor, size: Size, opts: PlaceOptions = {}): Box {
  const area = opts.area ?? safeArea();
  const point = anchorPoint(anchor, area);
  const h = horizontalAlign(anchor);
  const v = verticalAlign(anchor);

  const x = h === "start" ? point.x : h === "end" ? point.x - size.w : point.x - size.w / 2;
  const y = v === "start" ? point.y : v === "end" ? point.y - size.h : point.y - size.h / 2;

  const box: Box = {
    x: x + (opts.offset?.x ?? 0),
    y: y + (opts.offset?.y ?? 0),
    w: size.w,
    h: size.h,
  };
  return opts.clamp === false ? box : clampBox(box, area);
}

/** Push a box back inside `area` (never resizes it). */
export function clampBox(box: Box, area: Area = safeArea()): Box {
  return {
    x: Math.max(area.x, Math.min(area.x + area.w - box.w, box.x)),
    y: Math.max(area.y, Math.min(area.y + area.h - box.h, box.y)),
    w: box.w,
    h: box.h,
  };
}

/**
 * True when two boxes overlap by more than `pad` pixels — a *tolerance*, used
 * to ignore hairline collisions that a viewer would never see.
 */
export function overlaps(a: Box, b: Box, pad = 0): boolean {
  return a.x < b.x + b.w - pad && b.x < a.x + a.w - pad && a.y < b.y + b.h - pad && b.y < a.y + a.h - pad;
}

/**
 * True when two boxes are separated by at least `gap` pixels on one axis — the
 * *clearance* test. This is the opposite direction to `overlaps(a, b, gap)`,
 * which is exactly the trap that once let a graphic be parked on top of the
 * label it was supposed to avoid.
 */
export function clearOf(a: Box, b: Box, gap = 0): boolean {
  return a.x + a.w + gap <= b.x || b.x + b.w + gap <= a.x || a.y + a.h + gap <= b.y || b.y + b.h + gap <= a.y;
}

function intersectionArea(a: Box, b: Box): number {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

/**
 * True when two layers can be on screen at the same moment. Layers that do not
 * declare a window are assumed to be present for the whole scene, so the audit
 * stays strict for everything that does not opt in.
 */
export function timeOverlap(a: NamedBox, b: NamedBox): boolean {
  if (a.startMs == null || a.endMs == null || b.startMs == null || b.endMs == null) return true;
  return a.startMs < b.endMs && b.startMs < a.endMs;
}

export interface Overlap {
  a: string;
  b: string;
  /** Shared area in square stage pixels. */
  area: number;
  /** The shared rectangle, for drawing a fix suggestion. */
  box: Box;
}

export function findOverlaps(
  boxes: NamedBox[],
  gap = 0,
  allow?: (a: NamedBox, b: NamedBox) => boolean,
): Overlap[] {
  const found: Overlap[] = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      if (allow?.(a, b)) continue;
      // A layer that exists to be covered is never a collision.
      if (a.background || b.background) continue;
      // Two layers that are never on screen together cannot collide.
      if (!timeOverlap(a, b)) continue;
      if (clearOf(a, b, gap)) continue;
      const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      found.push({
        a: a.name,
        b: b.name,
        area: Math.round(intersectionArea(a, b)),
        box: { x: Math.round(Math.max(a.x, b.x)), y: Math.round(Math.max(a.y, b.y)), w: Math.round(w), h: Math.round(h) },
      });
    }
  }
  return found.sort((x, y) => y.area - x.area);
}

export interface BoundsViolation {
  name: string;
  box: Box;
  /** Which edges stick out. */
  edges: Array<"left" | "right" | "top" | "bottom">;
}

export function findOutOfBounds(boxes: NamedBox[], area: Area = safeArea()): BoundsViolation[] {
  const bad: BoundsViolation[] = [];
  for (const b of boxes) {
    // A full-bleed layer is *meant* to run past the safe area — that is what
    // full-bleed means. Flagging the base video for touching the frame edge
    // would make every real composition look broken.
    if (b.background) continue;
    const edges: BoundsViolation["edges"] = [];
    if (b.x < area.x - 0.5) edges.push("left");
    if (b.y < area.y - 0.5) edges.push("top");
    if (b.x + b.w > area.x + area.w + 0.5) edges.push("right");
    if (b.y + b.h > area.y + area.h + 0.5) edges.push("bottom");
    if (edges.length) bad.push({ name: b.name, box: b, edges });
  }
  return bad;
}

export interface LayoutAudit {
  ok: boolean;
  boxes: number;
  overlaps: Overlap[];
  outOfBounds: BoundsViolation[];
  /** Human-readable one-liner, safe to hand straight back to an agent. */
  summary: string;
}

export interface AuditOptions {
  area?: Area;
  /** Minimum clearance demanded between two layers. Two layers closer than
   *  this are reported as a collision, so a caller can ask for breathing room
   *  rather than merely "not touching". Defaults to 0. */
  pad?: number;
  /** Layer names to leave out of the audit entirely. */
  ignore?: string[];
  /**
   * Layers in the same group are one graphic — a card and the chart drawn on it,
   * a progress track and its fill. Overlaps inside a group are intentional, so
   * this predicate is how the caller says so.
   */
  allow?: (a: NamedBox, b: NamedBox) => boolean;
}

/**
 * The single check that matters: does any layer collide with another, and does
 * anything fall outside the safe area? Both are hard failures for a shipped
 * film, so this returns a verdict rather than a pile of numbers.
 */
export function auditLayout(boxes: NamedBox[], opts: AuditOptions = {}): LayoutAudit {
  const area = opts.area ?? safeArea();
  const ignore = new Set(opts.ignore ?? []);
  const subject = boxes.filter((b) => !ignore.has(b.name));
  const overlaps = findOverlaps(subject, opts.pad ?? 0, opts.allow);
  const outOfBounds = findOutOfBounds(subject, area);
  const ok = overlaps.length === 0 && outOfBounds.length === 0;
  const parts: string[] = [`${subject.length} layers checked`];
  parts.push(overlaps.length ? `${overlaps.length} overlap(s): ${overlaps.slice(0, 3).map((o) => `${o.a}/${o.b}`).join(", ")}` : "no overlaps");
  parts.push(outOfBounds.length ? `${outOfBounds.length} outside the safe area: ${outOfBounds.slice(0, 3).map((o) => o.name).join(", ")}` : "all inside the safe area");
  return { ok, boxes: subject.length, overlaps, outOfBounds, summary: parts.join("; ") };
}

/** A box that declares which composed graphic it belongs to. */
export interface GroupedBox extends NamedBox {
  group?: string;
}

/** Same-group overlaps are composition, not collision. */
export function groupAllows(a: GroupedBox, b: GroupedBox): boolean {
  return Boolean(a.group) && a.group === b.group;
}

/* ------------------------------------------------------------------ flow ---- */

export interface FlowOptions {
  anchor?: Anchor;
  /** Gap between items in stage pixels. */
  gap?: number;
  /** Cross-axis alignment of items against the anchor. */
  align?: "start" | "center" | "end";
  area?: Area;
  offset?: { x?: number; y?: number };
}

/**
 * Stack boxes vertically from an anchor. This is how a text block is laid out:
 * the caller supplies each item's measured size, and the engine guarantees the
 * stack is centred as a whole and that no two items touch.
 */
export function flowColumn(items: Size[], opts: FlowOptions = {}): Box[] {
  const anchor = opts.anchor ?? "center";
  const gap = opts.gap ?? 0;
  const area = opts.area ?? safeArea();
  const align = opts.align ?? horizontalAlign(anchor);
  const v = verticalAlign(anchor);

  const totalH = items.reduce((sum, it) => sum + it.h, 0) + gap * Math.max(0, items.length - 1);
  const point = anchorPoint(anchor, area);
  let y = v === "start" ? point.y : v === "end" ? point.y - totalH : point.y - totalH / 2;
  y += opts.offset?.y ?? 0;

  const boxes: Box[] = [];
  for (const item of items) {
    const x =
      align === "start"
        ? area.x
        : align === "end"
          ? area.x + area.w - item.w
          : area.x + (area.w - item.w) / 2;
    boxes.push({
      x: x + (opts.offset?.x ?? 0),
      y,
      w: item.w,
      h: item.h,
    });
    y += item.h + gap;
  }
  return boxes;
}

/** Stack boxes horizontally from an anchor, left to right. */
export function flowRow(items: Size[], opts: FlowOptions = {}): Box[] {
  const anchor = opts.anchor ?? "center";
  const gap = opts.gap ?? 0;
  const area = opts.area ?? safeArea();
  const align = opts.align ?? verticalAlign(anchor);
  const h = horizontalAlign(anchor);

  const totalW = items.reduce((sum, it) => sum + it.w, 0) + gap * Math.max(0, items.length - 1);
  const point = anchorPoint(anchor, area);
  let x = h === "start" ? point.x : h === "end" ? point.x - totalW : point.x - totalW / 2;
  x += opts.offset?.x ?? 0;

  const boxes: Box[] = [];
  for (const item of items) {
    const y =
      align === "start"
        ? area.y
        : align === "end"
          ? area.y + area.h - item.h
          : area.y + (area.h - item.h) / 2;
    boxes.push({ x, y: y + (opts.offset?.y ?? 0), w: item.w, h: item.h });
    x += item.w + gap;
  }
  return boxes;
}

export interface GridFlowOptions {
  area?: Area;
  columns?: number;
  gutter?: number;
  rowGap?: number;
  offset?: { x?: number; y?: number };
}

/**
 * Lay equal cells out on the column grid, `perRow` per row. Used for feature
 * rows and icon sets so they share one rhythm instead of nine hand-picked tops.
 */
export function flowGrid(
  count: number,
  cell: Size,
  perRow: number,
  opts: GridFlowOptions = {},
): Box[] {
  const area = opts.area ?? safeArea();
  const columns = opts.columns ?? GRID_COLUMNS;
  const gutter = opts.gutter ?? GRID_GUTTER;
  const rowGap = opts.rowGap ?? cell.h * 0.35;
  const span = Math.max(1, Math.floor(columns / perRow));

  const boxes: Box[] = [];
  for (let i = 0; i < count; i++) {
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    const track = gridTrack(col * span, span, { area, columns, gutter });
    boxes.push({
      x: track.x + (opts.offset?.x ?? 0),
      y: area.y + row * (cell.h + rowGap) + (opts.offset?.y ?? 0),
      w: Math.min(cell.w, track.w),
      h: cell.h,
    });
  }
  return boxes;
}

/**
 * Find a home for a graphic that does not collide with anything already on the
 * stage. Candidates are generated in a deliberate order — the requested anchor
 * first, then the other anchors (each nudged a little so a near-miss still
 * finds room), then a coarse sweep of the whole safe area — so the answer is
 * stable for the same inputs instead of random.
 *
 * The search is a strict ladder: a spot that clears everything by `gap` beats
 * one that merely does not touch; and if the stage is genuinely full, the spot
 * that covers the *least* existing content is returned rather than silently
 * reusing the requested anchor on top of something. That last rule is what
 * keeps a crowded composition from producing a hidden overlap.
 */
export function freeSpace(
  size: Size,
  occupied: NamedBox[],
  opts: { prefer?: Anchor[]; area?: Area; pad?: number; gap?: number } = {},
): Box {
  const area = opts.area ?? safeArea();
  const pad = opts.pad ?? 0;
  const gap = opts.gap ?? 24;
  const order = [...(opts.prefer ?? []), ...ANCHORS.filter((a) => !(opts.prefer ?? []).includes(a))];

  const candidates: Box[] = [];
  const steps = [0, gap, -gap, gap * 2, -gap * 2, gap * 3];
  for (const anchor of order) {
    for (const dy of steps) {
      for (const dx of steps) {
        candidates.push(place(anchor, size, { area, clamp: false, offset: { x: dx, y: dy } }));
      }
    }
  }
  // A coarse lattice over the safe area is the safety net: if every anchor is
  // blocked there is still somewhere on the stage this fits.
  const stride = 96;
  for (let y = area.y; y + size.h <= area.y + area.h + 0.5; y += stride) {
    for (let x = area.x; x + size.w <= area.x + area.w + 0.5; x += stride) {
      candidates.push({ x, y, w: size.w, h: size.h });
    }
  }

  const inArea = (b: Box) =>
    b.x >= area.x - 0.5 && b.y >= area.y - 0.5 && b.x + b.w <= area.x + area.w + 0.5 && b.y + b.h <= area.y + area.h + 0.5;
  const usable = candidates.filter(inArea);
  const pool = usable.length ? usable : candidates.map((b) => clampBox(b, area));

  // 1. a spot with real breathing room, 2. a spot that at least does not touch,
  // 3. the spot that covers the least content.
  for (const clearance of [Math.max(pad, gap), pad]) {
    const hit = pool.find((b) => occupied.every((o) => clearOf(b, o, clearance)));
    if (hit) return hit;
  }
  let best = pool[0];
  let bestCovered = Number.POSITIVE_INFINITY;
  for (const b of pool) {
    const covered = occupied.reduce((sum, o) => sum + intersectionArea(b, o), 0);
    if (covered < bestCovered) {
      bestCovered = covered;
      best = b;
    }
  }
  return best;
}

/** Scale a size down so it fits inside `max`, preserving aspect ratio. */
export function fitWithin(size: Size, max: Size): Size {
  const scale = Math.min(1, max.w / size.w, max.h / size.h);
  return { w: Math.round(size.w * scale), h: Math.round(size.h * scale) };
}

/**
 * Height of a wrapped text block. Text is the one thing the engine cannot
 * measure directly, so callers pass a size and the layout stays honest.
 */
export function textHeight(fontSize: number, lines: number, lineHeight = 1.2): number {
  return Math.ceil(fontSize * lineHeight * lines);
}

/**
 * Place a vertical stack of boxes so that no two of them touch, balanced on a
 * centre and kept inside a band.
 *
 * A multi-part graphic — a kicker over a phrase, a prompt over a chip over a
 * footer — is a composition, not a set of independent labels. Placing each part
 * at its own fraction of the stage height works at one aspect ratio and
 * collides at the next: a 1920x1080 stage gives a large caption a taller box
 * than a 1080x1350 stage does, and a fixed 0.38/0.5 pair that reads cleanly on
 * one overlaps by 40px on the other. Measuring the parts and stacking them
 * makes the composition correct at every size instead.
 *
 * Returns the top of each box, in the order given.
 */
export function stackColumn(
  heights: number[],
  opts: { centreY: number; gap: number; band?: { top: number; bottom: number } },
): number[] {
  if (!heights.length) return [];
  const total = heights.reduce((sum, h) => sum + h, 0) + opts.gap * (heights.length - 1);
  let top = Math.round(opts.centreY - total / 2);
  if (opts.band) {
    if (top < opts.band.top) top = Math.round(opts.band.top);
    if (top + total > opts.band.bottom) top = Math.round(opts.band.bottom - total);
  }
  const tops: number[] = [];
  let cursor = top;
  for (const h of heights) {
    tops.push(cursor);
    cursor += h + opts.gap;
  }
  return tops;
}

/**
 * The largest font size at which `chars` characters still fit `width`, clamped
 * between a floor and a ceiling. A shared glyph-width estimate keeps every
 * caller sizing text the same way the caption engine does.
 */
export function fitFontSize(
  chars: number,
  width: number,
  opts: { glyphRatio?: number; min: number; max: number },
): number {
  const ratio = opts.glyphRatio ?? 0.56;
  const fitted = Math.floor(width / (Math.max(1, chars) * ratio));
  return Math.max(Math.min(opts.min, opts.max), Math.min(opts.max, fitted));
}

/* ------------------------------------------------------------- style glue --- */

/** Render a box as the CSS `left/top/width/height` a layer style expects. */
export function boxToStyle(box: Box, extra: Record<string, string | number> = {}): Record<string, string | number> {
  return {
    left: `${Math.round(box.x)}px`,
    top: `${Math.round(box.y)}px`,
    width: `${Math.round(box.w)}px`,
    height: `${Math.round(box.h)}px`,
    ...extra,
  };
}

/**
 * Recover a box from a persisted layer style. Only pixel values can be trusted;
 * percentage and keyword positions are reported as unmeasurable so the audit
 * does not invent geometry it does not have.
 */
export function styleToBox(style: Record<string, string | number> | undefined): Box | null {
  if (!style) return null;
  const px = (v: unknown): number | null => {
    if (typeof v === "number") return v;
    if (typeof v === "string" && /^-?\d+(\.\d+)?px$/.test(v.trim())) return Number.parseFloat(v);
    return null;
  };
  const x = px(style.left);
  const y = px(style.top);
  const w = px(style.width);
  const h = px(style.height);
  if (x === null || y === null || w === null || h === null) return null;
  return { x, y, w, h };
}

export function describeBox(box: Box): string {
  return `x=${Math.round(box.x)} y=${Math.round(box.y)} w=${Math.round(box.w)} h=${Math.round(box.h)}`;
}
