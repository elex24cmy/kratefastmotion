// Graphics + layout tool executors.
//
// `compose_graphic` is how any agent — not just the film director — draws a
// designed graphic. The important part is that the agent says *what* it wants
// and *roughly where* ("a bar chart, bottom-right"), and the layout engine
// decides the exact pixel box so the graphic cannot land on top of existing
// content. `check_layout` closes the loop: it audits the composition and hands
// back the collisions and out-of-bounds layers, so a model can self-correct
// without ever seeing a pixel.

import type { MotionComponent, ToolName } from "@kratefastmotion/shared";
import {
  GRAPHIC_KINDS,
  GRAPHIC_PURPOSE,
  buildGraphic,
  type GraphicKind,
  type GraphicLayer,
  type GraphicPalette,
} from "../../motion/filmGraphics.js";
import {
  ANCHORS,
  type Anchor,
  type Box,
  type GroupedBox,
  type NamedBox,
  type Size,
  auditLayout,
  clearOf,
  describeBox,
  freeSpace,
  groupAllows,
  place,
  safeArea,
  styleToBox,
} from "../../motion/layout.js";
import { PALETTES, type FilmMotion, type FilmStyle } from "../../motion/filmDirector.js";
import { createComponent, listComponents } from "../../db/repositories/components.js";
import { getProject } from "../../db/repositories/projects.js";
import { createId, now } from "../../utils/id.js";
import type { ToolContext, ToolResult } from "./registry.js";

type Executor = (args: Record<string, unknown>, ctx: ToolContext) => ToolResult | Promise<ToolResult>;

function ok(summary: string, specChanged = true, data?: unknown): ToolResult {
  return { ok: true, summary, specChanged, data };
}
function fail(summary: string): ToolResult {
  return { ok: false, summary, specChanged: false };
}

/** A sensible footprint per graphic kind, so the agent only has to name the kind. */
const DEFAULT_SIZE: Record<GraphicKind, Size> = {
  card: { w: 560, h: 420 },
  chip: { w: 300, h: 56 },
  ring: { w: 220, h: 220 },
  bracket: { w: 1728, h: 888 },
  connector: { w: 620, h: 40 },
  progress: { w: 640, h: 16 },
  bars: { w: 560, h: 220 },
  dots: { w: 280, h: 180 },
  chevrons: { w: 240, h: 90 },
  divider: { w: 560, h: 26 },
  iconTile: { w: 160, h: 160 },
  area: { w: 560, h: 240 },
};

/** How much of a kind's box sits *outside* the box it was given. A progress
 *  value sits above the track and an icon-tile caption sits below the tile, so
 *  placement has to reserve room for them or the audit fails on a graphic the
 *  agent asked for correctly. */
function overflow(kind: GraphicKind, size: Size, hasValue: boolean, hasLabel: boolean): { above: number; below: number } {
  if (kind === "progress" && hasValue) {
    const labelH = Math.max(30, size.h * 1.9);
    return { above: Math.max(34, size.h * 2.2), below: 0 };
  }
  if (kind === "iconTile" && hasLabel) {
    const tile = Math.min(size.w, size.h);
    return { above: 0, below: tile + 18 + Math.max(28, tile * 0.34) - size.h };
  }
  return { above: 0, below: 0 };
}

const ANCHOR_SET = new Set<string>(ANCHORS);

/** Anchors tried, in order, when the agent asks for "auto". Centred first, then
 *  the corners — the order a designer would actually try. */
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

/** Every measurable layer box in the project, optionally limited to one scene. */
function occupiedBoxes(projectId: string, sceneId?: string): NamedBox[] {
  const boxes: NamedBox[] = [];
  for (const c of listComponents(projectId)) {
    if (sceneId && c.sceneId !== sceneId) continue;
    const box = styleToBox(c.style);
    if (!box || box.w <= 0 || box.h <= 0) continue;
    boxes.push({ name: c.name, ...box });
  }
  return boxes;
}

/** Where a scene starts on the project timeline, so a graphic added to a scene
 *  animates inside that scene's beat rather than at t=0. */
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

/** Palette + beat amplitude for the project, inherited from the film director
 *  when the project is a film, so an added graphic sits in the same world. */
function projectLook(projectId: string, accent?: string): { palette: GraphicPalette; amp: number } {
  const tokens = getProject(projectId)?.tokens ?? {};
  const style = String(tokens.__filmStyle ?? "default") as FilmStyle;
  const motion = String(tokens.__filmMotion ?? "balanced") as FilmMotion;
  const palette = PALETTES[style] ?? PALETTES.default;
  const amp = motion === "kinetic" ? 3 : motion === "calm" ? 0.55 : 1;
  return { palette: accent ? { ...palette, accent } : palette, amp };
}

/** Turn one graphic's layers into persisted components. */
function persist(
  projectId: string,
  sceneId: string | null,
  layers: GraphicLayer[],
  timeOffset: number,
): string[] {
  const all = listComponents(projectId);
  let order = all.reduce((max, c) => Math.max(max, c.orderIndex), -1) + 1;
  const ts = now();
  const ids: string[] = [];

  for (const layer of layers) {
    const id = createId("c_");
    const style: Record<string, string | number> = { ...layer.style, position: "absolute" };
    if (layer.group) style._group = layer.group;
    const component: MotionComponent = {
      id,
      projectId,
      templateId: null,
      name: layer.name,
      selector: null,
      sceneId,
      orderIndex: order++,
      easing: layer.easing ?? { type: "preset", name: "ease-out" },
      // A layer's own lifetime never goes below 400ms: the kit subtracts a tail
      // from the scene length, and a very short scene would otherwise produce a
      // sub-frame animation that reads as a flicker.
      durationMs: Math.max(400, Math.round(layer.durationMs)),
      delayMs: Math.max(0, Math.round(timeOffset + layer.delayMs)),
      iterationCount: layer.iterationCount ?? 1,
      direction: layer.direction ?? "normal",
      fillMode: "both",
      playState: "running",
      trigger: "onLoad",
      keyframes: layer.keyframes,
      style,
      parentId: null,
      createdAt: ts,
      updatedAt: ts,
    };
    createComponent(component);
    ids.push(id);
  }
  return ids;
}

export const graphicExecutors: Partial<Record<ToolName, Executor>> = {
  compose_graphic: (args, ctx) => {
    const kind = String(args.kind) as GraphicKind;
    if (!GRAPHIC_KINDS.includes(kind)) {
      return fail(`unknown graphic kind "${args.kind}". Choose one of: ${GRAPHIC_KINDS.join(", ")}. ${GRAPHIC_KINDS.map((k) => `${k}: ${GRAPHIC_PURPOSE[k]}`).join(" ")}`);
    }

    const requested = String(args.placement ?? "auto");
    const sceneId = typeof args.sceneId === "string" && args.sceneId ? args.sceneId : null;
    if (sceneId && !sceneStart(ctx.projectId, sceneId)) {
      return fail(`scene ${sceneId} not found in this project. Use list_scenes to get a valid sceneId, or omit it for a standalone graphic.`);
    }

    const defaults = DEFAULT_SIZE[kind];
    const base: Size = {
      w: Math.max(24, Math.round(Number(args.width) || defaults.w)),
      h: Math.max(8, Math.round(Number(args.height) || defaults.h)),
    };
    const value = args.value != null ? String(args.value) : undefined;
    const label = args.label != null ? String(args.label) : undefined;
    const hasValue = Boolean(value);
    const hasLabel = Boolean(label);

    const area = safeArea();
    const occupied = occupiedBoxes(ctx.projectId, sceneId ?? undefined);
    const avoid = args.avoidOverlap !== false;
    const firstChoice: Anchor =
      requested === "auto" || !ANCHOR_SET.has(requested) ? (avoid ? AUTO_ORDER[0] : "center") : (requested as Anchor);
    const prefer =
      requested === "auto" || !ANCHOR_SET.has(requested)
        ? AUTO_ORDER
        : [requested as Anchor, ...AUTO_ORDER.filter((a) => a !== requested)];

    const baseOver = overflow(kind, base, hasValue, hasLabel);
    const baseFootprint: Size = { w: base.w, h: base.h + baseOver.above + baseOver.below };
    const preferred = place(firstChoice, baseFootprint, { area });

    /**
     * Place the graphic at one scale. A graphic that renders parts outside its
     * own box — a progress value above the track, an icon-tile caption below —
     * is placed against its true footprint, then the box is translated back so
     * the extra parts still land inside the reserved room.
     */
    const attempt = (scale: number) => {
      const size: Size = { w: Math.max(24, Math.round(base.w * scale)), h: Math.max(8, Math.round(base.h * scale)) };
      const over = overflow(kind, size, hasValue, hasLabel);
      const footprint: Size = { w: size.w, h: size.h + over.above + over.below };
      const spot = avoid
        ? freeSpace(footprint, occupied, { area, prefer, gap: 36 })
        : place(firstChoice, footprint, { area });
      const box: Box = { x: spot.x, y: spot.y + over.above, w: size.w, h: size.h };
      return { scale, size, footprint, spot, box, clear: occupied.every((o) => clearOf(box, o, 0)) };
    };

    // Ask for the requested size first. If the stage is too full for it, step
    // down rather than park the graphic on top of someone else's label — a
    // slightly smaller chart beats an unreadable collision.
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
    const { box, footprint, spot, scale } = chosen;

    const { palette, amp } = projectLook(ctx.projectId, typeof args.accent === "string" ? args.accent : undefined);
    const scene = sceneId ? sceneStart(ctx.projectId, sceneId) : null;
    const sceneDurationMs = scene?.durationMs && scene.durationMs > 0
      ? scene.durationMs
      : Math.max(1200, Math.round(Number(args.durationMs) || 1600));
    const timeOffset = scene?.start ?? 0;

    const layers = buildGraphic({
      kind,
      box,
      palette,
      amp,
      sceneDurationMs,
      // Every call is its own composition, so two identical graphics dropped on
      // the same spot are a real collision — not one group that "allows" it.
      group: createId("g_"),
      label,
      value,
      tone: (args.tone as "accent" | "neutral" | "muted" | undefined) ?? "accent",
      delayMs: args.delayMs != null ? Math.max(0, Math.round(Number(args.delayMs))) : 0,
      amount: args.amount != null ? Number(args.amount) : undefined,
      count: args.count != null ? Math.round(Number(args.count)) : undefined,
    });

    if (typeof args.name === "string" && args.name.trim()) {
      const prefix = args.name.trim();
      for (const layer of layers) layer.name = `${prefix} · ${layer.name}`;
    }

    const ids = persist(ctx.projectId, sceneId, layers, timeOffset);

    // Report what actually happened: the resolved box, whether the engine had to
    // shift or shrink it, and how much (if any) content it still covers — enough
    // for a model to reason about the result without ever seeing a pixel.
    const moved =
      scale < 1 || Math.round(spot.x) !== Math.round(preferred.x) || Math.round(spot.y) !== Math.round(preferred.y);
    // Measure coverage over the true footprint, not just the box: a progress
    // value sits above its track, and it has to be clear too.
    const covered = occupied.reduce((sum, o) => {
      const w = Math.min(spot.x + footprint.w, o.x + o.w) - Math.max(spot.x, o.x);
      const h = Math.min(spot.y + footprint.h, o.y + o.h) - Math.max(spot.y, o.y);
      return sum + (w > 0 && h > 0 ? w * h : 0);
    }, 0);
    const how = `${requested === "auto" ? "auto" : requested}${moved ? " → moved" : ""}${scale < 1 ? `, scaled to ${Math.round(scale * 100)}% to fit` : ""}`;
    const overlapNote =
      covered > 0
        ? ` WARNING: the stage was too full — this spot still covers ${Math.round(covered)}px² of existing content; call check_layout and move or resize.`
        : "";
    return ok(
      `drew ${kind} at ${describeBox(box)} (${how}) — ${layers.length} layer(s): ${layers.map((l) => l.name).join(", ")}.${overlapNote}`,
      true,
      {
        kind,
        placement: requested,
        moved,
        scale,
        coveredArea: Math.round(covered),
        box: { x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.w), h: Math.round(box.h) },
        componentIds: ids,
        layerNames: layers.map((l) => l.name),
        sceneId,
      },
    );
  },

  check_layout: (args, ctx) => {
    const filterScene = typeof args.sceneId === "string" && args.sceneId ? args.sceneId : undefined;
    const pad = args.pad != null ? Math.max(0, Number(args.pad)) : 0;
    const project = getProject(ctx.projectId);
    if (!project) return fail(`project ${ctx.projectId} not found`);

    const groups = new Map<string, GroupedBox[]>();
    const unmeasured: string[] = [];
    for (const c of listComponents(ctx.projectId)) {
      if (filterScene && c.sceneId !== filterScene) continue;
      const box = styleToBox(c.style);
      if (!box || box.w <= 0 || box.h <= 0) {
        unmeasured.push(c.name);
        continue;
      }
      const group = typeof c.style._group === "string" ? c.style._group : undefined;
      const key = c.sceneId ?? "__global__";
      const list = groups.get(key) ?? [];
      list.push({ name: c.name, group, ...box });
      groups.set(key, list);
    }

    const sceneName = (id: string) =>
      project.scenes.find((s) => s.id === id)?.name ?? (id === "__global__" ? "Unscened" : id);

    const reports = [...groups.entries()].map(([key, boxes]) => ({
      sceneId: key === "__global__" ? null : key,
      scene: sceneName(key),
      audit: auditLayout(boxes, { allow: groupAllows, pad }),
    }));

    const failing = reports.filter((r) => !r.audit.ok);
    const okAll = failing.length === 0;
    const checked = reports.reduce((n, r) => n + r.audit.boxes, 0);

    const detail = reports
      .map((r) => {
        const issues: string[] = [];
        for (const o of r.audit.overlaps) {
          issues.push(`overlap ${o.a} / ${o.b} (${o.area}px² at ${describeBox(o.box)})`);
        }
        for (const o of r.audit.outOfBounds) {
          issues.push(`${o.name} outside the safe area on the ${o.edges.join("+")} edge (${describeBox(o.box)})`);
        }
        return `${r.scene}: ${r.audit.ok ? "clean" : issues.join("; ")}`;
      })
      .join(" | ");

    const summary = okAll
      ? `layout clean — ${checked} layer(s) across ${reports.length} group(s), no overlaps, everything inside the safe area`
      : `layout has ${failing.length} problem group(s) — ${detail}`;

    return ok(summary, false, {
      ok: okAll,
      checked,
      pad,
      unmeasured: unmeasured.length,
      groups: reports.map((r) => ({
        sceneId: r.sceneId,
        scene: r.scene,
        ok: r.audit.ok,
        boxes: r.audit.boxes,
        overlaps: r.audit.overlaps,
        outOfBounds: r.audit.outOfBounds,
      })),
    });
  },
};
