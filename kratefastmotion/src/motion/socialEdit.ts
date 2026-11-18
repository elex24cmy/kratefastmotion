/**
 * Social edit — "talking head, cut to a rhythm".
 *
 * This is the composition the reference clip is built on, expressed as data:
 * one piece of base footage held full-bleed, a transcript rendered as large
 * captions that pop on the beat, single words punched up for emphasis, b-roll
 * cutaways that break the shot every few seconds, colour cards that punctuate
 * the longest pauses, and an end card that asks for a comment. The framing
 * jumps between two zooms (a digital punch-in) so a single clip reads as a
 * multi-shot edit.
 *
 * Everything is deterministic and computed from the transcript and the stage
 * size — no LLM, no hand-tuned percentages. Full-bleed layers (base footage,
 * cutaways, colour cards, scrims) are marked `_background`, so the layout audit
 * lets captions sit on top of them while still catching a caption that lands on
 * a keyword pop. Layers that only share a scene but never share a moment are
 * compared by their time windows, not their coordinates.
 *
 * The individual pieces — `baseFootageLayer`, `cutawayLayers`, `beatCardLayers`,
 * `ctaCardLayers` — are exported as pure `GraphicLayer` builders so the
 * per-tool executors (`add_cutaway`, `add_beat_card`, `add_cta_card`) produce
 * exactly the same visuals as the orchestrator instead of a second, drifting
 * copy.
 *
 * Speech-to-text is deliberately absent: the configured provider exposes no ASR
 * endpoint and the offline recogniser is unusable. The transcript is supplied.
 */
import type { Keyframe } from "@kratefastmotion/shared";
import { createId } from "../utils/id.js";
import { draft, type ComponentDraft } from "./templates/helper.js";
import { boxToStyle, contentMargin, fitFontSize, stageArea, stackColumn, textHeight } from "./layout.js";
import {
  buildCaptions,
  buildKeywordPops,
  cuesFromPlainText,
  paginate,
  parseTranscript,
  pickKeywords,
  placeKeywordPops,
  type CaptionPage,
  type KeywordHit,
  type TranscriptCue,
} from "./filmCaptions.js";
import type { GraphicLayer, GraphicPalette } from "./filmGraphics.js";
import { EASE_BACK, EASE_IN, EASE_IN_OUT, EASE_OUT, FONT_STACK, MONO_STACK } from "./filmBase.js";
import {
  detectMotion,
  motionScale,
  PALETTES,
  type FilmMotion,
  type FilmPlan,
  type FilmScene,
  type FilmStyle,
} from "./filmDirector.js";

export interface SocialEditStage {
  width: number;
  height: number;
}

export interface SocialEditMedia {
  /** Served URL, already resolved from an asset id by the caller. */
  src: string;
  name?: string;
  kind?: "image" | "video";
  /** In-point into the source, in seconds. */
  inSeconds?: number;
  muted?: boolean;
  volume?: number;
}

export interface SocialEditOptions {
  /** Design stage. Defaults to 1080x1350, the 4:5 social frame. */
  stage?: SocialEditStage;
  title?: string;
  brand?: string;
  style?: FilmStyle;
  motion?: FilmMotion;
  /** Words used to infer style/motion when they are not given. */
  prompt?: string;
  /** The base footage the edit is cut from. */
  video?: SocialEditMedia;
  /** B-roll dropped in on a rhythm. Cycled if there are fewer than slots. */
  cutaways?: SocialEditMedia[];
  /** Music bed mixed under everything. */
  music?: SocialEditMedia;
  /** Transcript: SRT, VTT, or plain prose. */
  transcript?: string;
  /** Window untimed prose covers. Defaults to the whole content span. */
  transcriptStartMs?: number;
  transcriptEndMs?: number;
  /** Total runtime in ms. Derived from the transcript when omitted. */
  totalDurationMs?: number;
  /** Words shown together per caption page. 1 gives a word-by-word look. */
  wordsPerPage?: number;
  /** How many emphasis words to punch up, or the words themselves. */
  keywords?: number | string[];
  /** Colour cards to insert in the longest pauses. */
  beatCards?: number;
  /** End-card call to action. */
  cta?: string;
  /** The word the viewer is asked to comment. */
  keyword?: string;
  /** How often a cutaway lands, in ms. */
  cutawayEveryMs?: number;
  /** How long each cutaway holds, in ms. */
  cutawayDurationMs?: number;
  /** How often the framing punches in, in ms. */
  punchMs?: number;
  /** Set false to compose without captions. */
  captions?: boolean;
}

export interface SocialEditResult extends FilmPlan {
  /** The caption band, in stage pixels — useful for reporting. */
  captionBand: { y: number; height: number };
}

export const DEFAULT_SOCIAL_STAGE: SocialEditStage = { width: 1080, height: 1350 };

/** Smallest pause between spoken phrases that a colour card can fill. */
const MIN_CARD_GAP_MS = 900;
/**
 * Shortest pause a card may fill when the caller asked for cards explicitly.
 * An explicit request is a deliberate choice, so a tighter pause is honoured
 * rather than silently ignored — the card just runs a little past the pause.
 */
const MIN_GAP_EXPLICIT_MS = 180;
/** Minimum spacing between two keyword punches, so they never stack. */
const POP_SPACING_MS = 800;
/** How long a punch is actually on screen, including its lead-in. */
const POP_LIFETIME_MS = 740;
/** Words per minute assumed when pacing untimed prose. */
const DEFAULT_WPM = 165;

export function socialMargin(stage: SocialEditStage): number {
  return contentMargin(stage.width, stage.height);
}

function fullBleed(stage: SocialEditStage, extra: Record<string, string | number> = {}): Record<string, string | number> {
  return {
    position: "absolute",
    left: 0,
    top: 0,
    width: stage.width,
    height: stage.height,
    ...extra,
  };
}

function textStyle(size: number, weight: number, extra: Record<string, string | number> = {}): Record<string, string | number> {
  return {
    fontFamily: FONT_STACK,
    fontSize: size,
    fontWeight: weight,
    lineHeight: 1.08,
    letterSpacing: "-0.02em",
    color: "#ffffff",
    margin: 0,
    ...extra,
  };
}

/* --------------------------------------------------------- layer builders ---- */

/**
 * The base footage, held full-bleed with a digital punch-in.
 *
 * The framing hard-cuts between two zooms at each beat. A hard cut is two
 * keyframes at (almost) the same offset — the animation steps between them
 * instead of interpolating — which is exactly the jump-cut zoom the genre uses,
 * and it needs only one <video>, so the export seeks one clip per frame.
 */
export function baseFootageLayer(
  stage: SocialEditStage,
  media: SocialEditMedia,
  totalMs: number,
  punchMs: number,
  amp: number,
): GraphicLayer {
  const steps = Math.max(1, Math.round(totalMs / Math.max(1200, punchMs)));
  const keyframes: Keyframe[] = [];
  for (let i = 0; i < steps; i += 1) {
    const from = i / steps;
    const to = (i + 1) / steps;
    const zoom = i % 2 === 0 ? 1 : 1 + 0.09 * Math.min(3, Math.max(0.55, amp));
    keyframes.push({ offset: from, properties: { scale: zoom } as Keyframe["properties"], easing: EASE_IN_OUT });
    const hold = i === steps - 1 ? 1 : to - 0.0006;
    keyframes.push({
      offset: hold,
      properties: { scale: zoom + 0.02 * amp } as Keyframe["properties"],
      easing: EASE_IN_OUT,
    });
  }

  return {
    name: "Base Footage",
    delayMs: 0,
    durationMs: totalMs,
    keyframes,
    style: {
      ...fullBleed(stage),
      _tag: "video",
      _src: media.src,
      _muted: media.muted === true ? "1" : "0",
      _loop: "0",
      _start: media.inSeconds ?? 0,
      _volume: media.volume ?? 1,
      _background: "1",
      objectFit: "cover",
      objectPosition: "center 32%",
      transformOrigin: "center 40%",
      filter: "saturate(1.04) contrast(1.03)",
      zIndex: "0",
    },
  };
}

/** A cutaway is full-bleed b-roll: the voice carries on, the picture cuts. */
export function cutawayLayers(
  stage: SocialEditStage,
  media: SocialEditMedia,
  atMs: number,
  durationMs: number,
  index = 0,
): GraphicLayer[] {
  const isVideo = (media.kind ?? "video") === "video";
  return [
    {
      name: `Cutaway ${index + 1}`,
      delayMs: atMs,
      durationMs,
      keyframes: [
        { offset: 0, properties: { opacity: 0, scale: 1.08 } as Keyframe["properties"], easing: EASE_OUT },
        { offset: 0.09, properties: { opacity: 1, scale: 1.06 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.86, properties: { opacity: 1, scale: 1 } as Keyframe["properties"], easing: EASE_IN },
        { offset: 1, properties: { opacity: 0, scale: 1 } as Keyframe["properties"] },
      ],
      style: {
        ...fullBleed(stage),
        _tag: isVideo ? "video" : "img",
        _src: media.src,
        _muted: "1",
        _loop: "0",
        _start: media.inSeconds ?? 0,
        _background: "1",
        objectFit: "cover",
        objectPosition: "center center",
        zIndex: "2",
      },
    },
  ];
}

/** A colour card is a full-frame backdrop, so captions may sit on top of it. */
export function beatCardLayers(
  stage: SocialEditStage,
  palette: GraphicPalette,
  atMs: number,
  durationMs: number,
  kicker: string,
  phrase: string,
  opts: { group?: string; band?: { top: number; bottom: number } } = {},
): GraphicLayer[] {
  const area = stageArea(stage.width, stage.height, socialMargin(stage));
  const group = opts.group ?? "beat-card";
  const layers: GraphicLayer[] = [];

  layers.push({
    name: "Beat Card",
    delayMs: atMs,
    durationMs,
    group,
    keyframes: [
      { offset: 0, properties: { opacity: 0 } as Keyframe["properties"], easing: EASE_OUT },
      { offset: 0.06, properties: { opacity: 1 } as Keyframe["properties"], easing: EASE_IN },
      { offset: 0.92, properties: { opacity: 1 } as Keyframe["properties"], easing: EASE_IN },
      { offset: 1, properties: { opacity: 0 } as Keyframe["properties"] },
    ],
    style: fullBleed(stage, {
      background: `linear-gradient(140deg, ${palette.accent} 0%, ${palette.accent2} 100%)`,
      _background: "1",
      zIndex: "3",
    }),
  });

  // The kicker and the phrase are one composition, so they are measured and
  // stacked rather than pinned to their own fraction of the stage height. A
  // fixed pair reads cleanly at one aspect ratio and collides at the next — the
  // phrase grows into the kicker as soon as the stage gets shorter.
  const gap = Math.round(stage.width * 0.03);
  const kickerSize = Math.round(stage.width * 0.032);
  const kickerH = textHeight(kickerSize, 1);
  const band = opts.band ?? {
    top: area.y + Math.round(area.h * 0.06),
    bottom: area.y + Math.round(area.h * 0.56),
  };
  const phraseLines = 2;
  const roomForPhrase = Math.max(48, band.bottom - band.top - kickerH - gap);
  const ceiling = Math.min(Math.round(stage.width * 0.1), Math.floor(roomForPhrase / (phraseLines * 1.1)));
  const phraseSize = fitFontSize(phrase.length, area.w * 0.94, {
    min: Math.min(Math.round(stage.width * 0.04), ceiling),
    max: ceiling,
  });
  const phraseH = textHeight(phraseSize, phraseLines, 1.1);
  const [kickerY, phraseY] = stackColumn([kickerH, phraseH], {
    centreY: (band.top + band.bottom) / 2,
    gap,
    band,
  });

  layers.push({
    name: "Beat Card Kicker",
    delayMs: atMs + 90,
    durationMs: Math.max(300, durationMs - 180),
    group,
    keyframes: [
      { offset: 0, properties: { opacity: 0, translateY: 12 } as Keyframe["properties"], easing: EASE_OUT },
      { offset: 0.18, properties: { opacity: 0.9, translateY: 0 } as Keyframe["properties"], easing: EASE_IN },
      { offset: 0.9, properties: { opacity: 0.9 } as Keyframe["properties"], easing: EASE_IN },
      { offset: 1, properties: { opacity: 0 } as Keyframe["properties"] },
    ],
    style: {
      ...boxToStyle({ x: area.x, y: kickerY, w: area.w, h: kickerH }),
      ...textStyle(kickerSize, 700, {
        textAlign: "center",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: "rgba(0,0,0,0.62)",
      }),
      zIndex: "4",
      _content: kicker,
    },
  });

  layers.push({
    name: "Beat Card Phrase",
    delayMs: atMs + 60,
    durationMs: Math.max(300, durationMs - 120),
    group,
    keyframes: [
      { offset: 0, properties: { opacity: 0, translateY: 34, scale: 0.96 } as Keyframe["properties"], easing: EASE_OUT },
      { offset: 0.16, properties: { opacity: 1, translateY: 0, scale: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
      { offset: 0.86, properties: { opacity: 1, translateY: -8, scale: 1.01 } as Keyframe["properties"], easing: EASE_IN },
      { offset: 1, properties: { opacity: 0, translateY: -22, scale: 1.02 } as Keyframe["properties"] },
    ],
    style: {
      ...boxToStyle({ x: area.x, y: phraseY, w: area.w, h: phraseH }),
      ...textStyle(phraseSize, 900, { textAlign: "center", color: "#0b0b12", whiteSpace: "pre-wrap" }),
      zIndex: "4",
      _content: phrase,
    },
  });

  return layers;
}

/** The end card: a comment prompt, on a card, with the keyword in a chip. */
export function ctaCardLayers(
  stage: SocialEditStage,
  palette: GraphicPalette,
  atMs: number,
  durationMs: number,
  cta: string,
  keyword: string,
  brand: string,
): GraphicLayer[] {
  const area = stageArea(stage.width, stage.height, socialMargin(stage));
  const group = "end-card";
  const layers: GraphicLayer[] = [];

  layers.push({
    name: "End Card",
    delayMs: atMs,
    durationMs,
    group,
    keyframes: [
      { offset: 0, properties: { opacity: 0 } as Keyframe["properties"], easing: EASE_OUT },
      { offset: 0.05, properties: { opacity: 1 } as Keyframe["properties"], easing: EASE_IN },
      { offset: 1, properties: { opacity: 1 } as Keyframe["properties"] },
    ],
    style: fullBleed(stage, {
      background: `radial-gradient(120% 90% at 50% 0%, ${palette.accent2} 0%, ${palette.bgFrom} 62%, #05060b 100%)`,
      _background: "1",
      zIndex: "3",
    }),
  });

  // Kicker, chip and footer are stacked as one composition: the chip is a fixed
  // fraction of the stage width, so pinning the footer to a separate fraction of
  // the height puts it inside the chip as soon as the stage is wide.
  const gap = Math.round(stage.width * 0.05);
  const kickerSize = Math.round(stage.width * 0.03);
  const kickerH = textHeight(kickerSize, 1);
  const chipW = Math.min(
    area.w,
    Math.round(keyword.length * stage.width * 0.098 * 0.62) + Math.round(stage.width * 0.14),
  );
  const chipH = Math.round(stage.width * 0.15);
  const footSize = Math.round(stage.width * 0.032);
  const footH = textHeight(footSize, 1);
  const [kickerY, chipY, footY] = stackColumn([kickerH, chipH, footH], {
    centreY: stage.height / 2,
    gap,
    band: { top: area.y, bottom: area.y + area.h },
  });

  layers.push({
    name: "End Card Kicker",
    delayMs: atMs + 140,
    durationMs: Math.max(300, durationMs - 140),
    group,
    keyframes: [
      { offset: 0, properties: { opacity: 0, translateY: 14 } as Keyframe["properties"], easing: EASE_OUT },
      { offset: 0.2, properties: { opacity: 0.92, translateY: 0 } as Keyframe["properties"], easing: EASE_IN },
      { offset: 1, properties: { opacity: 0.92, translateY: 0 } as Keyframe["properties"] },
    ],
    style: {
      ...boxToStyle({ x: area.x, y: kickerY, w: area.w, h: kickerH }),
      ...textStyle(kickerSize, 700, {
        textAlign: "center",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: palette.subtext,
      }),
      zIndex: "4",
      _content: cta,
    },
  });

  // The keyword sits in a chip, the way a comment prompt is usually framed.
  layers.push({
    name: "End Card Chip",
    delayMs: atMs + 240,
    durationMs: Math.max(300, durationMs - 240),
    group,
    keyframes: [
      { offset: 0, properties: { opacity: 0, scale: 0.8 } as Keyframe["properties"], easing: EASE_BACK },
      { offset: 0.3, properties: { opacity: 1, scale: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
      { offset: 0.92, properties: { opacity: 1, scale: 1 } as Keyframe["properties"], easing: EASE_IN },
      { offset: 1, properties: { opacity: 1, scale: 1.02 } as Keyframe["properties"] },
    ],
    style: {
      ...boxToStyle({
        x: Math.round(stage.width / 2 - chipW / 2),
        y: chipY,
        w: chipW,
        h: chipH,
      }),
      background: palette.accent,
      borderRadius: "26px",
      boxShadow: `0 24px 70px ${palette.accent}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...textStyle(Math.round(stage.width * 0.085), 900, { color: "#0b0b12", letterSpacing: "-0.02em" }),
      zIndex: "5",
      _content: keyword,
    },
  });

  layers.push({
    name: "End Card Footer",
    delayMs: atMs + 360,
    durationMs: Math.max(300, durationMs - 360),
    group,
    keyframes: [
      { offset: 0, properties: { opacity: 0, translateY: 12 } as Keyframe["properties"], easing: EASE_OUT },
      { offset: 0.24, properties: { opacity: 1, translateY: 0 } as Keyframe["properties"], easing: EASE_IN },
      { offset: 1, properties: { opacity: 1, translateY: 0 } as Keyframe["properties"] },
    ],
    style: {
      ...boxToStyle({ x: area.x, y: footY, w: area.w, h: footH }),
      ...textStyle(footSize, 600, { textAlign: "center", color: palette.text }),
      fontFamily: MONO_STACK,
      zIndex: "4",
      _content: brand,
    },
  });

  return layers;
}

/** Backdrop + scrim: what the edit sits on when there is no base footage. */
export function backdropLayers(
  stage: SocialEditStage,
  palette: GraphicPalette,
  totalMs: number,
  amp: number,
): GraphicLayer[] {
  return [
    {
      name: "Backdrop",
      delayMs: 0,
      durationMs: totalMs,
      keyframes: [
        { offset: 0, properties: { scale: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 1, properties: { scale: 1 + 0.04 * amp } as Keyframe["properties"] },
      ],
      style: fullBleed(stage, {
        background: `radial-gradient(120% 100% at 50% 0%, ${palette.bgTo} 0%, ${palette.bgFrom} 70%)`,
        _background: "1",
        zIndex: "0",
      }),
    },
    {
      name: "Footage Scrim",
      delayMs: 0,
      durationMs: totalMs,
      keyframes: [],
      style: fullBleed(stage, {
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.55) 100%)",
        _background: "1",
        zIndex: "1",
      }),
    },
  ];
}

/* ------------------------------------------------------------- timeline ---- */

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function estimateFromWords(text: string): number {
  return Math.round((wordCount(text) / DEFAULT_WPM) * 60_000);
}

function clampCues(cues: TranscriptCue[], endMs: number): TranscriptCue[] {
  return cues
    .filter((c) => c.startMs < endMs)
    .map((c) => ({ ...c, endMs: Math.min(c.endMs, endMs) }));
}

/**
 * The pauses between spoken phrases — where a colour card can land without
 * covering a caption. Returned longest-first, because the longest pause is the
 * most natural place to cut away.
 */
export function findGaps(
  pages: CaptionPage[],
  startMs: number,
  endMs: number,
  minGapMs = MIN_CARD_GAP_MS,
): Array<{ start: number; end: number }> {
  const gaps: Array<{ start: number; end: number }> = [];
  let cursor = startMs;
  for (const page of pages) {
    if (page.startMs - cursor >= minGapMs) gaps.push({ start: cursor, end: page.startMs });
    cursor = Math.max(cursor, page.endMs);
  }
  if (endMs - cursor >= minGapMs) gaps.push({ start: cursor, end: endMs });
  return gaps.sort((a, b) => b.end - b.start - (a.end - a.start));
}

/* --------------------------------------------------------------- build ---- */

interface LayerCtx {
  idx: number;
  sceneFor: (ms: number) => string;
}

function fromGraphic(ctx: LayerCtx, layer: GraphicLayer): ComponentDraft {
  const d = draft(layer.name, {
    sceneId: ctx.sceneFor(layer.delayMs),
    durationMs: Math.max(200, Math.round(layer.durationMs)),
    delayMs: Math.max(0, Math.round(layer.delayMs)),
    easing: layer.easing ?? EASE_OUT,
    keyframes: layer.keyframes,
    style: {
      position: "absolute",
      ...layer.style,
      ...(layer.group ? { _group: layer.group } : {}),
    },
    iterationCount: layer.iterationCount ?? 1,
    direction: layer.direction ?? "normal",
    fillMode: "both",
  });
  d.orderIndex = ctx.idx++;
  return d;
}

/** Compose the edit. Pure: it returns a plan, and the caller persists it. */
export function buildSocialEdit(opts: SocialEditOptions): SocialEditResult {
  const stage = opts.stage ?? DEFAULT_SOCIAL_STAGE;
  const area = stageArea(stage.width, stage.height, socialMargin(stage));
  const style = opts.style ?? "tech";
  const palette = PALETTES[style];
  const prompt = opts.prompt ?? opts.transcript ?? "";
  const motion = opts.motion ?? detectMotion(prompt, style);
  const amp = motionScale(motion);
  const title = opts.title ?? "Social Edit";
  const brand = opts.brand ?? "KrateFastMotion";
  const cta = opts.cta ?? "Comment below";
  const keyword = (opts.keyword ?? "YES").toUpperCase();

  /* -- transcript -------------------------------------------------------- */

  const parsed = opts.transcript ? parseTranscript(opts.transcript) : { cues: [], timed: false };

  // The end card owns the tail, so nothing else is scheduled into it.
  const provisional =
    opts.totalDurationMs ??
    (parsed.cues.length ? parsed.cues[parsed.cues.length - 1].endMs + 1400 : undefined) ??
    (opts.transcript ? estimateFromWords(opts.transcript) + 2200 : 15000);
  const ctaMs = Math.min(4200, Math.max(2600, Math.round(provisional * 0.15)));
  const total = Math.max(6000, provisional);
  const contentEnd = Math.max(3000, total - ctaMs);

  const cues: TranscriptCue[] = parsed.timed
    ? clampCues(parsed.cues, contentEnd)
    : opts.transcript
      ? clampCues(
          cuesFromPlainText(opts.transcript, {
            startMs: opts.transcriptStartMs ?? 400,
            endMs: opts.transcriptEndMs ?? contentEnd,
          }),
          contentEnd,
        )
      : [];

  const pages = paginate(cues, {
    wordsPerPage: opts.wordsPerPage ?? 3,
    // Longer lines need more of the frame; shorter lines read punchier.
    maxChars: Math.round((area.w / (stage.width * 0.082)) * 12),
  });

  /* -- scenes ------------------------------------------------------------ */

  const sceneCount = Math.max(1, Math.min(14, Math.round(total / 4200)));
  const sceneMs = total / sceneCount;
  const scenes: FilmScene[] = Array.from({ length: sceneCount }, (_, i) => ({
    id: createId("s_"),
    name: sceneCount === 1 ? "Edit" : i === 0 ? "Cold open" : i === sceneCount - 1 ? "Close" : `Beat ${i + 1}`,
    kind: i === 0 ? "title" : i === sceneCount - 1 ? "outro" : "statement",
    durationMs: Math.round(sceneMs),
  }));
  const sceneFor = (ms: number): string =>
    scenes[Math.max(0, Math.min(sceneCount - 1, Math.floor(ms / sceneMs)))].id;

  const ctx: LayerCtx = { idx: 0, sceneFor };
  const drafts: ComponentDraft[] = [];

  /* -- base footage ------------------------------------------------------ */

  if (opts.video) {
    drafts.push(fromGraphic(ctx, baseFootageLayer(stage, opts.video, total, opts.punchMs ?? 4200, amp)));
    drafts.push(fromGraphic(ctx, backdropLayers(stage, palette, total, amp)[1]));
  } else {
    for (const layer of backdropLayers(stage, palette, total, amp)) drafts.push(fromGraphic(ctx, layer));
  }

  /* -- cutaways ---------------------------------------------------------- */

  const cutaways = opts.cutaways ?? [];
  if (cutaways.length) {
    const every = Math.max(2400, opts.cutawayEveryMs ?? 5600);
    const clip = Math.max(900, Math.min(opts.cutawayDurationMs ?? 1900, every - 900));
    let slot = Math.round(every * 0.62);
    let index = 0;
    while (slot + clip < contentEnd) {
      const media = cutaways[index % cutaways.length];
      for (const layer of cutawayLayers(stage, media, slot, clip, index)) drafts.push(fromGraphic(ctx, layer));
      index += 1;
      slot += every;
    }
  }

  /* -- colour cards in the longest pauses -------------------------------- */

  const cardBudget = opts.beatCards ?? (cues.length >= 8 ? 3 : cues.length >= 3 ? 1 : 0);

  /* -- captions and keyword pops ----------------------------------------- */

  if (opts.captions !== false && pages.length) {
    for (const layer of buildCaptions(pages, { stage, bandY: 0.7, palette, amp, zIndex: 40 })) {
      drafts.push(fromGraphic(ctx, layer));
    }

    const requested = opts.keywords ?? (motion === "kinetic" ? 8 : 5);
    let hits: KeywordHit[];
    if (Array.isArray(requested)) {
      const wanted = new Set(requested.map((w) => w.toLowerCase()));
      hits = [];
      for (const cue of cues) {
        for (const raw of cue.text.split(/\s+/)) {
          const word = raw.replace(/^[^\w$%]+|[^\w$%]+$/g, "");
          if (!wanted.has(word.toLowerCase())) continue;
          if (hits.some((h) => h.word.toLowerCase() === word.toLowerCase())) continue;
          hits.push({ word, startMs: cue.startMs, endMs: cue.endMs, score: 1 });
        }
      }
    } else {
      hits = pickKeywords(cues, requested);
    }

    // The caption engine owns punch timing: it holds a punch clear of its own
    // caption and never lets two punches land on the same pixels.
    const placed = placeKeywordPops(hits, pages, { endMs: contentEnd, spacingMs: POP_SPACING_MS });

    for (const layer of buildKeywordPops(placed, { stage, bandY: 0.34, palette, amp, zIndex: 60 })) {
      drafts.push(fromGraphic(ctx, layer));
    }

    /* -- colour cards, only where a punch is not already landing ---------- */

    if (cardBudget > 0) {
      // A card carries the phrase that follows the pause, so it is placed in a
      // pause — but only one a punch does not already own, and only one whose
      // full lifetime clears the previous card. Both rules are applied to the
      // card's real window, not the gap's, because a short pause makes a card
      // run past its gap and into whatever comes next.
      const minGap = opts.beatCards != null ? MIN_GAP_EXPLICIT_MS : MIN_CARD_GAP_MS;
      const candidates = findGaps(pages, 0, contentEnd, minGap)
        .map((gap) => {
          const duration = Math.max(1100, Math.min(2200, gap.end - gap.start - 120));
          const at = Math.round(gap.start + Math.max(0, (gap.end - gap.start - duration) / 2));
          return { at, duration, gap };
        })
        .filter((c) => c.at + c.duration <= contentEnd)
        .filter(
          (c) =>
            !placed.some((h) => {
              const punchStart = h.startMs - 60;
              return punchStart < c.at + c.duration && punchStart + POP_LIFETIME_MS > c.at;
            }),
        );

      // Greedy, longest pause first, skipping any card that would overlap one
      // already chosen — a short pause makes a card run past its gap, so two
      // cards can genuinely land on top of each other.
      const cards: typeof candidates = [];
      for (const candidate of candidates) {
        if (cards.length >= cardBudget) break;
        if (cards.some((c) => candidate.at < c.at + c.duration && c.at < candidate.at + candidate.duration)) continue;
        cards.push(candidate);
      }

      cards.forEach((card, i) => {
        const next = pages.find((p) => p.startMs >= card.gap.end);
        const phrase = (next ? next.text : title).toUpperCase();
        for (const layer of beatCardLayers(stage, palette, card.at, card.duration, `Part ${i + 1}`, phrase)) {
          drafts.push(fromGraphic(ctx, layer));
        }
      });
    }
  }

  /* -- music and end card ------------------------------------------------ */

  if (opts.music) {
    drafts.push(
      fromGraphic(ctx, {
        name: "Music Bed",
        delayMs: 0,
        durationMs: total,
        keyframes: [],
        style: {
          position: "absolute",
          left: 0,
          top: 0,
          width: 1,
          height: 1,
          opacity: 0,
          _tag: "audio",
          _src: opts.music.src,
          _loop: "1",
          _muted: "0",
          _start: opts.music.inSeconds ?? 0,
          _volume: opts.music.volume ?? 0.4,
          zIndex: "0",
        },
      }),
    );
  }

  for (const layer of ctaCardLayers(stage, palette, contentEnd, total - contentEnd, cta, keyword, brand)) {
    drafts.push(fromGraphic(ctx, layer));
  }

  return {
    scenes,
    drafts,
    totalDurationMs: total,
    palette,
    style,
    motion,
    title,
    artboard: { width: stage.width, height: stage.height },
    captionBand: {
      y: Math.round(stage.height * 0.7),
      height: textHeight(Math.round(stage.width * 0.082), 1.2, 1.15),
    },
  };
}

/** Stage size a project is composed against, from its artboard tokens. */
export function artboardOf(tokens: Record<string, string | number> | undefined): SocialEditStage {
  const w = Number(tokens?.artboardWidth);
  const h = Number(tokens?.artboardHeight);
  return {
    width: Number.isFinite(w) && w > 0 ? w : DEFAULT_SOCIAL_STAGE.width,
    height: Number.isFinite(h) && h > 0 ? h : DEFAULT_SOCIAL_STAGE.height,
  };
}
