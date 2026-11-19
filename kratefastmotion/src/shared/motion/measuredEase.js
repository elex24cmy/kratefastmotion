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
export const MEASURED_EASES = [
    "cruise",
    "glide",
    "softInOut",
    "softLand",
    "gentleIn",
    "snapSettle",
    "whip",
    "accelExit",
    "crashOut",
    "popOver",
    "crashIn",
    "bounceHard",
];
/** Median duration in frames @30 the humans gave this curve. */
export const MEASURED_EASE_FRAMES = {
    cruise: 9,
    glide: 10,
    softInOut: 9,
    softLand: 12,
    gentleIn: 9,
    snapSettle: 11,
    whip: 7,
    accelExit: 13,
    crashOut: 17,
    popOver: 15,
    crashIn: 10,
    bounceHard: 22,
};
/** Percent of travel done at 10 / 25 / 50 / 75 % of the duration. */
export const MEASURED_EASE_SHAPE = {
    cruise: [10, 25, 50, 75],
    glide: [16, 39, 69, 91],
    softInOut: [4, 17, 50, 83],
    softLand: [30, 59, 85, 95],
    gentleIn: [1, 6, 24, 55],
    snapSettle: [54, 84, 96, 98],
    whip: [23, 52, 83, 97],
    accelExit: [0, 3, 16, 47],
    crashOut: [0, 0, 6, 32],
    popOver: [10, 46, 96, 108],
    crashIn: [91, 118, 110, 103],
    bounceHard: [13, 62, 138, 139],
};
/** CSS cubic-bezier fit of the curve, as [x1, y1, x2, y2]. */
export const MEASURED_BEZIER = {
    cruise: [0, 0, 1, 1],
    glide: [0.5, 0.8515, 0.8528, 0.9948],
    softInOut: [0.2677, 0, 0.7323, 1],
    softLand: [0.2261, 0.8, 0.5338, 0.943],
    gentleIn: [0.4257, -0.0047, 0.7575, 0.5],
    snapSettle: [0.15, 1.1455, 0.3403, 0.9148],
    whip: [0.3951, 1, 0.7649, 0.9965],
    accelExit: [0.547, -0.0335, 0.8004, 0.5],
    crashOut: [0.7526, -0.0861, 0.8539, 0.5],
    popOver: [0.328, 0.1797, 0.25, 1.3472],
    crashIn: [0.15, 2.0123, 0.2495, 0.8645],
    bounceHard: [0.4366, 0.5263, 0.329, 2.368],
};
/** What the sample's humans used each curve for. */
export const MEASURED_EASE_USE = {
    cruise: "fades, drift, camera creep, counters, ambient motion; every drift is linear",
    glide: "all-purpose medium x/y/scale/blur lands and some fades; entries and exits alike",
    softInOut: "opacity and blur, counters off a handle, ground/colour ramps",
    softLand: "text rises, panels slide, scale-ins; the entry workhorse",
    gentleIn: "exits, blur-out and fade-out starts, slow push-ins running into a cut",
    snapSettle: "hero entries and CTA moves; a fast snap with a soft tail",
    whip: "big fast moves; a true whip is 7-8 frames",
    accelExit: "the leaving curve — scale exits, pans off-frame, peak speed at t~0.9",
    crashOut: "camera pull-offs and exits that end in a hard cut at full speed",
    popOver: "the late lean past the mark (peak 1.08 at t 0.72); the sample's usual overshoot",
    crashIn: "slams: drops that touch the mark almost at once, pass it, and relax back",
    bounceHard: "the big overshoot (peak 1.48); under 1 % of moves, use sparingly",
};
/* ------------------------------ exact curves ------------------------------ */
const powerOut = (p) => (t) => 1 - Math.pow(1 - t, p);
const powerIn = (p) => (t) => Math.pow(t, p);
const expoOut = (k) => {
    const d = 1 - Math.exp(-k);
    return (t) => (1 - Math.exp(-k * t)) / d;
};
const snapRamp = (w, tau) => {
    const n = w * (1 - Math.exp(-1 / tau)) + (1 - w);
    return (t) => (w * (1 - Math.exp(-t / tau)) + (1 - w) * t) / n;
};
const snapOver = (a, ta, td) => {
    const f = (t) => (1 + a * Math.exp(-t / td)) * (1 - Math.exp(-t / ta));
    const n = f(1);
    return (t) => f(t) / n;
};
const spring = (c, om) => {
    const f = (t) => 1 - Math.exp(-c * t) * (Math.cos(om * t) + (c / om) * Math.sin(om * t));
    const n = f(1);
    return (t) => f(t) / n;
};
const smoothP = (p) => (t) => {
    const a = Math.pow(t, p);
    const b = Math.pow(1 - t, p);
    return a / (a + b);
};
const guard = (f) => (t) => (t <= 0 ? 0 : t >= 1 ? 1 : f(t));
/** The exact measured curve, `t` in 0..1. */
export const MEASURED_EASE_FN = {
    cruise: guard((t) => t),
    glide: guard(powerOut(1.7)),
    softInOut: guard(smoothP(1.42)),
    softLand: guard(expoOut(3.41)),
    gentleIn: guard(powerIn(2.07)),
    snapSettle: guard(snapRamp(0.942, 0.118)),
    whip: guard(powerOut(2.52)),
    accelExit: guard(powerIn(2.6)),
    crashOut: guard(powerIn(3.97)),
    popOver: guard(spring(2.67, 4.36)),
    crashIn: guard(snapOver(2.0, 0.19, 0.218)),
    bounceHard: guard(spring(1.34, 5.07)),
};
/** Whether a preset name is one of the measured curves. */
export function isMeasuredEase(name) {
    return MEASURED_EASES.includes(name);
}
//# sourceMappingURL=measuredEase.js.map