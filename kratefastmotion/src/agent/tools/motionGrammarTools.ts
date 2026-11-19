// Motion grammar tool executor.
//
// `list_motions` hands the agent the measured motion vocabulary: how long a move
// should run, how siblings stagger, how much to overshoot and why. It is the
// distilled "how to make motions" from a frame-by-frame measurement of 4,288
// distinct moves across 53 professional motion moments (motionmaxxing by Tejas
// Makwana, Apache-2.0) — the same numbers the film director itself now builds
// with, exposed so an agent hand-authoring keyframes can match the director.
//
// The tool is read-only: it never touches the spec, so it is safe to call before
// any composition work.

import type { ToolName } from "@kratefastmotion/shared";
import {
  MEASURED_EASE_FRAMES,
  MEASURED_EASE_SHAPE,
  MEASURED_EASE_USE,
  MEASURED_EASES,
} from "@kratefastmotion/shared";
import {
  FILM_BEATS,
  MOTION_RULES,
  PROPERTY_FRAMES,
  ROLE_TIMING,
  type FilmBeat,
} from "../../motion/motionGrammar.js";
import type { ToolContext, ToolResult } from "./registry.js";

type Executor = (args: Record<string, unknown>, ctx: ToolContext) => ToolResult | Promise<ToolResult>;

function ok(summary: string, data?: unknown): ToolResult {
  return { ok: true, summary, specChanged: false, data };
}
function fail(summary: string): ToolResult {
  return { ok: false, summary, specChanged: false };
}

export const motionGrammarExecutors: Partial<Record<ToolName, Executor>> = {
  list_motions: (args) => {
    const rawRole = typeof args.role === "string" ? args.role : "all";
    const query = typeof args.query === "string" ? args.query.trim().toLowerCase() : "";
    const roles: readonly FilmBeat[] =
      rawRole === "all" ? FILM_BEATS : FILM_BEATS.filter((r) => r === rawRole);
    if (!roles.length) {
      return fail(`unknown role "${rawRole}". Roles: ${FILM_BEATS.join(", ")}.`);
    }

    const rules = MOTION_RULES.filter(
      (r) => r.roles === "all" || r.roles.some((x) => roles.includes(x)),
    ).filter((r) => {
      if (!query) return true;
      return (
        r.id.toLowerCase().includes(query) ||
        r.when.toLowerCase().includes(query) ||
        r.do.toLowerCase().includes(query) ||
        r.because.toLowerCase().includes(query) ||
        r.evidence.toLowerCase().includes(query)
      );
    });

    const eases = MEASURED_EASES.map((name) => ({
      ease: name,
      frames: MEASURED_EASE_FRAMES[name],
      shape: MEASURED_EASE_SHAPE[name],
      use: MEASURED_EASE_USE[name],
    }));

    if (!rules.length) {
      return fail(
        `no motion rules match role "${rawRole}"${query ? ` and query "${query}"` : ""}. There are ${MOTION_RULES.length} rules across ${FILM_BEATS.length} roles.`,
      );
    }

    const summary = [
      `Measured motion grammar — ${rules.length} rule(s), ${eases.length} measured eases (30 fps).`,
      `Durations by property (frames): ${Object.entries(PROPERTY_FRAMES)
        .map(([k, v]) => `${k} ${v}`)
        .join(", ")}.`,
      `Per role — ${roles
        .map(
          (r) =>
            `${r}: entry ${ROLE_TIMING[r].entry} f, exit ${ROLE_TIMING[r].exit} f, opacity ${ROLE_TIMING[r].opacityIn}/${ROLE_TIMING[r].opacityOut} f, blur ${ROLE_TIMING[r].blurIn}/${ROLE_TIMING[r].blurOut} f, stagger ${ROLE_TIMING[r].stagger} f`,
        )
        .join("; ")}.`,
      `Eases: ${eases.map((e) => `${e.ease} (${e.frames} f)`).join(", ")}.`,
      rules.map((r) => `${r.id} ${r.when} → ${r.do} — because ${r.because} [${r.evidence}]`).join("\n"),
    ].join("\n");

    return ok(summary, {
      roles,
      rules,
      eases,
      propertyFrames: PROPERTY_FRAMES,
      roleTiming: roles.map((r) => ({ role: r, ...ROLE_TIMING[r] })),
    });
  },
};
