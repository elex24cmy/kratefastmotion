// Caption tool executors.
//
// These are the two pieces the talking-head genre lives on: the spoken words
// rendered as large centre-frame captions, and single words punched up for
// emphasis. Both take a transcript — SRT, VTT or plain prose — and both hand
// back `GraphicLayer`s from the shared caption engine, so a caption added by an
// agent previews, edits and exports exactly like one the orchestrator composed.
//
// There is no speech-to-text here on purpose: the configured provider exposes no
// ASR endpoint and the offline recogniser returns noise. The caller supplies the
// words.

import type { ToolName } from "@kratefastmotion/shared";
import { getProject } from "../../db/repositories/projects.js";
import {
  buildCaptions,
  buildKeywordPops,
  cuesFromPlainText,
  paginate,
  parseTranscript,
  pickKeywords,
  placeKeywordPops,
  type KeywordHit,
  type TranscriptCue,
} from "../../motion/filmCaptions.js";
import { obstacleBoxes, shiftClear } from "./obstacles.js";
import { persistLayers } from "./persistLayers.js";
import { projectLook } from "./projectLook.js";
import { projectStage } from "./projectStage.js";
import type { ToolContext, ToolResult } from "./registry.js";

type Executor = (args: Record<string, unknown>, ctx: ToolContext) => ToolResult | Promise<ToolResult>;

function ok(summary: string, specChanged = true, data?: unknown): ToolResult {
  return { ok: true, summary, specChanged, data };
}
function fail(summary: string): ToolResult {
  return { ok: false, summary, specChanged: false };
}

function num(value: unknown): number | undefined {
  if (value == null) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

interface TranscriptInput {
  cues: TranscriptCue[];
  timed: boolean;
  /** End of the last cue, or null when there is nothing timed. */
  lastEndMs: number | null;
}

/**
 * Read the transcript and resolve the window it covers. Timed input (SRT/VTT)
 * paces itself; plain prose is spread across the requested window, falling back
 * to the project's total duration and then to a speaking-rate estimate.
 */
function readTranscript(projectId: string, args: Record<string, unknown>): TranscriptInput {
  const raw = String(args.transcript ?? "").trim();
  if (!raw) return { cues: [], timed: false, lastEndMs: null };

  const parsed = parseTranscript(raw);
  if (parsed.timed) {
    return {
      cues: parsed.cues,
      timed: true,
      lastEndMs: parsed.cues.length ? parsed.cues[parsed.cues.length - 1].endMs : null,
    };
  }

  const project = getProject(projectId);
  const projectTotal = num(project?.globalTiming?.totalDurationMs) ?? 0;
  const startMs = num(args.startMs) ?? 0;
  const endMs =
    num(args.endMs) ??
    num(args.totalDurationMs) ??
    (projectTotal > startMs ? projectTotal : 0) ??
    0;

  // No known window: pace the words at a speaking rate so the caller still gets
  // a usable timing instead of everything stacked at t=0.
  const words = raw.split(/\s+/).filter(Boolean).length;
  const span = endMs > startMs ? endMs : Math.max(4000, Math.round((words / 165) * 60_000));
  const cues = cuesFromPlainText(raw, { startMs, endMs: startMs + span });
  return { cues, timed: false, lastEndMs: cues.length ? cues[cues.length - 1].endMs : null };
}

/** Page options derived from the stage, so a caption never wraps. */
function pageOptions(args: Record<string, unknown>, areaWidth: number, stageWidth: number) {
  return {
    wordsPerPage: Math.max(1, Math.min(8, Math.round(num(args.wordsPerPage) ?? 3))),
    maxChars: Math.max(10, Math.round((areaWidth / (stageWidth * 0.082)) * 12)),
  };
}

/**
 * The caption engine already spaces the punches inside one call, so the only
 * thing left to fix is a punch landing on one added by an earlier call. The set
 * moves as one composition: nudging a single punch would break its spacing from
 * its siblings and land it 20 ms from the word next to it. `shiftClear` steps
 * the whole set past whatever is already on the stage.
 */

export const captionExecutors: Partial<Record<ToolName, Executor>> = {
  add_captions: (args, ctx) => {
    const transcript = readTranscript(ctx.projectId, args);
    if (!transcript.cues.length) {
      return fail("no transcript to caption — pass `transcript` as SRT, VTT or plain text (there is no speech-to-text here, so the words must be supplied)");
    }

    const stage = projectStage(ctx.projectId);
    const { palette, amp } = projectLook(ctx.projectId, typeof args.accent === "string" ? args.accent : undefined);
    const sceneId = typeof args.sceneId === "string" && args.sceneId ? args.sceneId : null;

    const pages = paginate(transcript.cues, pageOptions(args, stage.width * 0.9, stage.width));
    const layers = buildCaptions(pages, {
      stage,
      bandY: num(args.bandY) ?? 0.7,
      fontSize: num(args.fontSize),
      palette,
      amp,
      zIndex: num(args.zIndex) ?? 40,
      scrim: args.scrim !== false,
    });

    const ids = persistLayers(ctx.projectId, sceneId, layers, 0);
    const scrims = layers.filter((l) => l.name.startsWith("Caption Scrim")).length;

    return ok(
      `added ${pages.length} caption page(s) as ${layers.length} layer(s)${scrims ? ` (${scrims} with a scrim band)` : ""} on a ${stage.width}x${stage.height} stage — ${transcript.timed ? "timed from SRT/VTT" : "paced from plain text"}. Call check_layout to confirm the captions do not collide with anything.`,
      true,
      {
        pages: pages.length,
        layers: layers.length,
        timed: transcript.timed,
        firstMs: pages[0].startMs,
        lastMs: pages[pages.length - 1].endMs,
        componentIds: ids,
      },
    );
  },

  add_keyword_pop: (args, ctx) => {
    const transcript = readTranscript(ctx.projectId, args);
    const requestedWords = Array.isArray(args.words) ? args.words.map((w) => String(w)) : null;

    let hits: KeywordHit[];
    if (requestedWords?.length) {
      const wanted = new Set(requestedWords.map((w) => w.toLowerCase()));
      hits = [];
      for (const cue of transcript.cues) {
        for (const raw of cue.text.split(/\s+/)) {
          const word = raw.replace(/^[^\w$%]+|[^\w$%]+$/g, "");
          if (!wanted.has(word.toLowerCase())) continue;
          if (hits.some((h) => h.word.toLowerCase() === word.toLowerCase())) continue;
          hits.push({ word, startMs: cue.startMs, endMs: cue.endMs, score: 1 });
        }
      }
      if (!hits.length) {
        return fail(`none of ${requestedWords.join(", ")} appear in the transcript — check the spelling, or omit \`words\` to auto-pick the punchiest ones`);
      }
    } else {
      if (!transcript.cues.length) {
        return fail("nothing to pick keywords from — pass `transcript`, or pass `words` explicitly");
      }
      const count = Math.max(1, Math.min(16, Math.round(num(args.count) ?? 6)));
      hits = pickKeywords(transcript.cues, count);
      if (!hits.length) {
        return fail("the transcript has no words long enough to punch up — pass `words` explicitly to choose them");
      }
    }

    const stage = projectStage(ctx.projectId);
    const pages = paginate(transcript.cues, pageOptions(args, stage.width * 0.9, stage.width));
    const sceneId = typeof args.sceneId === "string" && args.sceneId ? args.sceneId : null;
    const { palette, amp } = projectLook(ctx.projectId, typeof args.accent === "string" ? args.accent : undefined);

    // The caption engine decides when each punch lands, so a punch added by hand
    // lands where the composed edit would have put it.
    const contentEnd = Math.max(
      transcript.lastEndMs ?? 0,
      pages.length ? pages[pages.length - 1].endMs : 0,
    ) + 1500;
    const placed = placeKeywordPops(hits, pages, { endMs: contentEnd });

    const obstacles = obstacleBoxes(ctx.projectId, sceneId);
    const moved = hits
      .filter((hit) => {
        const page = pages.find((p) => hit.startMs >= p.startMs && hit.startMs < p.endMs);
        return page != null;
      })
      .map((hit) => hit.word);

    const built = buildKeywordPops(placed, {
      stage,
      bandY: num(args.bandY) ?? 0.34,
      fontSize: num(args.fontSize),
      palette,
      amp,
      zIndex: num(args.zIndex) ?? 60,
    });
    // Move the whole set of punches as one composition so they keep their
    // spacing from each other while stepping clear of punches already placed.
    const { layers, shiftedMs } = shiftClear(built, obstacles, 780);

    const ids = persistLayers(ctx.projectId, sceneId, layers, 0);
    const shiftNote = shiftedMs ? ` (moved ${Math.round(shiftedMs)}ms later to clear existing punches)` : "";
    return ok(
      `punched up ${placed.length} word(s): ${placed.map((h) => h.word).join(", ")}${moved.length ? ` (moved ${moved.join(", ")} past their caption so they do not overlap)` : ""}${shiftNote}`,
      true,
      {
        words: placed.map((h) => h.word),
        layers: layers.length,
        movedPastCaption: moved,
        shiftedMs,
        componentIds: ids,
      },
    );
  },
};
