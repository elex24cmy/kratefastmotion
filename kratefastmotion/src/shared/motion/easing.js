import { z } from "zod";
import { isMeasuredEase, MEASURED_BEZIER, MEASURED_EASES } from "./measuredEase.js";
const BASE_EASING_PRESETS = [
    "linear",
    "ease",
    "ease-in",
    "ease-out",
    "ease-in-out",
    "ease-in-quad",
    "ease-out-quad",
    "ease-in-out-quad",
    "ease-in-cubic",
    "ease-out-cubic",
    "ease-in-out-cubic",
    "bounce",
    "back",
    "elastic",
    "snappy",
    "smooth",
    "soft",
];
/**
 * The hand-tuned presets, then the 12 measured curves ported from
 * motionmaxxing. The measured names are first-class presets: the agent can pass
 * `easing: { type: "preset", name: "softLand" }` to any tool, and the editor's
 * easing picker lists them alongside the classic ones.
 */
export const EASING_PRESETS = [...BASE_EASING_PRESETS, ...MEASURED_EASES];
/** CSS cubic-bezier approximation for presets that aren't native CSS keywords. */
export const PRESET_BEZIER = {
    "ease-in-quad": [0.11, 0, 0.5, 0],
    "ease-out-quad": [0.5, 1, 0.89, 1],
    "ease-in-out-quad": [0.45, 0, 0.55, 1],
    "ease-in-cubic": [0.32, 0, 0.67, 0],
    "ease-out-cubic": [0.33, 1, 0.68, 1],
    "ease-in-out-cubic": [0.65, 0, 0.35, 1],
    bounce: [0.68, -0.6, 0.32, 1.6],
    back: [0.34, 1.56, 0.64, 1],
    elastic: [0.5, -0.6, 0.1, 1.4],
    snappy: [0.2, 0.8, 0.2, 1],
    smooth: [0.45, 0, 0.15, 1],
    soft: [0.4, 0, 0.6, 1],
    ...MEASURED_BEZIER,
};
export const EasingPresetSchema = z.enum(EASING_PRESETS);
export const BezierEasingSchema = z.object({
    type: z.literal("bezier"),
    p1: z.tuple([z.number(), z.number()]),
    p2: z.tuple([z.number(), z.number()]),
});
export const SpringEasingSchema = z.object({
    type: z.literal("spring"),
    stiffness: z.number().positive(),
    damping: z.number().nonnegative(),
    mass: z.number().positive().default(1),
});
export const PresetEasingSchema = z.object({
    type: z.literal("preset"),
    name: EasingPresetSchema,
});
export const EasingSchema = z.discriminatedUnion("type", [
    PresetEasingSchema,
    BezierEasingSchema,
    SpringEasingSchema,
]);
export const easingPreset = (name) => ({ type: "preset", name });
export const easingBezier = (p1, p2) => ({
    type: "bezier",
    p1,
    p2,
});
export const easingSpring = (stiffness, damping, mass = 1) => ({ type: "spring", stiffness, damping, mass });
/** A measured curve from the motionmaxxing corpus, addressed by name. */
export const easingMeasured = (name) => ({ type: "preset", name });
/** Whether a measured curve leans past its mark (the sample's overshoots). */
export function isMeasuredOvershoot(name) {
    return name === "popOver" || name === "crashIn" || name === "bounceHard";
}
/** Convert an easing to a CSS animation-timing-function string. */
export function easingToCss(easing) {
    switch (easing.type) {
        case "preset": {
            const native = [
                "linear",
                "ease",
                "ease-in",
                "ease-out",
                "ease-in-out",
            ];
            if (native.includes(easing.name))
                return easing.name;
            const bz = PRESET_BEZIER[easing.name];
            if (bz)
                return `cubic-bezier(${bz[0]}, ${bz[1]}, ${bz[2]}, ${bz[3]})`;
            return "ease";
        }
        case "bezier":
            return `cubic-bezier(${easing.p1[0]}, ${easing.p1[1]}, ${easing.p2[0]}, ${easing.p2[1]})`;
        case "spring": {
            // Approximate spring with a cubic-bezier. Good enough for CSS preview;
            // WAAPI generator can use native spring-like timing.
            const { stiffness, damping, mass } = easing;
            const r = damping / (2 * Math.sqrt(stiffness * mass));
            if (r >= 1)
                return `cubic-bezier(0.22, 1, 0.36, 1)`; // over-damped -> smooth out
            return `cubic-bezier(0.34, 1.56, 0.64, 1)`; // under-damped -> bouncy
        }
    }
}
/** Whether this easing reads as "bouncy" — used by the mock agent for intent mapping. */
export function isBouncyEasing(easing) {
    if (easing.type === "preset")
        return (["bounce", "back", "elastic"].includes(easing.name) ||
            (isMeasuredEase(easing.name) && isMeasuredOvershoot(easing.name)));
    if (easing.type === "bezier")
        return easing.p2[1] > 1 || easing.p1[1] < 0;
    if (easing.type === "spring") {
        const r = easing.damping / (2 * Math.sqrt(easing.stiffness * easing.mass));
        return r < 1;
    }
    return false;
}
//# sourceMappingURL=easing.js.map