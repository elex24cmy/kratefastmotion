/**
 * The 12 measured eases.
 *
 * Ported from motionmaxxing by Tejas Makwana (Apache-2.0) — a corpus of 4,288
 * distinct moves sampled frame-by-frame from 53 professional motion moments.
 * Each curve is the median shape of a cluster of real moves, so it is what a
 * human motion designer actually reaches for, not an invented spring.
 *
 * Two representations of the same curve live here:
 *  - `MEASURED_EASE_FN` is the exact curve (the offline probe checks it against
 *    the published shape vectors — percent of travel done at 10/25/50/75 % of
 *    the duration — so the port cannot silently drift).
 *  - `MEASURED_BEZIER` is a CSS cubic-bezier fit of the same curve. The renderer
 *    only speaks cubic-bezier, so this is what preview, editor, code export and
 *    video export all animate with. The fit is within ~0.4 % for the workhorse
 *    curves and within ~4 % for the two rare overshoot slams.
 *
 * Frames are the unit (30 fps). The measured durations that pair with these
 * curves — how many frames an entrance gets, when to stagger, how much to
 * overshoot — live in the motion package's `motionGrammar.ts`.
 */
export declare const MEASURED_EASES: readonly ["cruise", "glide", "softInOut", "softLand", "gentleIn", "snapSettle", "whip", "accelExit", "crashOut", "popOver", "crashIn", "bounceHard"];
export type MeasuredEase = (typeof MEASURED_EASES)[number];
/** Median duration in frames @30 the humans gave this curve. */
export declare const MEASURED_EASE_FRAMES: Record<MeasuredEase, number>;
/** Percent of travel done at 10 / 25 / 50 / 75 % of the duration. */
export declare const MEASURED_EASE_SHAPE: Record<MeasuredEase, readonly [number, number, number, number]>;
/** CSS cubic-bezier fit of the curve, as [x1, y1, x2, y2]. */
export declare const MEASURED_BEZIER: Record<MeasuredEase, [number, number, number, number]>;
/** What the sample's humans used each curve for. */
export declare const MEASURED_EASE_USE: Record<MeasuredEase, string>;
/** The exact measured curve, `t` in 0..1. */
export declare const MEASURED_EASE_FN: Record<MeasuredEase, (t: number) => number>;
/** Whether a preset name is one of the measured curves. */
export declare function isMeasuredEase(name: string): name is MeasuredEase;
//# sourceMappingURL=measuredEase.d.ts.map