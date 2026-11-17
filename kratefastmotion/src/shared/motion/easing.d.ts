import { z } from "zod";
export declare const EASING_PRESETS: readonly ["linear", "ease", "ease-in", "ease-out", "ease-in-out", "ease-in-quad", "ease-out-quad", "ease-in-out-quad", "ease-in-cubic", "ease-out-cubic", "ease-in-out-cubic", "bounce", "back", "elastic", "snappy", "smooth", "soft"];
/** CSS cubic-bezier approximation for presets that aren't native CSS keywords. */
export declare const PRESET_BEZIER: Record<string, [number, number, number, number]>;
export declare const EasingPresetSchema: z.ZodEnum<["linear", "ease", "ease-in", "ease-out", "ease-in-out", "ease-in-quad", "ease-out-quad", "ease-in-out-quad", "ease-in-cubic", "ease-out-cubic", "ease-in-out-cubic", "bounce", "back", "elastic", "snappy", "smooth", "soft"]>;
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
    name: z.ZodEnum<["linear", "ease", "ease-in", "ease-out", "ease-in-out", "ease-in-quad", "ease-out-quad", "ease-in-out-quad", "ease-in-cubic", "ease-out-cubic", "ease-in-out-cubic", "bounce", "back", "elastic", "snappy", "smooth", "soft"]>;
}, "strip", z.ZodTypeAny, {
    type: "preset";
    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
}, {
    type: "preset";
    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
}>;
export declare const EasingSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"preset">;
    name: z.ZodEnum<["linear", "ease", "ease-in", "ease-out", "ease-in-out", "ease-in-quad", "ease-out-quad", "ease-in-out-quad", "ease-in-cubic", "ease-out-cubic", "ease-in-out-cubic", "bounce", "back", "elastic", "snappy", "smooth", "soft"]>;
}, "strip", z.ZodTypeAny, {
    type: "preset";
    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
}, {
    type: "preset";
    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
/** Convert an easing to a CSS animation-timing-function string. */
export declare function easingToCss(easing: Easing): string;
/** Whether this easing reads as "bouncy" — used by the mock agent for intent mapping. */
export declare function isBouncyEasing(easing: Easing): boolean;
//# sourceMappingURL=easing.d.ts.map