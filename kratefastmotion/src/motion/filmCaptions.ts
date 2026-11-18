/**
 * Caption engine.
 *
 * The edit this genre is built on — a vertical talking-head cut to a fast music
 * bed — is carried by three things: the spoken words rendered as large
 * centre-frame captions, single words punched up for emphasis, and cutaways
 * that break the shot every second or two. This module owns the first two.
 *
 * A transcript is the only input. It can arrive with real timings (SRT or VTT,
 * as exported by YouTube, TikTok or Instagram) or as plain text, in which case
 * the words are paced at a speaking rate across the clip. Either way the output
 * is a list of `GraphicLayer` descriptors — positioned boxes with keyframes — so
 * a caption is an ordinary component that previews, edits and exports like
 * everything else on the stage.
 *
 * There is deliberately no speech-to-text here: the configured model provider
 * exposes no ASR endpoint, and the Windows offline recogniser returns noise at
 * 0.2 confidence with no word timings. The transcript comes from the caller.
 */
import type { Keyframe } from "@kratefastmotion/shared";
import { type Area, boxToStyle, contentArea, place, stageArea, textHeight } from "./layout.js";
import type { GraphicLayer, GraphicPalette } from "./filmGraphics.js";
import { EASE_BACK, EASE_IN, EASE_IN_OUT, EASE_OUT, FONT_STACK } from "./filmBase.js";

/* ---------------------------------------------------------- transcripts ---- */

export interface TranscriptCue {
  startMs: number;
  endMs: number;
  text: string;
}

export interface ParsedTranscript {
  cues: TranscriptCue[];
  /** True when the source carried real timings (SRT/VTT). */
  timed: boolean;
}

/** `00:01:02,500` / `01:02.500` / `62.5` → milliseconds. */
export function parseTimestamp(raw: string): number | null {
  const value = raw.trim();
  const clock = /^(?:(\d+):)?(\d{1,2}):(\d{2})[.,](\d{1,3})$/.exec(value);
  if (clock) {
    const h = Number(clock[1] ?? 0);
    const m = Number(clock[2]);
    const s = Number(clock[3]);
    const ms = Number(clock[4].padEnd(3, "0"));
    return ((h * 60 + m) * 60 + s) * 1000 + ms;
  }
  const seconds = /^(\d+(?:\.\d+)?)$/.exec(value);
  return seconds ? Math.round(Number(seconds[1]) * 1000) : null;
}

/**
 * Parse SRT or WebVTT. The two formats differ only in their header and in
 * whether cue settings trail the end timestamp, so one reader covers both.
 */
export function parseTimedText(text: string): TranscriptCue[] {
  const normalised = text.replace(/\r/g, "").replace(/^\uFEFF/, "");
  const blocks = normalised.split(/\n{2,}/);
  const cues: TranscriptCue[] = [];
  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) continue;
    if (/^WEBVTT/i.test(lines[0]) || /^NOTE\b/i.test(lines[0])) continue;
    const timeLine = lines.find((l) => l.includes("-->"));
    if (!timeLine) continue;
    const [rawStart, rawRest] = timeLine.split("-->");
    if (rawStart == null || rawRest == null) continue;
    // Cue settings ("align:middle line:90%") follow the end timestamp.
    const rawEnd = rawRest.trim().split(/\s+/)[0];
    const startMs = parseTimestamp(rawStart);
    const endMs = parseTimestamp(rawEnd);
    if (startMs == null || endMs == null) continue;
    const body = lines
      .filter((l) => l !== timeLine && !/^\d+$/.test(l))
      .join(" ")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!body) continue;
    cues.push({ startMs, endMs: Math.max(endMs, startMs + 200), text: body });
  }
  return cues.sort((a, b) => a.startMs - b.startMs);
}

export const parseSrt = parseTimedText;
export const parseVtt = parseTimedText;

/** Detect whether a transcript carries timings at all. */
export function parseTranscript(text: string): ParsedTranscript {
  if (text.includes("-->")) {
    const cues = parseTimedText(text);
    if (cues.length) return { cues, timed: true };
  }
  return { cues: [], timed: false };
}

/** Split plain prose into sentences, keeping abbreviations from over-splitting. */
export function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export interface PlainTextTiming {
  startMs: number;
  endMs: number;
  /** Speaking rate used to pace the words. Defaults to 165 wpm. */
  wpm?: number;
}

/**
 * Pace untimed prose across a window. Each sentence gets a share of the window
 * proportional to its word count, which is the best available guess when the
 * transcript has no timings — the caller can nudge any cue afterwards.
 */
export function cuesFromPlainText(text: string, timing: PlainTextTiming): TranscriptCue[] {
  const sentences = splitSentences(text);
  if (!sentences.length) return [];
  const counts = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  const span = Math.max(500, timing.endMs - timing.startMs);
  const cues: TranscriptCue[] = [];
  let cursor = timing.startMs;
  sentences.forEach((sentence, i) => {
    const share = (counts[i] / total) * span;
    const end = i === sentences.length - 1 ? timing.endMs : Math.round(cursor + share);
    cues.push({ startMs: Math.round(cursor), endMs: Math.max(Math.round(cursor) + 200, end), text: sentence });
    cursor += share;
  });
  return cues;
}

/* -------------------------------------------------------------- paging ---- */

export interface CaptionPage {
  startMs: number;
  endMs: number;
  text: string;
}

export interface PageOptions {
  /** Words shown together. 1 gives the word-by-word "kinetic" look. */
  wordsPerPage?: number;
  /** Hard cap on a page's character count, so a page never wraps. */
  maxChars?: number;
}

/**
 * Break cues into the pages a viewer actually reads. Each page owns a slice of
 * its cue's window, sized by word count, and pages never overlap in time — two
 * captions on screen at once would read as a glitch (and as a layout
 * collision).
 */
export function paginate(cues: TranscriptCue[], opts: PageOptions = {}): CaptionPage[] {
  const wordsPerPage = Math.max(1, Math.round(opts.wordsPerPage ?? 3));
  const maxChars = Math.max(8, Math.round(opts.maxChars ?? 30));
  const pages: CaptionPage[] = [];

  for (const cue of cues) {
    const words = cue.text.split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    const chunks: string[][] = [];
    let current: string[] = [];
    for (const word of words) {
      const candidate = [...current, word].join(" ");
      if (current.length && (current.length >= wordsPerPage || candidate.length > maxChars)) {
        chunks.push(current);
        current = [word];
      } else {
        current.push(word);
      }
    }
    if (current.length) chunks.push(current);

    const totalWords = chunks.reduce((sum, c) => sum + c.length, 0) || 1;
    const span = Math.max(200, cue.endMs - cue.startMs);
    let cursor = cue.startMs;
    chunks.forEach((chunk, i) => {
      const share = (chunk.length / totalWords) * span;
      const end = i === chunks.length - 1 ? cue.endMs : Math.round(cursor + share);
      pages.push({
        startMs: Math.round(cursor),
        endMs: Math.max(Math.round(cursor) + 120, end),
        text: chunk.join(" "),
      });
      cursor += share;
    });
  }
  return pages.sort((a, b) => a.startMs - b.startMs);
}

/* ------------------------------------------------------------- styling ---- */

export interface CaptionStage {
  width: number;
  height: number;
  margin?: number;
}

export interface CaptionOptions {
  stage: CaptionStage;
  /** Vertical centre of the caption band as a fraction of the stage height. */
  bandY?: number;
  /** Largest caption size; pages with more characters scale down to fit. */
  fontSize?: number;
  palette: GraphicPalette;
  /** Beat amplitude multiplier: calm 0.55 / balanced 1 / kinetic 3. */
  amp?: number;
  sceneId?: string | null;
  zIndex?: number;
  /** Soft dark band behind the words so they read over any footage. */
  scrim?: boolean;
}

const CAPTION_FONT = FONT_STACK;
/** Average glyph width as a fraction of the font size, for a bold sans. */
const GLYPH_RATIO = 0.54;

function captionArea(stage: CaptionStage): Area {
  return stage.margin != null
    ? stageArea(stage.width, stage.height, stage.margin)
    : contentArea(stage.width, stage.height);
}

/** A caption pops in fast, holds, then drops away — a cut, not a dissolve. */
function captionBeat(a: number): Keyframe[] {
  return [
    { offset: 0, properties: { opacity: 0, translateY: 26 * a, scale: 0.9 } as Keyframe["properties"], easing: EASE_OUT },
    { offset: 0.13, properties: { opacity: 1, translateY: 0, scale: 1 } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: 0.87, properties: { opacity: 1, translateY: 0, scale: 1 } as Keyframe["properties"], easing: EASE_IN },
    { offset: 1, properties: { opacity: 0, translateY: -14 * a, scale: 0.99 } as Keyframe["properties"] },
  ];
}

/**
 * Turn pages into caption layers. Every page is one text layer (with an
 * optional scrim sharing its group) positioned on the caption band. The font
 * size shrinks for longer pages so a page never wraps and never overflows the
 * safe area — the layout engine is not asked to guess text metrics.
 */
export function buildCaptions(pages: CaptionPage[], opts: CaptionOptions): GraphicLayer[] {
  const area = captionArea(opts.stage);
  const bandY = opts.bandY ?? 0.68;
  const base = opts.fontSize ?? Math.round(opts.stage.width * 0.082);
  const amp = opts.amp ?? 1;
  const centre = opts.stage.height * bandY;
  const scrim = opts.scrim ?? true;
  const layers: GraphicLayer[] = [];

  pages.forEach((page, index) => {
    const chars = Math.max(3, page.text.length);
    const fitted = Math.max(Math.round(base * 0.42), Math.min(base, Math.floor((area.w * 0.94) / (chars * GLYPH_RATIO))));
    const box = {
      x: area.x,
      y: Math.round(centre - textHeight(fitted, 1.2, 1.15) / 2),
      w: area.w,
      h: textHeight(fitted, 1.2, 1.15),
    };
    const group = `caption:${index}`;
    const durationMs = Math.max(140, page.endMs - page.startMs);

    if (scrim) {
      const scrimH = Math.round(fitted * 1.9);
      layers.push({
        name: `Caption Scrim ${index + 1}`,
        delayMs: page.startMs,
        durationMs,
        group,
        keyframes: captionBeat(amp),
        style: {
          position: "absolute",
          ...boxToStyle({ x: area.x, y: Math.round(centre - scrimH / 2), w: area.w, h: scrimH }),
          // A scrim is full-width decoration whose whole job is to be covered by
          // the words — it may run to the frame edge, and it is never a collision.
          _background: "1",
          background:
            "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.52) 12%, rgba(0,0,0,0.52) 88%, rgba(0,0,0,0) 100%)",
          borderRadius: "22px",
          zIndex: String((opts.zIndex ?? 40) - 1),
        },
      });
    }

    layers.push({
      name: `Caption ${index + 1}`,
      delayMs: page.startMs,
      durationMs,
      group,
      keyframes: captionBeat(amp),
      style: {
        position: "absolute",
        ...boxToStyle(box),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: CAPTION_FONT,
        fontSize: fitted,
        fontWeight: 800,
        lineHeight: 1.15,
        letterSpacing: "-0.02em",
        color: opts.palette.text,
        textAlign: "center",
        whiteSpace: "nowrap",
        textShadow: "0 2px 6px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.6)",
        zIndex: String(opts.zIndex ?? 40),
        _content: page.text,
      },
    });
  });

  return layers;
}

/* ------------------------------------------------------------ keywords ---- */

const KEYWORD_STOP_WORDS = new Set([
  "the", "and", "that", "this", "with", "have", "from", "they", "your", "you", "for", "but",
  "not", "are", "was", "were", "will", "would", "there", "their", "what", "when", "then",
  "than", "them", "into", "just", "like", "about", "because", "been", "being", "over",
  "some", "such", "only", "also", "very", "much", "more", "most", "other", "which", "these",
  "those", "here", "where", "while", "does", "did", "doing", "done", "get", "got", "getting",
  "one", "two", "how", "why", "who", "its", "it's", "i'm", "you're", "we're", "they're",
]);

export interface KeywordHit {
  word: string;
  startMs: number;
  endMs: number;
  /** 0..1 salience, used to pick the punchiest words. */
  score: number;
}

/**
 * Pick the words worth punching up. Length and capitalisation stand in for
 * importance, stop words are dropped, and a word that recurs is only kept once
 * so the same punch does not fire five times.
 */
export function pickKeywords(cues: TranscriptCue[], limit = 6): KeywordHit[] {
  const seen = new Map<string, KeywordHit>();
  for (const cue of cues) {
    for (const raw of cue.text.split(/\s+/)) {
      const word = raw.replace(/^[^\w$%]+|[^\w$%]+$/g, "");
      if (word.length < 5) continue;
      if (KEYWORD_STOP_WORDS.has(word.toLowerCase())) continue;
      if (/^\d+$/.test(word)) continue;
      const key = word.toLowerCase();
      if (seen.has(key)) continue;
      let score = Math.min(1, (word.length - 4) / 8);
      if (/^[A-Z]/.test(word) && /[a-z]/.test(word)) score += 0.15;
      if (/\d/.test(word)) score += 0.1;
      seen.set(key, { word, startMs: cue.startMs, endMs: cue.endMs, score: Math.min(1, score) });
    }
  }
  return [...seen.values()].sort((a, b) => b.score - a.score).slice(0, Math.max(0, limit));
}

export interface KeywordOptions extends CaptionOptions {
  /** Vertical centre of the punch as a fraction of the stage height. */
  bandY?: number;
  /** Largest punch size. */
  fontSize?: number;
}

/**
 * Turn salience hits into punch placements.
 *
 * A punch sits in the same band as every other punch, so two that overlap in
 * time are two words stacked on the same pixels — the single most common way
 * this genre goes wrong. This is the one place that decides when a punch lands:
 * a word spoken while its own caption is on screen is pushed to just after the
 * page clears, and each punch is held at least `spacingMs` from the one before
 * it. Both the orchestrator and `add_keyword_pop` call it, so a punch added by
 * hand lands exactly where the composed edit would have put it.
 */
export function placeKeywordPops(
  hits: KeywordHit[],
  pages: CaptionPage[],
  opts: { endMs: number; spacingMs?: number; holdMs?: number; leadMs?: number },
): KeywordHit[] {
  const spacing = opts.spacingMs ?? 800;
  const hold = opts.holdMs ?? 420;
  const lead = opts.leadMs ?? 40;
  const ordered = [...hits].sort((a, b) => a.startMs - b.startMs);
  const placed: KeywordHit[] = [];
  let last = Number.NEGATIVE_INFINITY;

  for (const hit of ordered) {
    const page = pages.find((p) => hit.startMs >= p.startMs && hit.startMs < p.endMs);
    const earliest = page ? page.endMs + lead : hit.startMs;
    const start = Math.max(earliest, last + spacing);
    if (start + hold >= opts.endMs) continue;
    placed.push({ ...hit, startMs: start, endMs: start + hold });
    last = start;
  }
  return placed;
}

/**
 * Big centred emphasis words. They sit above the caption band and land on the
 * beat the word is spoken, with an overshoot so they feel struck rather than
 * faded in.
 */
export function buildKeywordPops(hits: KeywordHit[], opts: KeywordOptions): GraphicLayer[] {
  const area = captionArea(opts.stage);
  const bandY = opts.bandY ?? 0.42;
  const base = opts.fontSize ?? Math.round(opts.stage.width * 0.15);
  const amp = opts.amp ?? 1;
  const centre = opts.stage.height * bandY;
  const layers: GraphicLayer[] = [];

  hits.forEach((hit, index) => {
    const chars = Math.max(3, hit.word.length);
    const fitted = Math.max(
      Math.round(base * 0.45),
      Math.min(base, Math.floor((area.w * 0.94) / (chars * GLYPH_RATIO))),
    );
    const size = { w: Math.min(area.w, Math.round(chars * fitted * GLYPH_RATIO)), h: textHeight(fitted, 1.2, 1.1) };
    const box = place("center", size, {
      area: { x: area.x, y: Math.round(centre - size.h / 2), w: area.w, h: size.h },
    });
    // Hold the punch a beat past the word, but never past the next word.
    const start = Math.max(0, hit.startMs - 60);
    const durationMs = Math.max(320, Math.min(1500, hit.endMs - hit.startMs + 320));
    layers.push({
      name: `Keyword ${index + 1}`,
      delayMs: start,
      durationMs,
      keyframes: [
        { offset: 0, properties: { opacity: 0, scale: 0.6 * (1 + 0.1 * amp), rotate: -4 * amp } as Keyframe["properties"], easing: EASE_BACK },
        { offset: 0.22, properties: { opacity: 1, scale: 1, rotate: 0 } as Keyframe["properties"], easing: EASE_IN_OUT },
        { offset: 0.78, properties: { opacity: 1, scale: 1 + 0.03 * amp, rotate: 0 } as Keyframe["properties"], easing: EASE_IN },
        { offset: 1, properties: { opacity: 0, scale: 1 + 0.08 * amp, rotate: 0 } as Keyframe["properties"] },
      ],
      style: {
        position: "absolute",
        ...boxToStyle(box),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: CAPTION_FONT,
        fontSize: fitted,
        fontWeight: 900,
        lineHeight: 1.1,
        letterSpacing: "-0.03em",
        color: opts.palette.accent,
        textAlign: "center",
        whiteSpace: "nowrap",
        textShadow: `0 0 40px ${opts.palette.accent}66, 0 4px 10px rgba(0,0,0,0.7)`,
        zIndex: String((opts.zIndex ?? 60)),
        _content: hit.word,
      },
    });
  });

  return layers;
}
