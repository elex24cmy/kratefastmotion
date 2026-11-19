/**
 * The measured motion grammar.
 *
 * The companion to `@kratefastmotion/shared`'s 12 measured eases: those say
 * *what shape* a move takes, this says *how long* it runs, *when* siblings
 * stagger, *how much* something overshoots, and *why* — all taken from
 * motionmaxxing by Tejas Makwana (Apache-2.0), a measurement of 4,288 distinct
 * moves across 53 professional motion moments.
 *
 * Frames are the unit (30 fps), because that is how the corpus was measured.
 * Everything the film director does about timing is expressed in frames and
 * converted once, so a 4 s scene and a 2 s scene both get a 12-frame entrance
 * instead of a fraction of their own length — which is the whole point of a
 * measured grammar.
 */

import { MEASURED_EASE_FRAMES, type MeasuredEase } from "@kratefastmotion/shared";

export const FILM_FPS = 30;

export function framesToMs(frames: number): number {
  return Math.round((frames / FILM_FPS) * 1000);
}

export function msToFrames(ms: number): number {
  return Math.round((ms / 1000) * FILM_FPS);
}

/** The four beat roles the sample was measured over. */
export const FILM_BEATS = ["hook", "turn", "proof", "cta"] as const;
export type FilmBeat = (typeof FILM_BEATS)[number];

/**
 * Duration by property — the medians of the pooled sample. A move with no other
 * information should run this long.
 */
export const PROPERTY_FRAMES = {
  translateX: 12,
  translateY: 12,
  scale: 10,
  rotation: 11,
  opacity: 6,
  blur: 7,
  size: 8,
} as const;
export type MotionProperty = keyof typeof PROPERTY_FRAMES;

/**
 * Entry/exit/helper medians by beat role. `entry`/`exit` are translate/scale
 * frames; `opacityIn`/`opacityOut` and `blurIn`/`blurOut` are the helper
 * channels that ride alongside the move. `stagger` is the sibling onset gap.
 *
 * The CTA row is the staccato one: half the entry time, the widest stagger.
 */
export const ROLE_TIMING: Record<
  FilmBeat,
  {
    entry: number;
    exit: number;
    opacityIn: number;
    opacityOut: number;
    blurIn: number;
    blurOut: number;
    stagger: number;
  }
> = {
  hook: { entry: 13, exit: 11, opacityIn: 6, opacityOut: 6, blurIn: 7, blurOut: 9, stagger: 3 },
  turn: { entry: 13, exit: 15, opacityIn: 5, opacityOut: 6, blurIn: 8, blurOut: 9, stagger: 2 },
  proof: { entry: 13, exit: 14, opacityIn: 7, opacityOut: 7, blurIn: 9, blurOut: 6, stagger: 2 },
  cta: { entry: 6, exit: 11, opacityIn: 4, opacityOut: 6, blurIn: 6, blurOut: 6, stagger: 8 },
};

/** The default curve for each phase of a beat. */
export const ENTRY_EASE: MeasuredEase = "softLand";
export const EXIT_EASE: MeasuredEase = "accelExit";
export const HOLD_EASE: MeasuredEase = "cruise";
export const DRIFT_EASE: MeasuredEase = "cruise";
/** Hero arrivals — the first object of a beat, or a mark with identity. */
export const HERO_EASE: MeasuredEase = "snapSettle";
/** The sample's usual overshoot: a small, late lean past the mark. */
export const OVERSHOOT_EASE: MeasuredEase = "popOver";
/** Punctuation-only overshoot, under 1 % of moves. */
export const SLAM_EASE: MeasuredEase = "crashIn";

/**
 * Opacity is a helper, never the arrival: it starts part-way up (0.12-0.3) and
 * rides the move's own curve, so it reads as a 4-6 frame snap rather than a
 * slow fade. R1.6.
 */
export const ENTRY_OPACITY_FROM = 0.2;

/** Overshoot is rare, late and small. R1.10. */
export const OVERSHOOT = { share: 0.088, peak: 1.08, at: 0.72, frames: MEASURED_EASE_FRAMES.popOver } as const;

/** Sibling onsets 1-3 f apart, each move ~2x the gap so tails overlap. R1.8. */
export const STAGGER = { min: 1, max: 3, tailRatio: 0.5 } as const;

/** A held frame is never dead: drift 1-3 px/f, 0.5-1 % scale creep. R1.12. */
export const DRIFT = { pxPerFrame: [1, 3] as const, scaleCreep: [0.005, 0.01] as const };

/** An object with identity arrives from oversize, never grows from zero. R3.6. */
export const HERO_START_SCALE = { min: 1.4, max: 5 } as const;

export interface MotionRule {
  id: string;
  /** Beat roles the rule is about, or "all". */
  roles: readonly FilmBeat[] | "all";
  when: string;
  do: string;
  because: string;
  evidence: string;
}

/**
 * The measured rulebook, distilled from the WHEN → DO → BECAUSE rules the corpus
 * states over its numbers. This is the payload `list_motions` returns: the
 * concrete "how to make motions" an agent should follow.
 */
export const MOTION_RULES: readonly MotionRule[] = [
  {
    id: "R1.1",
    roles: "all",
    when: "you set a duration with no other information",
    do: "use translate/scale entries of 12 frames (0.40 s), opacity 6 f, blur 7 f, and exits of 13-14 f for translate and 10 f for scale",
    because: "these are the measured medians; a film built on 20-30 f ease-outs for everything is slower than the whole sample",
    evidence: "MEAS: pooled median 10 f (0.33 s)",
  },
  {
    id: "R1.2",
    roles: ["cta"],
    when: "the beat is a CTA or sign-off",
    do: "halve the entry times to 6 f, make snapSettle and softLand the two curves, and keep overshoot out",
    because: "the close is the most staccato part of a film (CTA median move 6 f vs 10-11 f elsewhere)",
    evidence: "MEAS: CTA entry 6 f, 39 % snap curves, 4.3 % overshoot",
  },
  {
    id: "R1.3",
    roles: ["turn"],
    when: "the beat is a turn",
    do: "give it the longest exits (14-16 f) and lean on acceleration, with up to 11 % of moves carrying a late overshoot",
    because: "turns are built on things being pulled away and replaced",
    evidence: "MEAS: turn exit 14-16 f, 33 % ease-in",
  },
  {
    id: "R1.4",
    roles: "all",
    when: "an element lands",
    do: "ease out — softLand 12 f, glide 10 f, snapSettle 11 f for a hero or CTA",
    because: "it reads as heavy and certain; 58 % of landings do this",
    evidence: "MEAS; M913/M914/M916 land 60-72 % of travel in the first 4 f",
  },
  {
    id: "R1.5",
    roles: "all",
    when: "an element leaves across the frame or into a cut",
    do: "accelerate — accelExit 13 f, crashOut 17 f, gentleIn 9 f — and end at peak speed",
    because: "an accelerating exit is thrown away and clears the frame with no dead frames; peak speed sits at t~0.9",
    evidence: "MEAS: 37 % of leaving moves accelerate; M920 card 17 -> 111 px/f",
  },
  {
    id: "R1.6",
    roles: "all",
    when: "something enters",
    do: "make it move (offset, scale or blur decaying) and use opacity only as a 4-6 f helper from 0.12-0.3 to 1",
    because: "motion carries the arrival; a pure opacity fade is the AI default",
    evidence: "MEAS; M919, M920",
  },
  {
    id: "R1.7",
    roles: "all",
    when: "a UI piece, row or word should read as a system event",
    do: "hard-cut it on (1 frame, no fade)",
    because: "16 % of entries and 25 % of exits in the sample are hard steps, and a step reads as state, not animation",
    evidence: "MEAS; M939, M940, M921",
  },
  {
    id: "R1.8",
    roles: "all",
    when: "repeated siblings (letters, tiles, rows, avatars) arrive",
    do: "space onsets 1-3 f apart with uneven gaps and run each move ~2x longer than the gap so tails overlap",
    because: "a whole wave under ~0.6 s reads as one gesture; a uniform timer-delay reads as a loading list",
    evidence: "MEAS: 56 % of gaps are 1 f; interval/duration median 0.5",
  },
  {
    id: "R1.9",
    roles: ["cta"],
    when: "a CTA stack of elements arrives",
    do: "widen the gaps to ~8 f (0.27 s)",
    because: "the sample's CTA groups are the only ones that slow down",
    evidence: "MEAS, 5 groups",
  },
  {
    id: "R1.10",
    roles: "all",
    when: "you want a bounce",
    do: "use popOver (peak 1.08 at t 0.72, 15 f) as a small late lean, at most once per beat",
    because: "an overshoot on everything is the AI default; the sample puts it on under 9 % of moves and mostly late",
    evidence: "MEAS: 8.8 % overshoot, 88 % of them peak after 35 % of the duration",
  },
  {
    id: "R1.12",
    roles: "all",
    when: "a thing must hold for more than 3 f",
    do: "keep something alive on it — linear drift 1-3 px/f, 0.5-1 % scale creep, a sweep, a caret, a counter tick",
    because: "a locked frame reads as a slide",
    evidence: "MEAS: 221 drift moves in 35 of 50 moments; median drift 26 f",
  },
  {
    id: "R1.13",
    roles: "all",
    when: "a clip ends",
    do: "end mid-motion — an accelerating exit, a still-shrinking lockup, a half-faded field",
    because: "the cut is the edit and the next frame inherits the speed",
    evidence: "M913, M916, M920, M929, M931, M944",
  },
  {
    id: "R3.1",
    roles: "all",
    when: "anything enters",
    do: "start the beat already in progress on frame 0 (a card mid-open, a word half-risen) and cut onto it",
    because: "the first frame of the clip carries the momentum of the previous one",
    evidence: "M933, M934, M938, M914, M918",
  },
  {
    id: "R3.4",
    roles: "all",
    when: "an element is removed",
    do: "let it exit by moving (60 % of exits) or by one hard frame, and give a word's exit ~3-4 f",
    because: "a fade leaves a ghost the eye has to wait out; exits are faster than entrances",
    evidence: "MEAS; M938",
  },
  {
    id: "R3.6",
    roles: "all",
    when: "an object with identity (logo, word, cursor, card, mark) enters",
    do: "start it at 1.4-5x and scale down to rest — never grow it from zero, never fade it up",
    because: "arrives-from-the-camera reads as authority and makes the hit without a bounce",
    evidence: "M929, M932, M947, M959, M968",
  },
  {
    id: "R4.1",
    roles: "all",
    when: "you choose a film's blur language",
    do: "pick one and keep it: per-element smear, crisp steps, or no blur at all",
    because: "mixed grammars read as different authors",
    evidence: "M913-M969",
  },
  {
    id: "R4.4",
    roles: "all",
    when: "a status line, CTA word or label should appear without moving",
    do: "resolve it in place — blur 12 -> 0 px, opacity 0.1 -> 1, ~4 f per word, words back-to-back",
    because: "it reads as inference or focus; nothing types",
    evidence: "M919, M920",
  },
  {
    id: "R5.1",
    roles: "all",
    when: "you start a film",
    do: "choose one clock per moment (smooth 30/60, stepped poses, or on-twos) and keep it",
    because: "mixed step rates read as a bug",
    evidence: "M921-M924, M947-M949, M962",
  },
];

/** Sibling onset gap in frames for a beat role. */
export function roleStagger(beat: FilmBeat): number {
  return ROLE_TIMING[beat].stagger;
}

/** Translate/scale entrance length in frames for a beat role. */
export function roleEntry(beat: FilmBeat): number {
  return ROLE_TIMING[beat].entry;
}

/** Translate/scale exit length in frames for a beat role. */
export function roleExit(beat: FilmBeat): number {
  return ROLE_TIMING[beat].exit;
}

/** Duration in frames for a property, when there is no other information. */
export function propertyFrames(property: MotionProperty): number {
  return PROPERTY_FRAMES[property];
}
