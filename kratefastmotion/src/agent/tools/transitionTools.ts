// Transition tool executor.
//
// `apply_transition` is how an agent makes a film cut between its beats instead
// of dissolving into one long slide. A transition needs to know where the scene
// boundaries are — a wipe is anchored on a cut, it covers the outgoing scene and
// reveals the incoming one — so this is a separate tool from `apply_effect`,
// which is a whole-timeline finish.
//
// The transition layers are percentage-sized full-bleed overlays on purpose, so
// the layout engine reads them as a seam rather than content: they never appear
// in an overlap audit and nothing has to dodge them.

import type { ToolName } from "@kratefastmotion/shared";
import {
  TRANSITION_DIRECTIONS,
  TRANSITION_KINDS,
  TRANSITION_PURPOSE,
  buildTransition,
  describeTransition,
  transitionSequence,
  type TransitionDirection,
  type TransitionKind,
} from "../../motion/filmTransitions.js";
import { getProject } from "../../db/repositories/projects.js";
import { deleteComponent, listComponents } from "../../db/repositories/components.js";
import { createId } from "../../utils/id.js";
import { persistLayers } from "./persistLayers.js";
import { projectLook } from "./projectLook.js";
import type { ToolContext, ToolResult } from "./registry.js";

type Executor = (args: Record<string, unknown>, ctx: ToolContext) => ToolResult | Promise<ToolResult>;

function ok(summary: string, specChanged = true, data?: unknown): ToolResult {
  return { ok: true, summary, specChanged, data };
}
function fail(summary: string): ToolResult {
  return { ok: false, summary, specChanged: false };
}

interface Boundary {
  sceneId: string;
  name: string;
  /** Absolute start time of the scene — which is also the cut before it. */
  startMs: number;
}

/** Cumulative start time of every scene. Scenes are sequential, so cut times add up. */
function sceneBoundaries(projectId: string): Boundary[] {
  const project = getProject(projectId);
  if (!project) return [];
  let t = 0;
  const out: Boundary[] = [];
  for (const s of project.scenes) {
    out.push({ sceneId: s.id, name: s.name, startMs: t });
    t += s.durationMs ?? 0;
  }
  return out;
}

export const transitionExecutors: Partial<Record<ToolName, Executor>> = {
  apply_transition: (args, ctx) => {
    const boundaries = sceneBoundaries(ctx.projectId);
    if (boundaries.length < 2) {
      return fail(
        `this project has ${boundaries.length} scene(s) — a transition needs at least two scenes to cut between. Call generate_film or add_scene first.`,
      );
    }

    // The first boundary is the opening scene; a transition only makes sense
    // before the scenes that follow it.
    const cuts = boundaries.slice(1).map((b, i) => ({ ...b, index: i + 1 }));

    const raw = typeof args.transition === "string" ? args.transition : undefined;
    if (raw !== undefined && !TRANSITION_KINDS.includes(raw as TransitionKind)) {
      return fail(
        `unknown transition "${raw}". Choose one of: ${TRANSITION_KINDS.join(", ")}. ` +
          TRANSITION_KINDS.map((k) => `${k}: ${TRANSITION_PURPOSE[k]}`).join(" "),
      );
    }

    const rawDir = typeof args.direction === "string" ? args.direction : undefined;
    if (rawDir !== undefined && !TRANSITION_DIRECTIONS.includes(rawDir as TransitionDirection)) {
      return fail(`unknown direction "${rawDir}". Choose one of: ${TRANSITION_DIRECTIONS.join(", ")}.`);
    }
    const direction = rawDir as TransitionDirection | undefined;

    const sceneId = typeof args.sceneId === "string" ? args.sceneId : undefined;
    if (sceneId && !boundaries.some((b) => b.sceneId === sceneId)) {
      return fail(
        `unknown scene "${sceneId}". Scenes: ${boundaries.map((b) => `${b.name} (${b.sceneId})`).join(", ")}.`,
      );
    }

    const every = args.every != null ? Math.max(1, Math.round(Number(args.every))) : 1;
    const { palette, amp, style, motion } = projectLook(
      ctx.projectId,
      typeof args.accent === "string" ? args.accent : undefined,
    );
    const durationMs =
      args.durationMs != null
        ? Math.max(160, Math.round(Number(args.durationMs)))
        : motion === "kinetic"
          ? 440
          : motion === "calm"
            ? 660
            : 540;
    const intensity = args.intensity != null ? Math.min(1, Math.max(0, Number(args.intensity))) : undefined;
    const replace = args.replace !== false;
    const prefix = typeof args.name === "string" && args.name.trim() ? args.name.trim() : undefined;

    const targets = cuts
      .filter((cut) => (sceneId ? cut.sceneId === sceneId : true))
      .filter((_, i) => i % every === 0);

    if (!targets.length) return fail("no scene boundaries matched — nothing to do.");

    // A per-style rotation, so consecutive cuts differ instead of repeating.
    const kinds = transitionSequence(style, motion, targets.length);

    // Replace: drop transitions already sitting on the target boundaries. Only
    // layers this tool made carry the marker, so a director-placed cut is left
    // alone unless it is explicitly re-targeted.
    let removed = 0;
    if (replace) {
      const wanted = new Set(targets.map((t) => String(t.index)));
      for (const c of listComponents(ctx.projectId)) {
        if (!c.style || c.style._transition === undefined) continue;
        if (wanted.has(String(c.style._cut)) && deleteComponent(ctx.projectId, c.id)) removed++;
      }
    }

    const created: string[] = [];
    const placed: { index: number; kind: TransitionKind; direction: TransitionDirection; atMs: number; layers: number }[] = [];

    targets.forEach((cut, i) => {
      const kind = (raw as TransitionKind | undefined) ?? kinds[i];
      const dir: TransitionDirection = direction ?? (cut.index % 2 === 0 ? "right" : "left");
      const layers = buildTransition({
        kind,
        palette,
        amp,
        cutMs: cut.startMs,
        durationMs,
        direction: dir,
        intensity,
        // Each cut is its own composition; a unique group keeps two cuts from
        // being treated as one graphic.
        group: createId("tr_"),
      });
      for (const layer of layers) {
        layer.style._transition = kind;
        layer.style._cut = String(cut.index);
        if (prefix) layer.name = `${prefix} · ${layer.name}`;
      }
      created.push(...persistLayers(ctx.projectId, null, layers));
      placed.push({ index: cut.index, kind, direction: dir, atMs: Math.round(cut.startMs), layers: layers.length });
    });

    const detail = placed.map((p) => `${describeTransition(p.kind, p.direction, durationMs)} at ${p.atMs}ms`).join("; ");

    return ok(
      `placed ${placed.length} transition(s) across ${cuts.length} cut(s) — ${detail}. ${created.length} layer(s)` +
        `${removed ? `, replaced ${removed} existing transition layer(s)` : ""}. ` +
        `Each transition covers the frame on the cut and clears either side, so the incoming scene is revealed as the panel leaves. Full-bleed, so check_layout stays clean.`,
      true,
      {
        transitions: placed,
        componentIds: created,
        replaced: removed,
        durationMs,
        sceneCount: boundaries.length,
      },
    );
  },
};
