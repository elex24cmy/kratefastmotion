import { z } from "zod";
export declare const HealthResponseSchema: z.ZodObject<{
    status: z.ZodLiteral<"ok">;
    version: z.ZodString;
    db: z.ZodBoolean;
    provider: z.ZodEnum<["mock", "openai"]>;
    toolCallSupported: z.ZodBoolean;
    puppeteer: z.ZodBoolean;
    ffmpeg: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    status: "ok";
    provider: "openai" | "mock";
    version: string;
    db: boolean;
    toolCallSupported: boolean;
    puppeteer: boolean;
    ffmpeg: boolean;
}, {
    status: "ok";
    provider: "openai" | "mock";
    version: string;
    db: boolean;
    toolCallSupported: boolean;
    puppeteer: boolean;
    ffmpeg: boolean;
}>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export declare const TemplateSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodString;
    description: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    spec: z.ZodUnknown;
    previewHtml: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    createdAt: string;
    description: string;
    category: string;
    tags: string[];
    previewHtml: string | null;
    spec?: unknown;
}, {
    name: string;
    id: string;
    createdAt: string;
    description: string;
    category: string;
    tags?: string[] | undefined;
    spec?: unknown;
    previewHtml?: string | null | undefined;
}>;
export type Template = z.infer<typeof TemplateSchema>;
export declare const CreateProjectInputSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    templateId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    templateId?: string | undefined;
}, {
    name?: string | undefined;
    templateId?: string | undefined;
}>;
export declare const ProjectResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodDefault<z.ZodString>;
    scenes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        durationMs: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        durationMs?: number | undefined;
    }, {
        name: string;
        id: string;
        durationMs?: number | undefined;
    }>, "many">>;
    tokens: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber]>>>;
    globalTiming: z.ZodDefault<z.ZodObject<{
        totalDurationMs: z.ZodOptional<z.ZodNumber>;
        defaultEasing: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
        }>]>>;
        bpm: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        totalDurationMs?: number | undefined;
        defaultEasing?: {
            type: "bezier";
            p1: [number, number];
            p2: [number, number];
        } | {
            type: "spring";
            stiffness: number;
            damping: number;
            mass: number;
        } | {
            type: "preset";
            name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
        } | undefined;
        bpm?: number | undefined;
    }, {
        totalDurationMs?: number | undefined;
        defaultEasing?: {
            type: "bezier";
            p1: [number, number];
            p2: [number, number];
        } | {
            type: "spring";
            stiffness: number;
            damping: number;
            mass?: number | undefined;
        } | {
            type: "preset";
            name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
        } | undefined;
        bpm?: number | undefined;
    }>>;
    status: z.ZodDefault<z.ZodEnum<["draft", "published"]>>;
    sourceTemplateId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    spec: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    status: "draft" | "published";
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    scenes: {
        name: string;
        id: string;
        durationMs?: number | undefined;
    }[];
    tokens: Record<string, string | number>;
    globalTiming: {
        totalDurationMs?: number | undefined;
        defaultEasing?: {
            type: "bezier";
            p1: [number, number];
            p2: [number, number];
        } | {
            type: "spring";
            stiffness: number;
            damping: number;
            mass: number;
        } | {
            type: "preset";
            name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
        } | undefined;
        bpm?: number | undefined;
    };
    sourceTemplateId: string | null;
    spec?: unknown;
}, {
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    status?: "draft" | "published" | undefined;
    description?: string | undefined;
    scenes?: {
        name: string;
        id: string;
        durationMs?: number | undefined;
    }[] | undefined;
    tokens?: Record<string, string | number> | undefined;
    globalTiming?: {
        totalDurationMs?: number | undefined;
        defaultEasing?: {
            type: "bezier";
            p1: [number, number];
            p2: [number, number];
        } | {
            type: "spring";
            stiffness: number;
            damping: number;
            mass?: number | undefined;
        } | {
            type: "preset";
            name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
        } | undefined;
        bpm?: number | undefined;
    } | undefined;
    sourceTemplateId?: string | null | undefined;
    spec?: unknown;
}>;
export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;
export declare const ChatRequestSchema: z.ZodObject<{
    message: z.ZodString;
    model: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    model?: string | undefined;
}, {
    message: string;
    model?: string | undefined;
}>;
/** Typed SSE event frames for the chat stream. */
export declare const ChatEventSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"meta">;
    provider: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "meta";
    provider: string;
}, {
    type: "meta";
    provider: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"token">;
    delta: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "token";
    delta: string;
}, {
    type: "token";
    delta: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"thinking">;
    text: z.ZodString;
    analysis: z.ZodDefault<z.ZodString>;
    constraints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    options: z.ZodDefault<z.ZodArray<z.ZodObject<{
        approach: z.ZodString;
        tradeoffs: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        approach: string;
        tradeoffs: string;
    }, {
        approach: string;
        tradeoffs: string;
    }>, "many">>;
    chosenApproach: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    options: {
        approach: string;
        tradeoffs: string;
    }[];
    type: "thinking";
    text: string;
    analysis: string;
    constraints: string[];
    chosenApproach: string;
}, {
    type: "thinking";
    text: string;
    options?: {
        approach: string;
        tradeoffs: string;
    }[] | undefined;
    analysis?: string | undefined;
    constraints?: string[] | undefined;
    chosenApproach?: string | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"reasoning">;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "reasoning";
    text: string;
}, {
    type: "reasoning";
    text: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"plan">;
    steps: z.ZodArray<z.ZodObject<{
        tool: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        description: string;
        tool: string;
    }, {
        description: string;
        tool: string;
    }>, "many">;
    summary: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "plan";
    steps: {
        description: string;
        tool: string;
    }[];
    summary: string;
}, {
    type: "plan";
    steps: {
        description: string;
        tool: string;
    }[];
    summary: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"tool_call">;
    tool: z.ZodString;
    args: z.ZodUnknown;
    callId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "tool_call";
    tool: string;
    callId: string;
    args?: unknown;
}, {
    type: "tool_call";
    tool: string;
    callId: string;
    args?: unknown;
}>, z.ZodObject<{
    type: z.ZodLiteral<"tool_result">;
    callId: z.ZodString;
    tool: z.ZodString;
    result: z.ZodUnknown;
    summary: z.ZodString;
    ok: z.ZodDefault<z.ZodBoolean>;
    specChanged: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "tool_result";
    tool: string;
    summary: string;
    ok: boolean;
    callId: string;
    specChanged: boolean;
    result?: unknown;
}, {
    type: "tool_result";
    tool: string;
    summary: string;
    callId: string;
    ok?: boolean | undefined;
    result?: unknown;
    specChanged?: boolean | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"spec_update">;
    components: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        sceneId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        selector: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        templateId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        durationMs: z.ZodDefault<z.ZodNumber>;
        delayMs: z.ZodDefault<z.ZodNumber>;
        iterationCount: z.ZodDefault<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"infinite">]>>;
        direction: z.ZodDefault<z.ZodEnum<["normal", "reverse", "alternate", "alternate-reverse"]>>;
        fillMode: z.ZodDefault<z.ZodEnum<["none", "forwards", "backwards", "both"]>>;
        playState: z.ZodDefault<z.ZodEnum<["running", "paused"]>>;
        trigger: z.ZodDefault<z.ZodEnum<["onLoad", "onClick", "onHover", "onScroll", "afterDelay"]>>;
        easing: z.ZodDefault<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
        }>]>>;
        keyframes: z.ZodDefault<z.ZodArray<z.ZodObject<{
            offset: z.ZodNumber;
            properties: z.ZodDefault<z.ZodRecord<z.ZodEnum<["translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "opacity", "blur", "color", "backgroundColor", "width", "height", "borderRadius", "fontSize", "letterSpacing", "boxShadow", "clipPath"]>, z.ZodUnion<[z.ZodNumber, z.ZodString]>>>;
            easing: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
            }>]>>;
        }, "strip", z.ZodTypeAny, {
            offset: number;
            properties: Partial<Record<"translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath", string | number>>;
            easing?: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass: number;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            } | undefined;
        }, {
            offset: number;
            properties?: Partial<Record<"translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath", string | number>> | undefined;
            easing?: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass?: number | undefined;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            } | undefined;
        }>, "many">>;
        style: z.ZodDefault<z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber]>>>>;
        orderIndex: z.ZodDefault<z.ZodNumber>;
        parentId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        easing: {
            type: "bezier";
            p1: [number, number];
            p2: [number, number];
        } | {
            type: "spring";
            stiffness: number;
            damping: number;
            mass: number;
        } | {
            type: "preset";
            name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
        };
        id: string;
        projectId: string;
        sceneId: string | null;
        selector: string | null;
        templateId: string | null;
        durationMs: number;
        delayMs: number;
        iterationCount: number | "infinite";
        direction: "reverse" | "normal" | "alternate" | "alternate-reverse";
        fillMode: "none" | "forwards" | "backwards" | "both";
        playState: "running" | "paused";
        trigger: "onLoad" | "onClick" | "onHover" | "onScroll" | "afterDelay";
        keyframes: {
            offset: number;
            properties: Partial<Record<"translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath", string | number>>;
            easing?: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass: number;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            } | undefined;
        }[];
        style: Record<string, string | number>;
        orderIndex: number;
        parentId: string | null;
        createdAt: string;
        updatedAt: string;
    }, {
        name: string;
        id: string;
        projectId: string;
        createdAt: string;
        updatedAt: string;
        easing?: {
            type: "bezier";
            p1: [number, number];
            p2: [number, number];
        } | {
            type: "spring";
            stiffness: number;
            damping: number;
            mass?: number | undefined;
        } | {
            type: "preset";
            name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
        } | undefined;
        sceneId?: string | null | undefined;
        selector?: string | null | undefined;
        templateId?: string | null | undefined;
        durationMs?: number | undefined;
        delayMs?: number | undefined;
        iterationCount?: number | "infinite" | undefined;
        direction?: "reverse" | "normal" | "alternate" | "alternate-reverse" | undefined;
        fillMode?: "none" | "forwards" | "backwards" | "both" | undefined;
        playState?: "running" | "paused" | undefined;
        trigger?: "onLoad" | "onClick" | "onHover" | "onScroll" | "afterDelay" | undefined;
        keyframes?: {
            offset: number;
            properties?: Partial<Record<"translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath", string | number>> | undefined;
            easing?: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass?: number | undefined;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            } | undefined;
        }[] | undefined;
        style?: Record<string, string | number> | undefined;
        orderIndex?: number | undefined;
        parentId?: string | null | undefined;
    }>, "many">;
    project: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodDefault<z.ZodString>;
        scenes: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            durationMs: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id: string;
            durationMs?: number | undefined;
        }, {
            name: string;
            id: string;
            durationMs?: number | undefined;
        }>, "many">>;
        tokens: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber]>>>;
        globalTiming: z.ZodDefault<z.ZodObject<{
            totalDurationMs: z.ZodOptional<z.ZodNumber>;
            defaultEasing: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
            }>]>>;
            bpm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            totalDurationMs?: number | undefined;
            defaultEasing?: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass: number;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            } | undefined;
            bpm?: number | undefined;
        }, {
            totalDurationMs?: number | undefined;
            defaultEasing?: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass?: number | undefined;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            } | undefined;
            bpm?: number | undefined;
        }>>;
        status: z.ZodDefault<z.ZodEnum<["draft", "published"]>>;
        sourceTemplateId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: "draft" | "published";
        name: string;
        id: string;
        createdAt: string;
        updatedAt: string;
        description: string;
        scenes: {
            name: string;
            id: string;
            durationMs?: number | undefined;
        }[];
        tokens: Record<string, string | number>;
        globalTiming: {
            totalDurationMs?: number | undefined;
            defaultEasing?: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass: number;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            } | undefined;
            bpm?: number | undefined;
        };
        sourceTemplateId: string | null;
    }, {
        name: string;
        id: string;
        createdAt: string;
        updatedAt: string;
        status?: "draft" | "published" | undefined;
        description?: string | undefined;
        scenes?: {
            name: string;
            id: string;
            durationMs?: number | undefined;
        }[] | undefined;
        tokens?: Record<string, string | number> | undefined;
        globalTiming?: {
            totalDurationMs?: number | undefined;
            defaultEasing?: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass?: number | undefined;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            } | undefined;
            bpm?: number | undefined;
        } | undefined;
        sourceTemplateId?: string | null | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "spec_update";
    components: {
        name: string;
        easing: {
            type: "bezier";
            p1: [number, number];
            p2: [number, number];
        } | {
            type: "spring";
            stiffness: number;
            damping: number;
            mass: number;
        } | {
            type: "preset";
            name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
        };
        id: string;
        projectId: string;
        sceneId: string | null;
        selector: string | null;
        templateId: string | null;
        durationMs: number;
        delayMs: number;
        iterationCount: number | "infinite";
        direction: "reverse" | "normal" | "alternate" | "alternate-reverse";
        fillMode: "none" | "forwards" | "backwards" | "both";
        playState: "running" | "paused";
        trigger: "onLoad" | "onClick" | "onHover" | "onScroll" | "afterDelay";
        keyframes: {
            offset: number;
            properties: Partial<Record<"translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath", string | number>>;
            easing?: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass: number;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            } | undefined;
        }[];
        style: Record<string, string | number>;
        orderIndex: number;
        parentId: string | null;
        createdAt: string;
        updatedAt: string;
    }[];
    project?: {
        status: "draft" | "published";
        name: string;
        id: string;
        createdAt: string;
        updatedAt: string;
        description: string;
        scenes: {
            name: string;
            id: string;
            durationMs?: number | undefined;
        }[];
        tokens: Record<string, string | number>;
        globalTiming: {
            totalDurationMs?: number | undefined;
            defaultEasing?: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass: number;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            } | undefined;
            bpm?: number | undefined;
        };
        sourceTemplateId: string | null;
    } | undefined;
}, {
    type: "spec_update";
    components: {
        name: string;
        id: string;
        projectId: string;
        createdAt: string;
        updatedAt: string;
        easing?: {
            type: "bezier";
            p1: [number, number];
            p2: [number, number];
        } | {
            type: "spring";
            stiffness: number;
            damping: number;
            mass?: number | undefined;
        } | {
            type: "preset";
            name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
        } | undefined;
        sceneId?: string | null | undefined;
        selector?: string | null | undefined;
        templateId?: string | null | undefined;
        durationMs?: number | undefined;
        delayMs?: number | undefined;
        iterationCount?: number | "infinite" | undefined;
        direction?: "reverse" | "normal" | "alternate" | "alternate-reverse" | undefined;
        fillMode?: "none" | "forwards" | "backwards" | "both" | undefined;
        playState?: "running" | "paused" | undefined;
        trigger?: "onLoad" | "onClick" | "onHover" | "onScroll" | "afterDelay" | undefined;
        keyframes?: {
            offset: number;
            properties?: Partial<Record<"translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath", string | number>> | undefined;
            easing?: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass?: number | undefined;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            } | undefined;
        }[] | undefined;
        style?: Record<string, string | number> | undefined;
        orderIndex?: number | undefined;
        parentId?: string | null | undefined;
    }[];
    project?: {
        name: string;
        id: string;
        createdAt: string;
        updatedAt: string;
        status?: "draft" | "published" | undefined;
        description?: string | undefined;
        scenes?: {
            name: string;
            id: string;
            durationMs?: number | undefined;
        }[] | undefined;
        tokens?: Record<string, string | number> | undefined;
        globalTiming?: {
            totalDurationMs?: number | undefined;
            defaultEasing?: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass?: number | undefined;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            } | undefined;
            bpm?: number | undefined;
        } | undefined;
        sourceTemplateId?: string | null | undefined;
    } | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"reflection">;
    text: z.ZodString;
    failedTools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    suggestion: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "reflection";
    text: string;
    failedTools: string[];
    suggestion?: string | undefined;
}, {
    type: "reflection";
    text: string;
    failedTools?: string[] | undefined;
    suggestion?: string | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"proactive_suggestion">;
    suggestions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        reason: z.ZodString;
        tool: z.ZodString;
        prompt: z.ZodString;
        kind: z.ZodDefault<z.ZodEnum<["refine", "extend", "diversify", "interact", "sequence", "polish", "collaborate", "export", "inspect"]>>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        title: string;
        tool: string;
        kind: "sequence" | "export" | "refine" | "extend" | "diversify" | "interact" | "polish" | "collaborate" | "inspect";
        reason: string;
    }, {
        prompt: string;
        title: string;
        tool: string;
        reason: string;
        kind?: "sequence" | "export" | "refine" | "extend" | "diversify" | "interact" | "polish" | "collaborate" | "inspect" | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "proactive_suggestion";
    suggestions: {
        prompt: string;
        title: string;
        tool: string;
        kind: "sequence" | "export" | "refine" | "extend" | "diversify" | "interact" | "polish" | "collaborate" | "inspect";
        reason: string;
    }[];
}, {
    type: "proactive_suggestion";
    suggestions?: {
        prompt: string;
        title: string;
        tool: string;
        reason: string;
        kind?: "sequence" | "export" | "refine" | "extend" | "diversify" | "interact" | "polish" | "collaborate" | "inspect" | undefined;
    }[] | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"goal">;
    root: z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        status: z.ZodEnum<["pending", "in_progress", "completed", "skipped"]>;
        children: z.ZodDefault<z.ZodArray<z.ZodLazy<z.ZodAny>, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "in_progress" | "completed" | "skipped";
        id: string;
        label: string;
        children: any[];
    }, {
        status: "pending" | "in_progress" | "completed" | "skipped";
        id: string;
        label: string;
        children?: any[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "goal";
    root: {
        status: "pending" | "in_progress" | "completed" | "skipped";
        id: string;
        label: string;
        children: any[];
    };
}, {
    type: "goal";
    root: {
        status: "pending" | "in_progress" | "completed" | "skipped";
        id: string;
        label: string;
        children?: any[] | undefined;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"session_summary">;
    summary: z.ZodObject<{
        headline: z.ZodString;
        intent: z.ZodString;
        actions: z.ZodArray<z.ZodString, "many">;
        outcomes: z.ZodArray<z.ZodString, "many">;
        metrics: z.ZodObject<{
            toolCalls: z.ZodNumber;
            successes: z.ZodNumber;
            failures: z.ZodNumber;
            goalsTotal: z.ZodNumber;
            goalsCompleted: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            toolCalls: number;
            successes: number;
            failures: number;
            goalsTotal: number;
            goalsCompleted: number;
        }, {
            toolCalls: number;
            successes: number;
            failures: number;
            goalsTotal: number;
            goalsCompleted: number;
        }>;
        nextSteps: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        intent: string;
        headline: string;
        actions: string[];
        outcomes: string[];
        metrics: {
            toolCalls: number;
            successes: number;
            failures: number;
            goalsTotal: number;
            goalsCompleted: number;
        };
        nextSteps: string[];
    }, {
        intent: string;
        headline: string;
        actions: string[];
        outcomes: string[];
        metrics: {
            toolCalls: number;
            successes: number;
            failures: number;
            goalsTotal: number;
            goalsCompleted: number;
        };
        nextSteps: string[];
    }>;
}, "strip", z.ZodTypeAny, {
    type: "session_summary";
    summary: {
        intent: string;
        headline: string;
        actions: string[];
        outcomes: string[];
        metrics: {
            toolCalls: number;
            successes: number;
            failures: number;
            goalsTotal: number;
            goalsCompleted: number;
        };
        nextSteps: string[];
    };
}, {
    type: "session_summary";
    summary: {
        intent: string;
        headline: string;
        actions: string[];
        outcomes: string[];
        metrics: {
            toolCalls: number;
            successes: number;
            failures: number;
            goalsTotal: number;
            goalsCompleted: number;
        };
        nextSteps: string[];
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"done">;
    message: z.ZodString;
    tokensIn: z.ZodDefault<z.ZodNumber>;
    tokensOut: z.ZodDefault<z.ZodNumber>;
    confidence: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    message: string;
    type: "done";
    tokensIn: number;
    tokensOut: number;
    confidence?: number | undefined;
}, {
    message: string;
    type: "done";
    tokensIn?: number | undefined;
    tokensOut?: number | undefined;
    confidence?: number | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"quality_report">;
    overall: z.ZodNumber;
    grade: z.ZodString;
    pass: z.ZodBoolean;
    autofixCount: z.ZodNumber;
    dimensions: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        score: z.ZodNumber;
        passed: z.ZodBoolean;
        findingCount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        key: string;
        score: number;
        passed: boolean;
        findingCount: number;
    }, {
        key: string;
        score: number;
        passed: boolean;
        findingCount: number;
    }>, "many">;
    suggestedNext: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "quality_report";
    overall: number;
    grade: string;
    pass: boolean;
    autofixCount: number;
    dimensions: {
        key: string;
        score: number;
        passed: boolean;
        findingCount: number;
    }[];
    suggestedNext: string[];
}, {
    type: "quality_report";
    overall: number;
    grade: string;
    pass: boolean;
    autofixCount: number;
    dimensions: {
        key: string;
        score: number;
        passed: boolean;
        findingCount: number;
    }[];
    suggestedNext?: string[] | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"error">;
    message: z.ZodString;
    recoverable: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    message: string;
    type: "error";
    recoverable: boolean;
}, {
    message: string;
    type: "error";
    recoverable?: boolean | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"checkpoint">;
    checkpointId: z.ZodString;
    triggerTool: z.ZodString;
    componentCount: z.ZodNumber;
    label: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "checkpoint";
    label: string;
    componentCount: number;
    checkpointId: string;
    triggerTool: string;
}, {
    type: "checkpoint";
    label: string;
    componentCount: number;
    checkpointId: string;
    triggerTool: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"hook_warning">;
    warnings: z.ZodArray<z.ZodString, "many">;
    tool: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "hook_warning";
    tool: string;
    warnings: string[];
}, {
    type: "hook_warning";
    tool: string;
    warnings: string[];
}>, z.ZodObject<{
    type: z.ZodLiteral<"plan_progress">;
    actionId: z.ZodString;
    actionType: z.ZodString;
    description: z.ZodString;
    completed: z.ZodNumber;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "plan_progress";
    description: string;
    actionType: string;
    completed: number;
    actionId: string;
    total: number;
}, {
    type: "plan_progress";
    description: string;
    actionType: string;
    completed: number;
    actionId: string;
    total: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"plan_state">;
    planSummary: z.ZodString;
    currentActionIndex: z.ZodNumber;
    completed: z.ZodNumber;
    failed: z.ZodNumber;
    total: z.ZodNumber;
    cancelRequested: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    type: "plan_state";
    completed: number;
    total: number;
    planSummary: string;
    currentActionIndex: number;
    failed: number;
    cancelRequested: boolean;
}, {
    type: "plan_state";
    completed: number;
    total: number;
    planSummary: string;
    currentActionIndex: number;
    failed: number;
    cancelRequested: boolean;
}>, z.ZodObject<{
    type: z.ZodLiteral<"budget">;
    label: z.ZodString;
    consumed: z.ZodNumber;
    initial: z.ZodNumber;
    remaining: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "budget";
    label: string;
    consumed: number;
    initial: number;
    remaining: number;
}, {
    type: "budget";
    label: string;
    consumed: number;
    initial: number;
    remaining: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"subagent_started">;
    goal: z.ZodString;
    toolCount: z.ZodNumber;
    maxIterations: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "subagent_started";
    goal: string;
    toolCount: number;
    maxIterations: number;
}, {
    type: "subagent_started";
    goal: string;
    toolCount: number;
    maxIterations: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"subagent_completed">;
    goal: z.ZodString;
    allSucceeded: z.ZodBoolean;
    specChanged: z.ZodBoolean;
    durationMs: z.ZodNumber;
    iterationsUsed: z.ZodNumber;
    summary: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "subagent_completed";
    durationMs: number;
    summary: string;
    specChanged: boolean;
    goal: string;
    allSucceeded: boolean;
    iterationsUsed: number;
}, {
    type: "subagent_completed";
    durationMs: number;
    summary: string;
    specChanged: boolean;
    goal: string;
    allSucceeded: boolean;
    iterationsUsed: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"editor_command">;
    command: z.ZodString;
    args: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    type: "editor_command";
    args: Record<string, unknown>;
    command: string;
}, {
    type: "editor_command";
    command: string;
    args?: Record<string, unknown> | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"parallel_tool_batch">;
    count: z.ZodNumber;
    tools: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    type: "parallel_tool_batch";
    count: number;
    tools: string[];
}, {
    type: "parallel_tool_batch";
    count: number;
    tools: string[];
}>]>;
export type ChatEvent = z.infer<typeof ChatEventSchema>;
export declare const MessageSchema: z.ZodObject<{
    id: z.ZodString;
    projectId: z.ZodString;
    role: z.ZodEnum<["user", "assistant", "system", "tool"]>;
    content: z.ZodDefault<z.ZodString>;
    toolName: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    toolCalls: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    toolCallId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    projectId: string;
    createdAt: string;
    role: "tool" | "user" | "assistant" | "system";
    content: string;
    toolName: string | null;
    toolCalls?: any[] | undefined;
    toolCallId?: string | null | undefined;
}, {
    id: string;
    projectId: string;
    createdAt: string;
    role: "tool" | "user" | "assistant" | "system";
    toolCalls?: any[] | undefined;
    content?: string | undefined;
    toolName?: string | null | undefined;
    toolCallId?: string | null | undefined;
}>;
export type Message = z.infer<typeof MessageSchema>;
export declare const ExportHtmlResponseSchema: z.ZodObject<{
    html: z.ZodString;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    html: string;
    url: string;
}, {
    html: string;
    url: string;
}>;
export declare const ExportVideoInputSchema: z.ZodObject<{
    format: z.ZodDefault<z.ZodEnum<["mp4", "gif", "webm"]>>;
    fps: z.ZodDefault<z.ZodNumber>;
    width: z.ZodDefault<z.ZodNumber>;
    height: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
    format: "mp4" | "gif" | "webm";
    fps: number;
}, {
    width?: number | undefined;
    height?: number | undefined;
    format?: "mp4" | "gif" | "webm" | undefined;
    fps?: number | undefined;
}>;
export declare const ExportJobResponseSchema: z.ZodObject<{
    jobId: z.ZodString;
    status: z.ZodEnum<["pending", "running", "done", "failed"]>;
}, "strip", z.ZodTypeAny, {
    status: "running" | "pending" | "done" | "failed";
    jobId: string;
}, {
    status: "running" | "pending" | "done" | "failed";
    jobId: string;
}>;
export declare const ExportJobStatusSchema: z.ZodObject<{
    id: z.ZodString;
    projectId: z.ZodString;
    format: z.ZodString;
    status: z.ZodEnum<["pending", "running", "done", "failed"]>;
    filePath: z.ZodNullable<z.ZodString>;
    error: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    completedAt: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    error: string | null;
    status: "running" | "pending" | "done" | "failed";
    id: string;
    projectId: string;
    createdAt: string;
    format: string;
    filePath: string | null;
    completedAt: string | null;
}, {
    error: string | null;
    status: "running" | "pending" | "done" | "failed";
    id: string;
    projectId: string;
    createdAt: string;
    format: string;
    filePath: string | null;
    completedAt: string | null;
}>;
export type ExportJobStatus = z.infer<typeof ExportJobStatusSchema>;
export declare const CreateSkillInputSchema: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
    description: string;
    tags: string[];
    componentId?: string | undefined;
}, {
    name: string;
    projectId: string;
    description: string;
    componentId?: string | undefined;
    tags?: string[] | undefined;
}>;
export type CreateSkillInput = z.infer<typeof CreateSkillInputSchema>;
export declare const SkillSummarySchema: z.ZodObject<Pick<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    version: z.ZodDefault<z.ZodString>;
    sourceProjectId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    sourceComponentId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    manifest: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        version: z.ZodDefault<z.ZodString>;
        outputType: z.ZodDefault<z.ZodEnum<["html", "spec", "code"]>>;
        inputSchema: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        version: string;
        outputType: "code" | "html" | "spec";
        inputSchema: Record<string, unknown>;
    }, {
        name: string;
        description: string;
        version?: string | undefined;
        outputType?: "code" | "html" | "spec" | undefined;
        inputSchema?: Record<string, unknown> | undefined;
    }>;
    motionSpec: z.ZodObject<{
        project: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodDefault<z.ZodString>;
            scenes: z.ZodDefault<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
                durationMs: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                id: string;
                durationMs?: number | undefined;
            }, {
                name: string;
                id: string;
                durationMs?: number | undefined;
            }>, "many">>;
            tokens: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber]>>>;
            globalTiming: z.ZodDefault<z.ZodObject<{
                totalDurationMs: z.ZodOptional<z.ZodNumber>;
                defaultEasing: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
                }>]>>;
                bpm: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                totalDurationMs?: number | undefined;
                defaultEasing?: {
                    type: "bezier";
                    p1: [number, number];
                    p2: [number, number];
                } | {
                    type: "spring";
                    stiffness: number;
                    damping: number;
                    mass: number;
                } | {
                    type: "preset";
                    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
                } | undefined;
                bpm?: number | undefined;
            }, {
                totalDurationMs?: number | undefined;
                defaultEasing?: {
                    type: "bezier";
                    p1: [number, number];
                    p2: [number, number];
                } | {
                    type: "spring";
                    stiffness: number;
                    damping: number;
                    mass?: number | undefined;
                } | {
                    type: "preset";
                    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
                } | undefined;
                bpm?: number | undefined;
            }>>;
            status: z.ZodDefault<z.ZodEnum<["draft", "published"]>>;
            sourceTemplateId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            status: "draft" | "published";
            name: string;
            id: string;
            createdAt: string;
            updatedAt: string;
            description: string;
            scenes: {
                name: string;
                id: string;
                durationMs?: number | undefined;
            }[];
            tokens: Record<string, string | number>;
            globalTiming: {
                totalDurationMs?: number | undefined;
                defaultEasing?: {
                    type: "bezier";
                    p1: [number, number];
                    p2: [number, number];
                } | {
                    type: "spring";
                    stiffness: number;
                    damping: number;
                    mass: number;
                } | {
                    type: "preset";
                    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
                } | undefined;
                bpm?: number | undefined;
            };
            sourceTemplateId: string | null;
        }, {
            name: string;
            id: string;
            createdAt: string;
            updatedAt: string;
            status?: "draft" | "published" | undefined;
            description?: string | undefined;
            scenes?: {
                name: string;
                id: string;
                durationMs?: number | undefined;
            }[] | undefined;
            tokens?: Record<string, string | number> | undefined;
            globalTiming?: {
                totalDurationMs?: number | undefined;
                defaultEasing?: {
                    type: "bezier";
                    p1: [number, number];
                    p2: [number, number];
                } | {
                    type: "spring";
                    stiffness: number;
                    damping: number;
                    mass?: number | undefined;
                } | {
                    type: "preset";
                    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
                } | undefined;
                bpm?: number | undefined;
            } | undefined;
            sourceTemplateId?: string | null | undefined;
        }>;
        components: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            projectId: z.ZodString;
            sceneId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            selector: z.ZodDefault<z.ZodNullable<z.ZodString>>;
            templateId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
            durationMs: z.ZodDefault<z.ZodNumber>;
            delayMs: z.ZodDefault<z.ZodNumber>;
            iterationCount: z.ZodDefault<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"infinite">]>>;
            direction: z.ZodDefault<z.ZodEnum<["normal", "reverse", "alternate", "alternate-reverse"]>>;
            fillMode: z.ZodDefault<z.ZodEnum<["none", "forwards", "backwards", "both"]>>;
            playState: z.ZodDefault<z.ZodEnum<["running", "paused"]>>;
            trigger: z.ZodDefault<z.ZodEnum<["onLoad", "onClick", "onHover", "onScroll", "afterDelay"]>>;
            easing: z.ZodDefault<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
            }>]>>;
            keyframes: z.ZodDefault<z.ZodArray<z.ZodObject<{
                offset: z.ZodNumber;
                properties: z.ZodDefault<z.ZodRecord<z.ZodEnum<["translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "opacity", "blur", "color", "backgroundColor", "width", "height", "borderRadius", "fontSize", "letterSpacing", "boxShadow", "clipPath"]>, z.ZodUnion<[z.ZodNumber, z.ZodString]>>>;
                easing: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
                }>]>>;
            }, "strip", z.ZodTypeAny, {
                offset: number;
                properties: Partial<Record<"translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath", string | number>>;
                easing?: {
                    type: "bezier";
                    p1: [number, number];
                    p2: [number, number];
                } | {
                    type: "spring";
                    stiffness: number;
                    damping: number;
                    mass: number;
                } | {
                    type: "preset";
                    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
                } | undefined;
            }, {
                offset: number;
                properties?: Partial<Record<"translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath", string | number>> | undefined;
                easing?: {
                    type: "bezier";
                    p1: [number, number];
                    p2: [number, number];
                } | {
                    type: "spring";
                    stiffness: number;
                    damping: number;
                    mass?: number | undefined;
                } | {
                    type: "preset";
                    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
                } | undefined;
            }>, "many">>;
            style: z.ZodDefault<z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber]>>>>;
            orderIndex: z.ZodDefault<z.ZodNumber>;
            parentId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            easing: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass: number;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            };
            id: string;
            projectId: string;
            sceneId: string | null;
            selector: string | null;
            templateId: string | null;
            durationMs: number;
            delayMs: number;
            iterationCount: number | "infinite";
            direction: "reverse" | "normal" | "alternate" | "alternate-reverse";
            fillMode: "none" | "forwards" | "backwards" | "both";
            playState: "running" | "paused";
            trigger: "onLoad" | "onClick" | "onHover" | "onScroll" | "afterDelay";
            keyframes: {
                offset: number;
                properties: Partial<Record<"translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath", string | number>>;
                easing?: {
                    type: "bezier";
                    p1: [number, number];
                    p2: [number, number];
                } | {
                    type: "spring";
                    stiffness: number;
                    damping: number;
                    mass: number;
                } | {
                    type: "preset";
                    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
                } | undefined;
            }[];
            style: Record<string, string | number>;
            orderIndex: number;
            parentId: string | null;
            createdAt: string;
            updatedAt: string;
        }, {
            name: string;
            id: string;
            projectId: string;
            createdAt: string;
            updatedAt: string;
            easing?: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass?: number | undefined;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            } | undefined;
            sceneId?: string | null | undefined;
            selector?: string | null | undefined;
            templateId?: string | null | undefined;
            durationMs?: number | undefined;
            delayMs?: number | undefined;
            iterationCount?: number | "infinite" | undefined;
            direction?: "reverse" | "normal" | "alternate" | "alternate-reverse" | undefined;
            fillMode?: "none" | "forwards" | "backwards" | "both" | undefined;
            playState?: "running" | "paused" | undefined;
            trigger?: "onLoad" | "onClick" | "onHover" | "onScroll" | "afterDelay" | undefined;
            keyframes?: {
                offset: number;
                properties?: Partial<Record<"translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath", string | number>> | undefined;
                easing?: {
                    type: "bezier";
                    p1: [number, number];
                    p2: [number, number];
                } | {
                    type: "spring";
                    stiffness: number;
                    damping: number;
                    mass?: number | undefined;
                } | {
                    type: "preset";
                    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
                } | undefined;
            }[] | undefined;
            style?: Record<string, string | number> | undefined;
            orderIndex?: number | undefined;
            parentId?: string | null | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        project: {
            status: "draft" | "published";
            name: string;
            id: string;
            createdAt: string;
            updatedAt: string;
            description: string;
            scenes: {
                name: string;
                id: string;
                durationMs?: number | undefined;
            }[];
            tokens: Record<string, string | number>;
            globalTiming: {
                totalDurationMs?: number | undefined;
                defaultEasing?: {
                    type: "bezier";
                    p1: [number, number];
                    p2: [number, number];
                } | {
                    type: "spring";
                    stiffness: number;
                    damping: number;
                    mass: number;
                } | {
                    type: "preset";
                    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
                } | undefined;
                bpm?: number | undefined;
            };
            sourceTemplateId: string | null;
        };
        components: {
            name: string;
            easing: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass: number;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            };
            id: string;
            projectId: string;
            sceneId: string | null;
            selector: string | null;
            templateId: string | null;
            durationMs: number;
            delayMs: number;
            iterationCount: number | "infinite";
            direction: "reverse" | "normal" | "alternate" | "alternate-reverse";
            fillMode: "none" | "forwards" | "backwards" | "both";
            playState: "running" | "paused";
            trigger: "onLoad" | "onClick" | "onHover" | "onScroll" | "afterDelay";
            keyframes: {
                offset: number;
                properties: Partial<Record<"translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath", string | number>>;
                easing?: {
                    type: "bezier";
                    p1: [number, number];
                    p2: [number, number];
                } | {
                    type: "spring";
                    stiffness: number;
                    damping: number;
                    mass: number;
                } | {
                    type: "preset";
                    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
                } | undefined;
            }[];
            style: Record<string, string | number>;
            orderIndex: number;
            parentId: string | null;
            createdAt: string;
            updatedAt: string;
        }[];
    }, {
        project: {
            name: string;
            id: string;
            createdAt: string;
            updatedAt: string;
            status?: "draft" | "published" | undefined;
            description?: string | undefined;
            scenes?: {
                name: string;
                id: string;
                durationMs?: number | undefined;
            }[] | undefined;
            tokens?: Record<string, string | number> | undefined;
            globalTiming?: {
                totalDurationMs?: number | undefined;
                defaultEasing?: {
                    type: "bezier";
                    p1: [number, number];
                    p2: [number, number];
                } | {
                    type: "spring";
                    stiffness: number;
                    damping: number;
                    mass?: number | undefined;
                } | {
                    type: "preset";
                    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
                } | undefined;
                bpm?: number | undefined;
            } | undefined;
            sourceTemplateId?: string | null | undefined;
        };
        components: {
            name: string;
            id: string;
            projectId: string;
            createdAt: string;
            updatedAt: string;
            easing?: {
                type: "bezier";
                p1: [number, number];
                p2: [number, number];
            } | {
                type: "spring";
                stiffness: number;
                damping: number;
                mass?: number | undefined;
            } | {
                type: "preset";
                name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
            } | undefined;
            sceneId?: string | null | undefined;
            selector?: string | null | undefined;
            templateId?: string | null | undefined;
            durationMs?: number | undefined;
            delayMs?: number | undefined;
            iterationCount?: number | "infinite" | undefined;
            direction?: "reverse" | "normal" | "alternate" | "alternate-reverse" | undefined;
            fillMode?: "none" | "forwards" | "backwards" | "both" | undefined;
            playState?: "running" | "paused" | undefined;
            trigger?: "onLoad" | "onClick" | "onHover" | "onScroll" | "afterDelay" | undefined;
            keyframes?: {
                offset: number;
                properties?: Partial<Record<"translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath", string | number>> | undefined;
                easing?: {
                    type: "bezier";
                    p1: [number, number];
                    p2: [number, number];
                } | {
                    type: "spring";
                    stiffness: number;
                    damping: number;
                    mass?: number | undefined;
                } | {
                    type: "preset";
                    name: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
                } | undefined;
            }[] | undefined;
            style?: Record<string, string | number> | undefined;
            orderIndex?: number | undefined;
            parentId?: string | null | undefined;
        }[];
    }>;
    codeHtml: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "name" | "id" | "description" | "tags" | "version"> & {
    outputType: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    description: string;
    tags: string[];
    version: string;
    outputType: string;
}, {
    name: string;
    id: string;
    description: string;
    tags?: string[] | undefined;
    version?: string | undefined;
    outputType?: string | undefined;
}>;
export type SkillSummary = z.infer<typeof SkillSummarySchema>;
//# sourceMappingURL=api.d.ts.map