import { z } from "zod";
/** A skill manifest — describes how an AI agent should call this motion skill. */
export declare const SkillManifestSchema: z.ZodObject<{
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
export type SkillManifest = z.infer<typeof SkillManifestSchema>;
export declare const SkillSchema: z.ZodObject<{
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
            }>]>>;
            keyframes: z.ZodDefault<z.ZodArray<z.ZodObject<{
                offset: z.ZodNumber;
                properties: z.ZodDefault<z.ZodRecord<z.ZodEnum<["translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "opacity", "blur", "color", "backgroundColor", "width", "height", "borderRadius", "fontSize", "letterSpacing", "boxShadow", "clipPath"]>, z.ZodUnion<[z.ZodNumber, z.ZodString]>>>;
                easing: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    tags: string[];
    sourceComponentId: string | null;
    sourceProjectId: string | null;
    version: string;
    manifest: {
        name: string;
        description: string;
        version: string;
        outputType: "code" | "html" | "spec";
        inputSchema: Record<string, unknown>;
    };
    motionSpec: {
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
                } | undefined;
            }[];
            style: Record<string, string | number>;
            orderIndex: number;
            parentId: string | null;
            createdAt: string;
            updatedAt: string;
        }[];
    };
    codeHtml: string | null;
}, {
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    manifest: {
        name: string;
        description: string;
        version?: string | undefined;
        outputType?: "code" | "html" | "spec" | undefined;
        inputSchema?: Record<string, unknown> | undefined;
    };
    motionSpec: {
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
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
                    name: "cruise" | "glide" | "softInOut" | "softLand" | "gentleIn" | "snapSettle" | "whip" | "accelExit" | "crashOut" | "popOver" | "crashIn" | "bounceHard" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "bounce" | "back" | "elastic" | "snappy" | "smooth" | "soft";
                } | undefined;
            }[] | undefined;
            style?: Record<string, string | number> | undefined;
            orderIndex?: number | undefined;
            parentId?: string | null | undefined;
        }[];
    };
    tags?: string[] | undefined;
    sourceComponentId?: string | null | undefined;
    sourceProjectId?: string | null | undefined;
    version?: string | undefined;
    codeHtml?: string | null | undefined;
}>;
export type Skill = z.infer<typeof SkillSchema>;
//# sourceMappingURL=skill.d.ts.map