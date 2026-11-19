/**
 * Vector geometry engine — real paths, real curves.
 *
 * The graphic kit draws rectangles, rings and clip-polygons. That is enough for
 * a chart, but not for an illustration: a rocket fin, a cloud, a crescent, a
 * stroked checkmark are curves, and a polygon cannot express them.
 *
 * This module is a small, pure vector engine: it builds Bézier paths
 * (rectangles, ellipses, polygons, stars, pies, arcs, blobs, squircles), reads
 * and writes SVG path data, transforms and fits paths into a box, and converts
 * a *stroke* into a fillable outline so a stroked shape can be drawn with the
 * same `clip-path` mechanism the rest of the app already uses. Nothing here
 * knows about rendering — it returns geometry, and the caller decides how to
 * paint it.
 *
 * The design of the node/handle model and the shape vocabulary follows the
 * command surface of VectorCraft (an Apache-2.0 vector editor); the
 * implementation below is original.
 */

/* ------------------------------------------------------------------ types --- */

export interface Vec2 {
  x: number;
  y: number;
}

/** A path node with optional *relative* Bézier handles. */
export interface Anchor {
  x: number;
  y: number;
  /** Handle arriving at this node, relative to the node. */
  in?: Vec2;
  /** Handle leaving this node, relative to the node. */
  out?: Vec2;
}

export interface SubPath {
  anchors: Anchor[];
  closed: boolean;
}

export interface VectorPath {
  subpaths: SubPath[];
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** Handle length that turns a quarter-circle into a cubic Bézier. */
export const KAPPA = 0.5522847498307936;

const TAU = Math.PI * 2;

function rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function round(v: number, places = 2): number {
  const f = 10 ** places;
  return Math.round(v * f) / f;
}

/** Deterministic 0..1 from an index — the same blob every time. */
function noise(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** A path made of one or more subpaths. */
export function makePath(...subpaths: SubPath[]): VectorPath {
  return { subpaths };
}

function open(anchors: Anchor[]): SubPath {
  return { anchors, closed: false };
}

function closed(anchors: Anchor[]): SubPath {
  return { anchors, closed: true };
}

function point(x: number, y: number, handles?: { in?: Vec2; out?: Vec2 }): Anchor {
  return handles ? { x, y, in: handles.in, out: handles.out } : { x, y };
}

/* ------------------------------------------------------------- primitives --- */

/** An axis-aligned rectangle filling `w`×`h`. */
export function rectPath(w: number, h: number): VectorPath {
  return makePath(closed([point(0, 0), point(w, 0), point(w, h), point(0, h)]));
}

/**
 * A rectangle with quarter-circle corners. The radius is clamped to half the
 * shorter side, so an over-large radius produces a stadium rather than a
 * self-crossing path.
 */
export function roundedRectPath(w: number, h: number, radius: number): VectorPath {
  const r = Math.max(0, Math.min(radius, Math.min(w, h) / 2));
  if (r <= 0.01) return rectPath(w, h);
  const k = KAPPA * r;
  const anchors: Anchor[] = [
    point(r, 0, { in: { x: -k, y: 0 }, out: { x: k, y: 0 } }),
    point(w - r, 0, { in: { x: -k, y: 0 }, out: { x: k, y: 0 } }),
    point(w, r, { in: { x: 0, y: -k }, out: { x: 0, y: k } }),
    point(w, h - r, { in: { x: 0, y: -k }, out: { x: 0, y: k } }),
    point(w - r, h, { in: { x: k, y: 0 }, out: { x: -k, y: 0 } }),
    point(r, h, { in: { x: k, y: 0 }, out: { x: -k, y: 0 } }),
    point(0, h - r, { in: { x: 0, y: k }, out: { x: 0, y: -k } }),
    point(0, r, { in: { x: 0, y: k }, out: { x: 0, y: -k } }),
  ];
  return makePath(closed(anchors));
}

/**
 * A point on an ellipse, measured in *degrees from 12 o'clock, clockwise* —
 * the convention a designer uses, and the one every shape below shares.
 */
function ellipsePoint(cx: number, cy: number, rx: number, ry: number, deg: number): Vec2 {
  const t = rad(deg);
  return { x: cx + rx * Math.sin(t), y: cy - ry * Math.cos(t) };
}

/** Tangent direction (dP/dθ) at `deg`, for handle construction. */
function ellipseTangent(rx: number, ry: number, deg: number): Vec2 {
  const t = rad(deg);
  return { x: rx * Math.cos(t), y: ry * Math.sin(t) };
}

/**
 * An ellipse approximated by `n` smooth anchors. `n = 4` is the classic
 * four-anchor circle (handles of length KAPPA·r); a higher count is smoother
 * and is what a heavily rotated or scaled ellipse needs.
 */
export function ellipseAnchorsPath(w: number, h: number, n = 4): VectorPath {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2;
  const ry = h / 2;
  const count = Math.max(3, Math.round(n));
  const step = 360 / count;
  // For an arc of angle φ the cubic handle is (4/3)·tan(φ/4) times the tangent.
  const m = (4 / 3) * Math.tan(rad(step) / 4);
  const anchors: Anchor[] = [];
  for (let i = 0; i < count; i++) {
    const deg = i * step;
    const p = ellipsePoint(cx, cy, rx, ry, deg);
    const t = ellipseTangent(rx, ry, deg);
    anchors.push(point(p.x, p.y, { in: { x: -m * t.x, y: -m * t.y }, out: { x: m * t.x, y: m * t.y } }));
  }
  return makePath(closed(anchors));
}

/** An ellipse inscribed in `w`×`h`. */
export function ellipsePath(w: number, h: number): VectorPath {
  return ellipseAnchorsPath(w, h, 4);
}

/**
 * A regular polygon inscribed in `w`×`h`, first vertex straight up when
 * `rotation` is 0. Using both radii means the shape fills its box rather than
 * leaving the long axis empty.
 */
export function polygonPath(w: number, h: number, sides: number, rotation = 0): VectorPath {
  const count = Math.max(3, Math.round(sides));
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2;
  const ry = h / 2;
  const anchors: Anchor[] = [];
  for (let i = 0; i < count; i++) {
    const p = ellipsePoint(cx, cy, rx, ry, rotation + (i * 360) / count);
    anchors.push(point(p.x, p.y));
  }
  return makePath(closed(anchors));
}

/**
 * The inner radius at which a star's arms become straight-edged (a `{n/2}`
 * star polygon, like a pentagram). Handy because the default star has a soft,
 * toy-like waist and this one reads as a real mark.
 */
export function straightStarInnerRadius(points: number): number {
  const n = Math.max(3, Math.round(points));
  return Math.cos(TAU / n) / Math.cos(Math.PI / n);
}

/** A star inscribed in `w`×`h`, first tip straight up when `rotation` is 0. */
export function starPath(w: number, h: number, points: number, innerRatio = 0.5, rotation = 0): VectorPath {
  const count = Math.max(3, Math.round(points));
  const inner = Math.max(0.05, Math.min(1, innerRatio));
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2;
  const ry = h / 2;
  const anchors: Anchor[] = [];
  for (let i = 0; i < count; i++) {
    const outer = ellipsePoint(cx, cy, rx, ry, rotation + (i * 360) / count);
    anchors.push(point(outer.x, outer.y));
    const innerP = ellipsePoint(cx, cy, rx * inner, ry * inner, rotation + 180 / count + (i * 360) / count);
    anchors.push(point(innerP.x, innerP.y));
  }
  return makePath(closed(anchors));
}

/** A straight-armed star (see {@link straightStarInnerRadius}). */
export function straightStarPath(w: number, h: number, points: number, rotation = 0): VectorPath {
  return starPath(w, h, points, straightStarInnerRadius(points), rotation);
}

/** A four-pointed sparkle — the "AI" glyph. */
export function sparklePath(w: number, h: number): VectorPath {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2;
  const ry = h / 2;
  const waist = 0.16;
  const anchors: Anchor[] = [
    point(cx, cy - ry, { in: { x: -rx * waist, y: ry * waist * 0.6 }, out: { x: rx * waist, y: ry * waist * 0.6 } }),
    point(cx + rx, cy, { in: { x: -rx * waist * 0.6, y: -ry * waist }, out: { x: -rx * waist * 0.6, y: ry * waist } }),
    point(cx, cy + ry, { in: { x: rx * waist, y: -ry * waist * 0.6 }, out: { x: -rx * waist, y: -ry * waist * 0.6 } }),
    point(cx - rx, cy, { in: { x: rx * waist * 0.6, y: ry * waist }, out: { x: rx * waist * 0.6, y: -ry * waist } }),
  ];
  return makePath(closed(anchors));
}

/** A straight line from (x1,y1) to (x2,y2). */
export function linePath(x1: number, y1: number, x2: number, y2: number): VectorPath {
  return makePath(open([point(x1, y1), point(x2, y2)]));
}

/**
 * A smooth arc from `startDeg` to `endDeg` (0° = up, clockwise), open. Sampled
 * in ≤90° pieces so the cubic approximation stays tight.
 */
export function arcPath(w: number, h: number, startDeg: number, endDeg: number): VectorPath {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2;
  const ry = h / 2;
  const sweep = endDeg - startDeg;
  const steps = Math.max(1, Math.ceil(Math.abs(sweep) / 90));
  const stepDeg = sweep / steps;
  const m = (4 / 3) * Math.tan(rad(stepDeg) / 4);
  const anchors: Anchor[] = [];
  for (let i = 0; i <= steps; i++) {
    const deg = startDeg + stepDeg * i;
    const p = ellipsePoint(cx, cy, rx, ry, deg);
    const t = ellipseTangent(rx, ry, deg);
    anchors.push(
      point(p.x, p.y, {
        in: i === 0 ? undefined : { x: -m * t.x, y: -m * t.y },
        out: i === steps ? undefined : { x: m * t.x, y: m * t.y },
      }),
    );
  }
  return makePath(open(anchors));
}

/** A filled pie slice (a wedge from the centre) from `startDeg` to `endDeg`. */
export function piePath(w: number, h: number, startDeg: number, endDeg: number): VectorPath {
  const cx = w / 2;
  const cy = h / 2;
  const arc = arcPath(w, h, startDeg, endDeg).subpaths[0].anchors;
  return makePath(closed([point(cx, cy), ...arc]));
}

/** A ring (a circle with a hole) — one path, two contours, nonzero winding. */
export function ringPath(w: number, h: number, thickness: number): VectorPath {
  const t = Math.max(0.5, thickness);
  const outer = ellipsePath(w, h);
  const innerW = Math.max(1, w - t * 2);
  const innerH = Math.max(1, h - t * 2);
  const inner = transformPath(ellipsePath(innerW, innerH), { translateX: t, translateY: t });
  return withHole(outer, inner);
}

/** An organic closed blob, stable for a given `seed`. */
export function blobPath(w: number, h: number, seed = 1, wobble = 0.28): VectorPath {
  const lobes = 7;
  const pts: Vec2[] = [];
  for (let i = 0; i < lobes; i++) {
    const r = 1 + wobble * (noise(seed * 13.7 + i) * 2 - 1);
    const deg = (i * 360) / lobes;
    const t = rad(deg);
    pts.push({ x: Math.sin(t) * r, y: -Math.cos(t) * r });
  }
  const smooth = catmullRom(pts, true);
  return fitPath(makePath(closed(smooth)), w, h, { padding: 0 });
}

/** A superellipse ("squircle"). `exponent` 2 is an ellipse, 4–6 is the iOS feel. */
export function squirclePath(w: number, h: number, exponent = 4, samples = 48): VectorPath {
  const n = Math.max(2, exponent);
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2;
  const ry = h / 2;
  const anchors: Anchor[] = [];
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * TAU;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const x = cx + rx * Math.sign(c) * Math.abs(c) ** (2 / n);
    const y = cy + ry * Math.sign(s) * Math.abs(s) ** (2 / n);
    anchors.push(point(x, y));
  }
  return makePath(closed(anchors));
}

/** A heart, fitted to the box. */
export function heartPath(w: number, h: number): VectorPath {
  const d =
    "M50 30 C50 30 40 4 19 4 C0 4 0 32 0 32 C0 54 22 70 50 92 C78 70 100 54 100 32 C100 32 100 4 81 4 C60 4 50 30 50 30 Z";
  return fitPath(parseSvgPath(d), w, h, { padding: 0 });
}

/** A crescent moon (two circles, one cut out of the other), fitted to the box. */
export function moonPath(w: number, h: number): VectorPath {
  const outer = ellipsePath(w, h);
  const cut = transformPath(ellipsePath(w * 0.76, h * 0.84), { translateX: w * 0.2, translateY: h * 0.04 });
  return fitPath(withHole(outer, cut), w, h, { padding: 0 });
}

/** A speech bubble: a rounded rectangle with a tail. */
export function bubblePath(w: number, h: number): VectorPath {
  const body = roundedRectPath(w, h * 0.78, Math.min(w, h) * 0.18);
  const tail = makePath(
    closed([point(w * 0.22, h * 0.72), point(w * 0.36, h * 0.72), point(w * 0.24, h)]),
  );
  return unionPaths(body, tail);
}

/**
 * A smooth path through the given points, using Catmull-Rom → cubic Bézier.
 * This is how a blob, a superellipse or a hand-drawn outline becomes a curve.
 */
export function catmullRom(points: Vec2[], isClosed = false): Anchor[] {
  const n = points.length;
  if (n < 2) return points.map((p) => point(p.x, p.y));
  const at = (i: number): Vec2 => {
    if (isClosed) return points[((i % n) + n) % n];
    return points[Math.max(0, Math.min(n - 1, i))];
  };
  const anchors: Anchor[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const out = { x: (p2.x - p0.x) / 6, y: (p2.y - p0.y) / 6 };
    const inn = { x: -(p3.x - p1.x) / 6, y: -(p3.y - p1.y) / 6 };
    anchors.push(point(p1.x, p1.y, { in: inn, out }));
  }
  return anchors;
}

/** Build a path from explicit points, optionally with per-point handles. */
export function pathFromPoints(
  points: Array<Vec2 | (Vec2 & { in?: Vec2; out?: Vec2 })>,
  isClosed: boolean,
): VectorPath {
  const anchors = points.map((p) =>
    point(p.x, p.y, "in" in p || "out" in p ? { in: (p as Anchor).in, out: (p as Anchor).out } : undefined),
  );
  return makePath({ anchors, closed: isClosed });
}

/* --------------------------------------------------------- path algebra --- */

/** Concatenate paths. Under nonzero winding, same-direction contours union. */
export function unionPaths(...paths: VectorPath[]): VectorPath {
  const subpaths: SubPath[] = [];
  for (const p of paths) subpaths.push(...p.subpaths);
  return { subpaths };
}

/** Reverse a path's winding — the opposite of {@link unionPaths} (a hole). */
export function reversePath(path: VectorPath): VectorPath {
  return {
    subpaths: path.subpaths.map((sp) => ({
      closed: sp.closed,
      anchors: [...sp.anchors]
        .reverse()
        .map((a) => ({ x: a.x, y: a.y, in: a.out, out: a.in })),
    })),
  };
}

/** Cut `hole` out of `outer`. Both contours must be closed. */
export function withHole(outer: VectorPath, hole: VectorPath): VectorPath {
  return unionPaths(outer, reversePath(hole));
}

/** Subtract `b` from `a` (the general name for {@link withHole}). */
export function subtractPath(a: VectorPath, b: VectorPath): VectorPath {
  return withHole(a, b);
}

/* ------------------------------------------------------------ transform --- */

export interface TransformOptions {
  scaleX?: number;
  scaleY?: number;
  translateX?: number;
  translateY?: number;
  /** Rotation in degrees, about the path's own centre unless `pivot` is given. */
  rotate?: number;
  pivot?: Vec2;
}

function mapPoint(p: Vec2, fn: (p: Vec2) => Vec2): Vec2 {
  return fn(p);
}

/** Apply a scale/translate/rotate to every anchor and handle. */
export function transformPath(path: VectorPath, t: TransformOptions): VectorPath {
  const b = bounds(path);
  const pivot = t.pivot ?? { x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2 };
  const angle = rad(t.rotate ?? 0);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const sx = t.scaleX ?? 1;
  const sy = t.scaleY ?? 1;
  const tx = t.translateX ?? 0;
  const ty = t.translateY ?? 0;

  const apply = (p: Vec2): Vec2 => {
    const dx = (p.x - pivot.x) * sx;
    const dy = (p.y - pivot.y) * sy;
    return { x: pivot.x + dx * cos - dy * sin + tx, y: pivot.y + dx * sin + dy * cos + ty };
  };
  // Handles are directions, so they get scaled and rotated but not translated.
  const applyDir = (p: Vec2): Vec2 => {
    const dx = p.x * sx;
    const dy = p.y * sy;
    return { x: dx * cos - dy * sin, y: dx * sin + dy * cos };
  };

  return {
    subpaths: path.subpaths.map((sp) => ({
      closed: sp.closed,
      anchors: sp.anchors.map((a) => ({
        ...mapPoint(a, apply),
        in: a.in ? mapPoint(a.in, applyDir) : undefined,
        out: a.out ? mapPoint(a.out, applyDir) : undefined,
      })),
    })),
  };
}

/** Exact-ish bounds, by flattening at a tolerance relative to the path's size. */
export function bounds(path: VectorPath): Bounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const visit = (x: number, y: number) => {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  };
  let scale = 1;
  for (const sp of path.subpaths) {
    for (const a of sp.anchors) {
      scale = Math.max(scale, Math.abs(a.x), Math.abs(a.y), Math.abs(a.x + (a.in?.x ?? 0)), Math.abs(a.y + (a.in?.y ?? 0)));
    }
  }
  for (const contour of flattenPath(path, Math.max(1e-6, scale * 1e-4))) for (const p of contour) visit(p.x, p.y);
  if (!Number.isFinite(minX)) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  return { minX, minY, maxX, maxY };
}

/**
 * Scale and centre a path so it exactly fills `w`×`h` (minus optional padding).
 * `stretch` distorts the aspect ratio; the default preserves it.
 */
export function fitPath(
  path: VectorPath,
  w: number,
  h: number,
  opts: { padding?: number; stretch?: boolean } = {},
): VectorPath {
  const pad = opts.padding ?? 0;
  const b = bounds(path);
  const bw = Math.max(1e-6, b.maxX - b.minX);
  const bh = Math.max(1e-6, b.maxY - b.minY);
  const targetW = Math.max(1, w - pad * 2);
  const targetH = Math.max(1, h - pad * 2);
  const sx = targetW / bw;
  const sy = targetH / bh;
  const s = opts.stretch ? 1 : Math.min(sx, sy);
  const scaleX = opts.stretch ? sx : s;
  const scaleY = opts.stretch ? sy : s;
  const pivot = { x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2 };
  // `transformPath` scales about `pivot`, so the translation that lands the
  // scaled bounds at `offset` has to undo the pivot's contribution.
  const offsetX = pad + (targetW - bw * scaleX) / 2;
  const offsetY = pad + (targetH - bh * scaleY) / 2;
  return transformPath(path, {
    scaleX,
    scaleY,
    pivot,
    translateX: offsetX - b.minX * scaleX - pivot.x * (1 - scaleX),
    translateY: offsetY - b.minY * scaleY - pivot.y * (1 - scaleY),
  });
}

/* ---------------------------------------------------------- flattening --- */

/** Flatten every subpath into polylines (points only, no handles). */
export function flattenPath(path: VectorPath, tolerance = 0.25): Vec2[][] {
  const out: Vec2[][] = [];
  for (const sp of path.subpaths) {
    const anchors = sp.anchors;
    if (anchors.length === 0) continue;
    const pts: Vec2[] = [{ x: anchors[0].x, y: anchors[0].y }];
    const count = sp.closed ? anchors.length : anchors.length - 1;
    for (let i = 0; i < count; i++) {
      const a = anchors[i];
      const b = anchors[(i + 1) % anchors.length];
      if (a.out || b.in) {
        subdivideCubic(
          { x: a.x, y: a.y },
          { x: a.x + (a.out?.x ?? 0), y: a.y + (a.out?.y ?? 0) },
          { x: b.x + (b.in?.x ?? 0), y: b.y + (b.in?.y ?? 0) },
          { x: b.x, y: b.y },
          tolerance,
          0,
          pts,
        );
      } else {
        pts.push({ x: b.x, y: b.y });
      }
    }
    // A closed contour's last point is its first, and a duplicated vertex makes
    // a zero-length segment (which has no normal) for the offsetter. Drop it.
    if (sp.closed && pts.length > 1) {
      const first = pts[0];
      const last = pts[pts.length - 1];
      if (Math.hypot(last.x - first.x, last.y - first.y) < 1e-9) pts.pop();
    }
    out.push(pts);
  }
  return out;
}

function midpoint(a: Vec2, b: Vec2): Vec2 {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** True when the cubic is flat enough to be a straight chord. */
function flatEnough(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, tol: number): boolean {
  const dx = p3.x - p0.x;
  const dy = p3.y - p0.y;
  const d1 = Math.abs((p1.x - p3.x) * dy - (p1.y - p3.y) * dx);
  const d2 = Math.abs((p2.x - p3.x) * dy - (p2.y - p3.y) * dx);
  const dd = (d1 + d2) ** 2;
  return dd <= tol * tol * (dx * dx + dy * dy);
}

/** Adaptive de Casteljau subdivision — accurate at any coordinate scale. */
function subdivideCubic(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, tol: number, depth: number, out: Vec2[]): void {
  if (depth >= 18 || flatEnough(p0, p1, p2, p3, tol)) {
    out.push(p3);
    return;
  }
  const p01 = midpoint(p0, p1);
  const p12 = midpoint(p1, p2);
  const p23 = midpoint(p2, p3);
  const p012 = midpoint(p01, p12);
  const p123 = midpoint(p12, p23);
  const centre = midpoint(p012, p123);
  subdivideCubic(p0, p01, p012, centre, tol, depth + 1, out);
  subdivideCubic(centre, p123, p23, p3, tol, depth + 1, out);
}

/* -------------------------------------------------------------- stroking --- */

/**
 * Offset a polyline by `distance` along its segment normals, inserting a round
 * join at every corner so a convex turn is not cut off. A negative distance
 * offsets to the other side (used for the inner edge of a ring).
 */
function offsetPolyline(pts: Vec2[], distance: number, isClosed: boolean): Vec2[] {
  const n = pts.length;
  if (n < 2) return pts.map((p) => ({ x: p.x, y: p.y }));
  const segCount = isClosed ? n : n - 1;

  const normalOf = (a: Vec2, b: Vec2): Vec2 => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: dy / len, y: -dx / len };
  };
  const offsetPoint = (p: Vec2, nrm: Vec2): Vec2 => ({
    x: p.x + nrm.x * distance,
    y: p.y + nrm.y * distance,
  });

  const out: Vec2[] = [];
  const normals: Vec2[] = [];
  for (let s = 0; s < segCount; s++) normals.push(normalOf(pts[s], pts[(s + 1) % n]));

  const join = (vertex: Vec2, nPrev: Vec2, nNext: Vec2) => {
    const a0 = Math.atan2(nPrev.y, nPrev.x);
    const a1 = Math.atan2(nNext.y, nNext.x);
    let delta = a1 - a0;
    while (delta > Math.PI) delta -= TAU;
    while (delta < -Math.PI) delta += TAU;
    const steps = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 12)));
    for (let s = 1; s < steps; s++) {
      const ang = a0 + (delta * s) / steps;
      out.push({ x: vertex.x + Math.cos(ang) * Math.abs(distance), y: vertex.y + Math.sin(ang) * Math.abs(distance) });
    }
  };

  out.push(offsetPoint(pts[0], normals[0]));
  for (let s = 0; s < segCount; s++) {
    const endIndex = (s + 1) % n;
    out.push(offsetPoint(pts[endIndex], normals[s]));
    const nextSeg = s + 1;
    if (nextSeg < segCount) join(pts[endIndex], normals[s], normals[nextSeg]);
  }
  if (isClosed) join(pts[0], normals[segCount - 1], normals[0]);
  return out;
}

/**
 * Turn a stroke into a fillable outline. Closed contours become a ring (an
 * outer offset and an inner offset wound the other way); open contours become a
 * ribbon with round caps. The result can be painted with `clip-path` alone, so
 * a stroked icon needs no SVG element and animates like any other layer.
 */
export function strokePath(path: VectorPath, width: number, cap: "round" | "butt" = "round"): VectorPath {
  const w = Math.max(0.5, width);
  const half = w / 2;
  const subpaths: SubPath[] = [];
  for (const sp of path.subpaths) {
    const poly = flattenPath(makePath(sp), 0.4)[0];
    if (!poly || poly.length < 2) continue;
    if (sp.closed) {
      const outer = offsetPolyline(poly, half, true);
      const inner = offsetPolyline(poly, -half, true);
      subpaths.push(closed(outer.map((p) => point(p.x, p.y))));
      subpaths.push(closed(inner.reverse().map((p) => point(p.x, p.y))));
    } else {
      const left = offsetPolyline(poly, half, false);
      const right = offsetPolyline(poly, -half, false);
      const ribbon: Vec2[] = [...left];
      if (cap === "round") {
        const end = poly[poly.length - 1];
        const a0 = Math.atan2(left[left.length - 1].y - end.y, left[left.length - 1].x - end.x);
        const a1 = Math.atan2(right[right.length - 1].y - end.y, right[right.length - 1].x - end.x);
        let delta = a1 - a0;
        while (delta > Math.PI) delta -= TAU;
        while (delta < -Math.PI) delta += TAU;
        const steps = Math.max(2, Math.ceil(Math.abs(delta) / (Math.PI / 8)));
        for (let s = 1; s < steps; s++) {
          const ang = a0 + (delta * s) / steps;
          ribbon.push({ x: end.x + Math.cos(ang) * half, y: end.y + Math.sin(ang) * half });
        }
      }
      ribbon.push(...[...right].reverse());
      if (cap === "round") {
        const start = poly[0];
        const a0 = Math.atan2(right[0].y - start.y, right[0].x - start.x);
        const a1 = Math.atan2(left[0].y - start.y, left[0].x - start.x);
        let delta = a1 - a0;
        while (delta > Math.PI) delta -= TAU;
        while (delta < -Math.PI) delta += TAU;
        const steps = Math.max(2, Math.ceil(Math.abs(delta) / (Math.PI / 8)));
        for (let s = 1; s < steps; s++) {
          const ang = a0 + (delta * s) / steps;
          ribbon.push({ x: start.x + Math.cos(ang) * half, y: start.y + Math.sin(ang) * half });
        }
      }
      subpaths.push(closed(ribbon.map((p) => point(p.x, p.y))));
    }
  }
  return { subpaths };
}

/* --------------------------------------------------------------- SVG I/O --- */

/** Serialise a path to SVG path data (`d`). */
export function toPathData(path: VectorPath): string {
  const parts: string[] = [];
  for (const sp of path.subpaths) {
    const anchors = sp.anchors;
    if (!anchors.length) continue;
    parts.push(`M${round(anchors[0].x)} ${round(anchors[0].y)}`);
    const count = sp.closed ? anchors.length : anchors.length - 1;
    for (let i = 0; i < count; i++) {
      const a = anchors[i];
      const b = anchors[(i + 1) % anchors.length];
      if (a.out || b.in) {
        parts.push(
          `C${round(a.x + (a.out?.x ?? 0))} ${round(a.y + (a.out?.y ?? 0))} ${round(b.x + (b.in?.x ?? 0))} ${round(
            b.y + (b.in?.y ?? 0),
          )} ${round(b.x)} ${round(b.y)}`,
        );
      } else {
        parts.push(`L${round(b.x)} ${round(b.y)}`);
      }
    }
    if (sp.closed) parts.push("Z");
  }
  return parts.join(" ");
}

/** The CSS `clip-path` value that paints a path as a filled region. */
export function pathToClip(path: VectorPath): string {
  return `path("${toPathData(path)}")`;
}

/**
 * Parse SVG path data into a {@link VectorPath}. Supports M/L/H/V/C/S/Q/T/Z and
 * elliptical arcs (A), which are converted to cubics. This is what lets an
 * agent paste the `d` of an icon from anywhere and have it placed correctly.
 */
export function parseSvgPath(d: string): VectorPath {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  if (!tokens) return { subpaths: [] };

  const subpaths: SubPath[] = [];
  let anchors: Anchor[] = [];
  let closedFlag = false;
  let cur: Vec2 = { x: 0, y: 0 };
  let start: Vec2 = { x: 0, y: 0 };
  let lastCubicCtrl: Vec2 | null = null;
  let lastQuadCtrl: Vec2 | null = null;
  let i = 0;
  let cmd = "";

  const flush = () => {
    if (anchors.length) subpaths.push({ anchors, closed: closedFlag });
    anchors = [];
    closedFlag = false;
  };
  const push = (p: Vec2, inH?: Vec2, outH?: Vec2) => {
    anchors.push(point(p.x, p.y, { in: inH, out: outH }));
  };
  const num = (): number => Number(tokens[i++]);
  const isNum = (t: string | undefined): boolean => t != null && /^[-.\d]/.test(t);

  while (i < tokens.length) {
    const t = tokens[i];
    if (/[a-zA-Z]/.test(t)) {
      cmd = t;
      i++;
    } else if (cmd === "M") {
      cmd = "L";
    } else if (cmd === "m") {
      cmd = "l";
    }
    const rel = cmd === cmd.toLowerCase();
    const bx = rel ? cur.x : 0;
    const by = rel ? cur.y : 0;

    switch (cmd.toUpperCase()) {
      case "M": {
        flush();
        const p = { x: bx + num(), y: by + num() };
        cur = p;
        start = p;
        push(p);
        lastCubicCtrl = null;
        lastQuadCtrl = null;
        break;
      }
      case "L": {
        const p = { x: bx + num(), y: by + num() };
        push(p);
        cur = p;
        lastCubicCtrl = null;
        lastQuadCtrl = null;
        break;
      }
      case "H": {
        const p = { x: (rel ? cur.x : 0) + num(), y: cur.y };
        push(p);
        cur = p;
        lastCubicCtrl = null;
        lastQuadCtrl = null;
        break;
      }
      case "V": {
        const p = { x: cur.x, y: (rel ? cur.y : 0) + num() };
        push(p);
        cur = p;
        lastCubicCtrl = null;
        lastQuadCtrl = null;
        break;
      }
      case "C": {
        const c1 = { x: bx + num(), y: by + num() };
        const c2 = { x: bx + num(), y: by + num() };
        const p = { x: bx + num(), y: by + num() };
        if (anchors.length) {
          const prev = anchors[anchors.length - 1];
          prev.out = { x: c1.x - prev.x, y: c1.y - prev.y };
        }
        push(p, { x: c2.x - p.x, y: c2.y - p.y });
        cur = p;
        lastCubicCtrl = c2;
        lastQuadCtrl = null;
        break;
      }
      case "S": {
        const c2 = { x: bx + num(), y: by + num() };
        const p = { x: bx + num(), y: by + num() };
        const c1 = lastCubicCtrl ? { x: 2 * cur.x - lastCubicCtrl.x, y: 2 * cur.y - lastCubicCtrl.y } : cur;
        if (anchors.length) {
          const prev = anchors[anchors.length - 1];
          prev.out = { x: c1.x - prev.x, y: c1.y - prev.y };
        }
        push(p, { x: c2.x - p.x, y: c2.y - p.y });
        cur = p;
        lastCubicCtrl = c2;
        lastQuadCtrl = null;
        break;
      }
      case "Q": {
        const c = { x: bx + num(), y: by + num() };
        const p = { x: bx + num(), y: by + num() };
        // Elevate the quadratic to a cubic.
        const c1 = { x: cur.x + (2 / 3) * (c.x - cur.x), y: cur.y + (2 / 3) * (c.y - cur.y) };
        const c2 = { x: p.x + (2 / 3) * (c.x - p.x), y: p.y + (2 / 3) * (c.y - p.y) };
        if (anchors.length) {
          const prev = anchors[anchors.length - 1];
          prev.out = { x: c1.x - prev.x, y: c1.y - prev.y };
        }
        push(p, { x: c2.x - p.x, y: c2.y - p.y });
        cur = p;
        lastQuadCtrl = c;
        lastCubicCtrl = c2;
        break;
      }
      case "T": {
        const p = { x: bx + num(), y: by + num() };
        const c: Vec2 = lastQuadCtrl ? { x: 2 * cur.x - lastQuadCtrl.x, y: 2 * cur.y - lastQuadCtrl.y } : cur;
        const c1 = { x: cur.x + (2 / 3) * (c.x - cur.x), y: cur.y + (2 / 3) * (c.y - cur.y) };
        const c2 = { x: p.x + (2 / 3) * (c.x - p.x), y: p.y + (2 / 3) * (c.y - p.y) };
        if (anchors.length) {
          const prev = anchors[anchors.length - 1];
          prev.out = { x: c1.x - prev.x, y: c1.y - prev.y };
        }
        push(p, { x: c2.x - p.x, y: c2.y - p.y });
        cur = p;
        lastQuadCtrl = c;
        lastCubicCtrl = c2;
        break;
      }
      case "A": {
        const rx = num();
        const ry = num();
        const rot = num();
        const large = num() !== 0;
        const sweep = num() !== 0;
        const p = { x: bx + num(), y: by + num() };
        const segs = arcToCubics(cur, rx, ry, rot, large, sweep, p);
        if (segs.length) {
          if (anchors.length) {
            const prev = anchors[anchors.length - 1];
            prev.out = { x: segs[0].c1.x - prev.x, y: segs[0].c1.y - prev.y };
          }
          for (let s = 0; s < segs.length; s++) {
            const seg = segs[s];
            push(seg.end, { x: seg.c2.x - seg.end.x, y: seg.c2.y - seg.end.y });
          }
        } else {
          push(p);
        }
        cur = p;
        lastCubicCtrl = null;
        lastQuadCtrl = null;
        break;
      }
      case "Z": {
        closedFlag = true;
        // A closed path's final handle is the first anchor's `in`; the wrap
        // segment is emitted by toPathData, so nothing else to do here.
        flush();
        cur = start;
        lastCubicCtrl = null;
        lastQuadCtrl = null;
        break;
      }
      default:
        i++;
        break;
    }
    if (cmd.toUpperCase() === "Z") continue;
  }
  flush();
  return { subpaths };
}

interface CubicSeg {
  c1: Vec2;
  c2: Vec2;
  end: Vec2;
}

/** Convert an SVG elliptical arc into cubic Bézier segments. */
function arcToCubics(
  from: Vec2,
  rxIn: number,
  ryIn: number,
  rotDeg: number,
  large: boolean,
  sweep: boolean,
  to: Vec2,
): CubicSeg[] {
  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);
  if (rx === 0 || ry === 0 || (from.x === to.x && from.y === to.y)) return [];
  const phi = rad(rotDeg);
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const dx = (from.x - to.x) / 2;
  const dy = (from.y - to.y) / 2;
  const x1p = cosPhi * dx + sinPhi * dy;
  const y1p = -sinPhi * dx + cosPhi * dy;
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    const s = Math.sqrt(lambda);
    rx *= s;
    ry *= s;
  }
  const sign = large === sweep ? -1 : 1;
  const num = Math.max(0, rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p);
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const co = sign * Math.sqrt(den === 0 ? 0 : num / den);
  const cxp = (co * rx * y1p) / ry;
  const cyp = (-co * ry * x1p) / rx;
  const cx = cosPhi * cxp - sinPhi * cyp + (from.x + to.x) / 2;
  const cy = sinPhi * cxp + cosPhi * cyp + (from.y + to.y) / 2;

  const angle = (ux: number, uy: number, vx: number, vy: number): number => {
    const dot = ux * vx + uy * vy;
    const len = Math.hypot(ux, uy) * Math.hypot(vx, vy);
    let a = Math.acos(Math.max(-1, Math.min(1, dot / (len || 1))));
    if (ux * vy - uy * vx < 0) a = -a;
    return a;
  };
  const theta1 = angle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let delta = angle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!sweep && delta > 0) delta -= TAU;
  if (sweep && delta < 0) delta += TAU;

  const steps = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)));
  const step = delta / steps;
  const alpha = (4 / 3) * Math.tan(step / 4);
  const segs: CubicSeg[] = [];
  let th = theta1;
  const at = (t: number): Vec2 => {
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);
    return { x: cx + rx * cosT * cosPhi - ry * sinT * sinPhi, y: cy + rx * cosT * sinPhi + ry * sinT * cosPhi };
  };
  const deriv = (t: number): Vec2 => {
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);
    return { x: -rx * sinT * cosPhi - ry * cosT * sinPhi, y: -rx * sinT * sinPhi + ry * cosT * cosPhi };
  };
  for (let s = 0; s < steps; s++) {
    const p0 = at(th);
    const p3 = at(th + step);
    const d0 = deriv(th);
    const d3 = deriv(th + step);
    segs.push({
      c1: { x: p0.x + alpha * d0.x, y: p0.y + alpha * d0.y },
      c2: { x: p3.x - alpha * d3.x, y: p3.y - alpha * d3.y },
      end: p3,
    });
    th += step;
  }
  return segs;
}

/* --------------------------------------------------------------- helpers --- */

/** True when a path has any drawable geometry. */
export function isEmpty(path: VectorPath): boolean {
  return !path.subpaths.some((sp) => sp.anchors.length > 0);
}

/** A rough area estimate, used to reject degenerate shapes. */
export function pathArea(path: VectorPath): number {
  let total = 0;
  for (const contour of flattenPath(path)) {
    let a = 0;
    for (let i = 0; i < contour.length; i++) {
      const p = contour[i];
      const q = contour[(i + 1) % contour.length];
      a += p.x * q.y - q.x * p.y;
    }
    total += Math.abs(a / 2);
  }
  return total;
}
