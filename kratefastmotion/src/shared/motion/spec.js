import { z } from "zod";
import { EasingSchema, easingPreset } from "./easing.js";
import { KeyValueSchema, TransformPropertySchema } from "./transform.js";
export const zId = z.string().min(1);
export const CssStyleSchema = z
    .record(z.string(), z.union([z.string(), z.number()]))
    .default({});
export const KeyframeSchema = z.object({
    offset: z.number().min(0).max(1),
    properties: z.record(TransformPropertySchema, KeyValueSchema).default({}),
    easing: EasingSchema.optional(),
});
export const IterationCountSchema = z.union([z.number().int().positive(), z.literal("infinite")]);
export const DirectionSchema = z.enum([
    "normal",
    "reverse",
    "alternate",
    "alternate-reverse",
]);
export const FillModeSchema = z.enum(["none", "forwards", "backwards", "both"]);
export const PlayStateSchema = z.enum(["running", "paused"]);
export const TriggerSchema = z.enum(["onLoad", "onClick", "onHover", "onScroll", "afterDelay"]);
/** A single animatable element. The editable unit the agent tools operate on. */
export const MotionComponentSchema = z.object({
    id: zId,
    projectId: zId,
    sceneId: z.string().nullable().default(null),
    name: z.string(),
    selector: z.string().nullable().default(null),
    templateId: z.string().nullable().default(null),
    durationMs: z.number().int().positive().default(800),
    delayMs: z.number().int().nonnegative().default(0),
    iterationCount: IterationCountSchema.default(1),
    direction: DirectionSchema.default("normal"),
    fillMode: FillModeSchema.default("forwards"),
    playState: PlayStateSchema.default("running"),
    trigger: TriggerSchema.default("onLoad"),
    easing: EasingSchema.default(() => easingPreset("ease-out")),
    keyframes: z.array(KeyframeSchema).default([]),
    style: CssStyleSchema.default({}),
    orderIndex: z.number().int().default(0),
    parentId: z.string().nullable().default(null),
    createdAt: z.string(),
    updatedAt: z.string(),
});
export const SceneSchema = z.object({
    id: zId,
    name: z.string(),
    durationMs: z.number().int().positive().optional(),
});
export const GlobalTimingSchema = z
    .object({
    totalDurationMs: z.number().int().positive().optional(),
    defaultEasing: EasingSchema.optional(),
    // Project-wide tempo in beats-per-minute. When set, motion durations can
    // be quantized to musical beat divisions so every animation locks to the
    // same rhythmic grid — useful for syncing UI motion to a soundtrack.
    bpm: z.number().min(20).max(300).optional(),
})
    .default({});
export const MotionProjectSchema = z.object({
    id: zId,
    name: z.string(),
    description: z.string().default(""),
    scenes: z.array(SceneSchema).default([]),
    tokens: z.record(z.string(), z.union([z.string(), z.number()])).default({}),
    globalTiming: GlobalTimingSchema,
    status: z.enum(["draft", "published"]).default("draft"),
    sourceTemplateId: z.string().nullable().default(null),
    createdAt: z.string(),
    updatedAt: z.string(),
});
/** The assembled, runnable spec — project metadata + all components. */
export const MotionSpecSchema = z.object({
    project: MotionProjectSchema,
    components: z.array(MotionComponentSchema),
});
export const DEFAULT_EASING = easingPreset("ease-out");
//# sourceMappingURL=spec.js.map