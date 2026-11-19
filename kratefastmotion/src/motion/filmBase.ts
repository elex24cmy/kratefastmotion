/**
 * Shared film primitives.
 *
 * The timing vocabulary (easings, the entrance→hold→exit beat) and the font
 * stacks are used by both the film director and the graphic kit, so they live
 * here rather than being duplicated. Keeping one definition means a graphic
 * built by the kit and a title built by the director breathe at the same rate.
 */
import type { Easing, Keyframe } from "@kratefastmotion/shared";
import { easingBezier, easingMeasured, type MeasuredEase } from "@kratefastmotion/shared";
import { ENTRY_EASE, ENTRY_OPACITY_FROM, EXIT_EASE, FILM_FPS } from "./motionGrammar.js";

export const FONT_STACK =
  "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
export const MONO_STACK = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** Fast-out entrance, accelerated exit, and a neutral hold. */
export const EASE_OUT: Easing = easingBezier([0.16, 1], [0.3, 1]);
export const EASE_IN: Easing = easingBezier([0.7, 0], [0.84, 0]);
export const EASE_IN_OUT: Easing = easingBezier([0.65, 0], [0.35, 1]);
export const EASE_BACK: Easing = easingBezier([0.34, 1.56], [0.64, 1]);

/* --------------------------- the measured eases --------------------------- */
/*
 * The 12 curves measured from 53 professional motion moments, ported from
 * motionmaxxing. These are the director's default vocabulary: landings
 * decelerate (softLand/glide/snapSettle), exits accelerate (accelExit/crashOut),
 * drift is linear (cruise), and overshoot is a single late lean (popOver).
 */
export const EASE_CRUISE: Easing = easingMeasured("cruise");
export const EASE_GLIDE: Easing = easingMeasured("glide");
export const EASE_SOFT_IN_OUT: Easing = easingMeasured("softInOut");
export const EASE_SOFT_LAND: Easing = easingMeasured("softLand");
export const EASE_GENTLE_IN: Easing = easingMeasured("gentleIn");
export const EASE_SNAP_SETTLE: Easing = easingMeasured("snapSettle");
export const EASE_WHIP: Easing = easingMeasured("whip");
export const EASE_ACCEL_EXIT: Easing = easingMeasured("accelExit");
export const EASE_CRASH_OUT: Easing = easingMeasured("crashOut");
export const EASE_POP_OVER: Easing = easingMeasured("popOver");
export const EASE_CRASH_IN: Easing = easingMeasured("crashIn");
export const EASE_BOUNCE_HARD: Easing = easingMeasured("bounceHard");

export const MEASURED_EASING: Record<MeasuredEase, Easing> = {
  cruise: EASE_CRUISE,
  glide: EASE_GLIDE,
  softInOut: EASE_SOFT_IN_OUT,
  softLand: EASE_SOFT_LAND,
  gentleIn: EASE_GENTLE_IN,
  snapSettle: EASE_SNAP_SETTLE,
  whip: EASE_WHIP,
  accelExit: EASE_ACCEL_EXIT,
  crashOut: EASE_CRASH_OUT,
  popOver: EASE_POP_OVER,
  crashIn: EASE_CRASH_IN,
  bounceHard: EASE_BOUNCE_HARD,
};

export interface MeasuredBeatOptions {
  /** The layer's total animation length. Offsets are derived from this, so the
   *  entrance and exit are the measured *number of frames* rather than a
   *  fraction of the scene. */
  durationMs: number;
  /** Entrance length in frames @30. Defaults to the measured translate median (12). */
  enterFrames?: number;
  /** Exit length in frames @30. Defaults to the measured translate exit (13). */
  exitFrames?: number;
  /** Entrance curve. Defaults to softLand (the entry workhorse). */
  enterEase?: Easing;
  /** Exit curve. Defaults to accelExit (the leaving curve). */
  exitEase?: Easing;
  /** Opacity the entrance starts from — a helper, not a fade. Default 0.2. */
  enterOpacity?: number;
  /** Merged into the hold so the layer keeps creeping after it lands. */
  drift?: Record<string, string | number>;
}

function measuredSpan(opts: MeasuredBeatOptions, exitFrames: number) {
  const enter = Math.max(1, Math.round(opts.enterFrames ?? 12));
  const exit = Math.max(0, Math.round(exitFrames));
  const total = Math.max(enter + exit + 1, Math.round((opts.durationMs / 1000) * FILM_FPS));
  return { enter, exit, total, hold: total - enter - exit };
}

/** Total frames a measured beat will span, given its duration. */
export function measuredBeatFrames(opts: MeasuredBeatOptions): number {
  return measuredSpan(opts, opts.exitFrames ?? 13).total;
}

/**
 * Entrance → hold → exit with measured timing. Same shape as `beat()` but the
 * entrance and exit are absolute frame counts, the entrance is a *move* with
 * opacity riding along as a short helper (never a long fade), the hold drifts
 * linearly, and the exit accelerates away.
 */
export function measuredBeat(
  from: Record<string, string | number>,
  hold: Record<string, string | number>,
  exit: Record<string, string | number> = {},
  opts: MeasuredBeatOptions,
): Keyframe[] {
  const { enter, total, hold: holdF } = measuredSpan(opts, opts.exitFrames ?? 13);
  const enterEase = opts.enterEase ?? EASE_SOFT_LAND;
  const exitEase = opts.exitEase ?? EASE_ACCEL_EXIT;
  const opacity = opts.enterOpacity ?? ENTRY_OPACITY_FROM;
  const drifted = { ...hold, ...(opts.drift ?? {}) };

  if (holdF <= 0) {
    return [
      { offset: 0, properties: { opacity, ...from } as Keyframe["properties"], easing: enterEase },
      { offset: Math.min(0.999, enter / total), properties: { ...drifted, opacity: 1 } as Keyframe["properties"], easing: exitEase },
      { offset: 1, properties: { ...drifted, ...exit, opacity: 0 } as Keyframe["properties"] },
    ];
  }

  return [
    { offset: 0, properties: { opacity, ...from } as Keyframe["properties"], easing: enterEase },
    { offset: enter / total, properties: { ...hold, opacity: 1 } as Keyframe["properties"], easing: EASE_CRUISE },
    { offset: (enter + holdF) / total, properties: { ...drifted, opacity: 1 } as Keyframe["properties"], easing: exitEase },
    { offset: 1, properties: { ...drifted, ...exit, opacity: 0 } as Keyframe["properties"] },
  ];
}

/**
 * Entrance → hold, ending visible — the measured version of `beatHold()`, used
 * by the closing scene so the film ends on a composed end card.
 */
export function measuredHold(
  from: Record<string, string | number>,
  hold: Record<string, string | number>,
  opts: MeasuredBeatOptions,
): Keyframe[] {
  const { enter, total } = measuredSpan(opts, 1);
  const enterEase = opts.enterEase ?? EASE_SOFT_LAND;
  const opacity = opts.enterOpacity ?? ENTRY_OPACITY_FROM;
  const drifted = { ...hold, ...(opts.drift ?? {}) };
  return [
    { offset: 0, properties: { opacity, ...from } as Keyframe["properties"], easing: enterEase },
    { offset: enter / total, properties: { ...hold, opacity: 1 } as Keyframe["properties"], easing: EASE_CRUISE },
    { offset: 1, properties: { ...drifted, opacity: 1 } as Keyframe["properties"] },
  ];
}

/**
 * Entrance → hold → exit, with fast-out in and accelerated out. `drift` is
 * merged into the hold so a layer keeps creeping after it lands — the reference
 * films never let anything sit completely still.
 */
export function beat(
  from: Record<string, string | number>,
  hold: Record<string, string | number>,
  exit: Record<string, string | number> = {},
  drift: Record<string, string | number> = {},
): Keyframe[] {
  const drifted = { ...hold, ...drift };
  return [
    { offset: 0, properties: { opacity: 0, ...from } as Keyframe["properties"], easing: EASE_OUT },
    { offset: 0.18, properties: { opacity: 1, ...hold } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: 0.82, properties: { opacity: 1, ...drifted } as Keyframe["properties"], easing: EASE_IN },
    { offset: 1, properties: { opacity: 0, ...drifted, ...exit } as Keyframe["properties"] },
  ];
}

/**
 * Entrance → hold, ending visible. Used by the closing scene so the film — and
 * the editor canvas at rest, which keeps each layer's final `fill-mode: both`
 * state — ends on a composed end card instead of a blank stage after every
 * layer has faded out.
 */
export function beatHold(
  from: Record<string, string | number>,
  hold: Record<string, string | number>,
  drift: Record<string, string | number> = {},
): Keyframe[] {
  const drifted = { ...hold, ...drift };
  return [
    { offset: 0, properties: { opacity: 0, ...from } as Keyframe["properties"], easing: EASE_OUT },
    { offset: 0.22, properties: { opacity: 1, ...hold } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: 1, properties: { opacity: 1, ...drifted } as Keyframe["properties"] },
  ];
}

/**
 * A looping pulse used by ornaments (rings, chevrons, dots) that need to keep
 * moving for a whole scene without an exit of their own.
 */
export function pulse(
  from: Record<string, string | number>,
  hold: Record<string, string | number>,
): Keyframe[] {
  return [
    { offset: 0, properties: { opacity: 0, ...from } as Keyframe["properties"], easing: EASE_OUT },
    { offset: 0.2, properties: { opacity: 1, ...hold } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: 0.5, properties: { opacity: 0.55, ...from } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: 0.8, properties: { opacity: 1, ...hold } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: 1, properties: { opacity: 1, ...hold } as Keyframe["properties"] },
  ];
}

/** Apply an alpha channel to a hex colour, passing anything else through. */
export function withAlpha(color: string, alpha: number): string {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!match) return color;
  let hex = match[1];
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
