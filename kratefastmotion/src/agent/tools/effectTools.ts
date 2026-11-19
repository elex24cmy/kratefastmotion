// Effect (look) tool executor.
//
// `apply_effect` is how an agent adds a graded, cinematic finish to a film
// without touching a pixel: it names an effect — film grain, a colour grade, a
// glow, a light sweep, scanlines, letterboxing, chromatic fringing, glitch, a
// light leak or a flash — and the effect kit draws it as full-bleed CSS.
//
// The effect layers are percentage-sized on purpose, so the layout engine reads
// them as a finish rather than content: they sit above everything, never appear
// in an overlap audit, and nothing has to dodge them.

import type { ToolName } from "@kratefastmotion/shared";
import {
  DEFAULT_EFFECT_INTENSITY,
  EFFECT_CATEGORIES,
  EFFECT_CATEGORY,
  EFFECT_KINDS,
  EFFECT_PURPOSE,
  GRADE_TONES,
  buildEffect,
  describeEffect,
  type EffectCategory,
  type EffectKind,
  type GradeTone,
} from "../../motion/filmEffects.js";
import { getProject } from "../../db/repositories/projects.js";
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

/** The film's runtime, so a static look spans the whole timeline. */
function projectTotalMs(projectId: string): number {
  const project = getProject(projectId);
  if (!project) return 30000;
  const given = Number(project.globalTiming?.totalDurationMs);
  if (Number.isFinite(given) && given > 0) return Math.round(given);
  const sum = project.scenes.reduce((n, s) => n + (s.durationMs ?? 0), 0);
  return sum > 0 ? Math.round(sum) : 30000;
}

export const effectExecutors: Partial<Record<ToolName, Executor>> = {
  apply_effect: (args, ctx) => {
    const kind = String(args.effect ?? "") as EffectKind;
    if (!EFFECT_KINDS.includes(kind)) {
      return fail(
        `unknown effect "${args.effect}". Choose one of: ${EFFECT_KINDS.join(", ")}. ` +
          EFFECT_KINDS.map((k) => `${k}: ${EFFECT_PURPOSE[k]}`).join(" "),
      );
    }

    const rawTone = typeof args.tone === "string" ? args.tone : undefined;
    if (rawTone !== undefined && !GRADE_TONES.includes(rawTone as GradeTone)) {
      return fail(`unknown grade tone "${rawTone}". Choose one of: ${GRADE_TONES.join(", ")}.`);
    }
    const tone = rawTone as GradeTone | undefined;

    const { palette, amp } = projectLook(ctx.projectId, typeof args.accent === "string" ? args.accent : undefined);
    const total = projectTotalMs(ctx.projectId);
    const durationMs = args.durationMs != null ? Math.max(400, Math.round(Number(args.durationMs))) : total;
    const delayMs = args.delayMs != null ? Math.max(0, Math.round(Number(args.delayMs))) : 0;
    const intensity = args.intensity != null ? Math.min(1, Math.max(0, Number(args.intensity))) : undefined;
    const zIndex = args.zIndex != null ? Math.round(Number(args.zIndex)) : undefined;

    const layers = buildEffect({
      kind,
      palette,
      amp,
      durationMs,
      delayMs,
      intensity,
      tone,
      zIndex,
      // Each call is its own finish; a unique group keeps two effects from being
      // treated as one composition.
      group: createId("fx_"),
    });

    if (typeof args.name === "string" && args.name.trim()) {
      const prefix = args.name.trim();
      for (const layer of layers) layer.name = `${prefix} · ${layer.name}`;
    }

    const ids = persistLayers(ctx.projectId, null, layers);

    return ok(
      `applied ${kind} — ${describeEffect(kind, intensity, tone)}. ${layers.length} layer(s): ${layers
        .map((l) => l.name)
        .join(", ")}. Full-bleed finish: it sits above the content and needs no clearance, so check_layout stays clean.`,
      true,
      {
        effect: kind,
        intensity: intensity ?? null,
        tone: tone ?? null,
        fullBleed: true,
        componentIds: ids,
        layerNames: layers.map((l) => l.name),
      },
    );
  },

  list_effects: (args) => {
    const rawCategory = typeof args.category === "string" ? args.category : "all";
    const query = typeof args.query === "string" ? args.query.trim().toLowerCase() : "";

    const entries = EFFECT_KINDS.filter((k) => {
      if (rawCategory !== "all" && EFFECT_CATEGORY[k] !== rawCategory) return false;
      if (!query) return true;
      return k.includes(query) || EFFECT_PURPOSE[k].toLowerCase().includes(query) || EFFECT_CATEGORY[k].includes(query);
    }).map((k) => ({
      effect: k,
      category: EFFECT_CATEGORY[k],
      purpose: EFFECT_PURPOSE[k],
      defaultIntensity: DEFAULT_EFFECT_INTENSITY[k],
    }));

    if (!entries.length) {
      return fail(
        `no effects match category "${rawCategory}"${query ? ` and query "${query}"` : ""}. Categories: ${EFFECT_CATEGORIES.join(", ")}. There are ${EFFECT_KINDS.length} effects in total.`,
      );
    }

    const byCategory = EFFECT_CATEGORIES.filter((c) => rawCategory === "all" || c === rawCategory)
      .map((c) => {
        const list = entries.filter((e) => e.category === c);
        return `${c} (${list.length}): ${list.map((e) => e.effect).join(", ")}`;
      })
      .join("\n");

    return ok(
      `${entries.length} effect(s)${rawCategory === "all" ? "" : ` in ${rawCategory}`}${query ? ` matching "${query}"` : ""}:\n${byCategory}`,
      false,
      { total: EFFECT_KINDS.length, categories: EFFECT_CATEGORIES, effects: entries },
    );
  },
};
