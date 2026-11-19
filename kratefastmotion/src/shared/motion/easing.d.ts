import { z } from "zod";
import { type MeasuredEase } from "./measuredEase.js";
/**
 * The hand-tuned presets, then the 12 measured curves ported from
 * motionmaxxing. The measured names are first-class presets: the agent can pass
 * `easing: { type: "preset", name: "softLand" }` to any tool, and the editor's
 * easing picker lists them alongside the classic ones.
 */
export declare const EASING_PRESETS: readonly ["linear", "ease", "ease-in", "ease-out", "ease-in-out", "ease-in-quad", "ease-out-quad", "ease-in-out-quad", "ease-in-cubic", "ease-out-cubic", "ease-in-out-cubic", "bounce", "back", "elastic", "snappy", "smooth", "soft", "cruise", "glide", "softInOut", "softLand", "gentleIn", "snapSettle", "whip", "accelExit", "crashOut", "popOver", "crashIn", "bounceHard"];
/** CSS cubic-bezier approximation for presets that aren't native CSS keywords. */
export declare const PRESET_BEZIER: Record<string, [number, number, number, number]>;
export declare const EasingPresetSchema: z.ZodEnum<["linear", "ease", "ease-in", "ease-out", "ease-in-out", "ease-in-quad", "ease-out-quad", "ease-in-out-quad", "ease-in-cubic", "ease-out-cubic", "ease-in-out-cubic", "bounce", "back", "elastic", "snappy", "smooth", "soft", "cruise", "glide", "softInOut", "softLand", "gentleIn", "snapSettle", "whip", "accelExit", "crashOut", "popOver", "crashIn", "bounceHard"]>;
export declare const BezierEasingSchema: z.ZodObject<{
    type: z.ZodLiteral<"bezier">;
    p1: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    p2: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, "strip", z.ZodTypeAny, {
    type: "bezier";
    p1: [number, number];
    p2: [number, number];
}, {
    type: "bezier";
    p1: [number, number];
    p2: [number, number];
}>;
export declare const SpringEasingSchema: z.ZodObject<{
    type: z.ZodLiteral<"spring">;
    stiffness: z.ZodNumber;
    damping: z.ZodNumber;
    mass: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "spring";
    stiffness: number;
    damping: number;
    mass: number;
}, {
    type: "spring";
    stiffness: number;
    damping: number;
    mass?: number | undefined;
}>;
export declare const PresetEasingSchema: z.ZodObject<{
    type: z.ZodLiteral<"preset">;
    name: z.ZodEnum<["linear", "ease", "ease-in", "ease-out", "ease-in-out", "ease-in-quad", "ease-out-quad", "ease-in-out-quad", "ease-in-cubic", "ease-out-cubic", "ease-in-out-cubic", "bounce", "back", "elastic", "snappy", "smooth", "soft", "cruise", "glide", "softInOut", "softLand", "gentleIn", "snapSettle", "whip", "accelExit", "crashOut", "popOver", "crashIn", "bounceHard"]>;
}, "strip", z.ZodTypeAny, {
    type: "preset";
    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
}, {
    type: "preset";
    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
}>;
export declare const EasingSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"preset">;
    name: z.ZodEnum<["linear", "ease", "ease-in", "ease-out", "ease-in-out", "ease-in-quad", "ease-out-quad", "ease-in-out-quad", "ease-in-cubic", "ease-out-cubic", "ease-in-out-cubic", "bounce", "back", "elastic", "snappy", "smooth", "soft", "cruise", "glide", "softInOut", "softLand", "gentleIn", "snapSettle", "whip", "accelExit", "crashOut", "popOver", "crashIn", "bounceHard"]>;
}, "strip", z.ZodTypeAny, {
    type: "preset";
    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
}, {
    type: "preset";
    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
}>, z.ZodObject<{
    type: z.ZodLiteral<"bezier">;
    p1: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    p2: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, "strip", z.ZodTypeAny, {
    type: "bezier";
    p1: [number, number];
    p2: [number, number];
}, {
    type: "bezier";
    p1: [number, number];
    p2: [number, number];
}>, z.ZodObject<{
    type: z.ZodLiteral<"spring">;
    stiffness: z.ZodNumber;
    damping: z.ZodNumber;
    mass: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "spring";
    stiffness: number;
    damping: number;
    mass: number;
}, {
    type: "spring";
    stiffness: number;
    damping: number;
    mass?: number | undefined;
}>]>;
export type Easing = z.infer<typeof EasingSchema>;
export type EasingPreset = z.infer<typeof EasingPresetSchema>;
export declare const easingPreset: (name: EasingPreset) => Easing;
export declare const easingBezier: (p1: [number, number], p2: [number, number]) => Easing;
export declare const easingSpring: (stiffness: number, damping: number, mass?: number) => Easing;
/** A measured curve from the motionmaxxing corpus, addressed by name. */
export declare const easingMeasured: (name: MeasuredEase) => Easing;
/** Whether a measured curve leans past its mark (the sample's overshoots). */
export declare function isMeasuredOvershoot(name: MeasuredEase): boolean;
/** Convert an easing to a CSS animation-timing-function string. */
export declare function easingToCss(easing: Easing): string;
/** Whether this easing reads as "bouncy" — used by the mock agent for intent mapping. */
export declare function isBouncyEasing(easing: Easing): boolean;
//# sourceMappingURL=easing.d.ts.map