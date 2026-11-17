import { z } from "zod";
export declare const GetMotionSpecInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const ListTemplatesInput: z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
    tag: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category?: string | undefined;
    tag?: string | undefined;
}, {
    category?: string | undefined;
    tag?: string | undefined;
}>;
export declare const SetTemplateInput: z.ZodObject<{
    projectId: z.ZodString;
    templateId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    templateId: string;
}, {
    projectId: string;
    templateId: string;
}>;
export declare const PreviewUrlInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AddLayerInput: z.ZodObject<{
    projectId: z.ZodString;
    sceneId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    selector: z.ZodOptional<z.ZodString>;
    templateId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
    sceneId?: string | undefined;
    selector?: string | undefined;
    templateId?: string | undefined;
}, {
    name: string;
    projectId: string;
    sceneId?: string | undefined;
    selector?: string | undefined;
    templateId?: string | undefined;
}>;
export declare const RemoveComponentInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
}, {
    projectId: string;
    componentId: string;
}>;
export declare const AddSceneInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodString;
    durationMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
    durationMs?: number | undefined;
}, {
    name: string;
    projectId: string;
    durationMs?: number | undefined;
}>;
export declare const GenerateFilmInput: z.ZodObject<{
    projectId: z.ZodString;
    prompt: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    style: z.ZodOptional<z.ZodEnum<["cinematic", "tech", "playful", "calm", "energetic", "default"]>>;
    replace: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    prompt: string;
    style?: "default" | "cinematic" | "tech" | "playful" | "calm" | "energetic" | undefined;
    title?: string | undefined;
    replace?: boolean | undefined;
}, {
    projectId: string;
    prompt: string;
    style?: "default" | "cinematic" | "tech" | "playful" | "calm" | "energetic" | undefined;
    title?: string | undefined;
    replace?: boolean | undefined;
}>;
export declare const SetEasingInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    easing: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
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
    projectId: string;
    componentId: string;
}, {
    easing: {
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
    };
    projectId: string;
    componentId: string;
}>;
export declare const SetSpringInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    stiffness: z.ZodNumber;
    damping: z.ZodNumber;
    mass: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    stiffness: number;
    damping: number;
    mass: number;
    projectId: string;
    componentId: string;
}, {
    stiffness: number;
    damping: number;
    projectId: string;
    componentId: string;
    mass?: number | undefined;
}>;
export declare const SetDurationInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    durationMs: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    durationMs: number;
    componentId: string;
}, {
    projectId: string;
    durationMs: number;
    componentId: string;
}>;
export declare const SetDelayInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    delayMs: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    delayMs: number;
    componentId: string;
}, {
    projectId: string;
    delayMs: number;
    componentId: string;
}>;
export declare const SetTransformInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    property: z.ZodEnum<["translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "opacity", "blur", "color", "backgroundColor", "width", "height", "borderRadius", "fontSize", "letterSpacing", "boxShadow", "clipPath"]>;
    keyframes: z.ZodArray<z.ZodObject<{
        offset: z.ZodNumber;
        value: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
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
        value: string | number;
        offset: number;
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
        value: string | number;
        offset: number;
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
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    keyframes: {
        value: string | number;
        offset: number;
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
    componentId: string;
    property: "translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath";
}, {
    projectId: string;
    keyframes: {
        value: string | number;
        offset: number;
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
    }[];
    componentId: string;
    property: "translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath";
}>;
export declare const SetKeyframeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    property: z.ZodEnum<["translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "opacity", "blur", "color", "backgroundColor", "width", "height", "borderRadius", "fontSize", "letterSpacing", "boxShadow", "clipPath"]>;
    offset: z.ZodNumber;
    value: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
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
    value: string | number;
    offset: number;
    projectId: string;
    componentId: string;
    property: "translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath";
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
    value: string | number;
    offset: number;
    projectId: string;
    componentId: string;
    property: "translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath";
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
}>;
export declare const SetLoopInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    iterationCount: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"infinite">]>;
    direction: z.ZodOptional<z.ZodEnum<["normal", "reverse", "alternate", "alternate-reverse"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    iterationCount: number | "infinite";
    componentId: string;
    direction?: "reverse" | "normal" | "alternate" | "alternate-reverse" | undefined;
}, {
    projectId: string;
    iterationCount: number | "infinite";
    componentId: string;
    direction?: "reverse" | "normal" | "alternate" | "alternate-reverse" | undefined;
}>;
export declare const SetFillModeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    fillMode: z.ZodEnum<["none", "forwards", "backwards", "both"]>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    fillMode: "none" | "forwards" | "backwards" | "both";
    componentId: string;
}, {
    projectId: string;
    fillMode: "none" | "forwards" | "backwards" | "both";
    componentId: string;
}>;
export declare const SetColorInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    color: z.ZodString;
    target: z.ZodDefault<z.ZodEnum<["text", "background"]>>;
}, "strip", z.ZodTypeAny, {
    color: string;
    projectId: string;
    componentId: string;
    target: "text" | "background";
}, {
    color: string;
    projectId: string;
    componentId: string;
    target?: "text" | "background" | undefined;
}>;
export declare const SetStaticStyleInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    style: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    style: Record<string, string | number>;
    componentId: string;
}, {
    projectId: string;
    style: Record<string, string | number>;
    componentId: string;
}>;
export declare const SetGlobalTimingInput: z.ZodObject<{
    projectId: z.ZodString;
    totalDurationMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    totalDurationMs?: number | undefined;
}, {
    projectId: string;
    totalDurationMs?: number | undefined;
}>;
/** Set the project-wide tempo so motion can be quantized to a beat grid. */
export declare const SetProjectTempoInput: z.ZodObject<{
    projectId: z.ZodString;
    bpm: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    bpm: number;
}, {
    projectId: string;
    bpm: number;
}>;
/**
 * Snap a component's duration (or every component's) to the nearest beat
 * division of the project tempo. If no division is given, picks the closest
 * musical division for each duration automatically.
 */
export declare const QuantizeToTempoInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
    division: z.ZodOptional<z.ZodEnum<["1", "2", "4", "8", "16"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId?: string | undefined;
    division?: "1" | "2" | "4" | "8" | "16" | undefined;
}, {
    projectId: string;
    componentId?: string | undefined;
    division?: "1" | "2" | "4" | "8" | "16" | undefined;
}>;
/**
 * Anchor a component's start time to a musical phase within a 4/4 bar.
 * The phase is expressed either as a beat offset (0 = downbeat, 0.5 =
 * offbeat, 1 = beat 2) or via a named label. Translates to a delay so the
 * motion begins on that beat position. Requires a project tempo.
 */
export declare const SetPhaseInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    phaseBeats: z.ZodOptional<z.ZodNumber>;
    label: z.ZodOptional<z.ZodEnum<["downbeat", "offbeat", "backbeat", "beat1", "beat2", "beat3", "beat4"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId?: string | undefined;
    componentIds?: string[] | undefined;
    phaseBeats?: number | undefined;
    label?: "downbeat" | "offbeat" | "backbeat" | "beat1" | "beat2" | "beat3" | "beat4" | undefined;
}, {
    projectId: string;
    componentId?: string | undefined;
    componentIds?: string[] | undefined;
    phaseBeats?: number | undefined;
    label?: "downbeat" | "offbeat" | "backbeat" | "beat1" | "beat2" | "beat3" | "beat4" | undefined;
}>;
/**
 * Align component start times to the beat grid. In "snap" mode each
 * component's existing delay is snapped to the nearest beat division. In
 * "polyrhythm" mode the targeted components are distributed evenly across a
 * fixed beat cycle, producing a k:base polyrhythm (e.g. 3 components across
 * 2 beats = 3:2) that resolves back to the downbeat every cycle.
 */
export declare const AlignToBeatInput: z.ZodObject<{
    projectId: z.ZodString;
    mode: z.ZodDefault<z.ZodEnum<["snap", "polyrhythm"]>>;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    division: z.ZodOptional<z.ZodEnum<["1", "2", "4", "8", "16"]>>;
    cycleBeats: z.ZodDefault<z.ZodNumber>;
    rotation: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    mode: "snap" | "polyrhythm";
    cycleBeats: number;
    rotation: number;
    division?: "1" | "2" | "4" | "8" | "16" | undefined;
    componentIds?: string[] | undefined;
}, {
    projectId: string;
    division?: "1" | "2" | "4" | "8" | "16" | undefined;
    componentIds?: string[] | undefined;
    mode?: "snap" | "polyrhythm" | undefined;
    cycleBeats?: number | undefined;
    rotation?: number | undefined;
}>;
export declare const BatchUpdateInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodArray<z.ZodString, "many">;
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
    durationMs: z.ZodOptional<z.ZodNumber>;
    delayMs: z.ZodOptional<z.ZodNumber>;
    iterationCount: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"infinite">]>>;
    direction: z.ZodOptional<z.ZodEnum<["normal", "reverse", "alternate", "alternate-reverse"]>>;
    fillMode: z.ZodOptional<z.ZodEnum<["none", "forwards", "backwards", "both"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentIds: string[];
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
    durationMs?: number | undefined;
    delayMs?: number | undefined;
    iterationCount?: number | "infinite" | undefined;
    direction?: "reverse" | "normal" | "alternate" | "alternate-reverse" | undefined;
    fillMode?: "none" | "forwards" | "backwards" | "both" | undefined;
}, {
    projectId: string;
    componentIds: string[];
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
    durationMs?: number | undefined;
    delayMs?: number | undefined;
    iterationCount?: number | "infinite" | undefined;
    direction?: "reverse" | "normal" | "alternate" | "alternate-reverse" | undefined;
    fillMode?: "none" | "forwards" | "backwards" | "both" | undefined;
}>;
export declare const ApplyPresetInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    preset: z.ZodEnum<["shake", "wiggle", "float", "glow", "heartbeat", "typewriter"]>;
}, "strip", z.ZodTypeAny, {
    preset: "float" | "shake" | "wiggle" | "glow" | "heartbeat" | "typewriter";
    projectId: string;
    componentId: string;
}, {
    preset: "float" | "shake" | "wiggle" | "glow" | "heartbeat" | "typewriter";
    projectId: string;
    componentId: string;
}>;
export declare const DuplicateComponentInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    name?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    name?: string | undefined;
}>;
export declare const ReorderComponentsInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentIds: string[];
}, {
    projectId: string;
    componentIds: string[];
}>;
export declare const SetPlayStateInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    playState: z.ZodEnum<["running", "paused"]>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    playState: "running" | "paused";
    componentId: string;
}, {
    projectId: string;
    playState: "running" | "paused";
    componentId: string;
}>;
export declare const DescribeMotionInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId?: string | undefined;
}, {
    projectId: string;
    componentId?: string | undefined;
}>;
export declare const ListScenesInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const RemoveSceneInput: z.ZodObject<{
    projectId: z.ZodString;
    sceneId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    sceneId: string;
}, {
    projectId: string;
    sceneId: string;
}>;
export declare const StaggerComponentsInput: z.ZodObject<{
    projectId: z.ZodString;
    stepMs: z.ZodDefault<z.ZodNumber>;
    startMs: z.ZodOptional<z.ZodNumber>;
    direction: z.ZodDefault<z.ZodEnum<["forward", "reverse", "center"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    direction: "reverse" | "forward" | "center";
    stepMs: number;
    startMs?: number | undefined;
}, {
    projectId: string;
    direction?: "reverse" | "forward" | "center" | undefined;
    stepMs?: number | undefined;
    startMs?: number | undefined;
}>;
export declare const MatchTemplateInput: z.ZodObject<{
    projectId: z.ZodString;
    hint: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    hint?: string | undefined;
}, {
    projectId: string;
    hint?: string | undefined;
}>;
export declare const FindSimilarMotionInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
    threshold: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId?: string | undefined;
    limit?: number | undefined;
    threshold?: number | undefined;
}, {
    projectId: string;
    componentId?: string | undefined;
    limit?: number | undefined;
    threshold?: number | undefined;
}>;
export declare const GenerateMotionDocsInput: z.ZodObject<{
    projectId: z.ZodString;
    format: z.ZodOptional<z.ZodEnum<["markdown", "json"]>>;
    includeAccessibility: z.ZodOptional<z.ZodBoolean>;
    includePerformance: z.ZodOptional<z.ZodBoolean>;
    includeStoryboard: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    format?: "markdown" | "json" | undefined;
    includeAccessibility?: boolean | undefined;
    includePerformance?: boolean | undefined;
    includeStoryboard?: boolean | undefined;
}, {
    projectId: string;
    format?: "markdown" | "json" | undefined;
    includeAccessibility?: boolean | undefined;
    includePerformance?: boolean | undefined;
    includeStoryboard?: boolean | undefined;
}>;
export declare const CreateVariantInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
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
    durationMs: z.ZodOptional<z.ZodNumber>;
    scale: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    scale?: number | undefined;
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
    durationMs?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    scale?: number | undefined;
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
    durationMs?: number | undefined;
}>;
export declare const AnalyzeMotionInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId?: string | undefined;
}, {
    projectId: string;
    componentId?: string | undefined;
}>;
export declare const SuggestNextInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const SearchCatalogInput: z.ZodObject<{
    query: z.ZodString;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    query: string;
}, {
    query: string;
    limit?: number | undefined;
}>;
export declare const RunMotionPipelineInput: z.ZodObject<{
    projectId: z.ZodString;
    description: z.ZodString;
    durationMs: z.ZodOptional<z.ZodNumber>;
    colorScheme: z.ZodOptional<z.ZodEnum<["complementary", "analogous", "triadic", "monochrome"]>>;
    baseColor: z.ZodOptional<z.ZodString>;
    choreography: z.ZodOptional<z.ZodEnum<["cascade", "call_response", "unison", "counterpoint", "wave", "canon", "stagger_grid", "ripple_out", "auto"]>>;
    componentCount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    description: string;
    durationMs?: number | undefined;
    colorScheme?: "complementary" | "analogous" | "triadic" | "monochrome" | undefined;
    baseColor?: string | undefined;
    choreography?: "auto" | "cascade" | "call_response" | "unison" | "counterpoint" | "wave" | "canon" | "stagger_grid" | "ripple_out" | undefined;
    componentCount?: number | undefined;
}, {
    projectId: string;
    description: string;
    durationMs?: number | undefined;
    colorScheme?: "complementary" | "analogous" | "triadic" | "monochrome" | undefined;
    baseColor?: string | undefined;
    choreography?: "auto" | "cascade" | "call_response" | "unison" | "counterpoint" | "wave" | "canon" | "stagger_grid" | "ripple_out" | undefined;
    componentCount?: number | undefined;
}>;
export declare const ComposeSequenceInput: z.ZodObject<{
    projectId: z.ZodString;
    type: z.ZodEnum<["sequence", "parallel", "stagger"]>;
    componentIds: z.ZodArray<z.ZodString, "many">;
    stepMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    gapMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    type: "sequence" | "parallel" | "stagger";
    projectId: string;
    componentIds: string[];
    stepMs: number;
    gapMs: number;
}, {
    type: "sequence" | "parallel" | "stagger";
    projectId: string;
    componentIds: string[];
    stepMs?: number | undefined;
    gapMs?: number | undefined;
}>;
export declare const SetMotionPathInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    pathType: z.ZodEnum<["line", "circle", "ellipse", "bezier"]>;
    fromX: z.ZodOptional<z.ZodNumber>;
    fromY: z.ZodOptional<z.ZodNumber>;
    toX: z.ZodOptional<z.ZodNumber>;
    toY: z.ZodOptional<z.ZodNumber>;
    centerX: z.ZodOptional<z.ZodNumber>;
    centerY: z.ZodOptional<z.ZodNumber>;
    radiusX: z.ZodOptional<z.ZodNumber>;
    radiusY: z.ZodOptional<z.ZodNumber>;
    cp1X: z.ZodOptional<z.ZodNumber>;
    cp1Y: z.ZodOptional<z.ZodNumber>;
    cp2X: z.ZodOptional<z.ZodNumber>;
    cp2Y: z.ZodOptional<z.ZodNumber>;
    steps: z.ZodDefault<z.ZodNumber>;
    durationMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    pathType: "bezier" | "line" | "circle" | "ellipse";
    steps: number;
    durationMs?: number | undefined;
    fromX?: number | undefined;
    fromY?: number | undefined;
    toX?: number | undefined;
    toY?: number | undefined;
    centerX?: number | undefined;
    centerY?: number | undefined;
    radiusX?: number | undefined;
    radiusY?: number | undefined;
    cp1X?: number | undefined;
    cp1Y?: number | undefined;
    cp2X?: number | undefined;
    cp2Y?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    pathType: "bezier" | "line" | "circle" | "ellipse";
    durationMs?: number | undefined;
    fromX?: number | undefined;
    fromY?: number | undefined;
    toX?: number | undefined;
    toY?: number | undefined;
    centerX?: number | undefined;
    centerY?: number | undefined;
    radiusX?: number | undefined;
    radiusY?: number | undefined;
    cp1X?: number | undefined;
    cp1Y?: number | undefined;
    cp2X?: number | undefined;
    cp2Y?: number | undefined;
    steps?: number | undefined;
}>;
export declare const ApplyStyleInput: z.ZodObject<{
    projectId: z.ZodString;
    styleId: z.ZodEnum<["playful", "energetic", "calm", "professional", "dramatic", "minimal", "cinematic", "glassy", "retro", "futuristic", "organic", "mechanical", "luxury"]>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    styleId: "cinematic" | "playful" | "calm" | "energetic" | "professional" | "dramatic" | "minimal" | "glassy" | "retro" | "futuristic" | "organic" | "mechanical" | "luxury";
}, {
    projectId: string;
    styleId: "cinematic" | "playful" | "calm" | "energetic" | "professional" | "dramatic" | "minimal" | "glassy" | "retro" | "futuristic" | "organic" | "mechanical" | "luxury";
}>;
export declare const RecognizePatternInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const HarmonizeColorsInput: z.ZodObject<{
    projectId: z.ZodString;
    scheme: z.ZodDefault<z.ZodEnum<["complementary", "analogous", "triadic", "monochrome"]>>;
    baseColor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    scheme: "complementary" | "analogous" | "triadic" | "monochrome";
    baseColor?: string | undefined;
}, {
    projectId: string;
    baseColor?: string | undefined;
    scheme?: "complementary" | "analogous" | "triadic" | "monochrome" | undefined;
}>;
export declare const ChoreographInput: z.ZodObject<{
    projectId: z.ZodString;
    pattern: z.ZodEnum<["cascade", "wave", "ripple", "canon", "converge", "spiral", "explosion", "assembly", "breathing", "domino", "scatter"]>;
    stepMs: z.ZodDefault<z.ZodNumber>;
    durationMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    stepMs: number;
    pattern: "cascade" | "wave" | "canon" | "ripple" | "converge" | "spiral" | "explosion" | "assembly" | "breathing" | "domino" | "scatter";
    durationMs?: number | undefined;
}, {
    projectId: string;
    pattern: "cascade" | "wave" | "canon" | "ripple" | "converge" | "spiral" | "explosion" | "assembly" | "breathing" | "domino" | "scatter";
    durationMs?: number | undefined;
    stepMs?: number | undefined;
}>;
export declare const RefineMotionInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
    refinement: z.ZodEnum<["snappier", "smoother", "more-dramatic", "calmer", "subtler", "more-energetic", "bouncier", "softer"]>;
}, "strip", z.ZodTypeAny, {
    refinement: "snappier" | "smoother" | "more-dramatic" | "calmer" | "subtler" | "more-energetic" | "bouncier" | "softer";
    projectId: string;
    componentId?: string | undefined;
}, {
    refinement: "snappier" | "smoother" | "more-dramatic" | "calmer" | "subtler" | "more-energetic" | "bouncier" | "softer";
    projectId: string;
    componentId?: string | undefined;
}>;
export declare const SetCustomBezierInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    x1: z.ZodNumber;
    y1: z.ZodNumber;
    x2: z.ZodNumber;
    y2: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}, {
    projectId: string;
    componentId: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}>;
export declare const SetInterpolationInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    keyframeIndex: z.ZodNumber;
    interpolation: z.ZodEnum<["linear", "ease", "hold"]>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    keyframeIndex: number;
    interpolation: "linear" | "ease" | "hold";
}, {
    projectId: string;
    componentId: string;
    keyframeIndex: number;
    interpolation: "linear" | "ease" | "hold";
}>;
export declare const AddPropertyKeyframeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    property: z.ZodString;
    offset: z.ZodNumber;
    value: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
}, "strip", z.ZodTypeAny, {
    value: string | number;
    offset: number;
    projectId: string;
    componentId: string;
    property: string;
}, {
    value: string | number;
    offset: number;
    projectId: string;
    componentId: string;
    property: string;
}>;
export declare const RemoveKeyframeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    keyframeIndex: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    keyframeIndex: number;
}, {
    projectId: string;
    componentId: string;
    keyframeIndex: number;
}>;
export declare const SetTriggerInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    trigger: z.ZodEnum<["onLoad", "onClick", "onHover", "onScroll", "afterDelay"]>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    trigger: "onLoad" | "onClick" | "onHover" | "onScroll" | "afterDelay";
    componentId: string;
}, {
    projectId: string;
    trigger: "onLoad" | "onClick" | "onHover" | "onScroll" | "afterDelay";
    componentId: string;
}>;
export declare const SetOnionSkinInput: z.ZodObject<{
    projectId: z.ZodString;
    enabled: z.ZodBoolean;
    frames: z.ZodDefault<z.ZodNumber>;
    opacity: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    opacity: number;
    projectId: string;
    enabled: boolean;
    frames: number;
}, {
    projectId: string;
    enabled: boolean;
    opacity?: number | undefined;
    frames?: number | undefined;
}>;
export declare const PreviewFullscreenInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId?: string | undefined;
}, {
    projectId: string;
    componentId?: string | undefined;
}>;
export declare const SetCanvasViewInput: z.ZodObject<{
    projectId: z.ZodString;
    pan: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>>;
    zoom: z.ZodOptional<z.ZodNumber>;
    fit: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    pan?: {
        x: number;
        y: number;
    } | undefined;
    zoom?: number | undefined;
    fit?: boolean | undefined;
}, {
    projectId: string;
    pan?: {
        x: number;
        y: number;
    } | undefined;
    zoom?: number | undefined;
    fit?: boolean | undefined;
}>;
export declare const LockLayerInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    locked: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    locked: boolean;
}, {
    projectId: string;
    componentId: string;
    locked?: boolean | undefined;
}>;
export declare const SetPlaybackRangeInput: z.ZodObject<{
    projectId: z.ZodString;
    startMs: z.ZodOptional<z.ZodNumber>;
    endMs: z.ZodOptional<z.ZodNumber>;
    clear: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    startMs?: number | undefined;
    endMs?: number | undefined;
    clear?: boolean | undefined;
}, {
    projectId: string;
    startMs?: number | undefined;
    endMs?: number | undefined;
    clear?: boolean | undefined;
}>;
export declare const SelectComponentsInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    clear: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentIds: string[];
    clear: boolean;
}, {
    projectId: string;
    componentIds?: string[] | undefined;
    clear?: boolean | undefined;
}>;
export declare const ToggleSnapInput: z.ZodObject<{
    projectId: z.ZodString;
    enabled: z.ZodDefault<z.ZodBoolean>;
    size: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    enabled: boolean;
    size?: number | undefined;
}, {
    projectId: string;
    enabled?: boolean | undefined;
    size?: number | undefined;
}>;
export declare const SetRulersInput: z.ZodObject<{
    projectId: z.ZodString;
    show: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    show: boolean;
}, {
    projectId: string;
    show?: boolean | undefined;
}>;
export declare const SetZOrderInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    action: z.ZodEnum<["forward", "backward", "to-front", "to-back"]>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    action: "forward" | "backward" | "to-front" | "to-back";
}, {
    projectId: string;
    componentId: string;
    action: "forward" | "backward" | "to-front" | "to-back";
}>;
export declare const SetTransformPropsInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    rotation: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    width?: number | undefined;
    height?: number | undefined;
    rotation?: number | undefined;
    x?: number | undefined;
    y?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    width?: number | undefined;
    height?: number | undefined;
    rotation?: number | undefined;
    x?: number | undefined;
    y?: number | undefined;
}>;
export declare const AlignComponentsInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodArray<z.ZodString, "many">;
    align: z.ZodEnum<["left", "center", "right", "top", "middle", "bottom", "distribute-h", "distribute-v"]>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentIds: string[];
    align: "center" | "left" | "right" | "top" | "middle" | "bottom" | "distribute-h" | "distribute-v";
}, {
    projectId: string;
    componentIds: string[];
    align: "center" | "left" | "right" | "top" | "middle" | "bottom" | "distribute-h" | "distribute-v";
}>;
export declare const AddShapeInput: z.ZodObject<{
    projectId: z.ZodString;
    shape: z.ZodEnum<["rectangle", "circle", "text", "triangle", "star", "polygon", "line", "arrow"]>;
    name: z.ZodOptional<z.ZodString>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    shape: "text" | "line" | "circle" | "rectangle" | "triangle" | "star" | "polygon" | "arrow";
    projectId: string;
    width?: number | undefined;
    height?: number | undefined;
    name?: string | undefined;
    x?: number | undefined;
    y?: number | undefined;
}, {
    shape: "text" | "line" | "circle" | "rectangle" | "triangle" | "star" | "polygon" | "arrow";
    projectId: string;
    width?: number | undefined;
    height?: number | undefined;
    name?: string | undefined;
    x?: number | undefined;
    y?: number | undefined;
}>;
export declare const AddImageInput: z.ZodObject<{
    projectId: z.ZodString;
    src: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    fit: z.ZodOptional<z.ZodEnum<["cover", "contain", "fill"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    src: string;
    width?: number | undefined;
    height?: number | undefined;
    name?: string | undefined;
    x?: number | undefined;
    y?: number | undefined;
    fit?: "fill" | "cover" | "contain" | undefined;
}, {
    projectId: string;
    src: string;
    width?: number | undefined;
    height?: number | undefined;
    name?: string | undefined;
    x?: number | undefined;
    y?: number | undefined;
    fit?: "fill" | "cover" | "contain" | undefined;
}>;
export declare const AddVideoInput: z.ZodObject<{
    projectId: z.ZodString;
    src: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    muted: z.ZodOptional<z.ZodBoolean>;
    loop: z.ZodOptional<z.ZodBoolean>;
    autoplay: z.ZodOptional<z.ZodBoolean>;
    delayMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    src: string;
    width?: number | undefined;
    height?: number | undefined;
    name?: string | undefined;
    delayMs?: number | undefined;
    x?: number | undefined;
    y?: number | undefined;
    muted?: boolean | undefined;
    loop?: boolean | undefined;
    autoplay?: boolean | undefined;
}, {
    projectId: string;
    src: string;
    width?: number | undefined;
    height?: number | undefined;
    name?: string | undefined;
    delayMs?: number | undefined;
    x?: number | undefined;
    y?: number | undefined;
    muted?: boolean | undefined;
    loop?: boolean | undefined;
    autoplay?: boolean | undefined;
}>;
export declare const AddAudioInput: z.ZodObject<{
    projectId: z.ZodString;
    src: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    delayMs: z.ZodOptional<z.ZodNumber>;
    loop: z.ZodOptional<z.ZodBoolean>;
    muted: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    src: string;
    name?: string | undefined;
    delayMs?: number | undefined;
    muted?: boolean | undefined;
    loop?: boolean | undefined;
}, {
    projectId: string;
    src: string;
    name?: string | undefined;
    delayMs?: number | undefined;
    muted?: boolean | undefined;
    loop?: boolean | undefined;
}>;
export declare const AddTypewriterTextInput: z.ZodObject<{
    projectId: z.ZodString;
    text: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    fontSize: z.ZodOptional<z.ZodNumber>;
    color: z.ZodOptional<z.ZodString>;
    charDelayMs: z.ZodOptional<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    text: string;
    color?: string | undefined;
    fontSize?: number | undefined;
    name?: string | undefined;
    x?: number | undefined;
    y?: number | undefined;
    charDelayMs?: number | undefined;
    cursor?: boolean | undefined;
}, {
    projectId: string;
    text: string;
    color?: string | undefined;
    fontSize?: number | undefined;
    name?: string | undefined;
    x?: number | undefined;
    y?: number | undefined;
    charDelayMs?: number | undefined;
    cursor?: boolean | undefined;
}>;
export declare const AddSceneTransitionInput: z.ZodObject<{
    projectId: z.ZodString;
    type: z.ZodEnum<["dissolve", "wipe-left", "wipe-right", "wipe-up", "wipe-down", "slide-left", "slide-right", "zoom-in", "zoom-out", "flash"]>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    delayMs: z.ZodOptional<z.ZodNumber>;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "dissolve" | "wipe-left" | "wipe-right" | "wipe-up" | "wipe-down" | "slide-left" | "slide-right" | "zoom-in" | "zoom-out" | "flash";
    projectId: string;
    color?: string | undefined;
    durationMs?: number | undefined;
    delayMs?: number | undefined;
}, {
    type: "dissolve" | "wipe-left" | "wipe-right" | "wipe-up" | "wipe-down" | "slide-left" | "slide-right" | "zoom-in" | "zoom-out" | "flash";
    projectId: string;
    color?: string | undefined;
    durationMs?: number | undefined;
    delayMs?: number | undefined;
}>;
export declare const AddCameraMoveInput: z.ZodObject<{
    projectId: z.ZodString;
    type: z.ZodEnum<["pan-left", "pan-right", "pan-up", "pan-down", "zoom-in", "zoom-out", "zoom-pan"]>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    delayMs: z.ZodOptional<z.ZodNumber>;
    intensity: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "zoom-in" | "zoom-out" | "pan-left" | "pan-right" | "pan-up" | "pan-down" | "zoom-pan";
    projectId: string;
    durationMs?: number | undefined;
    delayMs?: number | undefined;
    intensity?: number | undefined;
}, {
    type: "zoom-in" | "zoom-out" | "pan-left" | "pan-right" | "pan-up" | "pan-down" | "zoom-pan";
    projectId: string;
    durationMs?: number | undefined;
    delayMs?: number | undefined;
    intensity?: number | undefined;
}>;
export declare const SetBlendModeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    blendMode: z.ZodEnum<["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"]>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    blendMode: "color" | "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "color-dodge" | "color-burn" | "hard-light" | "soft-light" | "difference" | "exclusion" | "hue" | "saturation" | "luminosity";
}, {
    projectId: string;
    componentId: string;
    blendMode: "color" | "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "color-dodge" | "color-burn" | "hard-light" | "soft-light" | "difference" | "exclusion" | "hue" | "saturation" | "luminosity";
}>;
export declare const SetArtboardInput: z.ZodObject<{
    projectId: z.ZodString;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    background: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    width?: number | undefined;
    height?: number | undefined;
    background?: string | undefined;
}, {
    projectId: string;
    width?: number | undefined;
    height?: number | undefined;
    background?: string | undefined;
}>;
export declare const SetLayerOpacityInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    opacity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    opacity: number;
    projectId: string;
    componentId: string;
}, {
    opacity: number;
    projectId: string;
    componentId: string;
}>;
export declare const NudgeComponentInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    dx: z.ZodNumber;
    dy: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    dx: number;
    dy: number;
}, {
    projectId: string;
    componentId: string;
    dx: number;
    dy: number;
}>;
export declare const CopyToClipboardInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentIds?: string[] | undefined;
}, {
    projectId: string;
    componentIds?: string[] | undefined;
}>;
export declare const PasteFromClipboardInput: z.ZodObject<{
    projectId: z.ZodString;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    x?: number | undefined;
    y?: number | undefined;
}, {
    projectId: string;
    x?: number | undefined;
    y?: number | undefined;
}>;
export declare const CaptureStateInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
}, {
    name: string;
    projectId: string;
}>;
export declare const ApplyStateInput: z.ZodObject<{
    projectId: z.ZodString;
    stateId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    stateId: string;
}, {
    projectId: string;
    stateId: string;
}>;
export declare const AddTransitionInput: z.ZodObject<{
    projectId: z.ZodString;
    fromStateId: z.ZodString;
    toStateId: z.ZodString;
    trigger: z.ZodDefault<z.ZodEnum<["onClick", "onHover", "onLoad", "manual"]>>;
    durationMs: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    durationMs: number;
    trigger: "onLoad" | "onClick" | "onHover" | "manual";
    fromStateId: string;
    toStateId: string;
}, {
    projectId: string;
    fromStateId: string;
    toStateId: string;
    durationMs?: number | undefined;
    trigger?: "onLoad" | "onClick" | "onHover" | "manual" | undefined;
}>;
export declare const RemoveStateInput: z.ZodObject<{
    projectId: z.ZodString;
    stateId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    stateId: string;
}, {
    projectId: string;
    stateId: string;
}>;
export declare const ListStatesInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const ToggleAutoKeyframeInput: z.ZodObject<{
    projectId: z.ZodString;
    enabled: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    enabled?: boolean | undefined;
}, {
    projectId: string;
    enabled?: boolean | undefined;
}>;
export declare const AddListenerInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    eventType: z.ZodEnum<["pointerEnter", "pointerLeave", "pointerDown", "pointerUp", "click"]>;
    actionType: z.ZodEnum<["applyState", "playAnimation", "setProperty"]>;
    target: z.ZodString;
    property: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    target: string;
    eventType: "pointerEnter" | "pointerLeave" | "pointerDown" | "pointerUp" | "click";
    actionType: "applyState" | "playAnimation" | "setProperty";
    value?: string | number | undefined;
    property?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    target: string;
    eventType: "pointerEnter" | "pointerLeave" | "pointerDown" | "pointerUp" | "click";
    actionType: "applyState" | "playAnimation" | "setProperty";
    value?: string | number | undefined;
    property?: string | undefined;
}>;
export declare const RemoveListenerInput: z.ZodObject<{
    projectId: z.ZodString;
    listenerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    listenerId: string;
}, {
    projectId: string;
    listenerId: string;
}>;
export declare const ListListenersInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId?: string | undefined;
}, {
    projectId: string;
    componentId?: string | undefined;
}>;
export declare const SetKeyframeOffsetInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    keyframeIndex: z.ZodNumber;
    offset: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    offset: number;
    projectId: string;
    componentId: string;
    keyframeIndex: number;
}, {
    offset: number;
    projectId: string;
    componentId: string;
    keyframeIndex: number;
}>;
export declare const AddMarkerInput: z.ZodObject<{
    projectId: z.ZodString;
    timeMs: z.ZodNumber;
    label: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    timeMs: number;
    label?: string | undefined;
}, {
    projectId: string;
    timeMs: number;
    label?: string | undefined;
}>;
export declare const RemoveMarkerInput: z.ZodObject<{
    projectId: z.ZodString;
    markerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    markerId: string;
}, {
    projectId: string;
    markerId: string;
}>;
export declare const ListMarkersInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const ReverseKeyframesInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
}, {
    projectId: string;
    componentId: string;
}>;
export declare const SoloLayerInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
}, {
    projectId: string;
    componentId: string;
}>;
export declare const ExportHtmlInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const ExportVideoInput: z.ZodObject<{
    projectId: z.ZodString;
    format: z.ZodDefault<z.ZodEnum<["mp4", "gif", "webm"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    format: "mp4" | "gif" | "webm";
}, {
    projectId: string;
    format?: "mp4" | "gif" | "webm" | undefined;
}>;
export declare const ExportSkillInput: z.ZodObject<{
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
export declare const ExportCodeInput: z.ZodObject<{
    projectId: z.ZodString;
    format: z.ZodDefault<z.ZodEnum<["css", "json", "react"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    format: "json" | "css" | "react";
}, {
    projectId: string;
    format?: "json" | "css" | "react" | undefined;
}>;
export declare const ExportLottieInput: z.ZodObject<{
    projectId: z.ZodString;
    fps: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    fps?: number | undefined;
}, {
    projectId: string;
    fps?: number | undefined;
}>;
export declare const SavePipelineInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    steps: z.ZodArray<z.ZodObject<{
        tool: z.ZodString;
        args: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        tool: string;
        args: Record<string, unknown>;
        description?: string | undefined;
    }, {
        tool: string;
        args: Record<string, unknown>;
        description?: string | undefined;
    }>, "many">;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
    steps: {
        tool: string;
        args: Record<string, unknown>;
        description?: string | undefined;
    }[];
    description?: string | undefined;
    tags?: string[] | undefined;
}, {
    name: string;
    projectId: string;
    steps: {
        tool: string;
        args: Record<string, unknown>;
        description?: string | undefined;
    }[];
    description?: string | undefined;
    tags?: string[] | undefined;
}>;
export declare const ListPipelinesInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const RunPipelineInput: z.ZodObject<{
    projectId: z.ZodString;
    pipelineId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    pipelineId: string;
}, {
    projectId: string;
    pipelineId: string;
}>;
export declare const DeletePipelineInput: z.ZodObject<{
    projectId: z.ZodString;
    pipelineId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    pipelineId: string;
}, {
    projectId: string;
    pipelineId: string;
}>;
export declare const AnalyzeMoodInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId?: string | undefined;
}, {
    projectId: string;
    componentId?: string | undefined;
}>;
export declare const SetMoodInput: z.ZodObject<{
    projectId: z.ZodString;
    mood: z.ZodEnum<["premium", "playful", "calm", "energetic", "dramatic", "minimal", "confident", "gentle", "urgent", "nostalgic"]>;
    componentId: z.ZodOptional<z.ZodString>;
    scope: z.ZodDefault<z.ZodEnum<["component", "project"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    mood: "playful" | "calm" | "energetic" | "dramatic" | "minimal" | "premium" | "confident" | "gentle" | "urgent" | "nostalgic";
    scope: "project" | "component";
    componentId?: string | undefined;
}, {
    projectId: string;
    mood: "playful" | "calm" | "energetic" | "dramatic" | "minimal" | "premium" | "confident" | "gentle" | "urgent" | "nostalgic";
    componentId?: string | undefined;
    scope?: "project" | "component" | undefined;
}>;
export declare const SuggestCreativeInput: z.ZodObject<{
    projectId: z.ZodString;
    surprise: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    surprise: boolean;
}, {
    projectId: string;
    surprise?: boolean | undefined;
}>;
export declare const AnalyzeVisualContextInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId?: string | undefined;
}, {
    projectId: string;
    componentId?: string | undefined;
}>;
export declare const SynthesizeCodeInput: z.ZodObject<{
    projectId: z.ZodString;
    description: z.ZodString;
    format: z.ZodDefault<z.ZodEnum<["css", "react", "html", "vanilla"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    description: string;
    format: "css" | "react" | "html" | "vanilla";
}, {
    projectId: string;
    description: string;
    format?: "css" | "react" | "html" | "vanilla" | undefined;
}>;
export declare const ComposeStateMachineInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    presetId: z.ZodOptional<z.ZodEnum<["hover-press", "toggle-on-off", "loading-sequence", "carousel", "tab-switch"]>>;
    componentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
    componentIds: string[];
    description?: string | undefined;
    presetId?: "hover-press" | "toggle-on-off" | "loading-sequence" | "carousel" | "tab-switch" | undefined;
}, {
    name: string;
    projectId: string;
    description?: string | undefined;
    componentIds?: string[] | undefined;
    presetId?: "hover-press" | "toggle-on-off" | "loading-sequence" | "carousel" | "tab-switch" | undefined;
}>;
export declare const ListStateMachinesInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const TriggerStateMachineInput: z.ZodObject<{
    projectId: z.ZodString;
    machineId: z.ZodString;
    stateName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    machineId: string;
    stateName: string;
}, {
    projectId: string;
    machineId: string;
    stateName: string;
}>;
export declare const SetParentInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    parentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    parentId: string;
    componentId: string;
}, {
    projectId: string;
    parentId: string;
    componentId: string;
}>;
export declare const RemoveParentInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
}, {
    projectId: string;
    componentId: string;
}>;
export declare const ListHierarchyInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AddConstraintInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    targetId: z.ZodString;
    type: z.ZodEnum<["position", "rotation", "scale", "look-at"]>;
    strength: z.ZodDefault<z.ZodNumber>;
    axis: z.ZodDefault<z.ZodEnum<["x", "y", "both"]>>;
}, "strip", z.ZodTypeAny, {
    type: "scale" | "rotation" | "position" | "look-at";
    projectId: string;
    componentId: string;
    targetId: string;
    strength: number;
    axis: "both" | "x" | "y";
}, {
    type: "scale" | "rotation" | "position" | "look-at";
    projectId: string;
    componentId: string;
    targetId: string;
    strength?: number | undefined;
    axis?: "both" | "x" | "y" | undefined;
}>;
export declare const RemoveConstraintInput: z.ZodObject<{
    projectId: z.ZodString;
    constraintId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    constraintId: string;
}, {
    projectId: string;
    constraintId: string;
}>;
export declare const ListConstraintsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AddClipInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodString;
    startMs: z.ZodNumber;
    endMs: z.ZodNumber;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
    startMs: number;
    endMs: number;
    color?: string | undefined;
}, {
    name: string;
    projectId: string;
    startMs: number;
    endMs: number;
    color?: string | undefined;
}>;
export declare const RemoveClipInput: z.ZodObject<{
    projectId: z.ZodString;
    clipId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    clipId: string;
}, {
    projectId: string;
    clipId: string;
}>;
export declare const ListClipsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const PlayClipInput: z.ZodObject<{
    projectId: z.ZodString;
    clipId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    clipId: string;
}, {
    projectId: string;
    clipId: string;
}>;
export declare const SetFilterInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    filter: z.ZodString;
    value: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
}, "strip", z.ZodTypeAny, {
    value: string | number;
    filter: string;
    projectId: string;
    componentId: string;
}, {
    value: string | number;
    filter: string;
    projectId: string;
    componentId: string;
}>;
export declare const Set3DTransformInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    perspective: z.ZodOptional<z.ZodNumber>;
    rotateX: z.ZodOptional<z.ZodNumber>;
    rotateY: z.ZodOptional<z.ZodNumber>;
    rotateZ: z.ZodOptional<z.ZodNumber>;
    translateZ: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    translateZ?: number | undefined;
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
    perspective?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    translateZ?: number | undefined;
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
    perspective?: number | undefined;
}>;
export declare const SetAdjustmentLayerInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    enabled: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    enabled: boolean;
}, {
    projectId: string;
    componentId: string;
    enabled: boolean;
}>;
export declare const CreatePrecompInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodArray<z.ZodString, "many">;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentIds: string[];
    name?: string | undefined;
}, {
    projectId: string;
    componentIds: string[];
    name?: string | undefined;
}>;
export declare const UngroupPrecompInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentIds: string[];
}, {
    projectId: string;
    componentIds: string[];
}>;
export declare const EnableMotionBlurInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    intensity: z.ZodDefault<z.ZodNumber>;
    shutterAngle: z.ZodDefault<z.ZodNumber>;
    enabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    enabled: boolean;
    intensity: number;
    shutterAngle: number;
}, {
    projectId: string;
    componentId: string;
    enabled?: boolean | undefined;
    intensity?: number | undefined;
    shutterAngle?: number | undefined;
}>;
export declare const AddNullObjectInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    name?: string | undefined;
    x?: number | undefined;
    y?: number | undefined;
}, {
    projectId: string;
    name?: string | undefined;
    x?: number | undefined;
    y?: number | undefined;
}>;
export declare const TrimPathInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    start: z.ZodDefault<z.ZodNumber>;
    end: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    animate: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    offset: number;
    projectId: string;
    componentId: string;
    start: number;
    end: number;
    animate: boolean;
}, {
    projectId: string;
    componentId: string;
    offset?: number | undefined;
    start?: number | undefined;
    end?: number | undefined;
    animate?: boolean | undefined;
}>;
export declare const AddRepeaterInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    copies: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodObject<{
        x: z.ZodDefault<z.ZodNumber>;
        y: z.ZodDefault<z.ZodNumber>;
        rotate: z.ZodDefault<z.ZodNumber>;
        scale: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        scale: number;
        rotate: number;
        x: number;
        y: number;
    }, {
        scale?: number | undefined;
        rotate?: number | undefined;
        x?: number | undefined;
        y?: number | undefined;
    }>>;
    decay: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    offset: {
        scale: number;
        rotate: number;
        x: number;
        y: number;
    };
    projectId: string;
    componentId: string;
    copies: number;
    decay: number;
}, {
    projectId: string;
    componentId: string;
    offset?: {
        scale?: number | undefined;
        rotate?: number | undefined;
        x?: number | undefined;
        y?: number | undefined;
    } | undefined;
    copies?: number | undefined;
    decay?: number | undefined;
}>;
export declare const AddEchoInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    copies: z.ZodDefault<z.ZodNumber>;
    delayMs: z.ZodDefault<z.ZodNumber>;
    decay: z.ZodDefault<z.ZodNumber>;
    scaleDecay: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    delayMs: number;
    componentId: string;
    copies: number;
    decay: number;
    scaleDecay: number;
}, {
    projectId: string;
    componentId: string;
    delayMs?: number | undefined;
    copies?: number | undefined;
    decay?: number | undefined;
    scaleDecay?: number | undefined;
}>;
export declare const SetTimeRemapInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    rate: z.ZodNumber;
    freezeAtMs: z.ZodOptional<z.ZodNumber>;
    reverseDirection: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    rate: number;
    reverseDirection: boolean;
    freezeAtMs?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    rate: number;
    freezeAtMs?: number | undefined;
    reverseDirection?: boolean | undefined;
}>;
export declare const AddLayerEffectInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    effect: z.ZodEnum<["drop-shadow", "inner-shadow", "outer-glow", "inner-glow", "stroke"]>;
    color: z.ZodDefault<z.ZodString>;
    distance: z.ZodDefault<z.ZodNumber>;
    blur: z.ZodDefault<z.ZodNumber>;
    opacity: z.ZodDefault<z.ZodNumber>;
    spread: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    opacity: number;
    blur: number;
    color: string;
    projectId: string;
    componentId: string;
    effect: "drop-shadow" | "inner-shadow" | "outer-glow" | "inner-glow" | "stroke";
    distance: number;
    spread: number;
}, {
    projectId: string;
    componentId: string;
    effect: "drop-shadow" | "inner-shadow" | "outer-glow" | "inner-glow" | "stroke";
    opacity?: number | undefined;
    blur?: number | undefined;
    color?: string | undefined;
    distance?: number | undefined;
    spread?: number | undefined;
}>;
export declare const AddMaskInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    shape: z.ZodDefault<z.ZodEnum<["rectangle", "ellipse", "path"]>>;
    mode: z.ZodDefault<z.ZodEnum<["add", "subtract", "intersect", "difference", "lighten", "darken"]>>;
    x: z.ZodDefault<z.ZodNumber>;
    y: z.ZodDefault<z.ZodNumber>;
    width: z.ZodDefault<z.ZodNumber>;
    height: z.ZodDefault<z.ZodNumber>;
    path: z.ZodOptional<z.ZodString>;
    feather: z.ZodDefault<z.ZodNumber>;
    expansion: z.ZodDefault<z.ZodNumber>;
    inverted: z.ZodDefault<z.ZodBoolean>;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
    shape: "path" | "ellipse" | "rectangle";
    projectId: string;
    componentId: string;
    mode: "darken" | "lighten" | "difference" | "add" | "subtract" | "intersect";
    x: number;
    y: number;
    feather: number;
    expansion: number;
    inverted: boolean;
    path?: string | undefined;
    name?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    path?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
    name?: string | undefined;
    shape?: "path" | "ellipse" | "rectangle" | undefined;
    mode?: "darken" | "lighten" | "difference" | "add" | "subtract" | "intersect" | undefined;
    x?: number | undefined;
    y?: number | undefined;
    feather?: number | undefined;
    expansion?: number | undefined;
    inverted?: boolean | undefined;
}>;
export declare const SetMaskModeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    maskIndex: z.ZodDefault<z.ZodNumber>;
    mode: z.ZodEnum<["add", "subtract", "intersect", "difference", "lighten", "darken"]>;
    inverted: z.ZodOptional<z.ZodBoolean>;
    feather: z.ZodOptional<z.ZodNumber>;
    expansion: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    mode: "darken" | "lighten" | "difference" | "add" | "subtract" | "intersect";
    maskIndex: number;
    feather?: number | undefined;
    expansion?: number | undefined;
    inverted?: boolean | undefined;
}, {
    projectId: string;
    componentId: string;
    mode: "darken" | "lighten" | "difference" | "add" | "subtract" | "intersect";
    feather?: number | undefined;
    expansion?: number | undefined;
    inverted?: boolean | undefined;
    maskIndex?: number | undefined;
}>;
export declare const SetTrackMatteInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    matteComponentId: z.ZodString;
    mode: z.ZodDefault<z.ZodEnum<["alpha", "alpha-inverted", "luma", "luma-inverted"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    mode: "alpha" | "alpha-inverted" | "luma" | "luma-inverted";
    matteComponentId: string;
}, {
    projectId: string;
    componentId: string;
    matteComponentId: string;
    mode?: "alpha" | "alpha-inverted" | "luma" | "luma-inverted" | undefined;
}>;
export declare const CreateShapeLayerInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    shape: z.ZodEnum<["rectangle", "ellipse", "polygon", "star", "line", "path"]>;
    x: z.ZodDefault<z.ZodNumber>;
    y: z.ZodDefault<z.ZodNumber>;
    width: z.ZodDefault<z.ZodNumber>;
    height: z.ZodDefault<z.ZodNumber>;
    sides: z.ZodDefault<z.ZodNumber>;
    points: z.ZodDefault<z.ZodNumber>;
    innerRadius: z.ZodOptional<z.ZodNumber>;
    path: z.ZodOptional<z.ZodString>;
    fill: z.ZodDefault<z.ZodString>;
    stroke: z.ZodOptional<z.ZodString>;
    strokeWidth: z.ZodDefault<z.ZodNumber>;
    cornerRadius: z.ZodDefault<z.ZodNumber>;
    rotation: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    fill: string;
    width: number;
    height: number;
    shape: "path" | "line" | "ellipse" | "rectangle" | "star" | "polygon";
    projectId: string;
    rotation: number;
    x: number;
    y: number;
    sides: number;
    points: number;
    strokeWidth: number;
    cornerRadius: number;
    path?: string | undefined;
    name?: string | undefined;
    stroke?: string | undefined;
    innerRadius?: number | undefined;
}, {
    shape: "path" | "line" | "ellipse" | "rectangle" | "star" | "polygon";
    projectId: string;
    path?: string | undefined;
    fill?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
    name?: string | undefined;
    rotation?: number | undefined;
    x?: number | undefined;
    y?: number | undefined;
    stroke?: string | undefined;
    sides?: number | undefined;
    points?: number | undefined;
    innerRadius?: number | undefined;
    strokeWidth?: number | undefined;
    cornerRadius?: number | undefined;
}>;
export declare const PosterizeTimeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    fps: z.ZodNumber;
    enabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    enabled: boolean;
    fps: number;
}, {
    projectId: string;
    componentId: string;
    fps: number;
    enabled?: boolean | undefined;
}>;
export declare const AddTextAnimatorInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    property: z.ZodDefault<z.ZodEnum<["position", "scale", "rotation", "opacity", "color"]>>;
    rangeStart: z.ZodDefault<z.ZodNumber>;
    rangeEnd: z.ZodDefault<z.ZodNumber>;
    unit: z.ZodDefault<z.ZodEnum<["character", "word"]>>;
    offset: z.ZodDefault<z.ZodNumber>;
    valueDelta: z.ZodDefault<z.ZodNumber>;
    staggerMs: z.ZodDefault<z.ZodNumber>;
    easing: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    offset: number;
    easing: string;
    projectId: string;
    componentId: string;
    property: "scale" | "opacity" | "color" | "rotation" | "position";
    rangeStart: number;
    rangeEnd: number;
    unit: "character" | "word";
    valueDelta: number;
    staggerMs: number;
}, {
    projectId: string;
    componentId: string;
    offset?: number | undefined;
    easing?: string | undefined;
    property?: "scale" | "opacity" | "color" | "rotation" | "position" | undefined;
    rangeStart?: number | undefined;
    rangeEnd?: number | undefined;
    unit?: "character" | "word" | undefined;
    valueDelta?: number | undefined;
    staggerMs?: number | undefined;
}>;
export declare const SetKeyframeInterpolationInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    keyframeIndex: z.ZodNumber;
    interpolation: z.ZodEnum<["linear", "bezier", "hold", "auto-bezier", "continuous"]>;
    roving: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    keyframeIndex: number;
    interpolation: "linear" | "bezier" | "hold" | "auto-bezier" | "continuous";
    roving?: boolean | undefined;
}, {
    projectId: string;
    componentId: string;
    keyframeIndex: number;
    interpolation: "linear" | "bezier" | "hold" | "auto-bezier" | "continuous";
    roving?: boolean | undefined;
}>;
export declare const SetExpressionInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    property: z.ZodString;
    expression: z.ZodString;
    enabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    property: string;
    enabled: boolean;
    expression: string;
}, {
    projectId: string;
    componentId: string;
    property: string;
    expression: string;
    enabled?: boolean | undefined;
}>;
export declare const SetGradientFillInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["linear", "radial"]>>;
    angle: z.ZodDefault<z.ZodNumber>;
    stops: z.ZodArray<z.ZodObject<{
        color: z.ZodString;
        position: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        color: string;
        position: number;
    }, {
        color: string;
        position?: number | undefined;
    }>, "many">;
    cx: z.ZodOptional<z.ZodNumber>;
    cy: z.ZodOptional<z.ZodNumber>;
    radius: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "linear" | "radial";
    projectId: string;
    componentId: string;
    angle: number;
    stops: {
        color: string;
        position: number;
    }[];
    cx?: number | undefined;
    cy?: number | undefined;
    radius?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    stops: {
        color: string;
        position?: number | undefined;
    }[];
    type?: "linear" | "radial" | undefined;
    angle?: number | undefined;
    cx?: number | undefined;
    cy?: number | undefined;
    radius?: number | undefined;
}>;
export declare const SetGradientStrokeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["linear", "radial"]>>;
    angle: z.ZodDefault<z.ZodNumber>;
    width: z.ZodDefault<z.ZodNumber>;
    stops: z.ZodArray<z.ZodObject<{
        color: z.ZodString;
        position: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        color: string;
        position: number;
    }, {
        color: string;
        position?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    type: "linear" | "radial";
    width: number;
    projectId: string;
    componentId: string;
    angle: number;
    stops: {
        color: string;
        position: number;
    }[];
}, {
    projectId: string;
    componentId: string;
    stops: {
        color: string;
        position?: number | undefined;
    }[];
    type?: "linear" | "radial" | undefined;
    width?: number | undefined;
    angle?: number | undefined;
}>;
export declare const ApplyWiggleInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    property: z.ZodDefault<z.ZodEnum<["translateX", "translateY", "rotate", "scale", "opacity", "skewX", "skewY"]>>;
    frequency: z.ZodDefault<z.ZodNumber>;
    amplitude: z.ZodDefault<z.ZodNumber>;
    octaves: z.ZodDefault<z.ZodNumber>;
    seed: z.ZodDefault<z.ZodNumber>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    sampleCount: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    property: "translateX" | "translateY" | "scale" | "rotate" | "skewX" | "skewY" | "opacity";
    frequency: number;
    amplitude: number;
    octaves: number;
    seed: number;
    sampleCount: number;
    durationMs?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    durationMs?: number | undefined;
    property?: "translateX" | "translateY" | "scale" | "rotate" | "skewX" | "skewY" | "opacity" | undefined;
    frequency?: number | undefined;
    amplitude?: number | undefined;
    octaves?: number | undefined;
    seed?: number | undefined;
    sampleCount?: number | undefined;
}>;
export declare const AddParticleEmitterInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    x: z.ZodDefault<z.ZodNumber>;
    y: z.ZodDefault<z.ZodNumber>;
    width: z.ZodDefault<z.ZodNumber>;
    height: z.ZodDefault<z.ZodNumber>;
    rate: z.ZodDefault<z.ZodNumber>;
    lifespan: z.ZodDefault<z.ZodNumber>;
    gravity: z.ZodDefault<z.ZodNumber>;
    spread: z.ZodDefault<z.ZodNumber>;
    speed: z.ZodDefault<z.ZodNumber>;
    startColor: z.ZodDefault<z.ZodString>;
    endColor: z.ZodDefault<z.ZodString>;
    startSize: z.ZodDefault<z.ZodNumber>;
    endSize: z.ZodDefault<z.ZodNumber>;
    startOpacity: z.ZodDefault<z.ZodNumber>;
    endOpacity: z.ZodDefault<z.ZodNumber>;
    blendMode: z.ZodDefault<z.ZodEnum<["normal", "screen", "lighter", "add"]>>;
}, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
    projectId: string;
    x: number;
    y: number;
    blendMode: "normal" | "screen" | "add" | "lighter";
    rate: number;
    spread: number;
    lifespan: number;
    gravity: number;
    speed: number;
    startColor: string;
    endColor: string;
    startSize: number;
    endSize: number;
    startOpacity: number;
    endOpacity: number;
    name?: string | undefined;
}, {
    projectId: string;
    width?: number | undefined;
    height?: number | undefined;
    name?: string | undefined;
    x?: number | undefined;
    y?: number | undefined;
    blendMode?: "normal" | "screen" | "add" | "lighter" | undefined;
    rate?: number | undefined;
    spread?: number | undefined;
    lifespan?: number | undefined;
    gravity?: number | undefined;
    speed?: number | undefined;
    startColor?: string | undefined;
    endColor?: string | undefined;
    startSize?: number | undefined;
    endSize?: number | undefined;
    startOpacity?: number | undefined;
    endOpacity?: number | undefined;
}>;
export declare const AddCameraInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    positionX: z.ZodDefault<z.ZodNumber>;
    positionY: z.ZodDefault<z.ZodNumber>;
    positionZ: z.ZodDefault<z.ZodNumber>;
    focalLength: z.ZodDefault<z.ZodNumber>;
    depthOfField: z.ZodDefault<z.ZodNumber>;
    rotateX: z.ZodDefault<z.ZodNumber>;
    rotateY: z.ZodDefault<z.ZodNumber>;
    rotateZ: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    projectId: string;
    positionX: number;
    positionY: number;
    positionZ: number;
    focalLength: number;
    depthOfField: number;
    name?: string | undefined;
}, {
    projectId: string;
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
    name?: string | undefined;
    positionX?: number | undefined;
    positionY?: number | undefined;
    positionZ?: number | undefined;
    focalLength?: number | undefined;
    depthOfField?: number | undefined;
}>;
export declare const SetCameraTransformInput: z.ZodObject<{
    projectId: z.ZodString;
    positionX: z.ZodOptional<z.ZodNumber>;
    positionY: z.ZodOptional<z.ZodNumber>;
    positionZ: z.ZodOptional<z.ZodNumber>;
    focalLength: z.ZodOptional<z.ZodNumber>;
    depthOfField: z.ZodOptional<z.ZodNumber>;
    rotateX: z.ZodOptional<z.ZodNumber>;
    rotateY: z.ZodOptional<z.ZodNumber>;
    rotateZ: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
    positionX?: number | undefined;
    positionY?: number | undefined;
    positionZ?: number | undefined;
    focalLength?: number | undefined;
    depthOfField?: number | undefined;
}, {
    projectId: string;
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
    positionX?: number | undefined;
    positionY?: number | undefined;
    positionZ?: number | undefined;
    focalLength?: number | undefined;
    depthOfField?: number | undefined;
}>;
export declare const BindAudioToPropertyInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    audioComponentId: z.ZodString;
    property: z.ZodDefault<z.ZodEnum<["opacity", "scale", "translateX", "translateY", "rotate", "backgroundColor"]>>;
    band: z.ZodDefault<z.ZodEnum<["bass", "mid", "treble", "overall"]>>;
    min: z.ZodDefault<z.ZodNumber>;
    max: z.ZodDefault<z.ZodNumber>;
    smoothing: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    property: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "backgroundColor";
    audioComponentId: string;
    band: "bass" | "mid" | "treble" | "overall";
    min: number;
    max: number;
    smoothing: number;
}, {
    projectId: string;
    componentId: string;
    audioComponentId: string;
    property?: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "backgroundColor" | undefined;
    band?: "bass" | "mid" | "treble" | "overall" | undefined;
    min?: number | undefined;
    max?: number | undefined;
    smoothing?: number | undefined;
}>;
export declare const UnbindAudioInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
}, {
    projectId: string;
    componentId: string;
}>;
export declare const AddPuppetPinInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    x: z.ZodNumber;
    y: z.ZodNumber;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    x: number;
    y: number;
    name?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    x: number;
    y: number;
    name?: string | undefined;
}>;
export declare const ApplyMeshWarpInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    turbulence: z.ZodDefault<z.ZodNumber>;
    scale: z.ZodDefault<z.ZodNumber>;
    octaves: z.ZodDefault<z.ZodNumber>;
    animated: z.ZodDefault<z.ZodBoolean>;
    speed: z.ZodDefault<z.ZodNumber>;
    seed: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    scale: number;
    projectId: string;
    componentId: string;
    octaves: number;
    seed: number;
    speed: number;
    turbulence: number;
    animated: boolean;
}, {
    projectId: string;
    componentId: string;
    scale?: number | undefined;
    octaves?: number | undefined;
    seed?: number | undefined;
    speed?: number | undefined;
    turbulence?: number | undefined;
    animated?: boolean | undefined;
}>;
export declare const RemoveMeshWarpInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
}, {
    projectId: string;
    componentId: string;
}>;
export declare const AddLightInput: z.ZodObject<{
    projectId: z.ZodString;
    type: z.ZodEnum<["parallel", "point", "spot", "ambient"]>;
    name: z.ZodOptional<z.ZodString>;
    positionX: z.ZodDefault<z.ZodNumber>;
    positionY: z.ZodDefault<z.ZodNumber>;
    positionZ: z.ZodDefault<z.ZodNumber>;
    targetX: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    targetY: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    targetZ: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    color: z.ZodDefault<z.ZodString>;
    intensity: z.ZodDefault<z.ZodNumber>;
    coneAngle: z.ZodOptional<z.ZodNumber>;
    coneFeather: z.ZodOptional<z.ZodNumber>;
    castShadow: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "parallel" | "point" | "spot" | "ambient";
    color: string;
    projectId: string;
    intensity: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    castShadow: boolean;
    name?: string | undefined;
    targetX?: number | undefined;
    targetY?: number | undefined;
    targetZ?: number | undefined;
    coneAngle?: number | undefined;
    coneFeather?: number | undefined;
}, {
    type: "parallel" | "point" | "spot" | "ambient";
    projectId: string;
    color?: string | undefined;
    name?: string | undefined;
    intensity?: number | undefined;
    positionX?: number | undefined;
    positionY?: number | undefined;
    positionZ?: number | undefined;
    targetX?: number | undefined;
    targetY?: number | undefined;
    targetZ?: number | undefined;
    coneAngle?: number | undefined;
    coneFeather?: number | undefined;
    castShadow?: boolean | undefined;
}>;
export declare const SetLightTransformInput: z.ZodObject<{
    projectId: z.ZodString;
    lightId: z.ZodString;
    positionX: z.ZodOptional<z.ZodNumber>;
    positionY: z.ZodOptional<z.ZodNumber>;
    positionZ: z.ZodOptional<z.ZodNumber>;
    targetX: z.ZodOptional<z.ZodNumber>;
    targetY: z.ZodOptional<z.ZodNumber>;
    targetZ: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    lightId: string;
    positionX?: number | undefined;
    positionY?: number | undefined;
    positionZ?: number | undefined;
    targetX?: number | undefined;
    targetY?: number | undefined;
    targetZ?: number | undefined;
}, {
    projectId: string;
    lightId: string;
    positionX?: number | undefined;
    positionY?: number | undefined;
    positionZ?: number | undefined;
    targetX?: number | undefined;
    targetY?: number | undefined;
    targetZ?: number | undefined;
}>;
export declare const SetLightPropertiesInput: z.ZodObject<{
    projectId: z.ZodString;
    lightId: z.ZodString;
    color: z.ZodOptional<z.ZodString>;
    intensity: z.ZodOptional<z.ZodNumber>;
    coneAngle: z.ZodOptional<z.ZodNumber>;
    coneFeather: z.ZodOptional<z.ZodNumber>;
    castShadow: z.ZodOptional<z.ZodBoolean>;
    falloff: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    lightId: string;
    color?: string | undefined;
    intensity?: number | undefined;
    coneAngle?: number | undefined;
    coneFeather?: number | undefined;
    castShadow?: boolean | undefined;
    falloff?: number | undefined;
}, {
    projectId: string;
    lightId: string;
    color?: string | undefined;
    intensity?: number | undefined;
    coneAngle?: number | undefined;
    coneFeather?: number | undefined;
    castShadow?: boolean | undefined;
    falloff?: number | undefined;
}>;
export declare const RemoveLightInput: z.ZodObject<{
    projectId: z.ZodString;
    lightId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    lightId: string;
}, {
    projectId: string;
    lightId: string;
}>;
export declare const CastShadowInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    enabled: z.ZodDefault<z.ZodBoolean>;
    shadowOpacity: z.ZodDefault<z.ZodNumber>;
    shadowBlur: z.ZodDefault<z.ZodNumber>;
    shadowOffsetX: z.ZodDefault<z.ZodNumber>;
    shadowOffsetY: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    enabled: boolean;
    shadowOpacity: number;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
}, {
    projectId: string;
    componentId: string;
    enabled?: boolean | undefined;
    shadowOpacity?: number | undefined;
    shadowBlur?: number | undefined;
    shadowOffsetX?: number | undefined;
    shadowOffsetY?: number | undefined;
}>;
export declare const SetCameraDOFInput: z.ZodObject<{
    projectId: z.ZodString;
    enabled: z.ZodDefault<z.ZodBoolean>;
    focusDistance: z.ZodDefault<z.ZodNumber>;
    aperture: z.ZodDefault<z.ZodNumber>;
    blurAmount: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    enabled: boolean;
    focusDistance: number;
    aperture: number;
    blurAmount: number;
}, {
    projectId: string;
    enabled?: boolean | undefined;
    focusDistance?: number | undefined;
    aperture?: number | undefined;
    blurAmount?: number | undefined;
}>;
export declare const SetLevelsInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    inputBlack: z.ZodDefault<z.ZodNumber>;
    inputWhite: z.ZodDefault<z.ZodNumber>;
    gamma: z.ZodDefault<z.ZodNumber>;
    outputBlack: z.ZodDefault<z.ZodNumber>;
    outputWhite: z.ZodDefault<z.ZodNumber>;
    channel: z.ZodDefault<z.ZodEnum<["rgb", "red", "green", "blue"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    inputBlack: number;
    inputWhite: number;
    gamma: number;
    outputBlack: number;
    outputWhite: number;
    channel: "rgb" | "red" | "green" | "blue";
}, {
    projectId: string;
    componentId: string;
    inputBlack?: number | undefined;
    inputWhite?: number | undefined;
    gamma?: number | undefined;
    outputBlack?: number | undefined;
    outputWhite?: number | undefined;
    channel?: "rgb" | "red" | "green" | "blue" | undefined;
}>;
export declare const SetCurvesInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    channel: z.ZodDefault<z.ZodEnum<["rgb", "red", "green", "blue"]>>;
    points: z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    points: {
        x: number;
        y: number;
    }[];
    channel: "rgb" | "red" | "green" | "blue";
}, {
    projectId: string;
    componentId: string;
    points: {
        x: number;
        y: number;
    }[];
    channel?: "rgb" | "red" | "green" | "blue" | undefined;
}>;
export declare const SetColorBalanceInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    shadowRed: z.ZodDefault<z.ZodNumber>;
    shadowGreen: z.ZodDefault<z.ZodNumber>;
    shadowBlue: z.ZodDefault<z.ZodNumber>;
    midtoneRed: z.ZodDefault<z.ZodNumber>;
    midtoneGreen: z.ZodDefault<z.ZodNumber>;
    midtoneBlue: z.ZodDefault<z.ZodNumber>;
    highlightRed: z.ZodDefault<z.ZodNumber>;
    highlightGreen: z.ZodDefault<z.ZodNumber>;
    highlightBlue: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    shadowRed: number;
    shadowGreen: number;
    shadowBlue: number;
    midtoneRed: number;
    midtoneGreen: number;
    midtoneBlue: number;
    highlightRed: number;
    highlightGreen: number;
    highlightBlue: number;
}, {
    projectId: string;
    componentId: string;
    shadowRed?: number | undefined;
    shadowGreen?: number | undefined;
    shadowBlue?: number | undefined;
    midtoneRed?: number | undefined;
    midtoneGreen?: number | undefined;
    midtoneBlue?: number | undefined;
    highlightRed?: number | undefined;
    highlightGreen?: number | undefined;
    highlightBlue?: number | undefined;
}>;
export declare const SetHueSaturationInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    hueShift: z.ZodDefault<z.ZodNumber>;
    saturation: z.ZodDefault<z.ZodNumber>;
    lightness: z.ZodDefault<z.ZodNumber>;
    channel: z.ZodDefault<z.ZodEnum<["master", "red", "yellow", "green", "cyan", "blue", "magenta"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    saturation: number;
    channel: "red" | "green" | "blue" | "master" | "yellow" | "cyan" | "magenta";
    hueShift: number;
    lightness: number;
}, {
    projectId: string;
    componentId: string;
    saturation?: number | undefined;
    channel?: "red" | "green" | "blue" | "master" | "yellow" | "cyan" | "magenta" | undefined;
    hueShift?: number | undefined;
    lightness?: number | undefined;
}>;
export declare const SetVibranceInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    vibrance: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    vibrance: number;
}, {
    projectId: string;
    componentId: string;
    vibrance?: number | undefined;
}>;
export declare const SetExposureInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    exposure: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    gammaCorrection: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    offset: number;
    projectId: string;
    componentId: string;
    exposure: number;
    gammaCorrection: number;
}, {
    projectId: string;
    componentId: string;
    offset?: number | undefined;
    exposure?: number | undefined;
    gammaCorrection?: number | undefined;
}>;
export declare const SetShadowHighlightInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    shadowAmount: z.ZodDefault<z.ZodNumber>;
    shadowTonalWidth: z.ZodDefault<z.ZodNumber>;
    shadowRadius: z.ZodDefault<z.ZodNumber>;
    highlightAmount: z.ZodDefault<z.ZodNumber>;
    highlightTonalWidth: z.ZodDefault<z.ZodNumber>;
    highlightRadius: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    shadowAmount: number;
    shadowTonalWidth: number;
    shadowRadius: number;
    highlightAmount: number;
    highlightTonalWidth: number;
    highlightRadius: number;
}, {
    projectId: string;
    componentId: string;
    shadowAmount?: number | undefined;
    shadowTonalWidth?: number | undefined;
    shadowRadius?: number | undefined;
    highlightAmount?: number | undefined;
    highlightTonalWidth?: number | undefined;
    highlightRadius?: number | undefined;
}>;
export declare const SetSelectiveColorInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    target: z.ZodEnum<["reds", "yellows", "greens", "cyans", "blues", "magentas", "whites", "neutrals", "blacks"]>;
    cyan: z.ZodDefault<z.ZodNumber>;
    magenta: z.ZodDefault<z.ZodNumber>;
    yellow: z.ZodDefault<z.ZodNumber>;
    black: z.ZodDefault<z.ZodNumber>;
    method: z.ZodDefault<z.ZodEnum<["relative", "absolute"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    target: "reds" | "yellows" | "greens" | "cyans" | "blues" | "magentas" | "whites" | "neutrals" | "blacks";
    yellow: number;
    cyan: number;
    magenta: number;
    black: number;
    method: "relative" | "absolute";
}, {
    projectId: string;
    componentId: string;
    target: "reds" | "yellows" | "greens" | "cyans" | "blues" | "magentas" | "whites" | "neutrals" | "blacks";
    yellow?: number | undefined;
    cyan?: number | undefined;
    magenta?: number | undefined;
    black?: number | undefined;
    method?: "relative" | "absolute" | undefined;
}>;
export declare const OffsetPathInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    amount: z.ZodNumber;
    miterLimit: z.ZodDefault<z.ZodNumber>;
    lineJoin: z.ZodDefault<z.ZodEnum<["miter", "round", "bevel"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    amount: number;
    miterLimit: number;
    lineJoin: "miter" | "round" | "bevel";
}, {
    projectId: string;
    componentId: string;
    amount: number;
    miterLimit?: number | undefined;
    lineJoin?: "miter" | "round" | "bevel" | undefined;
}>;
export declare const PuckerBloatInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    amount: number;
}, {
    projectId: string;
    componentId: string;
    amount: number;
}>;
export declare const RoundCornersInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    radius: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    radius: number;
}, {
    projectId: string;
    componentId: string;
    radius: number;
}>;
export declare const ZigZagInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    size: z.ZodDefault<z.ZodNumber>;
    ridges: z.ZodDefault<z.ZodNumber>;
    points: z.ZodDefault<z.ZodEnum<["corner", "smooth"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    size: number;
    points: "smooth" | "corner";
    ridges: number;
}, {
    projectId: string;
    componentId: string;
    size?: number | undefined;
    points?: "smooth" | "corner" | undefined;
    ridges?: number | undefined;
}>;
export declare const TwistPathInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    angle: z.ZodNumber;
    centerX: z.ZodOptional<z.ZodNumber>;
    centerY: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    angle: number;
    centerX?: number | undefined;
    centerY?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    angle: number;
    centerX?: number | undefined;
    centerY?: number | undefined;
}>;
export declare const MergePathsInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    mode: z.ZodEnum<["merge", "add", "subtract", "intersect", "exclude"]>;
    sourcePathIds: z.ZodArray<z.ZodString, "many">;
    resultName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    mode: "add" | "subtract" | "intersect" | "merge" | "exclude";
    sourcePathIds: string[];
    resultName?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    mode: "add" | "subtract" | "intersect" | "merge" | "exclude";
    sourcePathIds: string[];
    resultName?: string | undefined;
}>;
export declare const ShapeBooleanInput: z.ZodObject<{
    projectId: z.ZodString;
    operation: z.ZodEnum<["union", "subtract", "intersect", "exclude"]>;
    targetComponentId: z.ZodString;
    sourceComponentId: z.ZodString;
    createNew: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    operation: "subtract" | "intersect" | "exclude" | "union";
    targetComponentId: string;
    sourceComponentId: string;
    createNew: boolean;
}, {
    projectId: string;
    operation: "subtract" | "intersect" | "exclude" | "union";
    targetComponentId: string;
    sourceComponentId: string;
    createNew?: boolean | undefined;
}>;
export declare const TrimPathMultipleInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    segments: z.ZodArray<z.ZodObject<{
        start: z.ZodNumber;
        end: z.ZodNumber;
        offset: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        offset: number;
        start: number;
        end: number;
    }, {
        start: number;
        end: number;
        offset?: number | undefined;
    }>, "many">;
    reverse: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    reverse: boolean;
    projectId: string;
    componentId: string;
    segments: {
        offset: number;
        start: number;
        end: number;
    }[];
}, {
    projectId: string;
    componentId: string;
    segments: {
        start: number;
        end: number;
        offset?: number | undefined;
    }[];
    reverse?: boolean | undefined;
}>;
export declare const LoadDataSourceInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodString;
    format: z.ZodDefault<z.ZodEnum<["json", "csv"]>>;
    data: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
    format: "json" | "csv";
    data: string;
}, {
    name: string;
    projectId: string;
    data: string;
    format?: "json" | "csv" | undefined;
}>;
export declare const ListDataSourcesInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const BindPropertyToDataInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    dataSourceName: z.ZodString;
    column: z.ZodString;
    property: z.ZodEnum<["translateX", "translateY", "scale", "rotate", "opacity", "width", "height", "backgroundColor"]>;
    mapping: z.ZodDefault<z.ZodEnum<["linear", "logarithmic", "quantize"]>>;
    rangeMin: z.ZodOptional<z.ZodNumber>;
    rangeMax: z.ZodOptional<z.ZodNumber>;
    sampleInterval: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    property: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "backgroundColor" | "width" | "height";
    dataSourceName: string;
    column: string;
    mapping: "linear" | "logarithmic" | "quantize";
    sampleInterval: number;
    rangeMin?: number | undefined;
    rangeMax?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    property: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "backgroundColor" | "width" | "height";
    dataSourceName: string;
    column: string;
    mapping?: "linear" | "logarithmic" | "quantize" | undefined;
    rangeMin?: number | undefined;
    rangeMax?: number | undefined;
    sampleInterval?: number | undefined;
}>;
export declare const UnbindDataInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    property: z.ZodOptional<z.ZodEnum<["translateX", "translateY", "scale", "rotate", "opacity", "width", "height", "backgroundColor"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    property?: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "backgroundColor" | "width" | "height" | undefined;
}, {
    projectId: string;
    componentId: string;
    property?: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "backgroundColor" | "width" | "height" | undefined;
}>;
export declare const DataDrivenChartInput: z.ZodObject<{
    projectId: z.ZodString;
    dataSourceName: z.ZodString;
    chartType: z.ZodEnum<["bar", "line", "pie", "scatter", "area"]>;
    xColumn: z.ZodString;
    yColumn: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    animated: z.ZodDefault<z.ZodBoolean>;
    durationMs: z.ZodDefault<z.ZodNumber>;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    durationMs: number;
    animated: boolean;
    dataSourceName: string;
    chartType: "line" | "scatter" | "bar" | "pie" | "area";
    xColumn: string;
    yColumn: string;
    color?: string | undefined;
    name?: string | undefined;
}, {
    projectId: string;
    dataSourceName: string;
    chartType: "line" | "scatter" | "bar" | "pie" | "area";
    xColumn: string;
    yColumn: string;
    color?: string | undefined;
    name?: string | undefined;
    durationMs?: number | undefined;
    animated?: boolean | undefined;
}>;
export declare const ApplyGaussianBlurInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    radius: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    radius: number;
}, {
    projectId: string;
    componentId: string;
    radius?: number | undefined;
}>;
export declare const ApplyDirectionalBlurInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    angle: z.ZodDefault<z.ZodNumber>;
    length: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    length: number;
    projectId: string;
    componentId: string;
    angle: number;
}, {
    projectId: string;
    componentId: string;
    length?: number | undefined;
    angle?: number | undefined;
}>;
export declare const ApplyRadialBlurInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    centerX: z.ZodDefault<z.ZodNumber>;
    centerY: z.ZodDefault<z.ZodNumber>;
    amount: z.ZodDefault<z.ZodNumber>;
    spin: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    centerX: number;
    centerY: number;
    amount: number;
    spin: boolean;
}, {
    projectId: string;
    componentId: string;
    centerX?: number | undefined;
    centerY?: number | undefined;
    amount?: number | undefined;
    spin?: boolean | undefined;
}>;
export declare const ApplySharpenInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    amount: z.ZodDefault<z.ZodNumber>;
    radius: z.ZodDefault<z.ZodNumber>;
    threshold: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    threshold: number;
    radius: number;
    amount: number;
}, {
    projectId: string;
    componentId: string;
    threshold?: number | undefined;
    radius?: number | undefined;
    amount?: number | undefined;
}>;
export declare const ApplyWaveWarpInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    waveHeight: z.ZodDefault<z.ZodNumber>;
    waveWidth: z.ZodDefault<z.ZodNumber>;
    direction: z.ZodDefault<z.ZodNumber>;
    speed: z.ZodDefault<z.ZodNumber>;
    phase: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    direction: number;
    componentId: string;
    speed: number;
    waveHeight: number;
    waveWidth: number;
    phase: number;
}, {
    projectId: string;
    componentId: string;
    direction?: number | undefined;
    speed?: number | undefined;
    waveHeight?: number | undefined;
    waveWidth?: number | undefined;
    phase?: number | undefined;
}>;
export declare const ApplyRippleInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    centerX: z.ZodDefault<z.ZodNumber>;
    centerY: z.ZodDefault<z.ZodNumber>;
    radius: z.ZodDefault<z.ZodNumber>;
    waveSpeed: z.ZodDefault<z.ZodNumber>;
    frequency: z.ZodDefault<z.ZodNumber>;
    amplitude: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    centerX: number;
    centerY: number;
    radius: number;
    frequency: number;
    amplitude: number;
    waveSpeed: number;
}, {
    projectId: string;
    componentId: string;
    centerX?: number | undefined;
    centerY?: number | undefined;
    radius?: number | undefined;
    frequency?: number | undefined;
    amplitude?: number | undefined;
    waveSpeed?: number | undefined;
}>;
export declare const ApplyBulgeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    centerX: z.ZodDefault<z.ZodNumber>;
    centerY: z.ZodDefault<z.ZodNumber>;
    radius: z.ZodDefault<z.ZodNumber>;
    height: z.ZodDefault<z.ZodNumber>;
    antialias: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    height: number;
    projectId: string;
    componentId: string;
    centerX: number;
    centerY: number;
    radius: number;
    antialias: boolean;
}, {
    projectId: string;
    componentId: string;
    height?: number | undefined;
    centerX?: number | undefined;
    centerY?: number | undefined;
    radius?: number | undefined;
    antialias?: boolean | undefined;
}>;
export declare const ApplyGlowInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    threshold: z.ZodDefault<z.ZodNumber>;
    radius: z.ZodDefault<z.ZodNumber>;
    intensity: z.ZodDefault<z.ZodNumber>;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    threshold: number;
    intensity: number;
    radius: number;
    color?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    color?: string | undefined;
    threshold?: number | undefined;
    intensity?: number | undefined;
    radius?: number | undefined;
}>;
export declare const ApplyMosaicInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    blockSize: z.ZodDefault<z.ZodNumber>;
    sharpEdges: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    blockSize: number;
    sharpEdges: boolean;
}, {
    projectId: string;
    componentId: string;
    blockSize?: number | undefined;
    sharpEdges?: boolean | undefined;
}>;
export declare const ApplyFindEdgesInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    invert: z.ZodDefault<z.ZodBoolean>;
    blend: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    invert: boolean;
    blend: number;
}, {
    projectId: string;
    componentId: string;
    invert?: boolean | undefined;
    blend?: number | undefined;
}>;
export declare const ApplyLensFlareInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    centerX: z.ZodDefault<z.ZodNumber>;
    centerY: z.ZodDefault<z.ZodNumber>;
    brightness: z.ZodDefault<z.ZodNumber>;
    rays: z.ZodDefault<z.ZodNumber>;
    color: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    color: string;
    projectId: string;
    componentId: string;
    centerX: number;
    centerY: number;
    brightness: number;
    rays: number;
}, {
    projectId: string;
    componentId: string;
    color?: string | undefined;
    centerX?: number | undefined;
    centerY?: number | undefined;
    brightness?: number | undefined;
    rays?: number | undefined;
}>;
export declare const ApplyFourColorGradientInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    color1: z.ZodDefault<z.ZodString>;
    color2: z.ZodDefault<z.ZodString>;
    color3: z.ZodDefault<z.ZodString>;
    color4: z.ZodDefault<z.ZodString>;
    blend: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    blend: number;
    color1: string;
    color2: string;
    color3: string;
    color4: string;
}, {
    projectId: string;
    componentId: string;
    blend?: number | undefined;
    color1?: string | undefined;
    color2?: string | undefined;
    color3?: string | undefined;
    color4?: string | undefined;
}>;
export declare const RemoveExpressionInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    property: z.ZodEnum<["translateX", "translateY", "scale", "rotate", "opacity", "width", "height"]>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    property: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "width" | "height";
}, {
    projectId: string;
    componentId: string;
    property: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "width" | "height";
}>;
export declare const SetLoopExpressionInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    property: z.ZodDefault<z.ZodEnum<["translateX", "translateY", "scale", "rotate", "opacity"]>>;
    mode: z.ZodDefault<z.ZodEnum<["cycle", "pingpong", "offset", "continue"]>>;
    durationMs: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    durationMs: number;
    componentId: string;
    property: "translateX" | "translateY" | "scale" | "rotate" | "opacity";
    mode: "offset" | "cycle" | "pingpong" | "continue";
}, {
    projectId: string;
    componentId: string;
    durationMs?: number | undefined;
    property?: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | undefined;
    mode?: "offset" | "cycle" | "pingpong" | "continue" | undefined;
}>;
export declare const SequenceLayersInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    staggerMs: z.ZodDefault<z.ZodNumber>;
    overlap: z.ZodDefault<z.ZodNumber>;
    order: z.ZodDefault<z.ZodEnum<["top-to-bottom", "bottom-to-top", "selection-order", "forward", "reverse"]>>;
    ease: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    ease: boolean;
    projectId: string;
    staggerMs: number;
    overlap: number;
    order: "reverse" | "forward" | "top-to-bottom" | "bottom-to-top" | "selection-order";
    componentIds?: string[] | undefined;
}, {
    projectId: string;
    ease?: boolean | undefined;
    componentIds?: string[] | undefined;
    staggerMs?: number | undefined;
    overlap?: number | undefined;
    order?: "reverse" | "forward" | "top-to-bottom" | "bottom-to-top" | "selection-order" | undefined;
}>;
export declare const ExponentialScaleInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    fromScale: z.ZodDefault<z.ZodNumber>;
    toScale: z.ZodDefault<z.ZodNumber>;
    durationMs: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    durationMs: number;
    componentId: string;
    fromScale: number;
    toScale: number;
}, {
    projectId: string;
    componentId: string;
    durationMs?: number | undefined;
    fromScale?: number | undefined;
    toScale?: number | undefined;
}>;
export declare const SmoothKeyframesInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    property: z.ZodDefault<z.ZodEnum<["translateX", "translateY", "scale", "rotate", "opacity"]>>;
    tolerance: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    property: "translateX" | "translateY" | "scale" | "rotate" | "opacity";
    tolerance: number;
}, {
    projectId: string;
    componentId: string;
    property?: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | undefined;
    tolerance?: number | undefined;
}>;
export declare const WiggleKeyframesInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    property: z.ZodDefault<z.ZodEnum<["translateX", "translateY", "scale", "rotate", "opacity"]>>;
    frequency: z.ZodDefault<z.ZodNumber>;
    amplitude: z.ZodDefault<z.ZodNumber>;
    samples: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    property: "translateX" | "translateY" | "scale" | "rotate" | "opacity";
    frequency: number;
    amplitude: number;
    samples: number;
}, {
    projectId: string;
    componentId: string;
    property?: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | undefined;
    frequency?: number | undefined;
    amplitude?: number | undefined;
    samples?: number | undefined;
}>;
export declare const AudioToKeyframesInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    audioSourceId: z.ZodString;
    property: z.ZodDefault<z.ZodEnum<["translateX", "translateY", "scale", "rotate", "opacity"]>>;
    channel: z.ZodDefault<z.ZodEnum<["both", "left", "right"]>>;
    samples: z.ZodDefault<z.ZodNumber>;
    smoothing: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    property: "translateX" | "translateY" | "scale" | "rotate" | "opacity";
    smoothing: number;
    channel: "both" | "left" | "right";
    samples: number;
    audioSourceId: string;
}, {
    projectId: string;
    componentId: string;
    audioSourceId: string;
    property?: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | undefined;
    smoothing?: number | undefined;
    channel?: "both" | "left" | "right" | undefined;
    samples?: number | undefined;
}>;
export declare const SetRangeSelectorInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    unit: z.ZodDefault<z.ZodEnum<["characters", "words", "lines"]>>;
    start: z.ZodDefault<z.ZodNumber>;
    end: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    ease: z.ZodDefault<z.ZodBoolean>;
    basedOn: z.ZodDefault<z.ZodEnum<["characters", "words", "lines", "all"]>>;
    mode: z.ZodDefault<z.ZodEnum<["add", "subtract", "intersect", "min", "max"]>>;
}, "strip", z.ZodTypeAny, {
    ease: boolean;
    offset: number;
    projectId: string;
    componentId: string;
    mode: "add" | "subtract" | "intersect" | "min" | "max";
    start: number;
    end: number;
    unit: "characters" | "words" | "lines";
    basedOn: "characters" | "words" | "lines" | "all";
}, {
    projectId: string;
    componentId: string;
    ease?: boolean | undefined;
    offset?: number | undefined;
    mode?: "add" | "subtract" | "intersect" | "min" | "max" | undefined;
    start?: number | undefined;
    end?: number | undefined;
    unit?: "characters" | "words" | "lines" | undefined;
    basedOn?: "characters" | "words" | "lines" | "all" | undefined;
}>;
export declare const SetTextWigglerInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    frequency: z.ZodDefault<z.ZodNumber>;
    amplitudeX: z.ZodDefault<z.ZodNumber>;
    amplitudeY: z.ZodDefault<z.ZodNumber>;
    amplitudeRotation: z.ZodDefault<z.ZodNumber>;
    amplitudeScale: z.ZodDefault<z.ZodNumber>;
    correlation: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    frequency: number;
    amplitudeX: number;
    amplitudeY: number;
    amplitudeRotation: number;
    amplitudeScale: number;
    correlation: number;
}, {
    projectId: string;
    componentId: string;
    frequency?: number | undefined;
    amplitudeX?: number | undefined;
    amplitudeY?: number | undefined;
    amplitudeRotation?: number | undefined;
    amplitudeScale?: number | undefined;
    correlation?: number | undefined;
}>;
export declare const TextOnPathInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    pathId: z.ZodString;
    startOffset: z.ZodDefault<z.ZodNumber>;
    reverse: z.ZodDefault<z.ZodBoolean>;
    alignToPath: z.ZodDefault<z.ZodBoolean>;
    baselineShift: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    reverse: boolean;
    projectId: string;
    componentId: string;
    pathId: string;
    startOffset: number;
    alignToPath: boolean;
    baselineShift: number;
}, {
    projectId: string;
    componentId: string;
    pathId: string;
    reverse?: boolean | undefined;
    startOffset?: number | undefined;
    alignToPath?: boolean | undefined;
    baselineShift?: number | undefined;
}>;
export declare const SetVerticalTextInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    enabled: z.ZodDefault<z.ZodBoolean>;
    rotateChars: z.ZodDefault<z.ZodBoolean>;
    lineFlow: z.ZodDefault<z.ZodEnum<["top-to-bottom", "right-to-left"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    enabled: boolean;
    rotateChars: boolean;
    lineFlow: "top-to-bottom" | "right-to-left";
}, {
    projectId: string;
    componentId: string;
    enabled?: boolean | undefined;
    rotateChars?: boolean | undefined;
    lineFlow?: "top-to-bottom" | "right-to-left" | undefined;
}>;
export declare const SetKerningInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    tracking: z.ZodDefault<z.ZodNumber>;
    pairAdjustment: z.ZodDefault<z.ZodBoolean>;
    range: z.ZodOptional<z.ZodObject<{
        start: z.ZodDefault<z.ZodNumber>;
        end: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        start: number;
        end: number;
    }, {
        start?: number | undefined;
        end?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    tracking: number;
    pairAdjustment: boolean;
    range?: {
        start: number;
        end: number;
    } | undefined;
}, {
    projectId: string;
    componentId: string;
    tracking?: number | undefined;
    pairAdjustment?: boolean | undefined;
    range?: {
        start?: number | undefined;
        end?: number | undefined;
    } | undefined;
}>;
export declare const SetLeadingInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    lineHeight: z.ZodDefault<z.ZodNumber>;
    baselineShift: z.ZodDefault<z.ZodNumber>;
    autoLeading: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    baselineShift: number;
    lineHeight: number;
    autoLeading: boolean;
}, {
    projectId: string;
    componentId: string;
    baselineShift?: number | undefined;
    lineHeight?: number | undefined;
    autoLeading?: boolean | undefined;
}>;
export declare const PerCharacterTransformInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    translateX: z.ZodDefault<z.ZodNumber>;
    translateY: z.ZodDefault<z.ZodNumber>;
    scale: z.ZodDefault<z.ZodNumber>;
    rotate: z.ZodDefault<z.ZodNumber>;
    opacity: z.ZodDefault<z.ZodNumber>;
    anchor: z.ZodDefault<z.ZodEnum<["center", "baseline", "top"]>>;
    staggerMs: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    translateX: number;
    translateY: number;
    scale: number;
    rotate: number;
    opacity: number;
    projectId: string;
    componentId: string;
    staggerMs: number;
    anchor: "center" | "top" | "baseline";
}, {
    projectId: string;
    componentId: string;
    translateX?: number | undefined;
    translateY?: number | undefined;
    scale?: number | undefined;
    rotate?: number | undefined;
    opacity?: number | undefined;
    staggerMs?: number | undefined;
    anchor?: "center" | "top" | "baseline" | undefined;
}>;
export declare const SetTextAnimatorInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    animator: z.ZodEnum<["position", "scale", "rotation", "opacity", "color", "fillColor", "tracking"]>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    rangeStart: z.ZodDefault<z.ZodNumber>;
    rangeEnd: z.ZodDefault<z.ZodNumber>;
    smooth: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    smooth: number;
    projectId: string;
    componentId: string;
    rangeStart: number;
    rangeEnd: number;
    animator: "scale" | "opacity" | "color" | "rotation" | "position" | "tracking" | "fillColor";
    from?: string | undefined;
    to?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    animator: "scale" | "opacity" | "color" | "rotation" | "position" | "tracking" | "fillColor";
    smooth?: number | undefined;
    rangeStart?: number | undefined;
    rangeEnd?: number | undefined;
    from?: string | undefined;
    to?: string | undefined;
}>;
export declare const TrackPointInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    pointX: z.ZodNumber;
    pointY: z.ZodNumber;
    searchSize: z.ZodDefault<z.ZodNumber>;
    trackName: z.ZodOptional<z.ZodString>;
    durationMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    pointX: number;
    pointY: number;
    searchSize: number;
    durationMs?: number | undefined;
    trackName?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    pointX: number;
    pointY: number;
    durationMs?: number | undefined;
    searchSize?: number | undefined;
    trackName?: string | undefined;
}>;
export declare const TrackCameraInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    solveFocalLength: z.ZodDefault<z.ZodBoolean>;
    createNulls: z.ZodDefault<z.ZodBoolean>;
    threshold: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    threshold: number;
    solveFocalLength: boolean;
    createNulls: boolean;
}, {
    projectId: string;
    componentId: string;
    threshold?: number | undefined;
    solveFocalLength?: boolean | undefined;
    createNulls?: boolean | undefined;
}>;
export declare const WarpStabilizerInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    smoothness: z.ZodDefault<z.ZodNumber>;
    method: z.ZodDefault<z.ZodEnum<["position", "positionScaleRotation", "perspective", "subspaceWarp"]>>;
    crop: z.ZodDefault<z.ZodNumber>;
    noMotion: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    method: "position" | "perspective" | "positionScaleRotation" | "subspaceWarp";
    smoothness: number;
    crop: number;
    noMotion: boolean;
}, {
    projectId: string;
    componentId: string;
    method?: "position" | "perspective" | "positionScaleRotation" | "subspaceWarp" | undefined;
    smoothness?: number | undefined;
    crop?: number | undefined;
    noMotion?: boolean | undefined;
}>;
export declare const ApplyTrackToLayerInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    trackName: z.ZodString;
    applyTo: z.ZodDefault<z.ZodEnum<["position", "anchorPoint", "positionScale", "positionScaleRotation", "transform"]>>;
    matchName: z.ZodDefault<z.ZodBoolean>;
    compensate: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    trackName: string;
    applyTo: "position" | "positionScaleRotation" | "anchorPoint" | "positionScale" | "transform";
    matchName: boolean;
    compensate: boolean;
}, {
    projectId: string;
    componentId: string;
    trackName: string;
    applyTo?: "position" | "positionScaleRotation" | "anchorPoint" | "positionScale" | "transform" | undefined;
    matchName?: boolean | undefined;
    compensate?: boolean | undefined;
}>;
export declare const EditMotionPathInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    points: z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        ease: z.ZodDefault<z.ZodEnum<["linear", "bezier", "hold"]>>;
        handleIn: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>>;
        handleOut: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        ease: "linear" | "bezier" | "hold";
        x: number;
        y: number;
        handleIn?: {
            x: number;
            y: number;
        } | undefined;
        handleOut?: {
            x: number;
            y: number;
        } | undefined;
    }, {
        x: number;
        y: number;
        ease?: "linear" | "bezier" | "hold" | undefined;
        handleIn?: {
            x: number;
            y: number;
        } | undefined;
        handleOut?: {
            x: number;
            y: number;
        } | undefined;
    }>, "many">;
    closed: z.ZodDefault<z.ZodBoolean>;
    roving: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    closed: boolean;
    projectId: string;
    componentId: string;
    points: {
        ease: "linear" | "bezier" | "hold";
        x: number;
        y: number;
        handleIn?: {
            x: number;
            y: number;
        } | undefined;
        handleOut?: {
            x: number;
            y: number;
        } | undefined;
    }[];
    roving: boolean;
}, {
    projectId: string;
    componentId: string;
    points: {
        x: number;
        y: number;
        ease?: "linear" | "bezier" | "hold" | undefined;
        handleIn?: {
            x: number;
            y: number;
        } | undefined;
        handleOut?: {
            x: number;
            y: number;
        } | undefined;
    }[];
    closed?: boolean | undefined;
    roving?: boolean | undefined;
}>;
export declare const AutoOrientPathInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    orientAlong: z.ZodDefault<z.ZodEnum<["motionPath", "trackPath", "camera"]>>;
    axis: z.ZodDefault<z.ZodEnum<["auto", "x", "y"]>>;
    smoothing: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    offset: number;
    projectId: string;
    componentId: string;
    axis: "auto" | "x" | "y";
    smoothing: number;
    orientAlong: "motionPath" | "trackPath" | "camera";
}, {
    projectId: string;
    componentId: string;
    offset?: number | undefined;
    axis?: "auto" | "x" | "y" | undefined;
    smoothing?: number | undefined;
    orientAlong?: "motionPath" | "trackPath" | "camera" | undefined;
}>;
export declare const SetAdvancedBlendingInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    fillOpacity: z.ZodOptional<z.ZodNumber>;
    redChannel: z.ZodOptional<z.ZodBoolean>;
    greenChannel: z.ZodOptional<z.ZodBoolean>;
    blueChannel: z.ZodOptional<z.ZodBoolean>;
    knockout: z.ZodDefault<z.ZodOptional<z.ZodEnum<["none", "shallow", "deep"]>>>;
    blendIfSource: z.ZodOptional<z.ZodEnum<["gray", "red", "green", "blue"]>>;
    blendIfRange: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    knockout: "none" | "shallow" | "deep";
    fillOpacity?: number | undefined;
    redChannel?: boolean | undefined;
    greenChannel?: boolean | undefined;
    blueChannel?: boolean | undefined;
    blendIfSource?: "red" | "green" | "blue" | "gray" | undefined;
    blendIfRange?: [number, number] | undefined;
}, {
    projectId: string;
    componentId: string;
    fillOpacity?: number | undefined;
    redChannel?: boolean | undefined;
    greenChannel?: boolean | undefined;
    blueChannel?: boolean | undefined;
    knockout?: "none" | "shallow" | "deep" | undefined;
    blendIfSource?: "red" | "green" | "blue" | "gray" | undefined;
    blendIfRange?: [number, number] | undefined;
}>;
export declare const PrecomposeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodArray<z.ZodString, "many">;
    name: z.ZodDefault<z.ZodString>;
    moveAttributes: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
    componentIds: string[];
    moveAttributes: boolean;
}, {
    projectId: string;
    componentIds: string[];
    name?: string | undefined;
    moveAttributes?: boolean | undefined;
}>;
export declare const CollapseTransformationsInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    enabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    enabled: boolean;
}, {
    projectId: string;
    componentId: string;
    enabled?: boolean | undefined;
}>;
export declare const SetAlphaModeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    mode: z.ZodDefault<z.ZodEnum<["straight", "premultiplied"]>>;
    premultiplyColor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    mode: "straight" | "premultiplied";
    premultiplyColor?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    mode?: "straight" | "premultiplied" | undefined;
    premultiplyColor?: string | undefined;
}>;
export declare const SetTransferModeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    mode: z.ZodEnum<["normal", "stencil-alpha", "stencil-luma", "silhouette-alpha", "silhouette-luma", "alpha-add", "luma-matte"]>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    mode: "normal" | "stencil-alpha" | "stencil-luma" | "silhouette-alpha" | "silhouette-luma" | "alpha-add" | "luma-matte";
}, {
    projectId: string;
    componentId: string;
    mode: "normal" | "stencil-alpha" | "stencil-luma" | "silhouette-alpha" | "silhouette-luma" | "alpha-add" | "luma-matte";
}>;
export declare const SetBlendingGroupInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    isolated: z.ZodDefault<z.ZodBoolean>;
    groupOpacity: z.ZodOptional<z.ZodNumber>;
    knockout: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    knockout: boolean;
    isolated: boolean;
    groupOpacity?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    knockout?: boolean | undefined;
    isolated?: boolean | undefined;
    groupOpacity?: number | undefined;
}>;
export declare const TimeDisplacementInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    maxDisplacementMs: z.ZodDefault<z.ZodNumber>;
    displacementSource: z.ZodOptional<z.ZodString>;
    resolution: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    maxDisplacementMs: number;
    resolution: "low" | "medium" | "high";
    displacementSource?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    maxDisplacementMs?: number | undefined;
    displacementSource?: string | undefined;
    resolution?: "low" | "medium" | "high" | undefined;
}>;
export declare const EchoAdvancedInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    numberOfEchoes: z.ZodDefault<z.ZodNumber>;
    echoDelayMs: z.ZodDefault<z.ZodNumber>;
    decay: z.ZodDefault<z.ZodNumber>;
    echoOperator: z.ZodDefault<z.ZodEnum<["add", "maximum", "minimum", "screen", "difference", "composite-in-front", "composite-behind", "crossfade"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    decay: number;
    numberOfEchoes: number;
    echoDelayMs: number;
    echoOperator: "minimum" | "maximum" | "screen" | "difference" | "add" | "composite-in-front" | "composite-behind" | "crossfade";
}, {
    projectId: string;
    componentId: string;
    decay?: number | undefined;
    numberOfEchoes?: number | undefined;
    echoDelayMs?: number | undefined;
    echoOperator?: "minimum" | "maximum" | "screen" | "difference" | "add" | "composite-in-front" | "composite-behind" | "crossfade" | undefined;
}>;
export declare const SequenceWithTransitionInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    transitionType: z.ZodDefault<z.ZodEnum<["crossfade", "dissolve", "cut", "wipe", "push"]>>;
    transitionDurationMs: z.ZodDefault<z.ZodNumber>;
    overlapMs: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    transitionType: "push" | "dissolve" | "crossfade" | "cut" | "wipe";
    transitionDurationMs: number;
    overlapMs: number;
    componentIds?: string[] | undefined;
}, {
    projectId: string;
    componentIds?: string[] | undefined;
    transitionType?: "push" | "dissolve" | "crossfade" | "cut" | "wipe" | undefined;
    transitionDurationMs?: number | undefined;
    overlapMs?: number | undefined;
}>;
export declare const TimeReverseLayerInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
}, {
    projectId: string;
    componentId: string;
}>;
export declare const FreezeFrameInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    atTimeMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    atTimeMs?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    atTimeMs?: number | undefined;
}>;
export declare const PosterizeTimeAdvancedInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    fps: z.ZodDefault<z.ZodNumber>;
    range: z.ZodDefault<z.ZodEnum<["full", "first-half", "second-half", "custom"]>>;
    rangeStartMs: z.ZodOptional<z.ZodNumber>;
    rangeEndMs: z.ZodOptional<z.ZodNumber>;
    applyToVelocity: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    fps: number;
    range: "custom" | "full" | "first-half" | "second-half";
    applyToVelocity: boolean;
    rangeStartMs?: number | undefined;
    rangeEndMs?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    fps?: number | undefined;
    range?: "custom" | "full" | "first-half" | "second-half" | undefined;
    rangeStartMs?: number | undefined;
    rangeEndMs?: number | undefined;
    applyToVelocity?: boolean | undefined;
}>;
export declare const TimeWarpRemappingInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    speedKeyframes: z.ZodArray<z.ZodObject<{
        timeMs: z.ZodNumber;
        speed: z.ZodNumber;
        interpolation: z.ZodDefault<z.ZodEnum<["linear", "ease", "hold"]>>;
    }, "strip", z.ZodTypeAny, {
        interpolation: "linear" | "ease" | "hold";
        timeMs: number;
        speed: number;
    }, {
        timeMs: number;
        speed: number;
        interpolation?: "linear" | "ease" | "hold" | undefined;
    }>, "many">;
    preserveTotalDuration: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    speedKeyframes: {
        interpolation: "linear" | "ease" | "hold";
        timeMs: number;
        speed: number;
    }[];
    preserveTotalDuration: boolean;
}, {
    projectId: string;
    componentId: string;
    speedKeyframes: {
        timeMs: number;
        speed: number;
        interpolation?: "linear" | "ease" | "hold" | undefined;
    }[];
    preserveTotalDuration?: boolean | undefined;
}>;
export declare const LensDistortionInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    amount: z.ZodDefault<z.ZodNumber>;
    vertical: z.ZodOptional<z.ZodNumber>;
    horizontal: z.ZodOptional<z.ZodNumber>;
    remove: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    amount: number;
    remove: boolean;
    vertical?: number | undefined;
    horizontal?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    amount?: number | undefined;
    vertical?: number | undefined;
    horizontal?: number | undefined;
    remove?: boolean | undefined;
}>;
export declare const ChromaticAberrationInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    redOffset: z.ZodDefault<z.ZodNumber>;
    blueOffset: z.ZodDefault<z.ZodNumber>;
    radial: z.ZodDefault<z.ZodBoolean>;
    center: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    radial: boolean;
    redOffset: number;
    blueOffset: number;
    center?: [number, number] | undefined;
}, {
    projectId: string;
    componentId: string;
    center?: [number, number] | undefined;
    radial?: boolean | undefined;
    redOffset?: number | undefined;
    blueOffset?: number | undefined;
}>;
export declare const VignetteInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    amount: z.ZodDefault<z.ZodNumber>;
    size: z.ZodDefault<z.ZodNumber>;
    softness: z.ZodDefault<z.ZodNumber>;
    color: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    color: string;
    projectId: string;
    componentId: string;
    size: number;
    amount: number;
    softness: number;
}, {
    projectId: string;
    componentId: string;
    color?: string | undefined;
    size?: number | undefined;
    amount?: number | undefined;
    softness?: number | undefined;
}>;
export declare const CameraShakeProceduralInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    intensity: z.ZodDefault<z.ZodNumber>;
    frequency: z.ZodDefault<z.ZodNumber>;
    rotation: z.ZodDefault<z.ZodBoolean>;
    seed: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    rotation: boolean;
    intensity: number;
    frequency: number;
    seed: number;
}, {
    projectId: string;
    componentId: string;
    rotation?: boolean | undefined;
    intensity?: number | undefined;
    frequency?: number | undefined;
    seed?: number | undefined;
}>;
export declare const OpticalFlowInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    output: z.ZodDefault<z.ZodEnum<["vector-field", "motion-magnitude", "motion-direction"]>>;
    quality: z.ZodDefault<z.ZodEnum<["draft", "high", "best"]>>;
    smoothing: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    smoothing: number;
    output: "vector-field" | "motion-magnitude" | "motion-direction";
    quality: "draft" | "high" | "best";
}, {
    projectId: string;
    componentId: string;
    smoothing?: number | undefined;
    output?: "vector-field" | "motion-magnitude" | "motion-direction" | undefined;
    quality?: "draft" | "high" | "best" | undefined;
}>;
export declare const MotionMatchMoveInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    trackName: z.ZodOptional<z.ZodString>;
    applyTo: z.ZodDefault<z.ZodEnum<["position", "position-rotation", "position-scale", "position-scale-rotation"]>>;
    targetComponentId: z.ZodOptional<z.ZodString>;
    stabilization: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    applyTo: "position" | "position-rotation" | "position-scale" | "position-scale-rotation";
    stabilization: boolean;
    targetComponentId?: string | undefined;
    trackName?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    targetComponentId?: string | undefined;
    trackName?: string | undefined;
    applyTo?: "position" | "position-rotation" | "position-scale" | "position-scale-rotation" | undefined;
    stabilization?: boolean | undefined;
}>;
export declare const LensFlareAnamorphicInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    position: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    brightness: z.ZodDefault<z.ZodNumber>;
    streakLength: z.ZodDefault<z.ZodNumber>;
    streakAngle: z.ZodDefault<z.ZodNumber>;
    color: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    color: string;
    projectId: string;
    componentId: string;
    position: [number, number];
    brightness: number;
    streakLength: number;
    streakAngle: number;
}, {
    projectId: string;
    componentId: string;
    color?: string | undefined;
    position?: [number, number] | undefined;
    brightness?: number | undefined;
    streakLength?: number | undefined;
    streakAngle?: number | undefined;
}>;
export declare const DepthOfFieldAdvancedInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    focusDistance: z.ZodDefault<z.ZodNumber>;
    aperture: z.ZodDefault<z.ZodNumber>;
    blurAmount: z.ZodDefault<z.ZodNumber>;
    highlightShape: z.ZodDefault<z.ZodEnum<["circle", "hexagon", "octagon"]>>;
    focusCurve: z.ZodOptional<z.ZodArray<z.ZodObject<{
        distance: z.ZodNumber;
        blur: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        blur: number;
        distance: number;
    }, {
        blur: number;
        distance: number;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    focusDistance: number;
    aperture: number;
    blurAmount: number;
    highlightShape: "circle" | "hexagon" | "octagon";
    focusCurve?: {
        blur: number;
        distance: number;
    }[] | undefined;
}, {
    projectId: string;
    componentId: string;
    focusDistance?: number | undefined;
    aperture?: number | undefined;
    blurAmount?: number | undefined;
    highlightShape?: "circle" | "hexagon" | "octagon" | undefined;
    focusCurve?: {
        blur: number;
        distance: number;
    }[] | undefined;
}>;
export declare const PaintStrokeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    points: z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        pressure: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        pressure?: number | undefined;
    }, {
        x: number;
        y: number;
        pressure?: number | undefined;
    }>, "many">;
    color: z.ZodDefault<z.ZodString>;
    opacity: z.ZodDefault<z.ZodNumber>;
    blendMode: z.ZodDefault<z.ZodEnum<["normal", "multiply", "screen", "overlay"]>>;
}, "strip", z.ZodTypeAny, {
    opacity: number;
    color: string;
    projectId: string;
    componentId: string;
    blendMode: "normal" | "multiply" | "screen" | "overlay";
    points: {
        x: number;
        y: number;
        pressure?: number | undefined;
    }[];
}, {
    projectId: string;
    componentId: string;
    points: {
        x: number;
        y: number;
        pressure?: number | undefined;
    }[];
    opacity?: number | undefined;
    color?: string | undefined;
    blendMode?: "normal" | "multiply" | "screen" | "overlay" | undefined;
}>;
export declare const CloneStampInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    sourcePoint: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    destinationPoint: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    sourceLayerId: z.ZodOptional<z.ZodString>;
    brushSize: z.ZodDefault<z.ZodNumber>;
    opacity: z.ZodDefault<z.ZodNumber>;
    aligned: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    opacity: number;
    projectId: string;
    componentId: string;
    sourcePoint: [number, number];
    destinationPoint: [number, number];
    brushSize: number;
    aligned: boolean;
    sourceLayerId?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    sourcePoint: [number, number];
    destinationPoint: [number, number];
    opacity?: number | undefined;
    sourceLayerId?: string | undefined;
    brushSize?: number | undefined;
    aligned?: boolean | undefined;
}>;
export declare const BrushSettingsInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    size: z.ZodDefault<z.ZodNumber>;
    hardness: z.ZodDefault<z.ZodNumber>;
    opacity: z.ZodDefault<z.ZodNumber>;
    spacing: z.ZodDefault<z.ZodNumber>;
    flow: z.ZodDefault<z.ZodNumber>;
    angle: z.ZodOptional<z.ZodNumber>;
    roundness: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    opacity: number;
    projectId: string;
    componentId: string;
    size: number;
    hardness: number;
    spacing: number;
    flow: number;
    angle?: number | undefined;
    roundness?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    opacity?: number | undefined;
    size?: number | undefined;
    angle?: number | undefined;
    hardness?: number | undefined;
    spacing?: number | undefined;
    flow?: number | undefined;
    roundness?: number | undefined;
}>;
export declare const RevealWithBrushInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    points: z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        pressure: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        pressure?: number | undefined;
    }, {
        x: number;
        y: number;
        pressure?: number | undefined;
    }>, "many">;
    reveal: z.ZodDefault<z.ZodBoolean>;
    feather: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    feather: number;
    points: {
        x: number;
        y: number;
        pressure?: number | undefined;
    }[];
    reveal: boolean;
}, {
    projectId: string;
    componentId: string;
    points: {
        x: number;
        y: number;
        pressure?: number | undefined;
    }[];
    feather?: number | undefined;
    reveal?: boolean | undefined;
}>;
export declare const EraseStrokeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    points: z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>, "many">;
    brushSize: z.ZodDefault<z.ZodNumber>;
    hardness: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    points: {
        x: number;
        y: number;
    }[];
    brushSize: number;
    hardness: number;
}, {
    projectId: string;
    componentId: string;
    points: {
        x: number;
        y: number;
    }[];
    brushSize?: number | undefined;
    hardness?: number | undefined;
}>;
export declare const PaintAnimatorInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    strokeId: z.ZodOptional<z.ZodString>;
    mode: z.ZodDefault<z.ZodEnum<["write-on", "reveal", "grow-from-start", "grow-from-end"]>>;
    durationMs: z.ZodDefault<z.ZodNumber>;
    startMs: z.ZodDefault<z.ZodNumber>;
    endValue: z.ZodDefault<z.ZodNumber>;
    easing: z.ZodDefault<z.ZodEnum<["linear", "ease", "ease-in", "ease-out"]>>;
}, "strip", z.ZodTypeAny, {
    easing: "linear" | "ease" | "ease-in" | "ease-out";
    projectId: string;
    durationMs: number;
    componentId: string;
    mode: "reveal" | "write-on" | "grow-from-start" | "grow-from-end";
    startMs: number;
    endValue: number;
    strokeId?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    easing?: "linear" | "ease" | "ease-in" | "ease-out" | undefined;
    durationMs?: number | undefined;
    mode?: "reveal" | "write-on" | "grow-from-start" | "grow-from-end" | undefined;
    startMs?: number | undefined;
    strokeId?: string | undefined;
    endValue?: number | undefined;
}>;
export declare const RotoBrushInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    mode: z.ZodDefault<z.ZodEnum<["add", "subtract", "foreground", "background"]>>;
    seedPoints: z.ZodDefault<z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        radius: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        radius: number;
    }, {
        x: number;
        y: number;
        radius?: number | undefined;
    }>, "many">>;
    detectionSensitivity: z.ZodDefault<z.ZodNumber>;
    smoothness: z.ZodDefault<z.ZodNumber>;
    frameRange: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    mode: "background" | "add" | "subtract" | "foreground";
    smoothness: number;
    seedPoints: {
        x: number;
        y: number;
        radius: number;
    }[];
    detectionSensitivity: number;
    frameRange?: [number, number] | undefined;
}, {
    projectId: string;
    componentId: string;
    mode?: "background" | "add" | "subtract" | "foreground" | undefined;
    smoothness?: number | undefined;
    seedPoints?: {
        x: number;
        y: number;
        radius?: number | undefined;
    }[] | undefined;
    detectionSensitivity?: number | undefined;
    frameRange?: [number, number] | undefined;
}>;
export declare const RefineEdgeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    featherRadius: z.ZodDefault<z.ZodNumber>;
    edgeSoftness: z.ZodDefault<z.ZodNumber>;
    decontamination: z.ZodDefault<z.ZodNumber>;
    smoothEdge: z.ZodDefault<z.ZodBoolean>;
    useSmartRadius: z.ZodDefault<z.ZodBoolean>;
    smartRadius: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    featherRadius: number;
    edgeSoftness: number;
    decontamination: number;
    smoothEdge: boolean;
    useSmartRadius: boolean;
    smartRadius: number;
}, {
    projectId: string;
    componentId: string;
    featherRadius?: number | undefined;
    edgeSoftness?: number | undefined;
    decontamination?: number | undefined;
    smoothEdge?: boolean | undefined;
    useSmartRadius?: boolean | undefined;
    smartRadius?: number | undefined;
}>;
export declare const ColorKeyInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    keyColor: z.ZodDefault<z.ZodString>;
    colorTolerance: z.ZodDefault<z.ZodNumber>;
    edgeThin: z.ZodDefault<z.ZodNumber>;
    edgeFeather: z.ZodDefault<z.ZodNumber>;
    invert: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    invert: boolean;
    keyColor: string;
    colorTolerance: number;
    edgeThin: number;
    edgeFeather: number;
}, {
    projectId: string;
    componentId: string;
    invert?: boolean | undefined;
    keyColor?: string | undefined;
    colorTolerance?: number | undefined;
    edgeThin?: number | undefined;
    edgeFeather?: number | undefined;
}>;
export declare const LinearColorKeyInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    keyColor: z.ZodDefault<z.ZodString>;
    matchColors: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    matchingTolerance: z.ZodDefault<z.ZodNumber>;
    matchingSoftness: z.ZodDefault<z.ZodNumber>;
    operateOn: z.ZodDefault<z.ZodEnum<["rgb", "hue", "saturation", "brightness"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    keyColor: string;
    matchColors: string[];
    matchingTolerance: number;
    matchingSoftness: number;
    operateOn: "hue" | "saturation" | "rgb" | "brightness";
}, {
    projectId: string;
    componentId: string;
    keyColor?: string | undefined;
    matchColors?: string[] | undefined;
    matchingTolerance?: number | undefined;
    matchingSoftness?: number | undefined;
    operateOn?: "hue" | "saturation" | "rgb" | "brightness" | undefined;
}>;
export declare const DifferenceMatteInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    referenceFrame: z.ZodDefault<z.ZodNumber>;
    differenceThreshold: z.ZodDefault<z.ZodNumber>;
    matchTolerance: z.ZodDefault<z.ZodNumber>;
    blurBeforeDifference: z.ZodDefault<z.ZodNumber>;
    invert: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    invert: boolean;
    referenceFrame: number;
    differenceThreshold: number;
    matchTolerance: number;
    blurBeforeDifference: number;
}, {
    projectId: string;
    componentId: string;
    invert?: boolean | undefined;
    referenceFrame?: number | undefined;
    differenceThreshold?: number | undefined;
    matchTolerance?: number | undefined;
    blurBeforeDifference?: number | undefined;
}>;
export declare const SpillSuppressionInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    suppressColor: z.ZodDefault<z.ZodEnum<["green", "blue", "red", "custom"]>>;
    customColor: z.ZodOptional<z.ZodString>;
    suppression: z.ZodDefault<z.ZodNumber>;
    luminancePreservation: z.ZodDefault<z.ZodNumber>;
    edgeSoftness: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    edgeSoftness: number;
    suppressColor: "custom" | "red" | "green" | "blue";
    suppression: number;
    luminancePreservation: number;
    customColor?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    edgeSoftness?: number | undefined;
    suppressColor?: "custom" | "red" | "green" | "blue" | undefined;
    customColor?: string | undefined;
    suppression?: number | undefined;
    luminancePreservation?: number | undefined;
}>;
export declare const MatteChokerInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    chokeSpread: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    choke1: z.ZodDefault<z.ZodNumber>;
    choke2: z.ZodDefault<z.ZodNumber>;
    grayLevel: z.ZodDefault<z.ZodNumber>;
    iterations: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    choke1: number;
    choke2: number;
    grayLevel: number;
    iterations: number;
    chokeSpread?: number[] | undefined;
}, {
    projectId: string;
    componentId: string;
    chokeSpread?: number[] | undefined;
    choke1?: number | undefined;
    choke2?: number | undefined;
    grayLevel?: number | undefined;
    iterations?: number | undefined;
}>;
export declare const InnerOuterKeyInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    innerPath: z.ZodOptional<z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>, "many">>;
    outerPath: z.ZodOptional<z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>, "many">>;
    feather: z.ZodDefault<z.ZodNumber>;
    edgeThreshold: z.ZodDefault<z.ZodNumber>;
    useInnerOnly: z.ZodDefault<z.ZodBoolean>;
    invert: z.ZodDefault<z.ZodBoolean>;
    additionalForegroundPath: z.ZodOptional<z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>, "many">>;
    additionalBackgroundPath: z.ZodOptional<z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    feather: number;
    invert: boolean;
    edgeThreshold: number;
    useInnerOnly: boolean;
    innerPath?: {
        x: number;
        y: number;
    }[] | undefined;
    outerPath?: {
        x: number;
        y: number;
    }[] | undefined;
    additionalForegroundPath?: {
        x: number;
        y: number;
    }[] | undefined;
    additionalBackgroundPath?: {
        x: number;
        y: number;
    }[] | undefined;
}, {
    projectId: string;
    componentId: string;
    feather?: number | undefined;
    invert?: boolean | undefined;
    innerPath?: {
        x: number;
        y: number;
    }[] | undefined;
    outerPath?: {
        x: number;
        y: number;
    }[] | undefined;
    edgeThreshold?: number | undefined;
    useInnerOnly?: boolean | undefined;
    additionalForegroundPath?: {
        x: number;
        y: number;
    }[] | undefined;
    additionalBackgroundPath?: {
        x: number;
        y: number;
    }[] | undefined;
}>;
export declare const BlockDissolveInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    blockSize: z.ZodDefault<z.ZodNumber>;
    rows: z.ZodDefault<z.ZodNumber>;
    columns: z.ZodDefault<z.ZodNumber>;
    transitionDurationMs: z.ZodDefault<z.ZodNumber>;
    randomness: z.ZodDefault<z.ZodNumber>;
    direction: z.ZodDefault<z.ZodEnum<["dissolve-in", "dissolve-out"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    direction: "dissolve-in" | "dissolve-out";
    blockSize: number;
    transitionDurationMs: number;
    rows: number;
    columns: number;
    randomness: number;
    componentIds?: string[] | undefined;
}, {
    projectId: string;
    direction?: "dissolve-in" | "dissolve-out" | undefined;
    componentIds?: string[] | undefined;
    blockSize?: number | undefined;
    transitionDurationMs?: number | undefined;
    rows?: number | undefined;
    columns?: number | undefined;
    randomness?: number | undefined;
}>;
export declare const CardWipeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    rows: z.ZodDefault<z.ZodNumber>;
    columns: z.ZodDefault<z.ZodNumber>;
    flipAxis: z.ZodDefault<z.ZodEnum<["x", "y"]>>;
    flipDirection: z.ZodDefault<z.ZodEnum<["positive", "negative"]>>;
    transitionDurationMs: z.ZodDefault<z.ZodNumber>;
    randomness: z.ZodDefault<z.ZodNumber>;
    cameraDistance: z.ZodDefault<z.ZodNumber>;
    jitter: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    transitionDurationMs: number;
    rows: number;
    columns: number;
    randomness: number;
    flipAxis: "x" | "y";
    flipDirection: "positive" | "negative";
    cameraDistance: number;
    jitter: number;
    componentIds?: string[] | undefined;
}, {
    projectId: string;
    componentIds?: string[] | undefined;
    transitionDurationMs?: number | undefined;
    rows?: number | undefined;
    columns?: number | undefined;
    randomness?: number | undefined;
    flipAxis?: "x" | "y" | undefined;
    flipDirection?: "positive" | "negative" | undefined;
    cameraDistance?: number | undefined;
    jitter?: number | undefined;
}>;
export declare const GradientWipeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    gradientLayerId: z.ZodOptional<z.ZodString>;
    transitionDurationMs: z.ZodDefault<z.ZodNumber>;
    completion: z.ZodDefault<z.ZodNumber>;
    isGradientLayerInverted: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    transitionDurationMs: number;
    completion: number;
    isGradientLayerInverted: boolean;
    componentIds?: string[] | undefined;
    gradientLayerId?: string | undefined;
}, {
    projectId: string;
    componentIds?: string[] | undefined;
    transitionDurationMs?: number | undefined;
    gradientLayerId?: string | undefined;
    completion?: number | undefined;
    isGradientLayerInverted?: boolean | undefined;
}>;
export declare const IrisWipeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    irisCenter: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    outerRadius: z.ZodDefault<z.ZodNumber>;
    innerRadius: z.ZodDefault<z.ZodNumber>;
    irisPoints: z.ZodDefault<z.ZodNumber>;
    rotation: z.ZodDefault<z.ZodNumber>;
    transitionDurationMs: z.ZodDefault<z.ZodNumber>;
    feather: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    rotation: number;
    feather: number;
    innerRadius: number;
    transitionDurationMs: number;
    irisCenter: [number, number];
    outerRadius: number;
    irisPoints: number;
    componentIds?: string[] | undefined;
}, {
    projectId: string;
    componentIds?: string[] | undefined;
    rotation?: number | undefined;
    feather?: number | undefined;
    innerRadius?: number | undefined;
    transitionDurationMs?: number | undefined;
    irisCenter?: [number, number] | undefined;
    outerRadius?: number | undefined;
    irisPoints?: number | undefined;
}>;
export declare const LinearWipeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    angle: z.ZodDefault<z.ZodNumber>;
    feather: z.ZodDefault<z.ZodNumber>;
    transitionDurationMs: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    feather: number;
    angle: number;
    transitionDurationMs: number;
    componentIds?: string[] | undefined;
}, {
    projectId: string;
    componentIds?: string[] | undefined;
    feather?: number | undefined;
    angle?: number | undefined;
    transitionDurationMs?: number | undefined;
}>;
export declare const RadialWipeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    startAngle: z.ZodDefault<z.ZodNumber>;
    wipeAngle: z.ZodDefault<z.ZodNumber>;
    feather: z.ZodDefault<z.ZodNumber>;
    wipeShape: z.ZodDefault<z.ZodEnum<["clockwise", "counterclockwise", "both"]>>;
    transitionDurationMs: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    feather: number;
    transitionDurationMs: number;
    startAngle: number;
    wipeAngle: number;
    wipeShape: "both" | "clockwise" | "counterclockwise";
    componentIds?: string[] | undefined;
}, {
    projectId: string;
    componentIds?: string[] | undefined;
    feather?: number | undefined;
    transitionDurationMs?: number | undefined;
    startAngle?: number | undefined;
    wipeAngle?: number | undefined;
    wipeShape?: "both" | "clockwise" | "counterclockwise" | undefined;
}>;
export declare const VenetianBlindsInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    stripeWidth: z.ZodDefault<z.ZodNumber>;
    transitionDurationMs: z.ZodDefault<z.ZodNumber>;
    direction: z.ZodDefault<z.ZodEnum<["horizontal", "vertical"]>>;
    edgeCompletion: z.ZodDefault<z.ZodNumber>;
    feather: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    direction: "vertical" | "horizontal";
    feather: number;
    transitionDurationMs: number;
    stripeWidth: number;
    edgeCompletion: number;
    componentIds?: string[] | undefined;
}, {
    projectId: string;
    direction?: "vertical" | "horizontal" | undefined;
    componentIds?: string[] | undefined;
    feather?: number | undefined;
    transitionDurationMs?: number | undefined;
    stripeWidth?: number | undefined;
    edgeCompletion?: number | undefined;
}>;
export declare const CcJawsWipeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    shape: z.ZodDefault<z.ZodEnum<["jaws", "line", "scale", "grid", "radial"]>>;
    direction: z.ZodDefault<z.ZodEnum<["top-left", "top-right", "bottom-left", "bottom-right", "all"]>>;
    completion: z.ZodDefault<z.ZodNumber>;
    transitionDurationMs: z.ZodDefault<z.ZodNumber>;
    pointSpacing: z.ZodDefault<z.ZodNumber>;
    shapeLayer: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    shape: "scale" | "line" | "radial" | "jaws" | "grid";
    projectId: string;
    direction: "all" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
    transitionDurationMs: number;
    completion: number;
    pointSpacing: number;
    shapeLayer: boolean;
    componentIds?: string[] | undefined;
}, {
    projectId: string;
    shape?: "scale" | "line" | "radial" | "jaws" | "grid" | undefined;
    direction?: "all" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | undefined;
    componentIds?: string[] | undefined;
    transitionDurationMs?: number | undefined;
    completion?: number | undefined;
    pointSpacing?: number | undefined;
    shapeLayer?: boolean | undefined;
}>;
export declare const CcBallActionInput: z.ZodObject<{
    projectId: z.ZodString;
    ballSize: z.ZodDefault<z.ZodNumber>;
    spacing: z.ZodDefault<z.ZodNumber>;
    rotationX: z.ZodDefault<z.ZodNumber>;
    rotationY: z.ZodDefault<z.ZodNumber>;
    rotationZ: z.ZodDefault<z.ZodNumber>;
    scatter: z.ZodDefault<z.ZodNumber>;
    gridMode: z.ZodDefault<z.ZodEnum<["rectangular", "hexagonal"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    scatter: number;
    spacing: number;
    ballSize: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    gridMode: "rectangular" | "hexagonal";
}, {
    projectId: string;
    scatter?: number | undefined;
    spacing?: number | undefined;
    ballSize?: number | undefined;
    rotationX?: number | undefined;
    rotationY?: number | undefined;
    rotationZ?: number | undefined;
    gridMode?: "rectangular" | "hexagonal" | undefined;
}>;
export declare const CcBubblesInput: z.ZodObject<{
    projectId: z.ZodString;
    bubbleCount: z.ZodDefault<z.ZodNumber>;
    minSize: z.ZodDefault<z.ZodNumber>;
    maxSize: z.ZodDefault<z.ZodNumber>;
    speed: z.ZodDefault<z.ZodNumber>;
    wobble: z.ZodDefault<z.ZodNumber>;
    direction: z.ZodDefault<z.ZodEnum<["up", "down", "left", "right"]>>;
    seed: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    direction: "left" | "right" | "up" | "down";
    seed: number;
    speed: number;
    bubbleCount: number;
    minSize: number;
    maxSize: number;
    wobble: number;
}, {
    projectId: string;
    direction?: "left" | "right" | "up" | "down" | undefined;
    seed?: number | undefined;
    speed?: number | undefined;
    bubbleCount?: number | undefined;
    minSize?: number | undefined;
    maxSize?: number | undefined;
    wobble?: number | undefined;
}>;
export declare const CcRainfallInput: z.ZodObject<{
    projectId: z.ZodString;
    dropCount: z.ZodDefault<z.ZodNumber>;
    dropSize: z.ZodDefault<z.ZodNumber>;
    speed: z.ZodDefault<z.ZodNumber>;
    wind: z.ZodDefault<z.ZodNumber>;
    angle: z.ZodDefault<z.ZodNumber>;
    opacity: z.ZodDefault<z.ZodNumber>;
    blur: z.ZodDefault<z.ZodNumber>;
    seed: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    opacity: number;
    blur: number;
    projectId: string;
    angle: number;
    seed: number;
    speed: number;
    dropCount: number;
    dropSize: number;
    wind: number;
}, {
    projectId: string;
    opacity?: number | undefined;
    blur?: number | undefined;
    angle?: number | undefined;
    seed?: number | undefined;
    speed?: number | undefined;
    dropCount?: number | undefined;
    dropSize?: number | undefined;
    wind?: number | undefined;
}>;
export declare const CcSnowfallInput: z.ZodObject<{
    projectId: z.ZodString;
    flakeCount: z.ZodDefault<z.ZodNumber>;
    minSize: z.ZodDefault<z.ZodNumber>;
    maxSize: z.ZodDefault<z.ZodNumber>;
    speed: z.ZodDefault<z.ZodNumber>;
    wind: z.ZodDefault<z.ZodNumber>;
    wobble: z.ZodDefault<z.ZodNumber>;
    opacity: z.ZodDefault<z.ZodNumber>;
    seed: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    opacity: number;
    projectId: string;
    seed: number;
    speed: number;
    minSize: number;
    maxSize: number;
    wobble: number;
    wind: number;
    flakeCount: number;
}, {
    projectId: string;
    opacity?: number | undefined;
    seed?: number | undefined;
    speed?: number | undefined;
    minSize?: number | undefined;
    maxSize?: number | undefined;
    wobble?: number | undefined;
    wind?: number | undefined;
    flakeCount?: number | undefined;
}>;
export declare const CcStarBurstInput: z.ZodObject<{
    projectId: z.ZodString;
    starCount: z.ZodDefault<z.ZodNumber>;
    speed: z.ZodDefault<z.ZodNumber>;
    scatter: z.ZodDefault<z.ZodNumber>;
    phase: z.ZodDefault<z.ZodNumber>;
    gridSize: z.ZodDefault<z.ZodNumber>;
    color: z.ZodDefault<z.ZodString>;
    seed: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    color: string;
    projectId: string;
    scatter: number;
    seed: number;
    speed: number;
    phase: number;
    starCount: number;
    gridSize: number;
}, {
    projectId: string;
    color?: string | undefined;
    scatter?: number | undefined;
    seed?: number | undefined;
    speed?: number | undefined;
    phase?: number | undefined;
    starCount?: number | undefined;
    gridSize?: number | undefined;
}>;
export declare const CellPatternInput: z.ZodObject<{
    projectId: z.ZodString;
    patternType: z.ZodDefault<z.ZodEnum<["bubbles", "crystals", "static-plates", "tubular", "spotted", "cracked", "steel", "organic", "stone-rock", "dried-up", "shatter", "scales", "turbulent", "load-bubbles"]>>;
    contrast: z.ZodDefault<z.ZodNumber>;
    dispersal: z.ZodDefault<z.ZodNumber>;
    size: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    tiling: z.ZodDefault<z.ZodBoolean>;
    evolution: z.ZodDefault<z.ZodNumber>;
    speed: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    offset: [number, number];
    projectId: string;
    size: number;
    speed: number;
    patternType: "organic" | "bubbles" | "crystals" | "static-plates" | "tubular" | "spotted" | "cracked" | "steel" | "stone-rock" | "dried-up" | "shatter" | "scales" | "turbulent" | "load-bubbles";
    contrast: number;
    dispersal: number;
    tiling: boolean;
    evolution: number;
}, {
    projectId: string;
    offset?: [number, number] | undefined;
    size?: number | undefined;
    speed?: number | undefined;
    patternType?: "organic" | "bubbles" | "crystals" | "static-plates" | "tubular" | "spotted" | "cracked" | "steel" | "stone-rock" | "dried-up" | "shatter" | "scales" | "turbulent" | "load-bubbles" | undefined;
    contrast?: number | undefined;
    dispersal?: number | undefined;
    tiling?: boolean | undefined;
    evolution?: number | undefined;
}>;
export declare const AudioSpectrumInput: z.ZodObject<{
    projectId: z.ZodString;
    audioLayerId: z.ZodOptional<z.ZodString>;
    startPath: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    endPath: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    pathShape: z.ZodDefault<z.ZodEnum<["line", "curve", "closed", "loop"]>>;
    frequencyRange: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    maximumHeight: z.ZodDefault<z.ZodNumber>;
    thickness: z.ZodDefault<z.ZodNumber>;
    insideColor: z.ZodDefault<z.ZodString>;
    outsideColor: z.ZodDefault<z.ZodString>;
    displayOptions: z.ZodDefault<z.ZodArray<z.ZodEnum<["analog", "digital", "log", "analog-frequencies", "digital-frequencies"]>, "many">>;
    hueInterpolation: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    startPath: [number, number];
    endPath: [number, number];
    pathShape: "closed" | "line" | "loop" | "curve";
    frequencyRange: [number, number];
    maximumHeight: number;
    thickness: number;
    insideColor: string;
    outsideColor: string;
    displayOptions: ("analog" | "digital" | "log" | "analog-frequencies" | "digital-frequencies")[];
    hueInterpolation: number;
    audioLayerId?: string | undefined;
}, {
    projectId: string;
    audioLayerId?: string | undefined;
    startPath?: [number, number] | undefined;
    endPath?: [number, number] | undefined;
    pathShape?: "closed" | "line" | "loop" | "curve" | undefined;
    frequencyRange?: [number, number] | undefined;
    maximumHeight?: number | undefined;
    thickness?: number | undefined;
    insideColor?: string | undefined;
    outsideColor?: string | undefined;
    displayOptions?: ("analog" | "digital" | "log" | "analog-frequencies" | "digital-frequencies")[] | undefined;
    hueInterpolation?: number | undefined;
}>;
export declare const RadioWavesInput: z.ZodObject<{
    projectId: z.ZodString;
    producerPoint: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    wavesPerSecond: z.ZodDefault<z.ZodNumber>;
    waveSpeed: z.ZodDefault<z.ZodNumber>;
    frequency: z.ZodDefault<z.ZodNumber>;
    expansion: z.ZodDefault<z.ZodNumber>;
    maxRadius: z.ZodDefault<z.ZodNumber>;
    strokeWidth: z.ZodDefault<z.ZodNumber>;
    color: z.ZodDefault<z.ZodString>;
    fadeoutTime: z.ZodDefault<z.ZodNumber>;
    startWidth: z.ZodDefault<z.ZodNumber>;
    endWidth: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    color: string;
    projectId: string;
    expansion: number;
    strokeWidth: number;
    frequency: number;
    waveSpeed: number;
    producerPoint: [number, number];
    wavesPerSecond: number;
    maxRadius: number;
    fadeoutTime: number;
    startWidth: number;
    endWidth: number;
}, {
    projectId: string;
    color?: string | undefined;
    expansion?: number | undefined;
    strokeWidth?: number | undefined;
    frequency?: number | undefined;
    waveSpeed?: number | undefined;
    producerPoint?: [number, number] | undefined;
    wavesPerSecond?: number | undefined;
    maxRadius?: number | undefined;
    fadeoutTime?: number | undefined;
    startWidth?: number | undefined;
    endWidth?: number | undefined;
}>;
export declare const CartoonEffectInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    edgeThickness: z.ZodDefault<z.ZodNumber>;
    edgeIntensity: z.ZodDefault<z.ZodNumber>;
    shadingSteps: z.ZodDefault<z.ZodNumber>;
    shadingSmoothness: z.ZodDefault<z.ZodNumber>;
    outlineColor: z.ZodDefault<z.ZodString>;
    edgeMode: z.ZodDefault<z.ZodEnum<["inverted", "drawn", "lit", "outline"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    edgeThickness: number;
    edgeIntensity: number;
    shadingSteps: number;
    shadingSmoothness: number;
    outlineColor: string;
    edgeMode: "inverted" | "drawn" | "lit" | "outline";
}, {
    projectId: string;
    componentId: string;
    edgeThickness?: number | undefined;
    edgeIntensity?: number | undefined;
    shadingSteps?: number | undefined;
    shadingSmoothness?: number | undefined;
    outlineColor?: string | undefined;
    edgeMode?: "inverted" | "drawn" | "lit" | "outline" | undefined;
}>;
export declare const BrushStrokesInput: z.ZodObject<{
    projectId: z.ZodString;
    brushSize: z.ZodDefault<z.ZodNumber>;
    strokeAngle: z.ZodDefault<z.ZodNumber>;
    strokeLength: z.ZodDefault<z.ZodNumber>;
    strokeDensity: z.ZodDefault<z.ZodNumber>;
    strokeRandomness: z.ZodDefault<z.ZodNumber>;
    paintSurface: z.ZodDefault<z.ZodEnum<["painting", "canvas", "paper", "wet"]>>;
    blendMode: z.ZodDefault<z.ZodEnum<["normal", "multiply", "screen"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    blendMode: "normal" | "multiply" | "screen";
    brushSize: number;
    strokeAngle: number;
    strokeLength: number;
    strokeDensity: number;
    strokeRandomness: number;
    paintSurface: "painting" | "canvas" | "paper" | "wet";
}, {
    projectId: string;
    blendMode?: "normal" | "multiply" | "screen" | undefined;
    brushSize?: number | undefined;
    strokeAngle?: number | undefined;
    strokeLength?: number | undefined;
    strokeDensity?: number | undefined;
    strokeRandomness?: number | undefined;
    paintSurface?: "painting" | "canvas" | "paper" | "wet" | undefined;
}>;
export declare const OilPaintInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    brushScale: z.ZodDefault<z.ZodNumber>;
    contrast: z.ZodDefault<z.ZodNumber>;
    cleanColor: z.ZodDefault<z.ZodNumber>;
    invert: z.ZodDefault<z.ZodBoolean>;
    blur: z.ZodDefault<z.ZodNumber>;
    sharpness: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    blur: number;
    projectId: string;
    componentId: string;
    invert: boolean;
    contrast: number;
    brushScale: number;
    cleanColor: number;
    sharpness: number;
}, {
    projectId: string;
    componentId: string;
    blur?: number | undefined;
    invert?: boolean | undefined;
    contrast?: number | undefined;
    brushScale?: number | undefined;
    cleanColor?: number | undefined;
    sharpness?: number | undefined;
}>;
export declare const WatercolorInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    edgeIntensity: z.ZodDefault<z.ZodNumber>;
    edgeSimplicity: z.ZodDefault<z.ZodNumber>;
    texture: z.ZodDefault<z.ZodNumber>;
    brushSize: z.ZodDefault<z.ZodNumber>;
    wetness: z.ZodDefault<z.ZodNumber>;
    colorVariation: z.ZodDefault<z.ZodNumber>;
    paperType: z.ZodDefault<z.ZodEnum<["cold-press", "hot-press", "rough"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    brushSize: number;
    edgeIntensity: number;
    edgeSimplicity: number;
    texture: number;
    wetness: number;
    colorVariation: number;
    paperType: "cold-press" | "hot-press" | "rough";
}, {
    projectId: string;
    componentId: string;
    brushSize?: number | undefined;
    edgeIntensity?: number | undefined;
    edgeSimplicity?: number | undefined;
    texture?: number | undefined;
    wetness?: number | undefined;
    colorVariation?: number | undefined;
    paperType?: "cold-press" | "hot-press" | "rough" | undefined;
}>;
export declare const EmbossEffectInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    angle: z.ZodDefault<z.ZodNumber>;
    height: z.ZodDefault<z.ZodNumber>;
    amount: z.ZodDefault<z.ZodNumber>;
    relief: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    height: number;
    projectId: string;
    componentId: string;
    angle: number;
    amount: number;
    relief: number;
}, {
    projectId: string;
    componentId: string;
    height?: number | undefined;
    angle?: number | undefined;
    amount?: number | undefined;
    relief?: number | undefined;
}>;
export declare const MotionTileInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    tileCenter: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    tileWidth: z.ZodDefault<z.ZodNumber>;
    tileHeight: z.ZodDefault<z.ZodNumber>;
    outputWidth: z.ZodDefault<z.ZodNumber>;
    outputHeight: z.ZodDefault<z.ZodNumber>;
    phase: z.ZodDefault<z.ZodNumber>;
    horizontalOffset: z.ZodDefault<z.ZodNumber>;
    verticalOffset: z.ZodDefault<z.ZodNumber>;
    mirrorEdges: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    phase: number;
    tileCenter: [number, number];
    tileWidth: number;
    tileHeight: number;
    outputWidth: number;
    outputHeight: number;
    horizontalOffset: number;
    verticalOffset: number;
    mirrorEdges: boolean;
}, {
    projectId: string;
    componentId: string;
    phase?: number | undefined;
    tileCenter?: [number, number] | undefined;
    tileWidth?: number | undefined;
    tileHeight?: number | undefined;
    outputWidth?: number | undefined;
    outputHeight?: number | undefined;
    horizontalOffset?: number | undefined;
    verticalOffset?: number | undefined;
    mirrorEdges?: boolean | undefined;
}>;
export declare const ScatterEffectInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    scatterAmount: z.ZodDefault<z.ZodNumber>;
    grainAmount: z.ZodDefault<z.ZodNumber>;
    grainSeed: z.ZodDefault<z.ZodNumber>;
    horizontalOnly: z.ZodDefault<z.ZodBoolean>;
    verticalOnly: z.ZodDefault<z.ZodBoolean>;
    monochromatic: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    scatterAmount: number;
    grainAmount: number;
    grainSeed: number;
    horizontalOnly: boolean;
    verticalOnly: boolean;
    monochromatic: boolean;
}, {
    projectId: string;
    componentId: string;
    scatterAmount?: number | undefined;
    grainAmount?: number | undefined;
    grainSeed?: number | undefined;
    horizontalOnly?: boolean | undefined;
    verticalOnly?: boolean | undefined;
    monochromatic?: boolean | undefined;
}>;
export declare const ThresholdEffectInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    level: z.ZodDefault<z.ZodNumber>;
    invert: z.ZodDefault<z.ZodBoolean>;
    channel: z.ZodDefault<z.ZodEnum<["luminance", "red", "green", "blue", "alpha"]>>;
    halftone: z.ZodDefault<z.ZodBoolean>;
    halftoneSize: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    channel: "alpha" | "red" | "green" | "blue" | "luminance";
    invert: boolean;
    level: number;
    halftone: boolean;
    halftoneSize: number;
}, {
    projectId: string;
    componentId: string;
    channel?: "alpha" | "red" | "green" | "blue" | "luminance" | undefined;
    invert?: boolean | undefined;
    level?: number | undefined;
    halftone?: boolean | undefined;
    halftoneSize?: number | undefined;
}>;
export declare const AnalyzeRestraintInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const ListRecipesInput: z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category?: string | undefined;
    query?: string | undefined;
}, {
    category?: string | undefined;
    query?: string | undefined;
}>;
export declare const ApplyRecipeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    recipeId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    recipeId: string;
}, {
    projectId: string;
    componentId: string;
    recipeId: string;
}>;
export declare const SaveProjectRecipeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    intentKeywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    avoidWhen: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    restraintLevel: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
    componentId: string;
    description?: string | undefined;
    intentKeywords?: string[] | undefined;
    avoidWhen?: string[] | undefined;
    restraintLevel?: number | undefined;
}, {
    name: string;
    projectId: string;
    componentId: string;
    description?: string | undefined;
    intentKeywords?: string[] | undefined;
    avoidWhen?: string[] | undefined;
    restraintLevel?: number | undefined;
}>;
export declare const ListProjectRecipesInput: z.ZodObject<{
    projectId: z.ZodString;
    query: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    query?: string | undefined;
}, {
    projectId: string;
    query?: string | undefined;
}>;
export declare const ApplyProjectRecipeInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    recipeId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    recipeId: string;
}, {
    projectId: string;
    componentId: string;
    recipeId: string;
}>;
export declare const DeleteProjectRecipeInput: z.ZodObject<{
    projectId: z.ZodString;
    recipeId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    recipeId: string;
}, {
    projectId: string;
    recipeId: string;
}>;
export declare const SeedProjectRecipesInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const ListBrandPacksInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const ApplyBrandPackInput: z.ZodObject<{
    projectId: z.ZodString;
    packId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    packId: string;
    componentId?: string | undefined;
}, {
    projectId: string;
    packId: string;
    componentId?: string | undefined;
}>;
export declare const DeleteBrandPackInput: z.ZodObject<{
    projectId: z.ZodString;
    packId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    packId: string;
}, {
    projectId: string;
    packId: string;
}>;
export declare const SeedBrandPacksInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const SetMotionProfileInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<["hero", "supporting", "background", "cta", "decorative", "data", "navigation"]>>;
    temperament: z.ZodOptional<z.ZodEnum<["bold", "subtle", "urgent", "calm", "playful", "precise", "dramatic", "friendly"]>>;
    interactionStyle: z.ZodOptional<z.ZodEnum<["passive", "reactive", "interactive"]>>;
    visualWeight: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    role?: "background" | "data" | "hero" | "supporting" | "cta" | "decorative" | "navigation" | undefined;
    temperament?: "playful" | "calm" | "dramatic" | "urgent" | "bold" | "subtle" | "precise" | "friendly" | undefined;
    interactionStyle?: "passive" | "reactive" | "interactive" | undefined;
    visualWeight?: number | undefined;
    notes?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    role?: "background" | "data" | "hero" | "supporting" | "cta" | "decorative" | "navigation" | undefined;
    temperament?: "playful" | "calm" | "dramatic" | "urgent" | "bold" | "subtle" | "precise" | "friendly" | undefined;
    interactionStyle?: "passive" | "reactive" | "interactive" | undefined;
    visualWeight?: number | undefined;
    notes?: string | undefined;
}>;
export declare const GetMotionProfileInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
}, {
    projectId: string;
    componentId: string;
}>;
export declare const ListMotionProfilesInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const SuggestMotionProfileInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
}, {
    projectId: string;
    componentId: string;
}>;
export declare const ApplyMotionProfileInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
}, {
    projectId: string;
    componentId: string;
}>;
export declare const SaveMotionCaptureInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    samples: z.ZodArray<z.ZodObject<{
        t: z.ZodNumber;
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        t: number;
    }, {
        x: number;
        y: number;
        t: number;
    }>, "many">;
    originX: z.ZodOptional<z.ZodNumber>;
    originY: z.ZodOptional<z.ZodNumber>;
    normalize: z.ZodOptional<z.ZodBoolean>;
    smoothing: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
    samples: {
        x: number;
        y: number;
        t: number;
    }[];
    description?: string | undefined;
    smoothing?: number | undefined;
    originX?: number | undefined;
    originY?: number | undefined;
    normalize?: boolean | undefined;
}, {
    name: string;
    projectId: string;
    samples: {
        x: number;
        y: number;
        t: number;
    }[];
    description?: string | undefined;
    smoothing?: number | undefined;
    originX?: number | undefined;
    originY?: number | undefined;
    normalize?: boolean | undefined;
}>;
export declare const ListMotionCapturesInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const ApplyMotionCaptureInput: z.ZodObject<{
    projectId: z.ZodString;
    captureId: z.ZodString;
    componentId: z.ZodString;
    normalize: z.ZodOptional<z.ZodBoolean>;
    smoothing: z.ZodOptional<z.ZodNumber>;
    snap: z.ZodOptional<z.ZodNumber>;
    maxKeyframes: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    captureId: string;
    snap?: number | undefined;
    smoothing?: number | undefined;
    normalize?: boolean | undefined;
    maxKeyframes?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    captureId: string;
    snap?: number | undefined;
    smoothing?: number | undefined;
    normalize?: boolean | undefined;
    maxKeyframes?: number | undefined;
}>;
export declare const DeleteMotionCaptureInput: z.ZodObject<{
    projectId: z.ZodString;
    captureId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    captureId: string;
}, {
    projectId: string;
    captureId: string;
}>;
export declare const SeedMotionCapturesInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const ListExportPresetsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const RecommendExportFormatInput: z.ZodObject<{
    projectId: z.ZodString;
    hint: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    hint?: string | undefined;
}, {
    projectId: string;
    hint?: string | undefined;
}>;
export declare const ApplyExportPresetInput: z.ZodObject<{
    projectId: z.ZodString;
    presetId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    presetId: string;
}, {
    projectId: string;
    presetId: string;
}>;
export declare const SaveSessionSnapshotInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    messageCount: z.ZodOptional<z.ZodNumber>;
    toolsUsed: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
    parentId?: string | undefined;
    componentIds?: string[] | undefined;
    tags?: string[] | undefined;
    summary?: string | undefined;
    messageCount?: number | undefined;
    toolsUsed?: string[] | undefined;
}, {
    name: string;
    projectId: string;
    parentId?: string | undefined;
    componentIds?: string[] | undefined;
    tags?: string[] | undefined;
    summary?: string | undefined;
    messageCount?: number | undefined;
    toolsUsed?: string[] | undefined;
}>;
export declare const ListSessionSnapshotsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const ResumeSessionSnapshotInput: z.ZodObject<{
    projectId: z.ZodString;
    sessionId: z.ZodString;
    summary: z.ZodOptional<z.ZodString>;
    messageCount: z.ZodOptional<z.ZodNumber>;
    toolsUsed: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    sessionId: string;
    componentIds?: string[] | undefined;
    tags?: string[] | undefined;
    summary?: string | undefined;
    messageCount?: number | undefined;
    toolsUsed?: string[] | undefined;
}, {
    projectId: string;
    sessionId: string;
    componentIds?: string[] | undefined;
    tags?: string[] | undefined;
    summary?: string | undefined;
    messageCount?: number | undefined;
    toolsUsed?: string[] | undefined;
}>;
export declare const GetSessionLineageInput: z.ZodObject<{
    projectId: z.ZodString;
    sessionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    sessionId?: string | undefined;
}, {
    projectId: string;
    sessionId?: string | undefined;
}>;
export declare const DeleteSessionSnapshotInput: z.ZodObject<{
    projectId: z.ZodString;
    sessionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    sessionId: string;
}, {
    projectId: string;
    sessionId: string;
}>;
export declare const CheckAccessibilityInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId?: string | undefined;
}, {
    projectId: string;
    componentId?: string | undefined;
}>;
export declare const CheckPerformanceInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId?: string | undefined;
}, {
    projectId: string;
    componentId?: string | undefined;
}>;
export declare const CreateBeatInput: z.ZodObject<{
    projectId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    sceneId: z.ZodOptional<z.ZodString>;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    transition: z.ZodOptional<z.ZodEnum<["cut", "fade", "slide", "zoom", "dissolve", "wipe"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    title: string;
    sceneId?: string | undefined;
    durationMs?: number | undefined;
    description?: string | undefined;
    componentIds?: string[] | undefined;
    transition?: "zoom" | "dissolve" | "cut" | "wipe" | "fade" | "slide" | undefined;
}, {
    projectId: string;
    title: string;
    sceneId?: string | undefined;
    durationMs?: number | undefined;
    description?: string | undefined;
    componentIds?: string[] | undefined;
    transition?: "zoom" | "dissolve" | "cut" | "wipe" | "fade" | "slide" | undefined;
}>;
export declare const ListBeatsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const UpdateBeatInput: z.ZodObject<{
    projectId: z.ZodString;
    beatId: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    sceneId: z.ZodOptional<z.ZodString>;
    componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    transition: z.ZodOptional<z.ZodEnum<["cut", "fade", "slide", "zoom", "dissolve", "wipe"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    beatId: string;
    sceneId?: string | undefined;
    durationMs?: number | undefined;
    description?: string | undefined;
    title?: string | undefined;
    componentIds?: string[] | undefined;
    transition?: "zoom" | "dissolve" | "cut" | "wipe" | "fade" | "slide" | undefined;
}, {
    projectId: string;
    beatId: string;
    sceneId?: string | undefined;
    durationMs?: number | undefined;
    description?: string | undefined;
    title?: string | undefined;
    componentIds?: string[] | undefined;
    transition?: "zoom" | "dissolve" | "cut" | "wipe" | "fade" | "slide" | undefined;
}>;
export declare const ReorderBeatsInput: z.ZodObject<{
    projectId: z.ZodString;
    beatIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    beatIds: string[];
}, {
    projectId: string;
    beatIds: string[];
}>;
export declare const DeleteBeatInput: z.ZodObject<{
    projectId: z.ZodString;
    beatId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    beatId: string;
}, {
    projectId: string;
    beatId: string;
}>;
export declare const ExportStoryboardInput: z.ZodObject<{
    projectId: z.ZodString;
    format: z.ZodDefault<z.ZodEnum<["markdown", "json"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    format: "markdown" | "json";
}, {
    projectId: string;
    format?: "markdown" | "json" | undefined;
}>;
export declare const AnalyzePrinciplesInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId?: string | undefined;
}, {
    projectId: string;
    componentId?: string | undefined;
}>;
export declare const ApplyPrincipleInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    principle: z.ZodEnum<["squash_stretch", "anticipation", "staging", "slow_in_out", "arcs", "secondary_action", "timing", "exaggeration", "solid_drawing", "appeal", "follow_through", "overlapping_action"]>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    principle: "squash_stretch" | "anticipation" | "staging" | "slow_in_out" | "arcs" | "secondary_action" | "timing" | "exaggeration" | "solid_drawing" | "appeal" | "follow_through" | "overlapping_action";
}, {
    projectId: string;
    componentId: string;
    principle: "squash_stretch" | "anticipation" | "staging" | "slow_in_out" | "arcs" | "secondary_action" | "timing" | "exaggeration" | "solid_drawing" | "appeal" | "follow_through" | "overlapping_action";
}>;
export declare const SynthesizeEasingInput: z.ZodObject<{
    description: z.ZodString;
    format: z.ZodDefault<z.ZodEnum<["bezier", "spring", "css"]>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    format: "bezier" | "spring" | "css";
}, {
    description: string;
    format?: "bezier" | "spring" | "css" | undefined;
}>;
export declare const ApplyChoreographyInput: z.ZodObject<{
    projectId: z.ZodString;
    pattern: z.ZodEnum<["cascade", "call_response", "unison", "counterpoint", "wave", "canon", "stagger_grid", "ripple_out"]>;
    baseDelayMs: z.ZodOptional<z.ZodNumber>;
    baseDurationMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    pattern: "cascade" | "call_response" | "unison" | "counterpoint" | "wave" | "canon" | "stagger_grid" | "ripple_out";
    baseDelayMs?: number | undefined;
    baseDurationMs?: number | undefined;
}, {
    projectId: string;
    pattern: "cascade" | "call_response" | "unison" | "counterpoint" | "wave" | "canon" | "stagger_grid" | "ripple_out";
    baseDelayMs?: number | undefined;
    baseDurationMs?: number | undefined;
}>;
export declare const BlendMotionsInput: z.ZodObject<{
    projectId: z.ZodString;
    sourceComponentId: z.ZodString;
    targetComponentId: z.ZodString;
    ratio: z.ZodDefault<z.ZodNumber>;
    applyTo: z.ZodDefault<z.ZodEnum<["source", "new"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    targetComponentId: string;
    sourceComponentId: string;
    applyTo: "source" | "new";
    ratio: number;
}, {
    projectId: string;
    targetComponentId: string;
    sourceComponentId: string;
    applyTo?: "source" | "new" | undefined;
    ratio?: number | undefined;
}>;
export declare const InterpolateMotionInput: z.ZodObject<{
    projectId: z.ZodString;
    sourceComponentId: z.ZodString;
    targetComponentId: z.ZodString;
    steps: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    steps: number;
    targetComponentId: string;
    sourceComponentId: string;
}, {
    projectId: string;
    targetComponentId: string;
    sourceComponentId: string;
    steps?: number | undefined;
}>;
export declare const MergePropertiesInput: z.ZodObject<{
    projectId: z.ZodString;
    sourceComponentId: z.ZodString;
    targetComponentId: z.ZodString;
    applyTo: z.ZodDefault<z.ZodEnum<["source", "new"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    targetComponentId: string;
    sourceComponentId: string;
    applyTo: "source" | "new";
}, {
    projectId: string;
    targetComponentId: string;
    sourceComponentId: string;
    applyTo?: "source" | "new" | undefined;
}>;
export declare const AnalyzeEmotionInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeRhythmInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeNarrativeInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AdaptMotionInput: z.ZodObject<{
    projectId: z.ZodString;
    device: z.ZodEnum<["desktop", "tablet", "mobile", "tv"]>;
    viewportWidth: z.ZodNumber;
    viewportHeight: z.ZodNumber;
    performance: z.ZodEnum<["high", "medium", "low"]>;
    accessibility: z.ZodEnum<["full", "reduced", "minimal"]>;
    connectionSpeed: z.ZodEnum<["fast", "slow", "offline"]>;
    batteryLevel: z.ZodDefault<z.ZodNumber>;
    apply: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    device: "desktop" | "tablet" | "mobile" | "tv";
    viewportWidth: number;
    viewportHeight: number;
    performance: "low" | "medium" | "high";
    accessibility: "minimal" | "full" | "reduced";
    connectionSpeed: "fast" | "slow" | "offline";
    batteryLevel: number;
    apply: boolean;
}, {
    projectId: string;
    device: "desktop" | "tablet" | "mobile" | "tv";
    viewportWidth: number;
    viewportHeight: number;
    performance: "low" | "medium" | "high";
    accessibility: "minimal" | "full" | "reduced";
    connectionSpeed: "fast" | "slow" | "offline";
    batteryLevel?: number | undefined;
    apply?: boolean | undefined;
}>;
export declare const PreviewAdaptationsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const GenerateResponsiveCssInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const SynthesizeMotionInput: z.ZodObject<{
    projectId: z.ZodString;
    pattern: z.ZodEnum<["heartbeat", "breathing", "walk-cycle", "bounce-ball", "pendulum", "ocean-wave", "tremor", "fidget", "heartbeat-fast", "shake-violent", "sway-gentle", "orbit-elliptical"]>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    loopCount: z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"infinite">]>>>;
    amplitudeScale: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    speedScale: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    componentName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    pattern: "heartbeat" | "breathing" | "walk-cycle" | "bounce-ball" | "pendulum" | "ocean-wave" | "tremor" | "fidget" | "heartbeat-fast" | "shake-violent" | "sway-gentle" | "orbit-elliptical";
    amplitudeScale: number;
    loopCount: number | "infinite";
    speedScale: number;
    durationMs?: number | undefined;
    componentName?: string | undefined;
}, {
    projectId: string;
    pattern: "heartbeat" | "breathing" | "walk-cycle" | "bounce-ball" | "pendulum" | "ocean-wave" | "tremor" | "fidget" | "heartbeat-fast" | "shake-violent" | "sway-gentle" | "orbit-elliptical";
    durationMs?: number | undefined;
    amplitudeScale?: number | undefined;
    loopCount?: number | "infinite" | undefined;
    speedScale?: number | undefined;
    componentName?: string | undefined;
}>;
export declare const MorphToPatternInput: z.ZodObject<{
    projectId: z.ZodString;
    targetPattern: z.ZodEnum<["heartbeat", "breathing", "walk-cycle", "bounce-ball", "pendulum", "ocean-wave", "tremor", "fidget", "heartbeat-fast", "shake-violent", "sway-gentle", "orbit-elliptical"]>;
    morphSteps: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    durationMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    targetPattern: "heartbeat" | "breathing" | "walk-cycle" | "bounce-ball" | "pendulum" | "ocean-wave" | "tremor" | "fidget" | "heartbeat-fast" | "shake-violent" | "sway-gentle" | "orbit-elliptical";
    morphSteps: number;
    durationMs?: number | undefined;
}, {
    projectId: string;
    targetPattern: "heartbeat" | "breathing" | "walk-cycle" | "bounce-ball" | "pendulum" | "ocean-wave" | "tremor" | "fidget" | "heartbeat-fast" | "shake-violent" | "sway-gentle" | "orbit-elliptical";
    durationMs?: number | undefined;
    morphSteps?: number | undefined;
}>;
export declare const SynthesizeWaveformInput: z.ZodObject<{
    projectId: z.ZodString;
    waveform: z.ZodEnum<["sine", "square", "triangle", "sawtooth", "noise", "pulse"]>;
    amplitude: z.ZodNumber;
    frequency: z.ZodNumber;
    phase: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    property: z.ZodEnum<["translateX", "translateY", "scale", "scaleX", "scaleY", "rotate", "opacity"]>;
    durationMs: z.ZodDefault<z.ZodNumber>;
    loopCount: z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"infinite">]>>>;
    componentName: z.ZodOptional<z.ZodString>;
    keyframeCount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    offset: number;
    projectId: string;
    durationMs: number;
    property: "translateX" | "translateY" | "scale" | "scaleX" | "scaleY" | "rotate" | "opacity";
    frequency: number;
    amplitude: number;
    phase: number;
    loopCount: number | "infinite";
    waveform: "triangle" | "sine" | "square" | "sawtooth" | "noise" | "pulse";
    keyframeCount: number;
    componentName?: string | undefined;
}, {
    projectId: string;
    property: "translateX" | "translateY" | "scale" | "scaleX" | "scaleY" | "rotate" | "opacity";
    frequency: number;
    amplitude: number;
    waveform: "triangle" | "sine" | "square" | "sawtooth" | "noise" | "pulse";
    offset?: number | undefined;
    durationMs?: number | undefined;
    phase?: number | undefined;
    loopCount?: number | "infinite" | undefined;
    componentName?: string | undefined;
    keyframeCount?: number | undefined;
}>;
export declare const CreateStoryArcInput: z.ZodObject<{
    projectId: z.ZodString;
    genre: z.ZodEnum<["hero", "mystery", "romance", "comedy", "thriller", "documentary", "fantasy", "horror"]>;
    totalDurationMs: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    totalDurationMs: number;
    genre: "hero" | "mystery" | "romance" | "comedy" | "thriller" | "documentary" | "fantasy" | "horror";
}, {
    projectId: string;
    genre: "hero" | "mystery" | "romance" | "comedy" | "thriller" | "documentary" | "fantasy" | "horror";
    totalDurationMs?: number | undefined;
}>;
export declare const AnalyzePacingInput: z.ZodObject<{
    projectId: z.ZodString;
    arcId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    arcId?: string | undefined;
}, {
    projectId: string;
    arcId?: string | undefined;
}>;
export declare const ApplyStoryPlanInput: z.ZodObject<{
    projectId: z.ZodString;
    genre: z.ZodEnum<["hero", "mystery", "romance", "comedy", "thriller", "documentary", "fantasy", "horror"]>;
    totalDurationMs: z.ZodDefault<z.ZodNumber>;
    apply: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    totalDurationMs: number;
    apply: boolean;
    genre: "hero" | "mystery" | "romance" | "comedy" | "thriller" | "documentary" | "fantasy" | "horror";
}, {
    projectId: string;
    genre: "hero" | "mystery" | "romance" | "comedy" | "thriller" | "documentary" | "fantasy" | "horror";
    totalDurationMs?: number | undefined;
    apply?: boolean | undefined;
}>;
export declare const SaveMemoryInput: z.ZodObject<{
    projectId: z.ZodString;
    key: z.ZodString;
    value: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    value: string;
    key: string;
    projectId: string;
    tags?: string[] | undefined;
}, {
    value: string;
    key: string;
    projectId: string;
    tags?: string[] | undefined;
}>;
export declare const RecallMemoryInput: z.ZodObject<{
    projectId: z.ZodString;
    query: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    query: string;
}, {
    projectId: string;
    query: string;
}>;
export declare const ListGeneratedSkillsInput: z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    projectId?: string | undefined;
}, {
    projectId?: string | undefined;
    limit?: number | undefined;
}>;
export declare const CompileGrammarInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    source: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    source: string;
}, {
    projectId: string;
    componentId: string;
    source: string;
}>;
export declare const ParseMotionInput: z.ZodObject<{
    projectId: z.ZodString;
    description: z.ZodString;
    componentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    description: string;
    componentId?: string | undefined;
}, {
    projectId: string;
    description: string;
    componentId?: string | undefined;
}>;
export declare const SetShaderEffectInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    effectId: z.ZodString;
    intensity: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    effectId: string;
    intensity?: number | undefined;
}, {
    projectId: string;
    componentId: string;
    effectId: string;
    intensity?: number | undefined;
}>;
export declare const SaveVersionInput: z.ZodObject<{
    projectId: z.ZodString;
    label: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    label: string;
}, {
    projectId: string;
    label: string;
}>;
export declare const ListVersionsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const RestoreVersionInput: z.ZodObject<{
    projectId: z.ZodString;
    versionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    versionId: string;
}, {
    projectId: string;
    versionId: string;
}>;
export declare const DeleteVersionInput: z.ZodObject<{
    projectId: z.ZodString;
    versionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    versionId: string;
}, {
    projectId: string;
    versionId: string;
}>;
export declare const SaveTokenInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodString;
    category: z.ZodEnum<["duration", "easing", "color", "spacing", "radius", "shadow", "font"]>;
    value: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    value: string;
    name: string;
    projectId: string;
    category: "color" | "easing" | "radius" | "spacing" | "duration" | "shadow" | "font";
    description?: string | undefined;
}, {
    value: string;
    name: string;
    projectId: string;
    category: "color" | "easing" | "radius" | "spacing" | "duration" | "shadow" | "font";
    description?: string | undefined;
}>;
export declare const ListTokensInput: z.ZodObject<{
    projectId: z.ZodString;
    category: z.ZodOptional<z.ZodEnum<["duration", "easing", "color", "spacing", "radius", "shadow", "font"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    category?: "color" | "easing" | "radius" | "spacing" | "duration" | "shadow" | "font" | undefined;
}, {
    projectId: string;
    category?: "color" | "easing" | "radius" | "spacing" | "duration" | "shadow" | "font" | undefined;
}>;
export declare const UpdateTokenInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodString;
    value: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
    value?: string | undefined;
    description?: string | undefined;
}, {
    name: string;
    projectId: string;
    value?: string | undefined;
    description?: string | undefined;
}>;
export declare const DeleteTokenInput: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
}, {
    name: string;
    projectId: string;
}>;
export declare const GenerateImageInput: z.ZodObject<{
    prompt: z.ZodString;
    model: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    negativePrompt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    width?: number | undefined;
    height?: number | undefined;
    model?: string | undefined;
    negativePrompt?: string | undefined;
}, {
    prompt: string;
    width?: number | undefined;
    height?: number | undefined;
    model?: string | undefined;
    negativePrompt?: string | undefined;
}>;
export declare const GenerateSpeechInput: z.ZodObject<{
    text: z.ZodString;
    model: z.ZodOptional<z.ZodString>;
    voiceId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    text: string;
    model?: string | undefined;
    voiceId?: string | undefined;
}, {
    text: string;
    model?: string | undefined;
    voiceId?: string | undefined;
}>;
export declare const GenerateVideoInput: z.ZodObject<{
    prompt: z.ZodString;
    model: z.ZodOptional<z.ZodString>;
    duration: z.ZodOptional<z.ZodNumber>;
    sourceImage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    duration?: number | undefined;
    model?: string | undefined;
    sourceImage?: string | undefined;
}, {
    prompt: string;
    duration?: number | undefined;
    model?: string | undefined;
    sourceImage?: string | undefined;
}>;
export declare const Generate3DInput: z.ZodObject<{
    prompt: z.ZodString;
    model: z.ZodOptional<z.ZodString>;
    sourceImage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    model?: string | undefined;
    sourceImage?: string | undefined;
}, {
    prompt: string;
    model?: string | undefined;
    sourceImage?: string | undefined;
}>;
export declare const ListModelsInput: z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    modality: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    provider?: string | undefined;
    modality?: string | undefined;
}, {
    provider?: string | undefined;
    modality?: string | undefined;
}>;
export declare const EditorZoomCanvasInput: z.ZodObject<{
    zoom: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    zoom: number;
}, {
    zoom: number;
}>;
export declare const EditorPanCanvasInput: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
}, {
    x: number;
    y: number;
}>;
export declare const EditorFitToScreenInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const EditorResetViewInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const EditorSetPlayheadInput: z.ZodObject<{
    timeMs: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    timeMs: number;
}, {
    timeMs: number;
}>;
export declare const EditorSetPlaybackSpeedInput: z.ZodObject<{
    speed: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    speed: number;
}, {
    speed: number;
}>;
export declare const EditorPlayInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const EditorPauseInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const EditorToggleRulersInput: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    enabled?: boolean | undefined;
}, {
    enabled?: boolean | undefined;
}>;
export declare const EditorToggleSnapInput: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    gridSize: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    enabled?: boolean | undefined;
    gridSize?: number | undefined;
}, {
    enabled?: boolean | undefined;
    gridSize?: number | undefined;
}>;
export declare const EditorToggleAutoKeyframeInput: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    enabled?: boolean | undefined;
}, {
    enabled?: boolean | undefined;
}>;
export declare const EditorToggleOnionSkinInput: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    frames: z.ZodOptional<z.ZodNumber>;
    opacity: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    opacity?: number | undefined;
    enabled?: boolean | undefined;
    frames?: number | undefined;
}, {
    opacity?: number | undefined;
    enabled?: boolean | undefined;
    frames?: number | undefined;
}>;
export declare const EditorSelectComponentInput: z.ZodObject<{
    componentId: z.ZodString;
    additive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    componentId: string;
    additive?: boolean | undefined;
}, {
    componentId: string;
    additive?: boolean | undefined;
}>;
export declare const EditorSelectComponentsInput: z.ZodObject<{
    componentIds: z.ZodArray<z.ZodString, "many">;
    clearFirst: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    componentIds: string[];
    clearFirst?: boolean | undefined;
}, {
    componentIds: string[];
    clearFirst?: boolean | undefined;
}>;
export declare const EditorClearSelectionInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const EditorToggleVisibilityInput: z.ZodObject<{
    componentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    componentId: string;
}, {
    componentId: string;
}>;
export declare const EditorToggleLockInput: z.ZodObject<{
    componentId: z.ZodString;
    locked: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    componentId: string;
    locked?: boolean | undefined;
}, {
    componentId: string;
    locked?: boolean | undefined;
}>;
export declare const EditorSetPanelInput: z.ZodObject<{
    category: z.ZodEnum<["design", "motion", "intel", "assets", "output"]>;
    tab: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category: "output" | "design" | "motion" | "intel" | "assets";
    tab?: string | undefined;
}, {
    category: "output" | "design" | "motion" | "intel" | "assets";
    tab?: string | undefined;
}>;
export declare const EditorTogglePanelInput: z.ZodObject<{
    collapsed: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    collapsed?: boolean | undefined;
}, {
    collapsed?: boolean | undefined;
}>;
export declare const EditorOpenOverlayInput: z.ZodObject<{
    overlay: z.ZodEnum<["preview", "export", "templates", "settings", "command_palette"]>;
    open: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    overlay: "preview" | "export" | "templates" | "settings" | "command_palette";
    open?: boolean | undefined;
}, {
    overlay: "preview" | "export" | "templates" | "settings" | "command_palette";
    open?: boolean | undefined;
}>;
export declare const EditorUndoInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const EditorRedoInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const EditorSetArtboardInput: z.ZodObject<{
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    background: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    width?: number | undefined;
    height?: number | undefined;
    background?: string | undefined;
}, {
    width?: number | undefined;
    height?: number | undefined;
    background?: string | undefined;
}>;
export declare const EditorTriggerReplayInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const EditorToggleMotionPathsInput: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    enabled?: boolean | undefined;
}, {
    enabled?: boolean | undefined;
}>;
export declare const EditorTogglePerformanceMonitorInput: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    enabled?: boolean | undefined;
}, {
    enabled?: boolean | undefined;
}>;
export declare const EditorSetSoloInput: z.ZodObject<{
    componentId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    componentId: string | null;
}, {
    componentId: string | null;
}>;
export declare const EditorToggleSidebarInput: z.ZodObject<{
    collapsed: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    collapsed?: boolean | undefined;
}, {
    collapsed?: boolean | undefined;
}>;
export declare const EditorTimelineCommandInput: z.ZodObject<{
    action: z.ZodString;
}, "strip", z.ZodTypeAny, {
    action: string;
}, {
    action: string;
}>;
export declare const EditorToggleSelectionInput: z.ZodObject<{
    componentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    componentId: string;
}, {
    componentId: string;
}>;
export declare const EditorOpenSkillsInput: z.ZodObject<{
    open: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    open?: boolean | undefined;
}, {
    open?: boolean | undefined;
}>;
export declare const EditorOpenShortcutsInput: z.ZodObject<{
    open: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    open?: boolean | undefined;
}, {
    open?: boolean | undefined;
}>;
export declare const EditorSetTrackOrderInput: z.ZodObject<{
    trackIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    trackIds: string[];
}, {
    trackIds: string[];
}>;
export declare const EditorSetLoopRegionInput: z.ZodObject<{
    startMs: z.ZodNumber;
    endMs: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    startMs: number;
    endMs: number;
}, {
    startMs: number;
    endMs: number;
}>;
export declare const EditorClearLoopRegionInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const RollbackLastActionInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const ListCheckpointsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const RollbackToCheckpointInput: z.ZodObject<{
    projectId: z.ZodString;
    checkpointId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    checkpointId: string;
}, {
    projectId: string;
    checkpointId: string;
}>;
export declare const CancelPlanInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const GetPlanStateInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const SeekToFrameInput: z.ZodObject<{
    projectId: z.ZodString;
    frame: z.ZodNumber;
    fps: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    frame: number;
    fps?: number | undefined;
}, {
    projectId: string;
    frame: number;
    fps?: number | undefined;
}>;
export declare const RenderFramesInput: z.ZodObject<{
    projectId: z.ZodString;
    startFrame: z.ZodOptional<z.ZodNumber>;
    endFrame: z.ZodOptional<z.ZodNumber>;
    fps: z.ZodOptional<z.ZodNumber>;
    sampleStep: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    fps?: number | undefined;
    startFrame?: number | undefined;
    endFrame?: number | undefined;
    sampleStep?: number | undefined;
}, {
    projectId: string;
    fps?: number | undefined;
    startFrame?: number | undefined;
    endFrame?: number | undefined;
    sampleStep?: number | undefined;
}>;
export declare const ExportHtmlCompositionInput: z.ZodObject<{
    projectId: z.ZodString;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    fps: z.ZodOptional<z.ZodNumber>;
    includeControls: z.ZodOptional<z.ZodBoolean>;
    loop: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    width?: number | undefined;
    height?: number | undefined;
    loop?: boolean | undefined;
    fps?: number | undefined;
    includeControls?: boolean | undefined;
}, {
    projectId: string;
    width?: number | undefined;
    height?: number | undefined;
    loop?: boolean | undefined;
    fps?: number | undefined;
    includeControls?: boolean | undefined;
}>;
export declare const ResolveMediaInput: z.ZodObject<{
    modality: z.ZodEnum<["audio", "image", "video", "voice", "icon", "logo", "lut", "font"]>;
    purpose: z.ZodEnum<["background-music", "sound-effect", "voiceover", "background-image", "foreground-image", "transition", "overlay", "color-grade", "caption", "watermark"]>;
    description: z.ZodString;
    durationSec: z.ZodOptional<z.ZodNumber>;
    allowGeneration: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    description: string;
    modality: "image" | "video" | "audio" | "font" | "voice" | "icon" | "logo" | "lut";
    purpose: "overlay" | "transition" | "background-music" | "sound-effect" | "voiceover" | "background-image" | "foreground-image" | "color-grade" | "caption" | "watermark";
    durationSec?: number | undefined;
    allowGeneration?: boolean | undefined;
}, {
    description: string;
    modality: "image" | "video" | "audio" | "font" | "voice" | "icon" | "logo" | "lut";
    purpose: "overlay" | "transition" | "background-music" | "sound-effect" | "voiceover" | "background-image" | "foreground-image" | "color-grade" | "caption" | "watermark";
    durationSec?: number | undefined;
    allowGeneration?: boolean | undefined;
}>;
export declare const RouteSkillInput: z.ZodObject<{
    userInput: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userInput: string;
}, {
    userInput: string;
}>;
export declare const ListSkillsInput: z.ZodObject<{
    category: z.ZodOptional<z.ZodEnum<["creation", "analysis", "optimization", "export", "editing", "intelligence"]>>;
}, "strip", z.ZodTypeAny, {
    category?: "export" | "creation" | "analysis" | "optimization" | "editing" | "intelligence" | undefined;
}, {
    category?: "export" | "creation" | "analysis" | "optimization" | "editing" | "intelligence" | undefined;
}>;
export declare const PlanSequenceInput: z.ZodObject<{
    description: z.ZodString;
    arc: z.ZodOptional<z.ZodEnum<["hero-journey", "product-launch", "tutorial", "product-reveal", "emotional-arc", "action-sequence", "documentary", "celebration"]>>;
    totalDurationMs: z.ZodOptional<z.ZodNumber>;
    sceneCount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    description: string;
    totalDurationMs?: number | undefined;
    arc?: "documentary" | "hero-journey" | "product-launch" | "tutorial" | "product-reveal" | "emotional-arc" | "action-sequence" | "celebration" | undefined;
    sceneCount?: number | undefined;
}, {
    description: string;
    totalDurationMs?: number | undefined;
    arc?: "documentary" | "hero-journey" | "product-launch" | "tutorial" | "product-reveal" | "emotional-arc" | "action-sequence" | "celebration" | undefined;
    sceneCount?: number | undefined;
}>;
export declare const ListNarrativeArcsInput: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
export declare const ListMotionThemesInput: z.ZodObject<{
    personality: z.ZodOptional<z.ZodEnum<["precise", "organic", "playful", "dramatic", "minimal", "luxurious", "technical", "warm"]>>;
}, "strip", z.ZodTypeAny, {
    personality?: "playful" | "dramatic" | "minimal" | "organic" | "precise" | "luxurious" | "technical" | "warm" | undefined;
}, {
    personality?: "playful" | "dramatic" | "minimal" | "organic" | "precise" | "luxurious" | "technical" | "warm" | undefined;
}>;
export declare const ApplyMotionThemeInput: z.ZodObject<{
    projectId: z.ZodString;
    themeId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    themeId: string;
}, {
    projectId: string;
    themeId: string;
}>;
export declare const ListRhythmPatternsInput: z.ZodObject<{
    category: z.ZodOptional<z.ZodEnum<["metric", "expressive", "biological", "compound"]>>;
}, "strip", z.ZodTypeAny, {
    category?: "metric" | "expressive" | "biological" | "compound" | undefined;
}, {
    category?: "metric" | "expressive" | "biological" | "compound" | undefined;
}>;
export declare const ApplyRhythmInput: z.ZodObject<{
    patternId: z.ZodEnum<["steady-beat", "syncopated", "swing", "rubato", "polyrhythm-3-2", "gallop", "waltz", "fanfare", "heartbeat", "wave-flow", "accelerando", "decelerando"]>;
    itemCount: z.ZodNumber;
    bpm: z.ZodOptional<z.ZodNumber>;
    scale: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    patternId: "heartbeat" | "steady-beat" | "syncopated" | "swing" | "rubato" | "polyrhythm-3-2" | "gallop" | "waltz" | "fanfare" | "wave-flow" | "accelerando" | "decelerando";
    itemCount: number;
    scale?: number | undefined;
    bpm?: number | undefined;
}, {
    patternId: "heartbeat" | "steady-beat" | "syncopated" | "swing" | "rubato" | "polyrhythm-3-2" | "gallop" | "waltz" | "fanfare" | "wave-flow" | "accelerando" | "decelerando";
    itemCount: number;
    scale?: number | undefined;
    bpm?: number | undefined;
}>;
export declare const GenerateVariantsInput: z.ZodObject<{
    projectId: z.ZodString;
    count: z.ZodOptional<z.ZodNumber>;
    strategies: z.ZodOptional<z.ZodArray<z.ZodEnum<["easing", "timing", "choreography", "intensity", "direction", "palette"]>, "many">>;
    seed: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    seed?: number | undefined;
    count?: number | undefined;
    strategies?: ("easing" | "direction" | "choreography" | "intensity" | "timing" | "palette")[] | undefined;
}, {
    projectId: string;
    seed?: number | undefined;
    count?: number | undefined;
    strategies?: ("easing" | "direction" | "choreography" | "intensity" | "timing" | "palette")[] | undefined;
}>;
export declare const EvolveMotionInput: z.ZodObject<{
    projectId: z.ZodString;
    strategy: z.ZodOptional<z.ZodEnum<["balanced", "playful", "accessible", "performant", "harmonious"]>>;
    generations: z.ZodOptional<z.ZodNumber>;
    populationSize: z.ZodOptional<z.ZodNumber>;
    mutationRate: z.ZodOptional<z.ZodNumber>;
    apply: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    apply?: boolean | undefined;
    strategy?: "playful" | "balanced" | "accessible" | "performant" | "harmonious" | undefined;
    generations?: number | undefined;
    populationSize?: number | undefined;
    mutationRate?: number | undefined;
}, {
    projectId: string;
    apply?: boolean | undefined;
    strategy?: "playful" | "balanced" | "accessible" | "performant" | "harmonious" | undefined;
    generations?: number | undefined;
    populationSize?: number | undefined;
    mutationRate?: number | undefined;
}>;
export declare const ListEvolutionStrategiesInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const PredictPerceptionInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const PredictChronopathInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeCreativeContextInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const ListSemanticConceptsInput: z.ZodObject<{
    category: z.ZodOptional<z.ZodEnum<["emotion", "brand", "energy", "aesthetic"]>>;
}, "strip", z.ZodTypeAny, {
    category?: "emotion" | "brand" | "energy" | "aesthetic" | undefined;
}, {
    category?: "emotion" | "brand" | "energy" | "aesthetic" | undefined;
}>;
export declare const InferIntentInput: z.ZodObject<{
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
}, {
    description: string;
}>;
export declare const BlendConceptsInput: z.ZodObject<{
    conceptA: z.ZodString;
    conceptB: z.ZodString;
    weightA: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    conceptA: string;
    conceptB: string;
    weightA?: number | undefined;
}, {
    conceptA: string;
    conceptB: string;
    weightA?: number | undefined;
}>;
export declare const SimulatePhysicsInput: z.ZodObject<{
    type: z.ZodEnum<["spring", "gravity", "projectile", "friction", "pendulum"]>;
    config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    type: "spring" | "gravity" | "pendulum" | "projectile" | "friction";
    config?: Record<string, number> | undefined;
}, {
    type: "spring" | "gravity" | "pendulum" | "projectile" | "friction";
    config?: Record<string, number> | undefined;
}>;
export declare const ListPhysicsPresetsInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const RunPhysicsPresetInput: z.ZodObject<{
    presetId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    presetId: string;
}, {
    presetId: string;
}>;
export declare const GeneratePathMotionInput: z.ZodObject<{
    type: z.ZodEnum<["bezier", "lissajous", "spiral", "figure-eight", "heart", "circle", "svg-path"]>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    samples: z.ZodOptional<z.ZodNumber>;
    scale: z.ZodOptional<z.ZodNumber>;
    loop: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "bezier" | "circle" | "spiral" | "lissajous" | "figure-eight" | "heart" | "svg-path";
    scale?: number | undefined;
    durationMs?: number | undefined;
    loop?: boolean | undefined;
    samples?: number | undefined;
}, {
    type: "bezier" | "circle" | "spiral" | "lissajous" | "figure-eight" | "heart" | "svg-path";
    scale?: number | undefined;
    durationMs?: number | undefined;
    loop?: boolean | undefined;
    samples?: number | undefined;
}>;
export declare const ListPathPresetsInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const RunPathPresetInput: z.ZodObject<{
    presetId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    presetId: string;
}, {
    presetId: string;
}>;
export declare const EncodeMotionInput: z.ZodObject<{
    projectId: z.ZodString;
    format: z.ZodEnum<["lottie", "css", "waapi", "smil", "gsap", "react-spring"]>;
    minify: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    format: "css" | "lottie" | "waapi" | "smil" | "gsap" | "react-spring";
    minify?: boolean | undefined;
}, {
    projectId: string;
    format: "css" | "lottie" | "waapi" | "smil" | "gsap" | "react-spring";
    minify?: boolean | undefined;
}>;
export declare const ListCodecFormatsInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const ExtractStyleDnaInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const TransferProjectStyleInput: z.ZodObject<{
    projectId: z.ZodString;
    sourceProjectId: z.ZodString;
    easingStrength: z.ZodOptional<z.ZodNumber>;
    tempoStrength: z.ZodOptional<z.ZodNumber>;
    energyStrength: z.ZodOptional<z.ZodNumber>;
    colorStrength: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    sourceProjectId: string;
    easingStrength?: number | undefined;
    tempoStrength?: number | undefined;
    energyStrength?: number | undefined;
    colorStrength?: number | undefined;
}, {
    projectId: string;
    sourceProjectId: string;
    easingStrength?: number | undefined;
    tempoStrength?: number | undefined;
    energyStrength?: number | undefined;
    colorStrength?: number | undefined;
}>;
export declare const BlendStylesInput: z.ZodObject<{
    projectIdA: z.ZodString;
    projectIdB: z.ZodString;
    ratio: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    ratio: number;
    projectIdA: string;
    projectIdB: string;
}, {
    ratio: number;
    projectIdA: string;
    projectIdB: string;
}>;
export declare const DescribeStyleInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const CompareStylesInput: z.ZodObject<{
    projectIdA: z.ZodString;
    projectIdB: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectIdA: string;
    projectIdB: string;
}, {
    projectIdA: string;
    projectIdB: string;
}>;
export declare const ListStyleArchetypesInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const ApplyStyleArchetypeInput: z.ZodObject<{
    projectId: z.ZodString;
    archetypeId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    archetypeId: string;
}, {
    projectId: string;
    archetypeId: string;
}>;
export declare const BuildKnowledgeGraphInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const QueryConceptInput: z.ZodObject<{
    conceptId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    conceptId: string;
}, {
    conceptId: string;
}>;
export declare const FindRelatedInput: z.ZodObject<{
    conceptId: z.ZodString;
    relationship: z.ZodOptional<z.ZodEnum<["enables", "complements", "conflicts", "requires", "specializes", "alternative", "combines", "transitions", "contrasts", "evolves"]>>;
}, "strip", z.ZodTypeAny, {
    conceptId: string;
    relationship?: "enables" | "complements" | "conflicts" | "requires" | "specializes" | "alternative" | "combines" | "transitions" | "contrasts" | "evolves" | undefined;
}, {
    conceptId: string;
    relationship?: "enables" | "complements" | "conflicts" | "requires" | "specializes" | "alternative" | "combines" | "transitions" | "contrasts" | "evolves" | undefined;
}>;
export declare const FindPathInput: z.ZodObject<{
    fromId: z.ZodString;
    toId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fromId: string;
    toId: string;
}, {
    fromId: string;
    toId: string;
}>;
export declare const SearchConceptsInput: z.ZodObject<{
    query: z.ZodString;
}, "strip", z.ZodTypeAny, {
    query: string;
}, {
    query: string;
}>;
export declare const SuggestConnectionsInput: z.ZodObject<{
    conceptIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    conceptIds: string[];
}, {
    conceptIds: string[];
}>;
export declare const RecommendNextInput: z.ZodObject<{
    usedConceptIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    usedConceptIds: string[];
}, {
    usedConceptIds: string[];
}>;
export declare const AnalyzeGraphInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const RunAllTestsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const RunTestsByCategoryInput: z.ZodObject<{
    projectId: z.ZodString;
    category: z.ZodEnum<["accessibility", "performance", "visual", "principles", "timing", "consistency"]>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    category: "timing" | "performance" | "accessibility" | "visual" | "principles" | "consistency";
}, {
    projectId: string;
    category: "timing" | "performance" | "accessibility" | "visual" | "principles" | "consistency";
}>;
export declare const RunTestSuiteInput: z.ZodObject<{
    projectId: z.ZodString;
    suiteId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    suiteId: string;
}, {
    projectId: string;
    suiteId: string;
}>;
export declare const ListTestSuitesInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const SynthesizeFromEmotionInput: z.ZodObject<{
    projectId: z.ZodString;
    emotionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    emotionId: string;
}, {
    projectId: string;
    emotionId: string;
}>;
export declare const DetectEmotionInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
}, {
    projectId: string;
    componentId: string;
}>;
export declare const BlendEmotionsInput: z.ZodObject<{
    projectId: z.ZodString;
    emotions: z.ZodArray<z.ZodObject<{
        emotionId: z.ZodString;
        weight: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        emotionId: string;
        weight: number;
    }, {
        emotionId: string;
        weight: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    emotions: {
        emotionId: string;
        weight: number;
    }[];
}, {
    projectId: string;
    emotions: {
        emotionId: string;
        weight: number;
    }[];
}>;
export declare const PlanEmotionJourneyInput: z.ZodObject<{
    projectId: z.ZodString;
    emotionIds: z.ZodArray<z.ZodString, "many">;
    totalDurationMs: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    totalDurationMs: number;
    emotionIds: string[];
}, {
    projectId: string;
    emotionIds: string[];
    totalDurationMs?: number | undefined;
}>;
export declare const ListEmotionsInput: z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category?: string | undefined;
}, {
    category?: string | undefined;
}>;
export declare const GetTasteProfileInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const RecommendForProjectInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const RecordMotionObservationInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    action: z.ZodEnum<["created", "accepted", "rejected", "modified"]>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    action: "created" | "accepted" | "rejected" | "modified";
}, {
    projectId: string;
    componentId: string;
    action: "created" | "accepted" | "rejected" | "modified";
}>;
export declare const ComputeContextAdjustmentsInput: z.ZodObject<{
    projectId: z.ZodString;
    device: z.ZodOptional<z.ZodString>;
    performance: z.ZodOptional<z.ZodString>;
    timeOfDay: z.ZodOptional<z.ZodString>;
    ambientLight: z.ZodOptional<z.ZodString>;
    userState: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    device?: string | undefined;
    performance?: string | undefined;
    timeOfDay?: string | undefined;
    ambientLight?: string | undefined;
    userState?: string | undefined;
}, {
    projectId: string;
    device?: string | undefined;
    performance?: string | undefined;
    timeOfDay?: string | undefined;
    ambientLight?: string | undefined;
    userState?: string | undefined;
}>;
export declare const AdaptComponentForContextInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
    device: z.ZodOptional<z.ZodString>;
    performance: z.ZodOptional<z.ZodString>;
    timeOfDay: z.ZodOptional<z.ZodString>;
    ambientLight: z.ZodOptional<z.ZodString>;
    userState: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
    device?: string | undefined;
    performance?: string | undefined;
    timeOfDay?: string | undefined;
    ambientLight?: string | undefined;
    userState?: string | undefined;
}, {
    projectId: string;
    componentId: string;
    device?: string | undefined;
    performance?: string | undefined;
    timeOfDay?: string | undefined;
    ambientLight?: string | undefined;
    userState?: string | undefined;
}>;
export declare const AutoDetectContextInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const ListContextOptionsInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const PlanCollaborationInput: z.ZodObject<{
    projectId: z.ZodString;
    request: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    request: string;
}, {
    projectId: string;
    request: string;
}>;
export declare const ExecuteCollaborationInput: z.ZodObject<{
    projectId: z.ZodString;
    request: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    request: string;
}, {
    projectId: string;
    request: string;
}>;
export declare const ListCollaborationModulesInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const AnalyzeResonanceInput: z.ZodObject<{
    projectId: z.ZodString;
    viewerState: z.ZodOptional<z.ZodObject<{
        attention: z.ZodOptional<z.ZodNumber>;
        arousal: z.ZodOptional<z.ZodNumber>;
        valence: z.ZodOptional<z.ZodNumber>;
        fatigue: z.ZodOptional<z.ZodNumber>;
        timeOfDay: z.ZodOptional<z.ZodEnum<["morning", "afternoon", "evening", "night"]>>;
    }, "strip", z.ZodTypeAny, {
        timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
        attention?: number | undefined;
        arousal?: number | undefined;
        valence?: number | undefined;
        fatigue?: number | undefined;
    }, {
        timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
        attention?: number | undefined;
        arousal?: number | undefined;
        valence?: number | undefined;
        fatigue?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    viewerState?: {
        timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
        attention?: number | undefined;
        arousal?: number | undefined;
        valence?: number | undefined;
        fatigue?: number | undefined;
    } | undefined;
}, {
    projectId: string;
    viewerState?: {
        timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
        attention?: number | undefined;
        arousal?: number | undefined;
        valence?: number | undefined;
        fatigue?: number | undefined;
    } | undefined;
}>;
export declare const TuneResonanceInput: z.ZodObject<{
    projectId: z.ZodString;
    viewerState: z.ZodOptional<z.ZodObject<{
        attention: z.ZodOptional<z.ZodNumber>;
        arousal: z.ZodOptional<z.ZodNumber>;
        valence: z.ZodOptional<z.ZodNumber>;
        fatigue: z.ZodOptional<z.ZodNumber>;
        timeOfDay: z.ZodOptional<z.ZodEnum<["morning", "afternoon", "evening", "night"]>>;
    }, "strip", z.ZodTypeAny, {
        timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
        attention?: number | undefined;
        arousal?: number | undefined;
        valence?: number | undefined;
        fatigue?: number | undefined;
    }, {
        timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
        attention?: number | undefined;
        arousal?: number | undefined;
        valence?: number | undefined;
        fatigue?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    viewerState?: {
        timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
        attention?: number | undefined;
        arousal?: number | undefined;
        valence?: number | undefined;
        fatigue?: number | undefined;
    } | undefined;
}, {
    projectId: string;
    viewerState?: {
        timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
        attention?: number | undefined;
        arousal?: number | undefined;
        valence?: number | undefined;
        fatigue?: number | undefined;
    } | undefined;
}>;
export declare const TranslateSynesthesiaInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const MapSensoryToMotionInput: z.ZodObject<{
    modality: z.ZodEnum<["color", "sound", "texture", "emotion"]>;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string;
    modality: "color" | "texture" | "emotion" | "sound";
}, {
    value: string;
    modality: "color" | "texture" | "emotion" | "sound";
}>;
export declare const DreamFromPromptInput: z.ZodObject<{
    projectId: z.ZodString;
    prompt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    prompt: string;
}, {
    projectId: string;
    prompt: string;
}>;
export declare const GenerateDreamSequenceInput: z.ZodObject<{
    projectId: z.ZodString;
    length: z.ZodOptional<z.ZodNumber>;
    seed: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    length?: number | undefined;
    seed?: string | undefined;
}, {
    projectId: string;
    length?: number | undefined;
    seed?: string | undefined;
}>;
export declare const ListDreamConceptsInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const AnalyzeHarmonicsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const FindHarmonicsInput: z.ZodObject<{
    projectId: z.ZodString;
    componentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    componentId: string;
}, {
    projectId: string;
    componentId: string;
}>;
export declare const AnalyzeEntropyInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const IdentifyInformationHotspotsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeCognitiveLoadInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeTopologyInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const FindTemporalPathInput: z.ZodObject<{
    projectId: z.ZodString;
    fromId: z.ZodString;
    toId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    fromId: string;
    toId: string;
}, {
    projectId: string;
    fromId: string;
    toId: string;
}>;
export declare const AnalyzePoeticsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeEcosystemInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeCalligraphyInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeMythologyInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeWeatherInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeAlchemyInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeArchitectureInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeCartographyInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeGenealogyInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeAstronomyInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeChemistryInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeMusicologyInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeBotanyInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeGeologyInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzePhysicsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeLinguisticsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const AnalyzeCinemaInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const VerifyMotionInput: z.ZodObject<{
    projectId: z.ZodString;
    /** Optional intent override; defaults to the most recent user message. */
    intent: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    intent?: string | undefined;
}, {
    projectId: string;
    intent?: string | undefined;
}>;
export declare const SelfCorrectInput: z.ZodObject<{
    projectId: z.ZodString;
    /** Optional intent override; defaults to the most recent user message. */
    intent: z.ZodOptional<z.ZodString>;
    /** When false, only reports what would be fixed without applying patches. Default true. */
    apply: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    apply?: boolean | undefined;
    intent?: string | undefined;
}, {
    projectId: string;
    apply?: boolean | undefined;
    intent?: string | undefined;
}>;
export declare const PredictIntentInput: z.ZodObject<{
    /** The partial user input to predict intent from. May be empty. */
    partial: z.ZodString;
    /** Optional project id to use the spec as a prior. */
    projectId: z.ZodOptional<z.ZodString>;
    /** How many predictions to return. Default 5. */
    topK: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    partial: string;
    projectId?: string | undefined;
    topK?: number | undefined;
}, {
    partial: string;
    projectId?: string | undefined;
    topK?: number | undefined;
}>;
export declare const ForecastMotionInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const GenesisMotionInput: z.ZodObject<{
    projectId: z.ZodString;
    /** Which mathematical generator to use. */
    kind: z.ZodEnum<["lissajous", "goldenSpiral", "waveInterference", "dampedOscillator", "phyllotaxis", "lorenzAttractor"]>;
    /** Number of keyframe samples. Default 24. */
    samples: z.ZodOptional<z.ZodNumber>;
    /** Animation duration in ms. Default 2000. */
    durationMs: z.ZodOptional<z.ZodNumber>;
    /** Frequency a. Default 3. */
    a: z.ZodOptional<z.ZodNumber>;
    /** Frequency b. Default 2. */
    b: z.ZodOptional<z.ZodNumber>;
    /** Amplitude in pixels. Default 120. */
    amplitude: z.ZodOptional<z.ZodNumber>;
    /** Damping coefficient. Default 0.15. */
    damping: z.ZodOptional<z.ZodNumber>;
    /** Angular frequency. Default 4. */
    omega: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    kind: "lissajous" | "goldenSpiral" | "waveInterference" | "dampedOscillator" | "phyllotaxis" | "lorenzAttractor";
    damping?: number | undefined;
    durationMs?: number | undefined;
    amplitude?: number | undefined;
    samples?: number | undefined;
    a?: number | undefined;
    b?: number | undefined;
    omega?: number | undefined;
}, {
    projectId: string;
    kind: "lissajous" | "goldenSpiral" | "waveInterference" | "dampedOscillator" | "phyllotaxis" | "lorenzAttractor";
    damping?: number | undefined;
    durationMs?: number | undefined;
    amplitude?: number | undefined;
    samples?: number | undefined;
    a?: number | undefined;
    b?: number | undefined;
    omega?: number | undefined;
}>;
export declare const AnalyzeSymbiosisInput: z.ZodObject<{
    /** First project id (parent A). */
    projectIdA: z.ZodString;
    /** Second project id (parent B). */
    projectIdB: z.ZodString;
    /** When true, persist the bred hybrid offspring as components in project A. Default false. */
    persistOffspring: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectIdA: string;
    projectIdB: string;
    persistOffspring?: boolean | undefined;
}, {
    projectIdA: string;
    projectIdB: string;
    persistOffspring?: boolean | undefined;
}>;
export declare const ReflectConsciousnessInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const DecideVolitionInput: z.ZodObject<{
    /** The partial user input to evaluate. May be empty. */
    partial: z.ZodString;
    /** Optional project id to read the current spec as a prior. */
    projectId: z.ZodOptional<z.ZodString>;
    /** Number of consecutive prior turns that ended in an ASK. */
    consecutiveAsks: z.ZodOptional<z.ZodNumber>;
    /** Whether the same keyword appeared in the prior turn. */
    repeatedKeyword: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    partial: string;
    projectId?: string | undefined;
    consecutiveAsks?: number | undefined;
    repeatedKeyword?: boolean | undefined;
}, {
    partial: string;
    projectId?: string | undefined;
    consecutiveAsks?: number | undefined;
    repeatedKeyword?: boolean | undefined;
}>;
export declare const TranslateLexiconInput: z.ZodObject<{
    /** The natural-language intent to translate (English or Chinese). */
    input: z.ZodString;
    /** Optional project id, reserved for future spec-aware routing. */
    projectId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    input: string;
    projectId?: string | undefined;
}, {
    input: string;
    projectId?: string | undefined;
}>;
export declare const RunMotionDebateInput: z.ZodObject<{
    projectId: z.ZodString;
    request: z.ZodString;
    accessibilityWeight: z.ZodOptional<z.ZodNumber>;
    performanceWeight: z.ZodOptional<z.ZodNumber>;
    brandWeight: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    request: string;
    accessibilityWeight?: number | undefined;
    performanceWeight?: number | undefined;
    brandWeight?: number | undefined;
}, {
    projectId: string;
    request: string;
    accessibilityWeight?: number | undefined;
    performanceWeight?: number | undefined;
    brandWeight?: number | undefined;
}>;
export declare const RunReflectionLoopInput: z.ZodObject<{
    projectId: z.ZodString;
    maxPasses: z.ZodDefault<z.ZodNumber>;
    autoApply: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    maxPasses: number;
    autoApply: boolean;
}, {
    projectId: string;
    maxPasses?: number | undefined;
    autoApply?: boolean | undefined;
}>;
export declare const GetFlowStateInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const RunHeuristicsInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const GetAtelierReportInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const GenerateManifestoInput: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
/** Tool-name → input schema registry. The agent and MCP layer both consume this. */
export declare const TOOL_INPUT_SCHEMAS: {
    readonly get_motion_spec: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly list_templates: z.ZodObject<{
        category: z.ZodOptional<z.ZodString>;
        tag: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        category?: string | undefined;
        tag?: string | undefined;
    }, {
        category?: string | undefined;
        tag?: string | undefined;
    }>;
    readonly set_template: z.ZodObject<{
        projectId: z.ZodString;
        templateId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        templateId: string;
    }, {
        projectId: string;
        templateId: string;
    }>;
    readonly preview_url: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly add_layer: z.ZodObject<{
        projectId: z.ZodString;
        sceneId: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        selector: z.ZodOptional<z.ZodString>;
        templateId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        projectId: string;
        sceneId?: string | undefined;
        selector?: string | undefined;
        templateId?: string | undefined;
    }, {
        name: string;
        projectId: string;
        sceneId?: string | undefined;
        selector?: string | undefined;
        templateId?: string | undefined;
    }>;
    readonly remove_component: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
    }, {
        projectId: string;
        componentId: string;
    }>;
    readonly add_scene: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodString;
        durationMs: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        projectId: string;
        durationMs?: number | undefined;
    }, {
        name: string;
        projectId: string;
        durationMs?: number | undefined;
    }>;
    readonly generate_film: z.ZodObject<{
        projectId: z.ZodString;
        prompt: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        style: z.ZodOptional<z.ZodEnum<["cinematic", "tech", "playful", "calm", "energetic", "default"]>>;
        replace: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        prompt: string;
        style?: "default" | "cinematic" | "tech" | "playful" | "calm" | "energetic" | undefined;
        title?: string | undefined;
        replace?: boolean | undefined;
    }, {
        projectId: string;
        prompt: string;
        style?: "default" | "cinematic" | "tech" | "playful" | "calm" | "energetic" | undefined;
        title?: string | undefined;
        replace?: boolean | undefined;
    }>;
    readonly set_easing: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        easing: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
    }, "strip", z.ZodTypeAny, {
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
        projectId: string;
        componentId: string;
    }, {
        easing: {
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
        };
        projectId: string;
        componentId: string;
    }>;
    readonly set_spring: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        stiffness: z.ZodNumber;
        damping: z.ZodNumber;
        mass: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        stiffness: number;
        damping: number;
        mass: number;
        projectId: string;
        componentId: string;
    }, {
        stiffness: number;
        damping: number;
        projectId: string;
        componentId: string;
        mass?: number | undefined;
    }>;
    readonly set_duration: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        durationMs: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        durationMs: number;
        componentId: string;
    }, {
        projectId: string;
        durationMs: number;
        componentId: string;
    }>;
    readonly set_delay: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        delayMs: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        delayMs: number;
        componentId: string;
    }, {
        projectId: string;
        delayMs: number;
        componentId: string;
    }>;
    readonly set_transform: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        property: z.ZodEnum<["translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "opacity", "blur", "color", "backgroundColor", "width", "height", "borderRadius", "fontSize", "letterSpacing", "boxShadow", "clipPath"]>;
        keyframes: z.ZodArray<z.ZodObject<{
            offset: z.ZodNumber;
            value: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
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
            value: string | number;
            offset: number;
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
            value: string | number;
            offset: number;
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
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        keyframes: {
            value: string | number;
            offset: number;
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
        componentId: string;
        property: "translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath";
    }, {
        projectId: string;
        keyframes: {
            value: string | number;
            offset: number;
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
        }[];
        componentId: string;
        property: "translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath";
    }>;
    readonly set_keyframe: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        property: z.ZodEnum<["translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "opacity", "blur", "color", "backgroundColor", "width", "height", "borderRadius", "fontSize", "letterSpacing", "boxShadow", "clipPath"]>;
        offset: z.ZodNumber;
        value: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
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
        value: string | number;
        offset: number;
        projectId: string;
        componentId: string;
        property: "translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath";
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
        value: string | number;
        offset: number;
        projectId: string;
        componentId: string;
        property: "translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "skewX" | "skewY" | "opacity" | "blur" | "color" | "backgroundColor" | "width" | "height" | "borderRadius" | "fontSize" | "letterSpacing" | "boxShadow" | "clipPath";
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
    }>;
    readonly set_loop: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        iterationCount: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"infinite">]>;
        direction: z.ZodOptional<z.ZodEnum<["normal", "reverse", "alternate", "alternate-reverse"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        iterationCount: number | "infinite";
        componentId: string;
        direction?: "reverse" | "normal" | "alternate" | "alternate-reverse" | undefined;
    }, {
        projectId: string;
        iterationCount: number | "infinite";
        componentId: string;
        direction?: "reverse" | "normal" | "alternate" | "alternate-reverse" | undefined;
    }>;
    readonly set_fill_mode: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        fillMode: z.ZodEnum<["none", "forwards", "backwards", "both"]>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        fillMode: "none" | "forwards" | "backwards" | "both";
        componentId: string;
    }, {
        projectId: string;
        fillMode: "none" | "forwards" | "backwards" | "both";
        componentId: string;
    }>;
    readonly set_color: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        color: z.ZodString;
        target: z.ZodDefault<z.ZodEnum<["text", "background"]>>;
    }, "strip", z.ZodTypeAny, {
        color: string;
        projectId: string;
        componentId: string;
        target: "text" | "background";
    }, {
        color: string;
        projectId: string;
        componentId: string;
        target?: "text" | "background" | undefined;
    }>;
    readonly set_static_style: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        style: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        style: Record<string, string | number>;
        componentId: string;
    }, {
        projectId: string;
        style: Record<string, string | number>;
        componentId: string;
    }>;
    readonly set_global_timing: z.ZodObject<{
        projectId: z.ZodString;
        totalDurationMs: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        totalDurationMs?: number | undefined;
    }, {
        projectId: string;
        totalDurationMs?: number | undefined;
    }>;
    readonly set_project_tempo: z.ZodObject<{
        projectId: z.ZodString;
        bpm: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        bpm: number;
    }, {
        projectId: string;
        bpm: number;
    }>;
    readonly quantize_to_tempo: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
        division: z.ZodOptional<z.ZodEnum<["1", "2", "4", "8", "16"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId?: string | undefined;
        division?: "1" | "2" | "4" | "8" | "16" | undefined;
    }, {
        projectId: string;
        componentId?: string | undefined;
        division?: "1" | "2" | "4" | "8" | "16" | undefined;
    }>;
    readonly set_phase: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        phaseBeats: z.ZodOptional<z.ZodNumber>;
        label: z.ZodOptional<z.ZodEnum<["downbeat", "offbeat", "backbeat", "beat1", "beat2", "beat3", "beat4"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId?: string | undefined;
        componentIds?: string[] | undefined;
        phaseBeats?: number | undefined;
        label?: "downbeat" | "offbeat" | "backbeat" | "beat1" | "beat2" | "beat3" | "beat4" | undefined;
    }, {
        projectId: string;
        componentId?: string | undefined;
        componentIds?: string[] | undefined;
        phaseBeats?: number | undefined;
        label?: "downbeat" | "offbeat" | "backbeat" | "beat1" | "beat2" | "beat3" | "beat4" | undefined;
    }>;
    readonly align_to_beat: z.ZodObject<{
        projectId: z.ZodString;
        mode: z.ZodDefault<z.ZodEnum<["snap", "polyrhythm"]>>;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        division: z.ZodOptional<z.ZodEnum<["1", "2", "4", "8", "16"]>>;
        cycleBeats: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        mode: "snap" | "polyrhythm";
        cycleBeats: number;
        rotation: number;
        division?: "1" | "2" | "4" | "8" | "16" | undefined;
        componentIds?: string[] | undefined;
    }, {
        projectId: string;
        division?: "1" | "2" | "4" | "8" | "16" | undefined;
        componentIds?: string[] | undefined;
        mode?: "snap" | "polyrhythm" | undefined;
        cycleBeats?: number | undefined;
        rotation?: number | undefined;
    }>;
    readonly batch_update: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodArray<z.ZodString, "many">;
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
        durationMs: z.ZodOptional<z.ZodNumber>;
        delayMs: z.ZodOptional<z.ZodNumber>;
        iterationCount: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"infinite">]>>;
        direction: z.ZodOptional<z.ZodEnum<["normal", "reverse", "alternate", "alternate-reverse"]>>;
        fillMode: z.ZodOptional<z.ZodEnum<["none", "forwards", "backwards", "both"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentIds: string[];
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
        durationMs?: number | undefined;
        delayMs?: number | undefined;
        iterationCount?: number | "infinite" | undefined;
        direction?: "reverse" | "normal" | "alternate" | "alternate-reverse" | undefined;
        fillMode?: "none" | "forwards" | "backwards" | "both" | undefined;
    }, {
        projectId: string;
        componentIds: string[];
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
        durationMs?: number | undefined;
        delayMs?: number | undefined;
        iterationCount?: number | "infinite" | undefined;
        direction?: "reverse" | "normal" | "alternate" | "alternate-reverse" | undefined;
        fillMode?: "none" | "forwards" | "backwards" | "both" | undefined;
    }>;
    readonly apply_preset: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        preset: z.ZodEnum<["shake", "wiggle", "float", "glow", "heartbeat", "typewriter"]>;
    }, "strip", z.ZodTypeAny, {
        preset: "float" | "shake" | "wiggle" | "glow" | "heartbeat" | "typewriter";
        projectId: string;
        componentId: string;
    }, {
        preset: "float" | "shake" | "wiggle" | "glow" | "heartbeat" | "typewriter";
        projectId: string;
        componentId: string;
    }>;
    readonly duplicate_component: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        name?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        name?: string | undefined;
    }>;
    readonly reorder_components: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentIds: string[];
    }, {
        projectId: string;
        componentIds: string[];
    }>;
    readonly set_play_state: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        playState: z.ZodEnum<["running", "paused"]>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        playState: "running" | "paused";
        componentId: string;
    }, {
        projectId: string;
        playState: "running" | "paused";
        componentId: string;
    }>;
    readonly describe_motion: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId?: string | undefined;
    }, {
        projectId: string;
        componentId?: string | undefined;
    }>;
    readonly list_scenes: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly remove_scene: z.ZodObject<{
        projectId: z.ZodString;
        sceneId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        sceneId: string;
    }, {
        projectId: string;
        sceneId: string;
    }>;
    readonly stagger_components: z.ZodObject<{
        projectId: z.ZodString;
        stepMs: z.ZodDefault<z.ZodNumber>;
        startMs: z.ZodOptional<z.ZodNumber>;
        direction: z.ZodDefault<z.ZodEnum<["forward", "reverse", "center"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        direction: "reverse" | "forward" | "center";
        stepMs: number;
        startMs?: number | undefined;
    }, {
        projectId: string;
        direction?: "reverse" | "forward" | "center" | undefined;
        stepMs?: number | undefined;
        startMs?: number | undefined;
    }>;
    readonly match_template: z.ZodObject<{
        projectId: z.ZodString;
        hint: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        hint?: string | undefined;
    }, {
        projectId: string;
        hint?: string | undefined;
    }>;
    readonly find_similar_motion: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
        threshold: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId?: string | undefined;
        limit?: number | undefined;
        threshold?: number | undefined;
    }, {
        projectId: string;
        componentId?: string | undefined;
        limit?: number | undefined;
        threshold?: number | undefined;
    }>;
    readonly generate_motion_docs: z.ZodObject<{
        projectId: z.ZodString;
        format: z.ZodOptional<z.ZodEnum<["markdown", "json"]>>;
        includeAccessibility: z.ZodOptional<z.ZodBoolean>;
        includePerformance: z.ZodOptional<z.ZodBoolean>;
        includeStoryboard: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        format?: "markdown" | "json" | undefined;
        includeAccessibility?: boolean | undefined;
        includePerformance?: boolean | undefined;
        includeStoryboard?: boolean | undefined;
    }, {
        projectId: string;
        format?: "markdown" | "json" | undefined;
        includeAccessibility?: boolean | undefined;
        includePerformance?: boolean | undefined;
        includeStoryboard?: boolean | undefined;
    }>;
    readonly create_variant: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
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
        durationMs: z.ZodOptional<z.ZodNumber>;
        scale: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        scale?: number | undefined;
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
        durationMs?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        scale?: number | undefined;
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
        durationMs?: number | undefined;
    }>;
    readonly analyze_motion: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId?: string | undefined;
    }, {
        projectId: string;
        componentId?: string | undefined;
    }>;
    readonly suggest_next: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly search_catalog: z.ZodObject<{
        query: z.ZodString;
        limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        query: string;
    }, {
        query: string;
        limit?: number | undefined;
    }>;
    readonly run_motion_pipeline: z.ZodObject<{
        projectId: z.ZodString;
        description: z.ZodString;
        durationMs: z.ZodOptional<z.ZodNumber>;
        colorScheme: z.ZodOptional<z.ZodEnum<["complementary", "analogous", "triadic", "monochrome"]>>;
        baseColor: z.ZodOptional<z.ZodString>;
        choreography: z.ZodOptional<z.ZodEnum<["cascade", "call_response", "unison", "counterpoint", "wave", "canon", "stagger_grid", "ripple_out", "auto"]>>;
        componentCount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        description: string;
        durationMs?: number | undefined;
        colorScheme?: "complementary" | "analogous" | "triadic" | "monochrome" | undefined;
        baseColor?: string | undefined;
        choreography?: "auto" | "cascade" | "call_response" | "unison" | "counterpoint" | "wave" | "canon" | "stagger_grid" | "ripple_out" | undefined;
        componentCount?: number | undefined;
    }, {
        projectId: string;
        description: string;
        durationMs?: number | undefined;
        colorScheme?: "complementary" | "analogous" | "triadic" | "monochrome" | undefined;
        baseColor?: string | undefined;
        choreography?: "auto" | "cascade" | "call_response" | "unison" | "counterpoint" | "wave" | "canon" | "stagger_grid" | "ripple_out" | undefined;
        componentCount?: number | undefined;
    }>;
    readonly compose_sequence: z.ZodObject<{
        projectId: z.ZodString;
        type: z.ZodEnum<["sequence", "parallel", "stagger"]>;
        componentIds: z.ZodArray<z.ZodString, "many">;
        stepMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        gapMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        type: "sequence" | "parallel" | "stagger";
        projectId: string;
        componentIds: string[];
        stepMs: number;
        gapMs: number;
    }, {
        type: "sequence" | "parallel" | "stagger";
        projectId: string;
        componentIds: string[];
        stepMs?: number | undefined;
        gapMs?: number | undefined;
    }>;
    readonly set_motion_path: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        pathType: z.ZodEnum<["line", "circle", "ellipse", "bezier"]>;
        fromX: z.ZodOptional<z.ZodNumber>;
        fromY: z.ZodOptional<z.ZodNumber>;
        toX: z.ZodOptional<z.ZodNumber>;
        toY: z.ZodOptional<z.ZodNumber>;
        centerX: z.ZodOptional<z.ZodNumber>;
        centerY: z.ZodOptional<z.ZodNumber>;
        radiusX: z.ZodOptional<z.ZodNumber>;
        radiusY: z.ZodOptional<z.ZodNumber>;
        cp1X: z.ZodOptional<z.ZodNumber>;
        cp1Y: z.ZodOptional<z.ZodNumber>;
        cp2X: z.ZodOptional<z.ZodNumber>;
        cp2Y: z.ZodOptional<z.ZodNumber>;
        steps: z.ZodDefault<z.ZodNumber>;
        durationMs: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        pathType: "bezier" | "line" | "circle" | "ellipse";
        steps: number;
        durationMs?: number | undefined;
        fromX?: number | undefined;
        fromY?: number | undefined;
        toX?: number | undefined;
        toY?: number | undefined;
        centerX?: number | undefined;
        centerY?: number | undefined;
        radiusX?: number | undefined;
        radiusY?: number | undefined;
        cp1X?: number | undefined;
        cp1Y?: number | undefined;
        cp2X?: number | undefined;
        cp2Y?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        pathType: "bezier" | "line" | "circle" | "ellipse";
        durationMs?: number | undefined;
        fromX?: number | undefined;
        fromY?: number | undefined;
        toX?: number | undefined;
        toY?: number | undefined;
        centerX?: number | undefined;
        centerY?: number | undefined;
        radiusX?: number | undefined;
        radiusY?: number | undefined;
        cp1X?: number | undefined;
        cp1Y?: number | undefined;
        cp2X?: number | undefined;
        cp2Y?: number | undefined;
        steps?: number | undefined;
    }>;
    readonly apply_style: z.ZodObject<{
        projectId: z.ZodString;
        styleId: z.ZodEnum<["playful", "energetic", "calm", "professional", "dramatic", "minimal", "cinematic", "glassy", "retro", "futuristic", "organic", "mechanical", "luxury"]>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        styleId: "cinematic" | "playful" | "calm" | "energetic" | "professional" | "dramatic" | "minimal" | "glassy" | "retro" | "futuristic" | "organic" | "mechanical" | "luxury";
    }, {
        projectId: string;
        styleId: "cinematic" | "playful" | "calm" | "energetic" | "professional" | "dramatic" | "minimal" | "glassy" | "retro" | "futuristic" | "organic" | "mechanical" | "luxury";
    }>;
    readonly recognize_pattern: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly harmonize_colors: z.ZodObject<{
        projectId: z.ZodString;
        scheme: z.ZodDefault<z.ZodEnum<["complementary", "analogous", "triadic", "monochrome"]>>;
        baseColor: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        scheme: "complementary" | "analogous" | "triadic" | "monochrome";
        baseColor?: string | undefined;
    }, {
        projectId: string;
        baseColor?: string | undefined;
        scheme?: "complementary" | "analogous" | "triadic" | "monochrome" | undefined;
    }>;
    readonly choreograph: z.ZodObject<{
        projectId: z.ZodString;
        pattern: z.ZodEnum<["cascade", "wave", "ripple", "canon", "converge", "spiral", "explosion", "assembly", "breathing", "domino", "scatter"]>;
        stepMs: z.ZodDefault<z.ZodNumber>;
        durationMs: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        stepMs: number;
        pattern: "cascade" | "wave" | "canon" | "ripple" | "converge" | "spiral" | "explosion" | "assembly" | "breathing" | "domino" | "scatter";
        durationMs?: number | undefined;
    }, {
        projectId: string;
        pattern: "cascade" | "wave" | "canon" | "ripple" | "converge" | "spiral" | "explosion" | "assembly" | "breathing" | "domino" | "scatter";
        durationMs?: number | undefined;
        stepMs?: number | undefined;
    }>;
    readonly refine_motion: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
        refinement: z.ZodEnum<["snappier", "smoother", "more-dramatic", "calmer", "subtler", "more-energetic", "bouncier", "softer"]>;
    }, "strip", z.ZodTypeAny, {
        refinement: "snappier" | "smoother" | "more-dramatic" | "calmer" | "subtler" | "more-energetic" | "bouncier" | "softer";
        projectId: string;
        componentId?: string | undefined;
    }, {
        refinement: "snappier" | "smoother" | "more-dramatic" | "calmer" | "subtler" | "more-energetic" | "bouncier" | "softer";
        projectId: string;
        componentId?: string | undefined;
    }>;
    readonly set_custom_bezier: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        x1: z.ZodNumber;
        y1: z.ZodNumber;
        x2: z.ZodNumber;
        y2: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }, {
        projectId: string;
        componentId: string;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }>;
    readonly set_interpolation: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        keyframeIndex: z.ZodNumber;
        interpolation: z.ZodEnum<["linear", "ease", "hold"]>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        keyframeIndex: number;
        interpolation: "linear" | "ease" | "hold";
    }, {
        projectId: string;
        componentId: string;
        keyframeIndex: number;
        interpolation: "linear" | "ease" | "hold";
    }>;
    readonly add_property_keyframe: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        property: z.ZodString;
        offset: z.ZodNumber;
        value: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, "strip", z.ZodTypeAny, {
        value: string | number;
        offset: number;
        projectId: string;
        componentId: string;
        property: string;
    }, {
        value: string | number;
        offset: number;
        projectId: string;
        componentId: string;
        property: string;
    }>;
    readonly remove_keyframe: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        keyframeIndex: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        keyframeIndex: number;
    }, {
        projectId: string;
        componentId: string;
        keyframeIndex: number;
    }>;
    readonly set_trigger: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        trigger: z.ZodEnum<["onLoad", "onClick", "onHover", "onScroll", "afterDelay"]>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        trigger: "onLoad" | "onClick" | "onHover" | "onScroll" | "afterDelay";
        componentId: string;
    }, {
        projectId: string;
        trigger: "onLoad" | "onClick" | "onHover" | "onScroll" | "afterDelay";
        componentId: string;
    }>;
    readonly set_onion_skin: z.ZodObject<{
        projectId: z.ZodString;
        enabled: z.ZodBoolean;
        frames: z.ZodDefault<z.ZodNumber>;
        opacity: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        opacity: number;
        projectId: string;
        enabled: boolean;
        frames: number;
    }, {
        projectId: string;
        enabled: boolean;
        opacity?: number | undefined;
        frames?: number | undefined;
    }>;
    readonly preview_fullscreen: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId?: string | undefined;
    }, {
        projectId: string;
        componentId?: string | undefined;
    }>;
    readonly set_canvas_view: z.ZodObject<{
        projectId: z.ZodString;
        pan: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>>;
        zoom: z.ZodOptional<z.ZodNumber>;
        fit: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        pan?: {
            x: number;
            y: number;
        } | undefined;
        zoom?: number | undefined;
        fit?: boolean | undefined;
    }, {
        projectId: string;
        pan?: {
            x: number;
            y: number;
        } | undefined;
        zoom?: number | undefined;
        fit?: boolean | undefined;
    }>;
    readonly lock_layer: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        locked: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        locked: boolean;
    }, {
        projectId: string;
        componentId: string;
        locked?: boolean | undefined;
    }>;
    readonly set_z_order: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        action: z.ZodEnum<["forward", "backward", "to-front", "to-back"]>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        action: "forward" | "backward" | "to-front" | "to-back";
    }, {
        projectId: string;
        componentId: string;
        action: "forward" | "backward" | "to-front" | "to-back";
    }>;
    readonly set_transform_props: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        rotation: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        width?: number | undefined;
        height?: number | undefined;
        rotation?: number | undefined;
        x?: number | undefined;
        y?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        width?: number | undefined;
        height?: number | undefined;
        rotation?: number | undefined;
        x?: number | undefined;
        y?: number | undefined;
    }>;
    readonly align_components: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodArray<z.ZodString, "many">;
        align: z.ZodEnum<["left", "center", "right", "top", "middle", "bottom", "distribute-h", "distribute-v"]>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentIds: string[];
        align: "center" | "left" | "right" | "top" | "middle" | "bottom" | "distribute-h" | "distribute-v";
    }, {
        projectId: string;
        componentIds: string[];
        align: "center" | "left" | "right" | "top" | "middle" | "bottom" | "distribute-h" | "distribute-v";
    }>;
    readonly set_playback_range: z.ZodObject<{
        projectId: z.ZodString;
        startMs: z.ZodOptional<z.ZodNumber>;
        endMs: z.ZodOptional<z.ZodNumber>;
        clear: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        startMs?: number | undefined;
        endMs?: number | undefined;
        clear?: boolean | undefined;
    }, {
        projectId: string;
        startMs?: number | undefined;
        endMs?: number | undefined;
        clear?: boolean | undefined;
    }>;
    readonly select_components: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        clear: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentIds: string[];
        clear: boolean;
    }, {
        projectId: string;
        componentIds?: string[] | undefined;
        clear?: boolean | undefined;
    }>;
    readonly toggle_snap: z.ZodObject<{
        projectId: z.ZodString;
        enabled: z.ZodDefault<z.ZodBoolean>;
        size: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        enabled: boolean;
        size?: number | undefined;
    }, {
        projectId: string;
        enabled?: boolean | undefined;
        size?: number | undefined;
    }>;
    readonly add_shape: z.ZodObject<{
        projectId: z.ZodString;
        shape: z.ZodEnum<["rectangle", "circle", "text", "triangle", "star", "polygon", "line", "arrow"]>;
        name: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        shape: "text" | "line" | "circle" | "rectangle" | "triangle" | "star" | "polygon" | "arrow";
        projectId: string;
        width?: number | undefined;
        height?: number | undefined;
        name?: string | undefined;
        x?: number | undefined;
        y?: number | undefined;
    }, {
        shape: "text" | "line" | "circle" | "rectangle" | "triangle" | "star" | "polygon" | "arrow";
        projectId: string;
        width?: number | undefined;
        height?: number | undefined;
        name?: string | undefined;
        x?: number | undefined;
        y?: number | undefined;
    }>;
    readonly add_image: z.ZodObject<{
        projectId: z.ZodString;
        src: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        fit: z.ZodOptional<z.ZodEnum<["cover", "contain", "fill"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        src: string;
        width?: number | undefined;
        height?: number | undefined;
        name?: string | undefined;
        x?: number | undefined;
        y?: number | undefined;
        fit?: "fill" | "cover" | "contain" | undefined;
    }, {
        projectId: string;
        src: string;
        width?: number | undefined;
        height?: number | undefined;
        name?: string | undefined;
        x?: number | undefined;
        y?: number | undefined;
        fit?: "fill" | "cover" | "contain" | undefined;
    }>;
    readonly add_video: z.ZodObject<{
        projectId: z.ZodString;
        src: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        muted: z.ZodOptional<z.ZodBoolean>;
        loop: z.ZodOptional<z.ZodBoolean>;
        autoplay: z.ZodOptional<z.ZodBoolean>;
        delayMs: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        src: string;
        width?: number | undefined;
        height?: number | undefined;
        name?: string | undefined;
        delayMs?: number | undefined;
        x?: number | undefined;
        y?: number | undefined;
        muted?: boolean | undefined;
        loop?: boolean | undefined;
        autoplay?: boolean | undefined;
    }, {
        projectId: string;
        src: string;
        width?: number | undefined;
        height?: number | undefined;
        name?: string | undefined;
        delayMs?: number | undefined;
        x?: number | undefined;
        y?: number | undefined;
        muted?: boolean | undefined;
        loop?: boolean | undefined;
        autoplay?: boolean | undefined;
    }>;
    readonly add_audio: z.ZodObject<{
        projectId: z.ZodString;
        src: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        delayMs: z.ZodOptional<z.ZodNumber>;
        loop: z.ZodOptional<z.ZodBoolean>;
        muted: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        src: string;
        name?: string | undefined;
        delayMs?: number | undefined;
        muted?: boolean | undefined;
        loop?: boolean | undefined;
    }, {
        projectId: string;
        src: string;
        name?: string | undefined;
        delayMs?: number | undefined;
        muted?: boolean | undefined;
        loop?: boolean | undefined;
    }>;
    readonly add_typewriter_text: z.ZodObject<{
        projectId: z.ZodString;
        text: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        fontSize: z.ZodOptional<z.ZodNumber>;
        color: z.ZodOptional<z.ZodString>;
        charDelayMs: z.ZodOptional<z.ZodNumber>;
        cursor: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        text: string;
        color?: string | undefined;
        fontSize?: number | undefined;
        name?: string | undefined;
        x?: number | undefined;
        y?: number | undefined;
        charDelayMs?: number | undefined;
        cursor?: boolean | undefined;
    }, {
        projectId: string;
        text: string;
        color?: string | undefined;
        fontSize?: number | undefined;
        name?: string | undefined;
        x?: number | undefined;
        y?: number | undefined;
        charDelayMs?: number | undefined;
        cursor?: boolean | undefined;
    }>;
    readonly add_scene_transition: z.ZodObject<{
        projectId: z.ZodString;
        type: z.ZodEnum<["dissolve", "wipe-left", "wipe-right", "wipe-up", "wipe-down", "slide-left", "slide-right", "zoom-in", "zoom-out", "flash"]>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        delayMs: z.ZodOptional<z.ZodNumber>;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "dissolve" | "wipe-left" | "wipe-right" | "wipe-up" | "wipe-down" | "slide-left" | "slide-right" | "zoom-in" | "zoom-out" | "flash";
        projectId: string;
        color?: string | undefined;
        durationMs?: number | undefined;
        delayMs?: number | undefined;
    }, {
        type: "dissolve" | "wipe-left" | "wipe-right" | "wipe-up" | "wipe-down" | "slide-left" | "slide-right" | "zoom-in" | "zoom-out" | "flash";
        projectId: string;
        color?: string | undefined;
        durationMs?: number | undefined;
        delayMs?: number | undefined;
    }>;
    readonly add_camera_move: z.ZodObject<{
        projectId: z.ZodString;
        type: z.ZodEnum<["pan-left", "pan-right", "pan-up", "pan-down", "zoom-in", "zoom-out", "zoom-pan"]>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        delayMs: z.ZodOptional<z.ZodNumber>;
        intensity: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "zoom-in" | "zoom-out" | "pan-left" | "pan-right" | "pan-up" | "pan-down" | "zoom-pan";
        projectId: string;
        durationMs?: number | undefined;
        delayMs?: number | undefined;
        intensity?: number | undefined;
    }, {
        type: "zoom-in" | "zoom-out" | "pan-left" | "pan-right" | "pan-up" | "pan-down" | "zoom-pan";
        projectId: string;
        durationMs?: number | undefined;
        delayMs?: number | undefined;
        intensity?: number | undefined;
    }>;
    readonly set_blend_mode: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        blendMode: z.ZodEnum<["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"]>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        blendMode: "color" | "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "color-dodge" | "color-burn" | "hard-light" | "soft-light" | "difference" | "exclusion" | "hue" | "saturation" | "luminosity";
    }, {
        projectId: string;
        componentId: string;
        blendMode: "color" | "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "color-dodge" | "color-burn" | "hard-light" | "soft-light" | "difference" | "exclusion" | "hue" | "saturation" | "luminosity";
    }>;
    readonly set_artboard: z.ZodObject<{
        projectId: z.ZodString;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        background: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        width?: number | undefined;
        height?: number | undefined;
        background?: string | undefined;
    }, {
        projectId: string;
        width?: number | undefined;
        height?: number | undefined;
        background?: string | undefined;
    }>;
    readonly set_layer_opacity: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        opacity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        opacity: number;
        projectId: string;
        componentId: string;
    }, {
        opacity: number;
        projectId: string;
        componentId: string;
    }>;
    readonly set_rulers: z.ZodObject<{
        projectId: z.ZodString;
        show: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        show: boolean;
    }, {
        projectId: string;
        show?: boolean | undefined;
    }>;
    readonly nudge_component: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        dx: z.ZodNumber;
        dy: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        dx: number;
        dy: number;
    }, {
        projectId: string;
        componentId: string;
        dx: number;
        dy: number;
    }>;
    readonly copy_to_clipboard: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentIds?: string[] | undefined;
    }, {
        projectId: string;
        componentIds?: string[] | undefined;
    }>;
    readonly paste_from_clipboard: z.ZodObject<{
        projectId: z.ZodString;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        x?: number | undefined;
        y?: number | undefined;
    }, {
        projectId: string;
        x?: number | undefined;
        y?: number | undefined;
    }>;
    readonly capture_state: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        projectId: string;
    }, {
        name: string;
        projectId: string;
    }>;
    readonly apply_state: z.ZodObject<{
        projectId: z.ZodString;
        stateId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        stateId: string;
    }, {
        projectId: string;
        stateId: string;
    }>;
    readonly add_transition: z.ZodObject<{
        projectId: z.ZodString;
        fromStateId: z.ZodString;
        toStateId: z.ZodString;
        trigger: z.ZodDefault<z.ZodEnum<["onClick", "onHover", "onLoad", "manual"]>>;
        durationMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        durationMs: number;
        trigger: "onLoad" | "onClick" | "onHover" | "manual";
        fromStateId: string;
        toStateId: string;
    }, {
        projectId: string;
        fromStateId: string;
        toStateId: string;
        durationMs?: number | undefined;
        trigger?: "onLoad" | "onClick" | "onHover" | "manual" | undefined;
    }>;
    readonly remove_state: z.ZodObject<{
        projectId: z.ZodString;
        stateId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        stateId: string;
    }, {
        projectId: string;
        stateId: string;
    }>;
    readonly list_states: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly toggle_auto_keyframe: z.ZodObject<{
        projectId: z.ZodString;
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        enabled?: boolean | undefined;
    }, {
        projectId: string;
        enabled?: boolean | undefined;
    }>;
    readonly add_listener: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        eventType: z.ZodEnum<["pointerEnter", "pointerLeave", "pointerDown", "pointerUp", "click"]>;
        actionType: z.ZodEnum<["applyState", "playAnimation", "setProperty"]>;
        target: z.ZodString;
        property: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        target: string;
        eventType: "pointerEnter" | "pointerLeave" | "pointerDown" | "pointerUp" | "click";
        actionType: "applyState" | "playAnimation" | "setProperty";
        value?: string | number | undefined;
        property?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        target: string;
        eventType: "pointerEnter" | "pointerLeave" | "pointerDown" | "pointerUp" | "click";
        actionType: "applyState" | "playAnimation" | "setProperty";
        value?: string | number | undefined;
        property?: string | undefined;
    }>;
    readonly remove_listener: z.ZodObject<{
        projectId: z.ZodString;
        listenerId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        listenerId: string;
    }, {
        projectId: string;
        listenerId: string;
    }>;
    readonly list_listeners: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId?: string | undefined;
    }, {
        projectId: string;
        componentId?: string | undefined;
    }>;
    readonly set_keyframe_offset: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        keyframeIndex: z.ZodNumber;
        offset: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        offset: number;
        projectId: string;
        componentId: string;
        keyframeIndex: number;
    }, {
        offset: number;
        projectId: string;
        componentId: string;
        keyframeIndex: number;
    }>;
    readonly add_marker: z.ZodObject<{
        projectId: z.ZodString;
        timeMs: z.ZodNumber;
        label: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        timeMs: number;
        label?: string | undefined;
    }, {
        projectId: string;
        timeMs: number;
        label?: string | undefined;
    }>;
    readonly remove_marker: z.ZodObject<{
        projectId: z.ZodString;
        markerId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        markerId: string;
    }, {
        projectId: string;
        markerId: string;
    }>;
    readonly list_markers: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly reverse_keyframes: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
    }, {
        projectId: string;
        componentId: string;
    }>;
    readonly solo_layer: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
    }, {
        projectId: string;
        componentId: string;
    }>;
    readonly export_html: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly export_video: z.ZodObject<{
        projectId: z.ZodString;
        format: z.ZodDefault<z.ZodEnum<["mp4", "gif", "webm"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        format: "mp4" | "gif" | "webm";
    }, {
        projectId: string;
        format?: "mp4" | "gif" | "webm" | undefined;
    }>;
    readonly export_skill: z.ZodObject<{
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
    readonly export_code: z.ZodObject<{
        projectId: z.ZodString;
        format: z.ZodDefault<z.ZodEnum<["css", "json", "react"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        format: "json" | "css" | "react";
    }, {
        projectId: string;
        format?: "json" | "css" | "react" | undefined;
    }>;
    readonly set_parent: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        parentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        parentId: string;
        componentId: string;
    }, {
        projectId: string;
        parentId: string;
        componentId: string;
    }>;
    readonly remove_parent: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
    }, {
        projectId: string;
        componentId: string;
    }>;
    readonly list_hierarchy: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly add_constraint: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        targetId: z.ZodString;
        type: z.ZodEnum<["position", "rotation", "scale", "look-at"]>;
        strength: z.ZodDefault<z.ZodNumber>;
        axis: z.ZodDefault<z.ZodEnum<["x", "y", "both"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "scale" | "rotation" | "position" | "look-at";
        projectId: string;
        componentId: string;
        targetId: string;
        strength: number;
        axis: "both" | "x" | "y";
    }, {
        type: "scale" | "rotation" | "position" | "look-at";
        projectId: string;
        componentId: string;
        targetId: string;
        strength?: number | undefined;
        axis?: "both" | "x" | "y" | undefined;
    }>;
    readonly remove_constraint: z.ZodObject<{
        projectId: z.ZodString;
        constraintId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        constraintId: string;
    }, {
        projectId: string;
        constraintId: string;
    }>;
    readonly list_constraints: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly add_clip: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodString;
        startMs: z.ZodNumber;
        endMs: z.ZodNumber;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        projectId: string;
        startMs: number;
        endMs: number;
        color?: string | undefined;
    }, {
        name: string;
        projectId: string;
        startMs: number;
        endMs: number;
        color?: string | undefined;
    }>;
    readonly remove_clip: z.ZodObject<{
        projectId: z.ZodString;
        clipId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        clipId: string;
    }, {
        projectId: string;
        clipId: string;
    }>;
    readonly list_clips: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly play_clip: z.ZodObject<{
        projectId: z.ZodString;
        clipId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        clipId: string;
    }, {
        projectId: string;
        clipId: string;
    }>;
    readonly set_filter: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        filter: z.ZodString;
        value: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, "strip", z.ZodTypeAny, {
        value: string | number;
        filter: string;
        projectId: string;
        componentId: string;
    }, {
        value: string | number;
        filter: string;
        projectId: string;
        componentId: string;
    }>;
    readonly set_3d_transform: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        perspective: z.ZodOptional<z.ZodNumber>;
        rotateX: z.ZodOptional<z.ZodNumber>;
        rotateY: z.ZodOptional<z.ZodNumber>;
        rotateZ: z.ZodOptional<z.ZodNumber>;
        translateZ: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        translateZ?: number | undefined;
        rotateX?: number | undefined;
        rotateY?: number | undefined;
        rotateZ?: number | undefined;
        perspective?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        translateZ?: number | undefined;
        rotateX?: number | undefined;
        rotateY?: number | undefined;
        rotateZ?: number | undefined;
        perspective?: number | undefined;
    }>;
    readonly set_adjustment_layer: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        enabled: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        enabled: boolean;
    }, {
        projectId: string;
        componentId: string;
        enabled: boolean;
    }>;
    readonly create_precomp: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodArray<z.ZodString, "many">;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentIds: string[];
        name?: string | undefined;
    }, {
        projectId: string;
        componentIds: string[];
        name?: string | undefined;
    }>;
    readonly ungroup_precomp: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentIds: string[];
    }, {
        projectId: string;
        componentIds: string[];
    }>;
    readonly enable_motion_blur: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        intensity: z.ZodDefault<z.ZodNumber>;
        shutterAngle: z.ZodDefault<z.ZodNumber>;
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        enabled: boolean;
        intensity: number;
        shutterAngle: number;
    }, {
        projectId: string;
        componentId: string;
        enabled?: boolean | undefined;
        intensity?: number | undefined;
        shutterAngle?: number | undefined;
    }>;
    readonly add_null_object: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        name?: string | undefined;
        x?: number | undefined;
        y?: number | undefined;
    }, {
        projectId: string;
        name?: string | undefined;
        x?: number | undefined;
        y?: number | undefined;
    }>;
    readonly trim_path: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        start: z.ZodDefault<z.ZodNumber>;
        end: z.ZodDefault<z.ZodNumber>;
        offset: z.ZodDefault<z.ZodNumber>;
        animate: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        offset: number;
        projectId: string;
        componentId: string;
        start: number;
        end: number;
        animate: boolean;
    }, {
        projectId: string;
        componentId: string;
        offset?: number | undefined;
        start?: number | undefined;
        end?: number | undefined;
        animate?: boolean | undefined;
    }>;
    readonly add_repeater: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        copies: z.ZodDefault<z.ZodNumber>;
        offset: z.ZodDefault<z.ZodObject<{
            x: z.ZodDefault<z.ZodNumber>;
            y: z.ZodDefault<z.ZodNumber>;
            rotate: z.ZodDefault<z.ZodNumber>;
            scale: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            scale: number;
            rotate: number;
            x: number;
            y: number;
        }, {
            scale?: number | undefined;
            rotate?: number | undefined;
            x?: number | undefined;
            y?: number | undefined;
        }>>;
        decay: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        offset: {
            scale: number;
            rotate: number;
            x: number;
            y: number;
        };
        projectId: string;
        componentId: string;
        copies: number;
        decay: number;
    }, {
        projectId: string;
        componentId: string;
        offset?: {
            scale?: number | undefined;
            rotate?: number | undefined;
            x?: number | undefined;
            y?: number | undefined;
        } | undefined;
        copies?: number | undefined;
        decay?: number | undefined;
    }>;
    readonly add_echo: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        copies: z.ZodDefault<z.ZodNumber>;
        delayMs: z.ZodDefault<z.ZodNumber>;
        decay: z.ZodDefault<z.ZodNumber>;
        scaleDecay: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        delayMs: number;
        componentId: string;
        copies: number;
        decay: number;
        scaleDecay: number;
    }, {
        projectId: string;
        componentId: string;
        delayMs?: number | undefined;
        copies?: number | undefined;
        decay?: number | undefined;
        scaleDecay?: number | undefined;
    }>;
    readonly set_time_remap: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        rate: z.ZodNumber;
        freezeAtMs: z.ZodOptional<z.ZodNumber>;
        reverseDirection: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        rate: number;
        reverseDirection: boolean;
        freezeAtMs?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        rate: number;
        freezeAtMs?: number | undefined;
        reverseDirection?: boolean | undefined;
    }>;
    readonly add_layer_effect: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        effect: z.ZodEnum<["drop-shadow", "inner-shadow", "outer-glow", "inner-glow", "stroke"]>;
        color: z.ZodDefault<z.ZodString>;
        distance: z.ZodDefault<z.ZodNumber>;
        blur: z.ZodDefault<z.ZodNumber>;
        opacity: z.ZodDefault<z.ZodNumber>;
        spread: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        opacity: number;
        blur: number;
        color: string;
        projectId: string;
        componentId: string;
        effect: "drop-shadow" | "inner-shadow" | "outer-glow" | "inner-glow" | "stroke";
        distance: number;
        spread: number;
    }, {
        projectId: string;
        componentId: string;
        effect: "drop-shadow" | "inner-shadow" | "outer-glow" | "inner-glow" | "stroke";
        opacity?: number | undefined;
        blur?: number | undefined;
        color?: string | undefined;
        distance?: number | undefined;
        spread?: number | undefined;
    }>;
    readonly add_mask: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        shape: z.ZodDefault<z.ZodEnum<["rectangle", "ellipse", "path"]>>;
        mode: z.ZodDefault<z.ZodEnum<["add", "subtract", "intersect", "difference", "lighten", "darken"]>>;
        x: z.ZodDefault<z.ZodNumber>;
        y: z.ZodDefault<z.ZodNumber>;
        width: z.ZodDefault<z.ZodNumber>;
        height: z.ZodDefault<z.ZodNumber>;
        path: z.ZodOptional<z.ZodString>;
        feather: z.ZodDefault<z.ZodNumber>;
        expansion: z.ZodDefault<z.ZodNumber>;
        inverted: z.ZodDefault<z.ZodBoolean>;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
        shape: "path" | "ellipse" | "rectangle";
        projectId: string;
        componentId: string;
        mode: "darken" | "lighten" | "difference" | "add" | "subtract" | "intersect";
        x: number;
        y: number;
        feather: number;
        expansion: number;
        inverted: boolean;
        path?: string | undefined;
        name?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        path?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        name?: string | undefined;
        shape?: "path" | "ellipse" | "rectangle" | undefined;
        mode?: "darken" | "lighten" | "difference" | "add" | "subtract" | "intersect" | undefined;
        x?: number | undefined;
        y?: number | undefined;
        feather?: number | undefined;
        expansion?: number | undefined;
        inverted?: boolean | undefined;
    }>;
    readonly set_mask_mode: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        maskIndex: z.ZodDefault<z.ZodNumber>;
        mode: z.ZodEnum<["add", "subtract", "intersect", "difference", "lighten", "darken"]>;
        inverted: z.ZodOptional<z.ZodBoolean>;
        feather: z.ZodOptional<z.ZodNumber>;
        expansion: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        mode: "darken" | "lighten" | "difference" | "add" | "subtract" | "intersect";
        maskIndex: number;
        feather?: number | undefined;
        expansion?: number | undefined;
        inverted?: boolean | undefined;
    }, {
        projectId: string;
        componentId: string;
        mode: "darken" | "lighten" | "difference" | "add" | "subtract" | "intersect";
        feather?: number | undefined;
        expansion?: number | undefined;
        inverted?: boolean | undefined;
        maskIndex?: number | undefined;
    }>;
    readonly set_track_matte: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        matteComponentId: z.ZodString;
        mode: z.ZodDefault<z.ZodEnum<["alpha", "alpha-inverted", "luma", "luma-inverted"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        mode: "alpha" | "alpha-inverted" | "luma" | "luma-inverted";
        matteComponentId: string;
    }, {
        projectId: string;
        componentId: string;
        matteComponentId: string;
        mode?: "alpha" | "alpha-inverted" | "luma" | "luma-inverted" | undefined;
    }>;
    readonly create_shape_layer: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        shape: z.ZodEnum<["rectangle", "ellipse", "polygon", "star", "line", "path"]>;
        x: z.ZodDefault<z.ZodNumber>;
        y: z.ZodDefault<z.ZodNumber>;
        width: z.ZodDefault<z.ZodNumber>;
        height: z.ZodDefault<z.ZodNumber>;
        sides: z.ZodDefault<z.ZodNumber>;
        points: z.ZodDefault<z.ZodNumber>;
        innerRadius: z.ZodOptional<z.ZodNumber>;
        path: z.ZodOptional<z.ZodString>;
        fill: z.ZodDefault<z.ZodString>;
        stroke: z.ZodOptional<z.ZodString>;
        strokeWidth: z.ZodDefault<z.ZodNumber>;
        cornerRadius: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        fill: string;
        width: number;
        height: number;
        shape: "path" | "line" | "ellipse" | "rectangle" | "star" | "polygon";
        projectId: string;
        rotation: number;
        x: number;
        y: number;
        sides: number;
        points: number;
        strokeWidth: number;
        cornerRadius: number;
        path?: string | undefined;
        name?: string | undefined;
        stroke?: string | undefined;
        innerRadius?: number | undefined;
    }, {
        shape: "path" | "line" | "ellipse" | "rectangle" | "star" | "polygon";
        projectId: string;
        path?: string | undefined;
        fill?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        name?: string | undefined;
        rotation?: number | undefined;
        x?: number | undefined;
        y?: number | undefined;
        stroke?: string | undefined;
        sides?: number | undefined;
        points?: number | undefined;
        innerRadius?: number | undefined;
        strokeWidth?: number | undefined;
        cornerRadius?: number | undefined;
    }>;
    readonly posterize_time: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        fps: z.ZodNumber;
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        enabled: boolean;
        fps: number;
    }, {
        projectId: string;
        componentId: string;
        fps: number;
        enabled?: boolean | undefined;
    }>;
    readonly add_text_animator: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        property: z.ZodDefault<z.ZodEnum<["position", "scale", "rotation", "opacity", "color"]>>;
        rangeStart: z.ZodDefault<z.ZodNumber>;
        rangeEnd: z.ZodDefault<z.ZodNumber>;
        unit: z.ZodDefault<z.ZodEnum<["character", "word"]>>;
        offset: z.ZodDefault<z.ZodNumber>;
        valueDelta: z.ZodDefault<z.ZodNumber>;
        staggerMs: z.ZodDefault<z.ZodNumber>;
        easing: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        offset: number;
        easing: string;
        projectId: string;
        componentId: string;
        property: "scale" | "opacity" | "color" | "rotation" | "position";
        rangeStart: number;
        rangeEnd: number;
        unit: "character" | "word";
        valueDelta: number;
        staggerMs: number;
    }, {
        projectId: string;
        componentId: string;
        offset?: number | undefined;
        easing?: string | undefined;
        property?: "scale" | "opacity" | "color" | "rotation" | "position" | undefined;
        rangeStart?: number | undefined;
        rangeEnd?: number | undefined;
        unit?: "character" | "word" | undefined;
        valueDelta?: number | undefined;
        staggerMs?: number | undefined;
    }>;
    readonly set_keyframe_interpolation: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        keyframeIndex: z.ZodNumber;
        interpolation: z.ZodEnum<["linear", "bezier", "hold", "auto-bezier", "continuous"]>;
        roving: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        keyframeIndex: number;
        interpolation: "linear" | "bezier" | "hold" | "auto-bezier" | "continuous";
        roving?: boolean | undefined;
    }, {
        projectId: string;
        componentId: string;
        keyframeIndex: number;
        interpolation: "linear" | "bezier" | "hold" | "auto-bezier" | "continuous";
        roving?: boolean | undefined;
    }>;
    readonly set_expression: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        property: z.ZodString;
        expression: z.ZodString;
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        property: string;
        enabled: boolean;
        expression: string;
    }, {
        projectId: string;
        componentId: string;
        property: string;
        expression: string;
        enabled?: boolean | undefined;
    }>;
    readonly set_gradient_fill: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        type: z.ZodDefault<z.ZodEnum<["linear", "radial"]>>;
        angle: z.ZodDefault<z.ZodNumber>;
        stops: z.ZodArray<z.ZodObject<{
            color: z.ZodString;
            position: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            color: string;
            position: number;
        }, {
            color: string;
            position?: number | undefined;
        }>, "many">;
        cx: z.ZodOptional<z.ZodNumber>;
        cy: z.ZodOptional<z.ZodNumber>;
        radius: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "linear" | "radial";
        projectId: string;
        componentId: string;
        angle: number;
        stops: {
            color: string;
            position: number;
        }[];
        cx?: number | undefined;
        cy?: number | undefined;
        radius?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        stops: {
            color: string;
            position?: number | undefined;
        }[];
        type?: "linear" | "radial" | undefined;
        angle?: number | undefined;
        cx?: number | undefined;
        cy?: number | undefined;
        radius?: number | undefined;
    }>;
    readonly set_gradient_stroke: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        type: z.ZodDefault<z.ZodEnum<["linear", "radial"]>>;
        angle: z.ZodDefault<z.ZodNumber>;
        width: z.ZodDefault<z.ZodNumber>;
        stops: z.ZodArray<z.ZodObject<{
            color: z.ZodString;
            position: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            color: string;
            position: number;
        }, {
            color: string;
            position?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "linear" | "radial";
        width: number;
        projectId: string;
        componentId: string;
        angle: number;
        stops: {
            color: string;
            position: number;
        }[];
    }, {
        projectId: string;
        componentId: string;
        stops: {
            color: string;
            position?: number | undefined;
        }[];
        type?: "linear" | "radial" | undefined;
        width?: number | undefined;
        angle?: number | undefined;
    }>;
    readonly apply_wiggle: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        property: z.ZodDefault<z.ZodEnum<["translateX", "translateY", "rotate", "scale", "opacity", "skewX", "skewY"]>>;
        frequency: z.ZodDefault<z.ZodNumber>;
        amplitude: z.ZodDefault<z.ZodNumber>;
        octaves: z.ZodDefault<z.ZodNumber>;
        seed: z.ZodDefault<z.ZodNumber>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        sampleCount: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        property: "translateX" | "translateY" | "scale" | "rotate" | "skewX" | "skewY" | "opacity";
        frequency: number;
        amplitude: number;
        octaves: number;
        seed: number;
        sampleCount: number;
        durationMs?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        durationMs?: number | undefined;
        property?: "translateX" | "translateY" | "scale" | "rotate" | "skewX" | "skewY" | "opacity" | undefined;
        frequency?: number | undefined;
        amplitude?: number | undefined;
        octaves?: number | undefined;
        seed?: number | undefined;
        sampleCount?: number | undefined;
    }>;
    readonly add_particle_emitter: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        x: z.ZodDefault<z.ZodNumber>;
        y: z.ZodDefault<z.ZodNumber>;
        width: z.ZodDefault<z.ZodNumber>;
        height: z.ZodDefault<z.ZodNumber>;
        rate: z.ZodDefault<z.ZodNumber>;
        lifespan: z.ZodDefault<z.ZodNumber>;
        gravity: z.ZodDefault<z.ZodNumber>;
        spread: z.ZodDefault<z.ZodNumber>;
        speed: z.ZodDefault<z.ZodNumber>;
        startColor: z.ZodDefault<z.ZodString>;
        endColor: z.ZodDefault<z.ZodString>;
        startSize: z.ZodDefault<z.ZodNumber>;
        endSize: z.ZodDefault<z.ZodNumber>;
        startOpacity: z.ZodDefault<z.ZodNumber>;
        endOpacity: z.ZodDefault<z.ZodNumber>;
        blendMode: z.ZodDefault<z.ZodEnum<["normal", "screen", "lighter", "add"]>>;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
        projectId: string;
        x: number;
        y: number;
        blendMode: "normal" | "screen" | "add" | "lighter";
        rate: number;
        spread: number;
        lifespan: number;
        gravity: number;
        speed: number;
        startColor: string;
        endColor: string;
        startSize: number;
        endSize: number;
        startOpacity: number;
        endOpacity: number;
        name?: string | undefined;
    }, {
        projectId: string;
        width?: number | undefined;
        height?: number | undefined;
        name?: string | undefined;
        x?: number | undefined;
        y?: number | undefined;
        blendMode?: "normal" | "screen" | "add" | "lighter" | undefined;
        rate?: number | undefined;
        spread?: number | undefined;
        lifespan?: number | undefined;
        gravity?: number | undefined;
        speed?: number | undefined;
        startColor?: string | undefined;
        endColor?: string | undefined;
        startSize?: number | undefined;
        endSize?: number | undefined;
        startOpacity?: number | undefined;
        endOpacity?: number | undefined;
    }>;
    readonly add_camera: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        positionX: z.ZodDefault<z.ZodNumber>;
        positionY: z.ZodDefault<z.ZodNumber>;
        positionZ: z.ZodDefault<z.ZodNumber>;
        focalLength: z.ZodDefault<z.ZodNumber>;
        depthOfField: z.ZodDefault<z.ZodNumber>;
        rotateX: z.ZodDefault<z.ZodNumber>;
        rotateY: z.ZodDefault<z.ZodNumber>;
        rotateZ: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        rotateX: number;
        rotateY: number;
        rotateZ: number;
        projectId: string;
        positionX: number;
        positionY: number;
        positionZ: number;
        focalLength: number;
        depthOfField: number;
        name?: string | undefined;
    }, {
        projectId: string;
        rotateX?: number | undefined;
        rotateY?: number | undefined;
        rotateZ?: number | undefined;
        name?: string | undefined;
        positionX?: number | undefined;
        positionY?: number | undefined;
        positionZ?: number | undefined;
        focalLength?: number | undefined;
        depthOfField?: number | undefined;
    }>;
    readonly set_camera_transform: z.ZodObject<{
        projectId: z.ZodString;
        positionX: z.ZodOptional<z.ZodNumber>;
        positionY: z.ZodOptional<z.ZodNumber>;
        positionZ: z.ZodOptional<z.ZodNumber>;
        focalLength: z.ZodOptional<z.ZodNumber>;
        depthOfField: z.ZodOptional<z.ZodNumber>;
        rotateX: z.ZodOptional<z.ZodNumber>;
        rotateY: z.ZodOptional<z.ZodNumber>;
        rotateZ: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        rotateX?: number | undefined;
        rotateY?: number | undefined;
        rotateZ?: number | undefined;
        positionX?: number | undefined;
        positionY?: number | undefined;
        positionZ?: number | undefined;
        focalLength?: number | undefined;
        depthOfField?: number | undefined;
    }, {
        projectId: string;
        rotateX?: number | undefined;
        rotateY?: number | undefined;
        rotateZ?: number | undefined;
        positionX?: number | undefined;
        positionY?: number | undefined;
        positionZ?: number | undefined;
        focalLength?: number | undefined;
        depthOfField?: number | undefined;
    }>;
    readonly bind_audio_to_property: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        audioComponentId: z.ZodString;
        property: z.ZodDefault<z.ZodEnum<["opacity", "scale", "translateX", "translateY", "rotate", "backgroundColor"]>>;
        band: z.ZodDefault<z.ZodEnum<["bass", "mid", "treble", "overall"]>>;
        min: z.ZodDefault<z.ZodNumber>;
        max: z.ZodDefault<z.ZodNumber>;
        smoothing: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        property: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "backgroundColor";
        audioComponentId: string;
        band: "bass" | "mid" | "treble" | "overall";
        min: number;
        max: number;
        smoothing: number;
    }, {
        projectId: string;
        componentId: string;
        audioComponentId: string;
        property?: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "backgroundColor" | undefined;
        band?: "bass" | "mid" | "treble" | "overall" | undefined;
        min?: number | undefined;
        max?: number | undefined;
        smoothing?: number | undefined;
    }>;
    readonly unbind_audio: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
    }, {
        projectId: string;
        componentId: string;
    }>;
    readonly add_puppet_pin: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        x: number;
        y: number;
        name?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        x: number;
        y: number;
        name?: string | undefined;
    }>;
    readonly apply_mesh_warp: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        turbulence: z.ZodDefault<z.ZodNumber>;
        scale: z.ZodDefault<z.ZodNumber>;
        octaves: z.ZodDefault<z.ZodNumber>;
        animated: z.ZodDefault<z.ZodBoolean>;
        speed: z.ZodDefault<z.ZodNumber>;
        seed: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        scale: number;
        projectId: string;
        componentId: string;
        octaves: number;
        seed: number;
        speed: number;
        turbulence: number;
        animated: boolean;
    }, {
        projectId: string;
        componentId: string;
        scale?: number | undefined;
        octaves?: number | undefined;
        seed?: number | undefined;
        speed?: number | undefined;
        turbulence?: number | undefined;
        animated?: boolean | undefined;
    }>;
    readonly remove_mesh_warp: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
    }, {
        projectId: string;
        componentId: string;
    }>;
    readonly add_light: z.ZodObject<{
        projectId: z.ZodString;
        type: z.ZodEnum<["parallel", "point", "spot", "ambient"]>;
        name: z.ZodOptional<z.ZodString>;
        positionX: z.ZodDefault<z.ZodNumber>;
        positionY: z.ZodDefault<z.ZodNumber>;
        positionZ: z.ZodDefault<z.ZodNumber>;
        targetX: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        targetY: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        targetZ: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        color: z.ZodDefault<z.ZodString>;
        intensity: z.ZodDefault<z.ZodNumber>;
        coneAngle: z.ZodOptional<z.ZodNumber>;
        coneFeather: z.ZodOptional<z.ZodNumber>;
        castShadow: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "parallel" | "point" | "spot" | "ambient";
        color: string;
        projectId: string;
        intensity: number;
        positionX: number;
        positionY: number;
        positionZ: number;
        castShadow: boolean;
        name?: string | undefined;
        targetX?: number | undefined;
        targetY?: number | undefined;
        targetZ?: number | undefined;
        coneAngle?: number | undefined;
        coneFeather?: number | undefined;
    }, {
        type: "parallel" | "point" | "spot" | "ambient";
        projectId: string;
        color?: string | undefined;
        name?: string | undefined;
        intensity?: number | undefined;
        positionX?: number | undefined;
        positionY?: number | undefined;
        positionZ?: number | undefined;
        targetX?: number | undefined;
        targetY?: number | undefined;
        targetZ?: number | undefined;
        coneAngle?: number | undefined;
        coneFeather?: number | undefined;
        castShadow?: boolean | undefined;
    }>;
    readonly set_light_transform: z.ZodObject<{
        projectId: z.ZodString;
        lightId: z.ZodString;
        positionX: z.ZodOptional<z.ZodNumber>;
        positionY: z.ZodOptional<z.ZodNumber>;
        positionZ: z.ZodOptional<z.ZodNumber>;
        targetX: z.ZodOptional<z.ZodNumber>;
        targetY: z.ZodOptional<z.ZodNumber>;
        targetZ: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        lightId: string;
        positionX?: number | undefined;
        positionY?: number | undefined;
        positionZ?: number | undefined;
        targetX?: number | undefined;
        targetY?: number | undefined;
        targetZ?: number | undefined;
    }, {
        projectId: string;
        lightId: string;
        positionX?: number | undefined;
        positionY?: number | undefined;
        positionZ?: number | undefined;
        targetX?: number | undefined;
        targetY?: number | undefined;
        targetZ?: number | undefined;
    }>;
    readonly set_light_properties: z.ZodObject<{
        projectId: z.ZodString;
        lightId: z.ZodString;
        color: z.ZodOptional<z.ZodString>;
        intensity: z.ZodOptional<z.ZodNumber>;
        coneAngle: z.ZodOptional<z.ZodNumber>;
        coneFeather: z.ZodOptional<z.ZodNumber>;
        castShadow: z.ZodOptional<z.ZodBoolean>;
        falloff: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        lightId: string;
        color?: string | undefined;
        intensity?: number | undefined;
        coneAngle?: number | undefined;
        coneFeather?: number | undefined;
        castShadow?: boolean | undefined;
        falloff?: number | undefined;
    }, {
        projectId: string;
        lightId: string;
        color?: string | undefined;
        intensity?: number | undefined;
        coneAngle?: number | undefined;
        coneFeather?: number | undefined;
        castShadow?: boolean | undefined;
        falloff?: number | undefined;
    }>;
    readonly remove_light: z.ZodObject<{
        projectId: z.ZodString;
        lightId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        lightId: string;
    }, {
        projectId: string;
        lightId: string;
    }>;
    readonly cast_shadow: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        enabled: z.ZodDefault<z.ZodBoolean>;
        shadowOpacity: z.ZodDefault<z.ZodNumber>;
        shadowBlur: z.ZodDefault<z.ZodNumber>;
        shadowOffsetX: z.ZodDefault<z.ZodNumber>;
        shadowOffsetY: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        enabled: boolean;
        shadowOpacity: number;
        shadowBlur: number;
        shadowOffsetX: number;
        shadowOffsetY: number;
    }, {
        projectId: string;
        componentId: string;
        enabled?: boolean | undefined;
        shadowOpacity?: number | undefined;
        shadowBlur?: number | undefined;
        shadowOffsetX?: number | undefined;
        shadowOffsetY?: number | undefined;
    }>;
    readonly set_camera_dof: z.ZodObject<{
        projectId: z.ZodString;
        enabled: z.ZodDefault<z.ZodBoolean>;
        focusDistance: z.ZodDefault<z.ZodNumber>;
        aperture: z.ZodDefault<z.ZodNumber>;
        blurAmount: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        enabled: boolean;
        focusDistance: number;
        aperture: number;
        blurAmount: number;
    }, {
        projectId: string;
        enabled?: boolean | undefined;
        focusDistance?: number | undefined;
        aperture?: number | undefined;
        blurAmount?: number | undefined;
    }>;
    readonly set_levels: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        inputBlack: z.ZodDefault<z.ZodNumber>;
        inputWhite: z.ZodDefault<z.ZodNumber>;
        gamma: z.ZodDefault<z.ZodNumber>;
        outputBlack: z.ZodDefault<z.ZodNumber>;
        outputWhite: z.ZodDefault<z.ZodNumber>;
        channel: z.ZodDefault<z.ZodEnum<["rgb", "red", "green", "blue"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        inputBlack: number;
        inputWhite: number;
        gamma: number;
        outputBlack: number;
        outputWhite: number;
        channel: "rgb" | "red" | "green" | "blue";
    }, {
        projectId: string;
        componentId: string;
        inputBlack?: number | undefined;
        inputWhite?: number | undefined;
        gamma?: number | undefined;
        outputBlack?: number | undefined;
        outputWhite?: number | undefined;
        channel?: "rgb" | "red" | "green" | "blue" | undefined;
    }>;
    readonly set_curves: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        channel: z.ZodDefault<z.ZodEnum<["rgb", "red", "green", "blue"]>>;
        points: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        points: {
            x: number;
            y: number;
        }[];
        channel: "rgb" | "red" | "green" | "blue";
    }, {
        projectId: string;
        componentId: string;
        points: {
            x: number;
            y: number;
        }[];
        channel?: "rgb" | "red" | "green" | "blue" | undefined;
    }>;
    readonly set_color_balance: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        shadowRed: z.ZodDefault<z.ZodNumber>;
        shadowGreen: z.ZodDefault<z.ZodNumber>;
        shadowBlue: z.ZodDefault<z.ZodNumber>;
        midtoneRed: z.ZodDefault<z.ZodNumber>;
        midtoneGreen: z.ZodDefault<z.ZodNumber>;
        midtoneBlue: z.ZodDefault<z.ZodNumber>;
        highlightRed: z.ZodDefault<z.ZodNumber>;
        highlightGreen: z.ZodDefault<z.ZodNumber>;
        highlightBlue: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        shadowRed: number;
        shadowGreen: number;
        shadowBlue: number;
        midtoneRed: number;
        midtoneGreen: number;
        midtoneBlue: number;
        highlightRed: number;
        highlightGreen: number;
        highlightBlue: number;
    }, {
        projectId: string;
        componentId: string;
        shadowRed?: number | undefined;
        shadowGreen?: number | undefined;
        shadowBlue?: number | undefined;
        midtoneRed?: number | undefined;
        midtoneGreen?: number | undefined;
        midtoneBlue?: number | undefined;
        highlightRed?: number | undefined;
        highlightGreen?: number | undefined;
        highlightBlue?: number | undefined;
    }>;
    readonly set_hue_saturation: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        hueShift: z.ZodDefault<z.ZodNumber>;
        saturation: z.ZodDefault<z.ZodNumber>;
        lightness: z.ZodDefault<z.ZodNumber>;
        channel: z.ZodDefault<z.ZodEnum<["master", "red", "yellow", "green", "cyan", "blue", "magenta"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        saturation: number;
        channel: "red" | "green" | "blue" | "master" | "yellow" | "cyan" | "magenta";
        hueShift: number;
        lightness: number;
    }, {
        projectId: string;
        componentId: string;
        saturation?: number | undefined;
        channel?: "red" | "green" | "blue" | "master" | "yellow" | "cyan" | "magenta" | undefined;
        hueShift?: number | undefined;
        lightness?: number | undefined;
    }>;
    readonly set_vibrance: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        vibrance: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        vibrance: number;
    }, {
        projectId: string;
        componentId: string;
        vibrance?: number | undefined;
    }>;
    readonly set_exposure: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        exposure: z.ZodDefault<z.ZodNumber>;
        offset: z.ZodDefault<z.ZodNumber>;
        gammaCorrection: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        offset: number;
        projectId: string;
        componentId: string;
        exposure: number;
        gammaCorrection: number;
    }, {
        projectId: string;
        componentId: string;
        offset?: number | undefined;
        exposure?: number | undefined;
        gammaCorrection?: number | undefined;
    }>;
    readonly set_shadow_highlight: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        shadowAmount: z.ZodDefault<z.ZodNumber>;
        shadowTonalWidth: z.ZodDefault<z.ZodNumber>;
        shadowRadius: z.ZodDefault<z.ZodNumber>;
        highlightAmount: z.ZodDefault<z.ZodNumber>;
        highlightTonalWidth: z.ZodDefault<z.ZodNumber>;
        highlightRadius: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        shadowAmount: number;
        shadowTonalWidth: number;
        shadowRadius: number;
        highlightAmount: number;
        highlightTonalWidth: number;
        highlightRadius: number;
    }, {
        projectId: string;
        componentId: string;
        shadowAmount?: number | undefined;
        shadowTonalWidth?: number | undefined;
        shadowRadius?: number | undefined;
        highlightAmount?: number | undefined;
        highlightTonalWidth?: number | undefined;
        highlightRadius?: number | undefined;
    }>;
    readonly set_selective_color: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        target: z.ZodEnum<["reds", "yellows", "greens", "cyans", "blues", "magentas", "whites", "neutrals", "blacks"]>;
        cyan: z.ZodDefault<z.ZodNumber>;
        magenta: z.ZodDefault<z.ZodNumber>;
        yellow: z.ZodDefault<z.ZodNumber>;
        black: z.ZodDefault<z.ZodNumber>;
        method: z.ZodDefault<z.ZodEnum<["relative", "absolute"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        target: "reds" | "yellows" | "greens" | "cyans" | "blues" | "magentas" | "whites" | "neutrals" | "blacks";
        yellow: number;
        cyan: number;
        magenta: number;
        black: number;
        method: "relative" | "absolute";
    }, {
        projectId: string;
        componentId: string;
        target: "reds" | "yellows" | "greens" | "cyans" | "blues" | "magentas" | "whites" | "neutrals" | "blacks";
        yellow?: number | undefined;
        cyan?: number | undefined;
        magenta?: number | undefined;
        black?: number | undefined;
        method?: "relative" | "absolute" | undefined;
    }>;
    readonly offset_path: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        amount: z.ZodNumber;
        miterLimit: z.ZodDefault<z.ZodNumber>;
        lineJoin: z.ZodDefault<z.ZodEnum<["miter", "round", "bevel"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        amount: number;
        miterLimit: number;
        lineJoin: "miter" | "round" | "bevel";
    }, {
        projectId: string;
        componentId: string;
        amount: number;
        miterLimit?: number | undefined;
        lineJoin?: "miter" | "round" | "bevel" | undefined;
    }>;
    readonly pucker_bloat: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        amount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        amount: number;
    }, {
        projectId: string;
        componentId: string;
        amount: number;
    }>;
    readonly round_corners: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        radius: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        radius: number;
    }, {
        projectId: string;
        componentId: string;
        radius: number;
    }>;
    readonly zig_zag: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        size: z.ZodDefault<z.ZodNumber>;
        ridges: z.ZodDefault<z.ZodNumber>;
        points: z.ZodDefault<z.ZodEnum<["corner", "smooth"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        size: number;
        points: "smooth" | "corner";
        ridges: number;
    }, {
        projectId: string;
        componentId: string;
        size?: number | undefined;
        points?: "smooth" | "corner" | undefined;
        ridges?: number | undefined;
    }>;
    readonly twist_path: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        angle: z.ZodNumber;
        centerX: z.ZodOptional<z.ZodNumber>;
        centerY: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        angle: number;
        centerX?: number | undefined;
        centerY?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        angle: number;
        centerX?: number | undefined;
        centerY?: number | undefined;
    }>;
    readonly merge_paths: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        mode: z.ZodEnum<["merge", "add", "subtract", "intersect", "exclude"]>;
        sourcePathIds: z.ZodArray<z.ZodString, "many">;
        resultName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        mode: "add" | "subtract" | "intersect" | "merge" | "exclude";
        sourcePathIds: string[];
        resultName?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        mode: "add" | "subtract" | "intersect" | "merge" | "exclude";
        sourcePathIds: string[];
        resultName?: string | undefined;
    }>;
    readonly shape_boolean: z.ZodObject<{
        projectId: z.ZodString;
        operation: z.ZodEnum<["union", "subtract", "intersect", "exclude"]>;
        targetComponentId: z.ZodString;
        sourceComponentId: z.ZodString;
        createNew: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        operation: "subtract" | "intersect" | "exclude" | "union";
        targetComponentId: string;
        sourceComponentId: string;
        createNew: boolean;
    }, {
        projectId: string;
        operation: "subtract" | "intersect" | "exclude" | "union";
        targetComponentId: string;
        sourceComponentId: string;
        createNew?: boolean | undefined;
    }>;
    readonly trim_path_multiple: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        segments: z.ZodArray<z.ZodObject<{
            start: z.ZodNumber;
            end: z.ZodNumber;
            offset: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            offset: number;
            start: number;
            end: number;
        }, {
            start: number;
            end: number;
            offset?: number | undefined;
        }>, "many">;
        reverse: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        reverse: boolean;
        projectId: string;
        componentId: string;
        segments: {
            offset: number;
            start: number;
            end: number;
        }[];
    }, {
        projectId: string;
        componentId: string;
        segments: {
            start: number;
            end: number;
            offset?: number | undefined;
        }[];
        reverse?: boolean | undefined;
    }>;
    readonly load_data_source: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodString;
        format: z.ZodDefault<z.ZodEnum<["json", "csv"]>>;
        data: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        projectId: string;
        format: "json" | "csv";
        data: string;
    }, {
        name: string;
        projectId: string;
        data: string;
        format?: "json" | "csv" | undefined;
    }>;
    readonly list_data_sources: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly bind_property_to_data: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        dataSourceName: z.ZodString;
        column: z.ZodString;
        property: z.ZodEnum<["translateX", "translateY", "scale", "rotate", "opacity", "width", "height", "backgroundColor"]>;
        mapping: z.ZodDefault<z.ZodEnum<["linear", "logarithmic", "quantize"]>>;
        rangeMin: z.ZodOptional<z.ZodNumber>;
        rangeMax: z.ZodOptional<z.ZodNumber>;
        sampleInterval: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        property: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "backgroundColor" | "width" | "height";
        dataSourceName: string;
        column: string;
        mapping: "linear" | "logarithmic" | "quantize";
        sampleInterval: number;
        rangeMin?: number | undefined;
        rangeMax?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        property: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "backgroundColor" | "width" | "height";
        dataSourceName: string;
        column: string;
        mapping?: "linear" | "logarithmic" | "quantize" | undefined;
        rangeMin?: number | undefined;
        rangeMax?: number | undefined;
        sampleInterval?: number | undefined;
    }>;
    readonly unbind_data: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        property: z.ZodOptional<z.ZodEnum<["translateX", "translateY", "scale", "rotate", "opacity", "width", "height", "backgroundColor"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        property?: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "backgroundColor" | "width" | "height" | undefined;
    }, {
        projectId: string;
        componentId: string;
        property?: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "backgroundColor" | "width" | "height" | undefined;
    }>;
    readonly data_driven_chart: z.ZodObject<{
        projectId: z.ZodString;
        dataSourceName: z.ZodString;
        chartType: z.ZodEnum<["bar", "line", "pie", "scatter", "area"]>;
        xColumn: z.ZodString;
        yColumn: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        animated: z.ZodDefault<z.ZodBoolean>;
        durationMs: z.ZodDefault<z.ZodNumber>;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        durationMs: number;
        animated: boolean;
        dataSourceName: string;
        chartType: "line" | "scatter" | "bar" | "pie" | "area";
        xColumn: string;
        yColumn: string;
        color?: string | undefined;
        name?: string | undefined;
    }, {
        projectId: string;
        dataSourceName: string;
        chartType: "line" | "scatter" | "bar" | "pie" | "area";
        xColumn: string;
        yColumn: string;
        color?: string | undefined;
        name?: string | undefined;
        durationMs?: number | undefined;
        animated?: boolean | undefined;
    }>;
    readonly apply_gaussian_blur: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        radius: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        radius: number;
    }, {
        projectId: string;
        componentId: string;
        radius?: number | undefined;
    }>;
    readonly apply_directional_blur: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        angle: z.ZodDefault<z.ZodNumber>;
        length: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        length: number;
        projectId: string;
        componentId: string;
        angle: number;
    }, {
        projectId: string;
        componentId: string;
        length?: number | undefined;
        angle?: number | undefined;
    }>;
    readonly apply_radial_blur: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        centerX: z.ZodDefault<z.ZodNumber>;
        centerY: z.ZodDefault<z.ZodNumber>;
        amount: z.ZodDefault<z.ZodNumber>;
        spin: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        centerX: number;
        centerY: number;
        amount: number;
        spin: boolean;
    }, {
        projectId: string;
        componentId: string;
        centerX?: number | undefined;
        centerY?: number | undefined;
        amount?: number | undefined;
        spin?: boolean | undefined;
    }>;
    readonly apply_sharpen: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        amount: z.ZodDefault<z.ZodNumber>;
        radius: z.ZodDefault<z.ZodNumber>;
        threshold: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        threshold: number;
        radius: number;
        amount: number;
    }, {
        projectId: string;
        componentId: string;
        threshold?: number | undefined;
        radius?: number | undefined;
        amount?: number | undefined;
    }>;
    readonly apply_wave_warp: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        waveHeight: z.ZodDefault<z.ZodNumber>;
        waveWidth: z.ZodDefault<z.ZodNumber>;
        direction: z.ZodDefault<z.ZodNumber>;
        speed: z.ZodDefault<z.ZodNumber>;
        phase: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        direction: number;
        componentId: string;
        speed: number;
        waveHeight: number;
        waveWidth: number;
        phase: number;
    }, {
        projectId: string;
        componentId: string;
        direction?: number | undefined;
        speed?: number | undefined;
        waveHeight?: number | undefined;
        waveWidth?: number | undefined;
        phase?: number | undefined;
    }>;
    readonly apply_ripple: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        centerX: z.ZodDefault<z.ZodNumber>;
        centerY: z.ZodDefault<z.ZodNumber>;
        radius: z.ZodDefault<z.ZodNumber>;
        waveSpeed: z.ZodDefault<z.ZodNumber>;
        frequency: z.ZodDefault<z.ZodNumber>;
        amplitude: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        centerX: number;
        centerY: number;
        radius: number;
        frequency: number;
        amplitude: number;
        waveSpeed: number;
    }, {
        projectId: string;
        componentId: string;
        centerX?: number | undefined;
        centerY?: number | undefined;
        radius?: number | undefined;
        frequency?: number | undefined;
        amplitude?: number | undefined;
        waveSpeed?: number | undefined;
    }>;
    readonly apply_bulge: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        centerX: z.ZodDefault<z.ZodNumber>;
        centerY: z.ZodDefault<z.ZodNumber>;
        radius: z.ZodDefault<z.ZodNumber>;
        height: z.ZodDefault<z.ZodNumber>;
        antialias: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        height: number;
        projectId: string;
        componentId: string;
        centerX: number;
        centerY: number;
        radius: number;
        antialias: boolean;
    }, {
        projectId: string;
        componentId: string;
        height?: number | undefined;
        centerX?: number | undefined;
        centerY?: number | undefined;
        radius?: number | undefined;
        antialias?: boolean | undefined;
    }>;
    readonly apply_glow: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        threshold: z.ZodDefault<z.ZodNumber>;
        radius: z.ZodDefault<z.ZodNumber>;
        intensity: z.ZodDefault<z.ZodNumber>;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        threshold: number;
        intensity: number;
        radius: number;
        color?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        color?: string | undefined;
        threshold?: number | undefined;
        intensity?: number | undefined;
        radius?: number | undefined;
    }>;
    readonly apply_mosaic: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        blockSize: z.ZodDefault<z.ZodNumber>;
        sharpEdges: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        blockSize: number;
        sharpEdges: boolean;
    }, {
        projectId: string;
        componentId: string;
        blockSize?: number | undefined;
        sharpEdges?: boolean | undefined;
    }>;
    readonly apply_find_edges: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        invert: z.ZodDefault<z.ZodBoolean>;
        blend: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        invert: boolean;
        blend: number;
    }, {
        projectId: string;
        componentId: string;
        invert?: boolean | undefined;
        blend?: number | undefined;
    }>;
    readonly apply_lens_flare: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        centerX: z.ZodDefault<z.ZodNumber>;
        centerY: z.ZodDefault<z.ZodNumber>;
        brightness: z.ZodDefault<z.ZodNumber>;
        rays: z.ZodDefault<z.ZodNumber>;
        color: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        color: string;
        projectId: string;
        componentId: string;
        centerX: number;
        centerY: number;
        brightness: number;
        rays: number;
    }, {
        projectId: string;
        componentId: string;
        color?: string | undefined;
        centerX?: number | undefined;
        centerY?: number | undefined;
        brightness?: number | undefined;
        rays?: number | undefined;
    }>;
    readonly apply_four_color_gradient: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        color1: z.ZodDefault<z.ZodString>;
        color2: z.ZodDefault<z.ZodString>;
        color3: z.ZodDefault<z.ZodString>;
        color4: z.ZodDefault<z.ZodString>;
        blend: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        blend: number;
        color1: string;
        color2: string;
        color3: string;
        color4: string;
    }, {
        projectId: string;
        componentId: string;
        blend?: number | undefined;
        color1?: string | undefined;
        color2?: string | undefined;
        color3?: string | undefined;
        color4?: string | undefined;
    }>;
    readonly remove_expression: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        property: z.ZodEnum<["translateX", "translateY", "scale", "rotate", "opacity", "width", "height"]>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        property: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "width" | "height";
    }, {
        projectId: string;
        componentId: string;
        property: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | "width" | "height";
    }>;
    readonly set_loop_expression: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        property: z.ZodDefault<z.ZodEnum<["translateX", "translateY", "scale", "rotate", "opacity"]>>;
        mode: z.ZodDefault<z.ZodEnum<["cycle", "pingpong", "offset", "continue"]>>;
        durationMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        durationMs: number;
        componentId: string;
        property: "translateX" | "translateY" | "scale" | "rotate" | "opacity";
        mode: "offset" | "cycle" | "pingpong" | "continue";
    }, {
        projectId: string;
        componentId: string;
        durationMs?: number | undefined;
        property?: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | undefined;
        mode?: "offset" | "cycle" | "pingpong" | "continue" | undefined;
    }>;
    readonly sequence_layers: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        staggerMs: z.ZodDefault<z.ZodNumber>;
        overlap: z.ZodDefault<z.ZodNumber>;
        order: z.ZodDefault<z.ZodEnum<["top-to-bottom", "bottom-to-top", "selection-order", "forward", "reverse"]>>;
        ease: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        ease: boolean;
        projectId: string;
        staggerMs: number;
        overlap: number;
        order: "reverse" | "forward" | "top-to-bottom" | "bottom-to-top" | "selection-order";
        componentIds?: string[] | undefined;
    }, {
        projectId: string;
        ease?: boolean | undefined;
        componentIds?: string[] | undefined;
        staggerMs?: number | undefined;
        overlap?: number | undefined;
        order?: "reverse" | "forward" | "top-to-bottom" | "bottom-to-top" | "selection-order" | undefined;
    }>;
    readonly exponential_scale: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        fromScale: z.ZodDefault<z.ZodNumber>;
        toScale: z.ZodDefault<z.ZodNumber>;
        durationMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        durationMs: number;
        componentId: string;
        fromScale: number;
        toScale: number;
    }, {
        projectId: string;
        componentId: string;
        durationMs?: number | undefined;
        fromScale?: number | undefined;
        toScale?: number | undefined;
    }>;
    readonly smooth_keyframes: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        property: z.ZodDefault<z.ZodEnum<["translateX", "translateY", "scale", "rotate", "opacity"]>>;
        tolerance: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        property: "translateX" | "translateY" | "scale" | "rotate" | "opacity";
        tolerance: number;
    }, {
        projectId: string;
        componentId: string;
        property?: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | undefined;
        tolerance?: number | undefined;
    }>;
    readonly wiggle_keyframes: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        property: z.ZodDefault<z.ZodEnum<["translateX", "translateY", "scale", "rotate", "opacity"]>>;
        frequency: z.ZodDefault<z.ZodNumber>;
        amplitude: z.ZodDefault<z.ZodNumber>;
        samples: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        property: "translateX" | "translateY" | "scale" | "rotate" | "opacity";
        frequency: number;
        amplitude: number;
        samples: number;
    }, {
        projectId: string;
        componentId: string;
        property?: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | undefined;
        frequency?: number | undefined;
        amplitude?: number | undefined;
        samples?: number | undefined;
    }>;
    readonly audio_to_keyframes: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        audioSourceId: z.ZodString;
        property: z.ZodDefault<z.ZodEnum<["translateX", "translateY", "scale", "rotate", "opacity"]>>;
        channel: z.ZodDefault<z.ZodEnum<["both", "left", "right"]>>;
        samples: z.ZodDefault<z.ZodNumber>;
        smoothing: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        property: "translateX" | "translateY" | "scale" | "rotate" | "opacity";
        smoothing: number;
        channel: "both" | "left" | "right";
        samples: number;
        audioSourceId: string;
    }, {
        projectId: string;
        componentId: string;
        audioSourceId: string;
        property?: "translateX" | "translateY" | "scale" | "rotate" | "opacity" | undefined;
        smoothing?: number | undefined;
        channel?: "both" | "left" | "right" | undefined;
        samples?: number | undefined;
    }>;
    readonly set_range_selector: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        unit: z.ZodDefault<z.ZodEnum<["characters", "words", "lines"]>>;
        start: z.ZodDefault<z.ZodNumber>;
        end: z.ZodDefault<z.ZodNumber>;
        offset: z.ZodDefault<z.ZodNumber>;
        ease: z.ZodDefault<z.ZodBoolean>;
        basedOn: z.ZodDefault<z.ZodEnum<["characters", "words", "lines", "all"]>>;
        mode: z.ZodDefault<z.ZodEnum<["add", "subtract", "intersect", "min", "max"]>>;
    }, "strip", z.ZodTypeAny, {
        ease: boolean;
        offset: number;
        projectId: string;
        componentId: string;
        mode: "add" | "subtract" | "intersect" | "min" | "max";
        start: number;
        end: number;
        unit: "characters" | "words" | "lines";
        basedOn: "characters" | "words" | "lines" | "all";
    }, {
        projectId: string;
        componentId: string;
        ease?: boolean | undefined;
        offset?: number | undefined;
        mode?: "add" | "subtract" | "intersect" | "min" | "max" | undefined;
        start?: number | undefined;
        end?: number | undefined;
        unit?: "characters" | "words" | "lines" | undefined;
        basedOn?: "characters" | "words" | "lines" | "all" | undefined;
    }>;
    readonly set_text_wiggler: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        frequency: z.ZodDefault<z.ZodNumber>;
        amplitudeX: z.ZodDefault<z.ZodNumber>;
        amplitudeY: z.ZodDefault<z.ZodNumber>;
        amplitudeRotation: z.ZodDefault<z.ZodNumber>;
        amplitudeScale: z.ZodDefault<z.ZodNumber>;
        correlation: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        frequency: number;
        amplitudeX: number;
        amplitudeY: number;
        amplitudeRotation: number;
        amplitudeScale: number;
        correlation: number;
    }, {
        projectId: string;
        componentId: string;
        frequency?: number | undefined;
        amplitudeX?: number | undefined;
        amplitudeY?: number | undefined;
        amplitudeRotation?: number | undefined;
        amplitudeScale?: number | undefined;
        correlation?: number | undefined;
    }>;
    readonly text_on_path: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        pathId: z.ZodString;
        startOffset: z.ZodDefault<z.ZodNumber>;
        reverse: z.ZodDefault<z.ZodBoolean>;
        alignToPath: z.ZodDefault<z.ZodBoolean>;
        baselineShift: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        reverse: boolean;
        projectId: string;
        componentId: string;
        pathId: string;
        startOffset: number;
        alignToPath: boolean;
        baselineShift: number;
    }, {
        projectId: string;
        componentId: string;
        pathId: string;
        reverse?: boolean | undefined;
        startOffset?: number | undefined;
        alignToPath?: boolean | undefined;
        baselineShift?: number | undefined;
    }>;
    readonly set_vertical_text: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        enabled: z.ZodDefault<z.ZodBoolean>;
        rotateChars: z.ZodDefault<z.ZodBoolean>;
        lineFlow: z.ZodDefault<z.ZodEnum<["top-to-bottom", "right-to-left"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        enabled: boolean;
        rotateChars: boolean;
        lineFlow: "top-to-bottom" | "right-to-left";
    }, {
        projectId: string;
        componentId: string;
        enabled?: boolean | undefined;
        rotateChars?: boolean | undefined;
        lineFlow?: "top-to-bottom" | "right-to-left" | undefined;
    }>;
    readonly set_kerning: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        tracking: z.ZodDefault<z.ZodNumber>;
        pairAdjustment: z.ZodDefault<z.ZodBoolean>;
        range: z.ZodOptional<z.ZodObject<{
            start: z.ZodDefault<z.ZodNumber>;
            end: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            start: number;
            end: number;
        }, {
            start?: number | undefined;
            end?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        tracking: number;
        pairAdjustment: boolean;
        range?: {
            start: number;
            end: number;
        } | undefined;
    }, {
        projectId: string;
        componentId: string;
        tracking?: number | undefined;
        pairAdjustment?: boolean | undefined;
        range?: {
            start?: number | undefined;
            end?: number | undefined;
        } | undefined;
    }>;
    readonly set_leading: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        lineHeight: z.ZodDefault<z.ZodNumber>;
        baselineShift: z.ZodDefault<z.ZodNumber>;
        autoLeading: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        baselineShift: number;
        lineHeight: number;
        autoLeading: boolean;
    }, {
        projectId: string;
        componentId: string;
        baselineShift?: number | undefined;
        lineHeight?: number | undefined;
        autoLeading?: boolean | undefined;
    }>;
    readonly per_character_transform: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        translateX: z.ZodDefault<z.ZodNumber>;
        translateY: z.ZodDefault<z.ZodNumber>;
        scale: z.ZodDefault<z.ZodNumber>;
        rotate: z.ZodDefault<z.ZodNumber>;
        opacity: z.ZodDefault<z.ZodNumber>;
        anchor: z.ZodDefault<z.ZodEnum<["center", "baseline", "top"]>>;
        staggerMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        translateX: number;
        translateY: number;
        scale: number;
        rotate: number;
        opacity: number;
        projectId: string;
        componentId: string;
        staggerMs: number;
        anchor: "center" | "top" | "baseline";
    }, {
        projectId: string;
        componentId: string;
        translateX?: number | undefined;
        translateY?: number | undefined;
        scale?: number | undefined;
        rotate?: number | undefined;
        opacity?: number | undefined;
        staggerMs?: number | undefined;
        anchor?: "center" | "top" | "baseline" | undefined;
    }>;
    readonly set_text_animator: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        animator: z.ZodEnum<["position", "scale", "rotation", "opacity", "color", "fillColor", "tracking"]>;
        from: z.ZodOptional<z.ZodString>;
        to: z.ZodOptional<z.ZodString>;
        rangeStart: z.ZodDefault<z.ZodNumber>;
        rangeEnd: z.ZodDefault<z.ZodNumber>;
        smooth: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        smooth: number;
        projectId: string;
        componentId: string;
        rangeStart: number;
        rangeEnd: number;
        animator: "scale" | "opacity" | "color" | "rotation" | "position" | "tracking" | "fillColor";
        from?: string | undefined;
        to?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        animator: "scale" | "opacity" | "color" | "rotation" | "position" | "tracking" | "fillColor";
        smooth?: number | undefined;
        rangeStart?: number | undefined;
        rangeEnd?: number | undefined;
        from?: string | undefined;
        to?: string | undefined;
    }>;
    readonly track_point: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        pointX: z.ZodNumber;
        pointY: z.ZodNumber;
        searchSize: z.ZodDefault<z.ZodNumber>;
        trackName: z.ZodOptional<z.ZodString>;
        durationMs: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        pointX: number;
        pointY: number;
        searchSize: number;
        durationMs?: number | undefined;
        trackName?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        pointX: number;
        pointY: number;
        durationMs?: number | undefined;
        searchSize?: number | undefined;
        trackName?: string | undefined;
    }>;
    readonly track_camera: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        solveFocalLength: z.ZodDefault<z.ZodBoolean>;
        createNulls: z.ZodDefault<z.ZodBoolean>;
        threshold: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        threshold: number;
        solveFocalLength: boolean;
        createNulls: boolean;
    }, {
        projectId: string;
        componentId: string;
        threshold?: number | undefined;
        solveFocalLength?: boolean | undefined;
        createNulls?: boolean | undefined;
    }>;
    readonly warp_stabilizer: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        smoothness: z.ZodDefault<z.ZodNumber>;
        method: z.ZodDefault<z.ZodEnum<["position", "positionScaleRotation", "perspective", "subspaceWarp"]>>;
        crop: z.ZodDefault<z.ZodNumber>;
        noMotion: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        method: "position" | "perspective" | "positionScaleRotation" | "subspaceWarp";
        smoothness: number;
        crop: number;
        noMotion: boolean;
    }, {
        projectId: string;
        componentId: string;
        method?: "position" | "perspective" | "positionScaleRotation" | "subspaceWarp" | undefined;
        smoothness?: number | undefined;
        crop?: number | undefined;
        noMotion?: boolean | undefined;
    }>;
    readonly apply_track_to_layer: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        trackName: z.ZodString;
        applyTo: z.ZodDefault<z.ZodEnum<["position", "anchorPoint", "positionScale", "positionScaleRotation", "transform"]>>;
        matchName: z.ZodDefault<z.ZodBoolean>;
        compensate: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        trackName: string;
        applyTo: "position" | "positionScaleRotation" | "anchorPoint" | "positionScale" | "transform";
        matchName: boolean;
        compensate: boolean;
    }, {
        projectId: string;
        componentId: string;
        trackName: string;
        applyTo?: "position" | "positionScaleRotation" | "anchorPoint" | "positionScale" | "transform" | undefined;
        matchName?: boolean | undefined;
        compensate?: boolean | undefined;
    }>;
    readonly edit_motion_path: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        points: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            ease: z.ZodDefault<z.ZodEnum<["linear", "bezier", "hold"]>>;
            handleIn: z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>;
            handleOut: z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>;
        }, "strip", z.ZodTypeAny, {
            ease: "linear" | "bezier" | "hold";
            x: number;
            y: number;
            handleIn?: {
                x: number;
                y: number;
            } | undefined;
            handleOut?: {
                x: number;
                y: number;
            } | undefined;
        }, {
            x: number;
            y: number;
            ease?: "linear" | "bezier" | "hold" | undefined;
            handleIn?: {
                x: number;
                y: number;
            } | undefined;
            handleOut?: {
                x: number;
                y: number;
            } | undefined;
        }>, "many">;
        closed: z.ZodDefault<z.ZodBoolean>;
        roving: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        closed: boolean;
        projectId: string;
        componentId: string;
        points: {
            ease: "linear" | "bezier" | "hold";
            x: number;
            y: number;
            handleIn?: {
                x: number;
                y: number;
            } | undefined;
            handleOut?: {
                x: number;
                y: number;
            } | undefined;
        }[];
        roving: boolean;
    }, {
        projectId: string;
        componentId: string;
        points: {
            x: number;
            y: number;
            ease?: "linear" | "bezier" | "hold" | undefined;
            handleIn?: {
                x: number;
                y: number;
            } | undefined;
            handleOut?: {
                x: number;
                y: number;
            } | undefined;
        }[];
        closed?: boolean | undefined;
        roving?: boolean | undefined;
    }>;
    readonly auto_orient_path: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        orientAlong: z.ZodDefault<z.ZodEnum<["motionPath", "trackPath", "camera"]>>;
        axis: z.ZodDefault<z.ZodEnum<["auto", "x", "y"]>>;
        smoothing: z.ZodDefault<z.ZodNumber>;
        offset: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        offset: number;
        projectId: string;
        componentId: string;
        axis: "auto" | "x" | "y";
        smoothing: number;
        orientAlong: "motionPath" | "trackPath" | "camera";
    }, {
        projectId: string;
        componentId: string;
        offset?: number | undefined;
        axis?: "auto" | "x" | "y" | undefined;
        smoothing?: number | undefined;
        orientAlong?: "motionPath" | "trackPath" | "camera" | undefined;
    }>;
    readonly set_advanced_blending: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        fillOpacity: z.ZodOptional<z.ZodNumber>;
        redChannel: z.ZodOptional<z.ZodBoolean>;
        greenChannel: z.ZodOptional<z.ZodBoolean>;
        blueChannel: z.ZodOptional<z.ZodBoolean>;
        knockout: z.ZodDefault<z.ZodOptional<z.ZodEnum<["none", "shallow", "deep"]>>>;
        blendIfSource: z.ZodOptional<z.ZodEnum<["gray", "red", "green", "blue"]>>;
        blendIfRange: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        knockout: "none" | "shallow" | "deep";
        fillOpacity?: number | undefined;
        redChannel?: boolean | undefined;
        greenChannel?: boolean | undefined;
        blueChannel?: boolean | undefined;
        blendIfSource?: "red" | "green" | "blue" | "gray" | undefined;
        blendIfRange?: [number, number] | undefined;
    }, {
        projectId: string;
        componentId: string;
        fillOpacity?: number | undefined;
        redChannel?: boolean | undefined;
        greenChannel?: boolean | undefined;
        blueChannel?: boolean | undefined;
        knockout?: "none" | "shallow" | "deep" | undefined;
        blendIfSource?: "red" | "green" | "blue" | "gray" | undefined;
        blendIfRange?: [number, number] | undefined;
    }>;
    readonly precompose: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodArray<z.ZodString, "many">;
        name: z.ZodDefault<z.ZodString>;
        moveAttributes: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        projectId: string;
        componentIds: string[];
        moveAttributes: boolean;
    }, {
        projectId: string;
        componentIds: string[];
        name?: string | undefined;
        moveAttributes?: boolean | undefined;
    }>;
    readonly collapse_transformations: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        enabled: boolean;
    }, {
        projectId: string;
        componentId: string;
        enabled?: boolean | undefined;
    }>;
    readonly set_alpha_mode: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        mode: z.ZodDefault<z.ZodEnum<["straight", "premultiplied"]>>;
        premultiplyColor: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        mode: "straight" | "premultiplied";
        premultiplyColor?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        mode?: "straight" | "premultiplied" | undefined;
        premultiplyColor?: string | undefined;
    }>;
    readonly set_transfer_mode: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        mode: z.ZodEnum<["normal", "stencil-alpha", "stencil-luma", "silhouette-alpha", "silhouette-luma", "alpha-add", "luma-matte"]>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        mode: "normal" | "stencil-alpha" | "stencil-luma" | "silhouette-alpha" | "silhouette-luma" | "alpha-add" | "luma-matte";
    }, {
        projectId: string;
        componentId: string;
        mode: "normal" | "stencil-alpha" | "stencil-luma" | "silhouette-alpha" | "silhouette-luma" | "alpha-add" | "luma-matte";
    }>;
    readonly set_blending_group: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        isolated: z.ZodDefault<z.ZodBoolean>;
        groupOpacity: z.ZodOptional<z.ZodNumber>;
        knockout: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        knockout: boolean;
        isolated: boolean;
        groupOpacity?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        knockout?: boolean | undefined;
        isolated?: boolean | undefined;
        groupOpacity?: number | undefined;
    }>;
    readonly time_displacement: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        maxDisplacementMs: z.ZodDefault<z.ZodNumber>;
        displacementSource: z.ZodOptional<z.ZodString>;
        resolution: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        maxDisplacementMs: number;
        resolution: "low" | "medium" | "high";
        displacementSource?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        maxDisplacementMs?: number | undefined;
        displacementSource?: string | undefined;
        resolution?: "low" | "medium" | "high" | undefined;
    }>;
    readonly echo_advanced: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        numberOfEchoes: z.ZodDefault<z.ZodNumber>;
        echoDelayMs: z.ZodDefault<z.ZodNumber>;
        decay: z.ZodDefault<z.ZodNumber>;
        echoOperator: z.ZodDefault<z.ZodEnum<["add", "maximum", "minimum", "screen", "difference", "composite-in-front", "composite-behind", "crossfade"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        decay: number;
        numberOfEchoes: number;
        echoDelayMs: number;
        echoOperator: "minimum" | "maximum" | "screen" | "difference" | "add" | "composite-in-front" | "composite-behind" | "crossfade";
    }, {
        projectId: string;
        componentId: string;
        decay?: number | undefined;
        numberOfEchoes?: number | undefined;
        echoDelayMs?: number | undefined;
        echoOperator?: "minimum" | "maximum" | "screen" | "difference" | "add" | "composite-in-front" | "composite-behind" | "crossfade" | undefined;
    }>;
    readonly sequence_with_transition: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        transitionType: z.ZodDefault<z.ZodEnum<["crossfade", "dissolve", "cut", "wipe", "push"]>>;
        transitionDurationMs: z.ZodDefault<z.ZodNumber>;
        overlapMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        transitionType: "push" | "dissolve" | "crossfade" | "cut" | "wipe";
        transitionDurationMs: number;
        overlapMs: number;
        componentIds?: string[] | undefined;
    }, {
        projectId: string;
        componentIds?: string[] | undefined;
        transitionType?: "push" | "dissolve" | "crossfade" | "cut" | "wipe" | undefined;
        transitionDurationMs?: number | undefined;
        overlapMs?: number | undefined;
    }>;
    readonly time_reverse_layer: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
    }, {
        projectId: string;
        componentId: string;
    }>;
    readonly freeze_frame: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        atTimeMs: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        atTimeMs?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        atTimeMs?: number | undefined;
    }>;
    readonly posterize_time_advanced: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        fps: z.ZodDefault<z.ZodNumber>;
        range: z.ZodDefault<z.ZodEnum<["full", "first-half", "second-half", "custom"]>>;
        rangeStartMs: z.ZodOptional<z.ZodNumber>;
        rangeEndMs: z.ZodOptional<z.ZodNumber>;
        applyToVelocity: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        fps: number;
        range: "custom" | "full" | "first-half" | "second-half";
        applyToVelocity: boolean;
        rangeStartMs?: number | undefined;
        rangeEndMs?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        fps?: number | undefined;
        range?: "custom" | "full" | "first-half" | "second-half" | undefined;
        rangeStartMs?: number | undefined;
        rangeEndMs?: number | undefined;
        applyToVelocity?: boolean | undefined;
    }>;
    readonly time_warp_remapping: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        speedKeyframes: z.ZodArray<z.ZodObject<{
            timeMs: z.ZodNumber;
            speed: z.ZodNumber;
            interpolation: z.ZodDefault<z.ZodEnum<["linear", "ease", "hold"]>>;
        }, "strip", z.ZodTypeAny, {
            interpolation: "linear" | "ease" | "hold";
            timeMs: number;
            speed: number;
        }, {
            timeMs: number;
            speed: number;
            interpolation?: "linear" | "ease" | "hold" | undefined;
        }>, "many">;
        preserveTotalDuration: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        speedKeyframes: {
            interpolation: "linear" | "ease" | "hold";
            timeMs: number;
            speed: number;
        }[];
        preserveTotalDuration: boolean;
    }, {
        projectId: string;
        componentId: string;
        speedKeyframes: {
            timeMs: number;
            speed: number;
            interpolation?: "linear" | "ease" | "hold" | undefined;
        }[];
        preserveTotalDuration?: boolean | undefined;
    }>;
    readonly lens_distortion: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        amount: z.ZodDefault<z.ZodNumber>;
        vertical: z.ZodOptional<z.ZodNumber>;
        horizontal: z.ZodOptional<z.ZodNumber>;
        remove: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        amount: number;
        remove: boolean;
        vertical?: number | undefined;
        horizontal?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        amount?: number | undefined;
        vertical?: number | undefined;
        horizontal?: number | undefined;
        remove?: boolean | undefined;
    }>;
    readonly chromatic_aberration: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        redOffset: z.ZodDefault<z.ZodNumber>;
        blueOffset: z.ZodDefault<z.ZodNumber>;
        radial: z.ZodDefault<z.ZodBoolean>;
        center: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        radial: boolean;
        redOffset: number;
        blueOffset: number;
        center?: [number, number] | undefined;
    }, {
        projectId: string;
        componentId: string;
        center?: [number, number] | undefined;
        radial?: boolean | undefined;
        redOffset?: number | undefined;
        blueOffset?: number | undefined;
    }>;
    readonly vignette: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        amount: z.ZodDefault<z.ZodNumber>;
        size: z.ZodDefault<z.ZodNumber>;
        softness: z.ZodDefault<z.ZodNumber>;
        color: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        color: string;
        projectId: string;
        componentId: string;
        size: number;
        amount: number;
        softness: number;
    }, {
        projectId: string;
        componentId: string;
        color?: string | undefined;
        size?: number | undefined;
        amount?: number | undefined;
        softness?: number | undefined;
    }>;
    readonly camera_shake_procedural: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        intensity: z.ZodDefault<z.ZodNumber>;
        frequency: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodBoolean>;
        seed: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        rotation: boolean;
        intensity: number;
        frequency: number;
        seed: number;
    }, {
        projectId: string;
        componentId: string;
        rotation?: boolean | undefined;
        intensity?: number | undefined;
        frequency?: number | undefined;
        seed?: number | undefined;
    }>;
    readonly optical_flow: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        output: z.ZodDefault<z.ZodEnum<["vector-field", "motion-magnitude", "motion-direction"]>>;
        quality: z.ZodDefault<z.ZodEnum<["draft", "high", "best"]>>;
        smoothing: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        smoothing: number;
        output: "vector-field" | "motion-magnitude" | "motion-direction";
        quality: "draft" | "high" | "best";
    }, {
        projectId: string;
        componentId: string;
        smoothing?: number | undefined;
        output?: "vector-field" | "motion-magnitude" | "motion-direction" | undefined;
        quality?: "draft" | "high" | "best" | undefined;
    }>;
    readonly motion_match_move: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        trackName: z.ZodOptional<z.ZodString>;
        applyTo: z.ZodDefault<z.ZodEnum<["position", "position-rotation", "position-scale", "position-scale-rotation"]>>;
        targetComponentId: z.ZodOptional<z.ZodString>;
        stabilization: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        applyTo: "position" | "position-rotation" | "position-scale" | "position-scale-rotation";
        stabilization: boolean;
        targetComponentId?: string | undefined;
        trackName?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        targetComponentId?: string | undefined;
        trackName?: string | undefined;
        applyTo?: "position" | "position-rotation" | "position-scale" | "position-scale-rotation" | undefined;
        stabilization?: boolean | undefined;
    }>;
    readonly lens_flare_anamorphic: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        position: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        brightness: z.ZodDefault<z.ZodNumber>;
        streakLength: z.ZodDefault<z.ZodNumber>;
        streakAngle: z.ZodDefault<z.ZodNumber>;
        color: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        color: string;
        projectId: string;
        componentId: string;
        position: [number, number];
        brightness: number;
        streakLength: number;
        streakAngle: number;
    }, {
        projectId: string;
        componentId: string;
        color?: string | undefined;
        position?: [number, number] | undefined;
        brightness?: number | undefined;
        streakLength?: number | undefined;
        streakAngle?: number | undefined;
    }>;
    readonly depth_of_field_advanced: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        focusDistance: z.ZodDefault<z.ZodNumber>;
        aperture: z.ZodDefault<z.ZodNumber>;
        blurAmount: z.ZodDefault<z.ZodNumber>;
        highlightShape: z.ZodDefault<z.ZodEnum<["circle", "hexagon", "octagon"]>>;
        focusCurve: z.ZodOptional<z.ZodArray<z.ZodObject<{
            distance: z.ZodNumber;
            blur: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            blur: number;
            distance: number;
        }, {
            blur: number;
            distance: number;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        focusDistance: number;
        aperture: number;
        blurAmount: number;
        highlightShape: "circle" | "hexagon" | "octagon";
        focusCurve?: {
            blur: number;
            distance: number;
        }[] | undefined;
    }, {
        projectId: string;
        componentId: string;
        focusDistance?: number | undefined;
        aperture?: number | undefined;
        blurAmount?: number | undefined;
        highlightShape?: "circle" | "hexagon" | "octagon" | undefined;
        focusCurve?: {
            blur: number;
            distance: number;
        }[] | undefined;
    }>;
    readonly paint_stroke: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        points: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            pressure: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }>, "many">;
        color: z.ZodDefault<z.ZodString>;
        opacity: z.ZodDefault<z.ZodNumber>;
        blendMode: z.ZodDefault<z.ZodEnum<["normal", "multiply", "screen", "overlay"]>>;
    }, "strip", z.ZodTypeAny, {
        opacity: number;
        color: string;
        projectId: string;
        componentId: string;
        blendMode: "normal" | "multiply" | "screen" | "overlay";
        points: {
            x: number;
            y: number;
            pressure?: number | undefined;
        }[];
    }, {
        projectId: string;
        componentId: string;
        points: {
            x: number;
            y: number;
            pressure?: number | undefined;
        }[];
        opacity?: number | undefined;
        color?: string | undefined;
        blendMode?: "normal" | "multiply" | "screen" | "overlay" | undefined;
    }>;
    readonly clone_stamp: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        sourcePoint: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        destinationPoint: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        sourceLayerId: z.ZodOptional<z.ZodString>;
        brushSize: z.ZodDefault<z.ZodNumber>;
        opacity: z.ZodDefault<z.ZodNumber>;
        aligned: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        opacity: number;
        projectId: string;
        componentId: string;
        sourcePoint: [number, number];
        destinationPoint: [number, number];
        brushSize: number;
        aligned: boolean;
        sourceLayerId?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        sourcePoint: [number, number];
        destinationPoint: [number, number];
        opacity?: number | undefined;
        sourceLayerId?: string | undefined;
        brushSize?: number | undefined;
        aligned?: boolean | undefined;
    }>;
    readonly brush_settings: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        size: z.ZodDefault<z.ZodNumber>;
        hardness: z.ZodDefault<z.ZodNumber>;
        opacity: z.ZodDefault<z.ZodNumber>;
        spacing: z.ZodDefault<z.ZodNumber>;
        flow: z.ZodDefault<z.ZodNumber>;
        angle: z.ZodOptional<z.ZodNumber>;
        roundness: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        opacity: number;
        projectId: string;
        componentId: string;
        size: number;
        hardness: number;
        spacing: number;
        flow: number;
        angle?: number | undefined;
        roundness?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        opacity?: number | undefined;
        size?: number | undefined;
        angle?: number | undefined;
        hardness?: number | undefined;
        spacing?: number | undefined;
        flow?: number | undefined;
        roundness?: number | undefined;
    }>;
    readonly reveal_with_brush: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        points: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            pressure: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }>, "many">;
        reveal: z.ZodDefault<z.ZodBoolean>;
        feather: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        feather: number;
        points: {
            x: number;
            y: number;
            pressure?: number | undefined;
        }[];
        reveal: boolean;
    }, {
        projectId: string;
        componentId: string;
        points: {
            x: number;
            y: number;
            pressure?: number | undefined;
        }[];
        feather?: number | undefined;
        reveal?: boolean | undefined;
    }>;
    readonly erase_stroke: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        points: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>, "many">;
        brushSize: z.ZodDefault<z.ZodNumber>;
        hardness: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        points: {
            x: number;
            y: number;
        }[];
        brushSize: number;
        hardness: number;
    }, {
        projectId: string;
        componentId: string;
        points: {
            x: number;
            y: number;
        }[];
        brushSize?: number | undefined;
        hardness?: number | undefined;
    }>;
    readonly paint_animator: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        strokeId: z.ZodOptional<z.ZodString>;
        mode: z.ZodDefault<z.ZodEnum<["write-on", "reveal", "grow-from-start", "grow-from-end"]>>;
        durationMs: z.ZodDefault<z.ZodNumber>;
        startMs: z.ZodDefault<z.ZodNumber>;
        endValue: z.ZodDefault<z.ZodNumber>;
        easing: z.ZodDefault<z.ZodEnum<["linear", "ease", "ease-in", "ease-out"]>>;
    }, "strip", z.ZodTypeAny, {
        easing: "linear" | "ease" | "ease-in" | "ease-out";
        projectId: string;
        durationMs: number;
        componentId: string;
        mode: "reveal" | "write-on" | "grow-from-start" | "grow-from-end";
        startMs: number;
        endValue: number;
        strokeId?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        easing?: "linear" | "ease" | "ease-in" | "ease-out" | undefined;
        durationMs?: number | undefined;
        mode?: "reveal" | "write-on" | "grow-from-start" | "grow-from-end" | undefined;
        startMs?: number | undefined;
        strokeId?: string | undefined;
        endValue?: number | undefined;
    }>;
    readonly roto_brush: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        mode: z.ZodDefault<z.ZodEnum<["add", "subtract", "foreground", "background"]>>;
        seedPoints: z.ZodDefault<z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            radius: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            radius: number;
        }, {
            x: number;
            y: number;
            radius?: number | undefined;
        }>, "many">>;
        detectionSensitivity: z.ZodDefault<z.ZodNumber>;
        smoothness: z.ZodDefault<z.ZodNumber>;
        frameRange: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        mode: "background" | "add" | "subtract" | "foreground";
        smoothness: number;
        seedPoints: {
            x: number;
            y: number;
            radius: number;
        }[];
        detectionSensitivity: number;
        frameRange?: [number, number] | undefined;
    }, {
        projectId: string;
        componentId: string;
        mode?: "background" | "add" | "subtract" | "foreground" | undefined;
        smoothness?: number | undefined;
        seedPoints?: {
            x: number;
            y: number;
            radius?: number | undefined;
        }[] | undefined;
        detectionSensitivity?: number | undefined;
        frameRange?: [number, number] | undefined;
    }>;
    readonly refine_edge: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        featherRadius: z.ZodDefault<z.ZodNumber>;
        edgeSoftness: z.ZodDefault<z.ZodNumber>;
        decontamination: z.ZodDefault<z.ZodNumber>;
        smoothEdge: z.ZodDefault<z.ZodBoolean>;
        useSmartRadius: z.ZodDefault<z.ZodBoolean>;
        smartRadius: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        featherRadius: number;
        edgeSoftness: number;
        decontamination: number;
        smoothEdge: boolean;
        useSmartRadius: boolean;
        smartRadius: number;
    }, {
        projectId: string;
        componentId: string;
        featherRadius?: number | undefined;
        edgeSoftness?: number | undefined;
        decontamination?: number | undefined;
        smoothEdge?: boolean | undefined;
        useSmartRadius?: boolean | undefined;
        smartRadius?: number | undefined;
    }>;
    readonly color_key: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        keyColor: z.ZodDefault<z.ZodString>;
        colorTolerance: z.ZodDefault<z.ZodNumber>;
        edgeThin: z.ZodDefault<z.ZodNumber>;
        edgeFeather: z.ZodDefault<z.ZodNumber>;
        invert: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        invert: boolean;
        keyColor: string;
        colorTolerance: number;
        edgeThin: number;
        edgeFeather: number;
    }, {
        projectId: string;
        componentId: string;
        invert?: boolean | undefined;
        keyColor?: string | undefined;
        colorTolerance?: number | undefined;
        edgeThin?: number | undefined;
        edgeFeather?: number | undefined;
    }>;
    readonly linear_color_key: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        keyColor: z.ZodDefault<z.ZodString>;
        matchColors: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        matchingTolerance: z.ZodDefault<z.ZodNumber>;
        matchingSoftness: z.ZodDefault<z.ZodNumber>;
        operateOn: z.ZodDefault<z.ZodEnum<["rgb", "hue", "saturation", "brightness"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        keyColor: string;
        matchColors: string[];
        matchingTolerance: number;
        matchingSoftness: number;
        operateOn: "hue" | "saturation" | "rgb" | "brightness";
    }, {
        projectId: string;
        componentId: string;
        keyColor?: string | undefined;
        matchColors?: string[] | undefined;
        matchingTolerance?: number | undefined;
        matchingSoftness?: number | undefined;
        operateOn?: "hue" | "saturation" | "rgb" | "brightness" | undefined;
    }>;
    readonly difference_matte: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        referenceFrame: z.ZodDefault<z.ZodNumber>;
        differenceThreshold: z.ZodDefault<z.ZodNumber>;
        matchTolerance: z.ZodDefault<z.ZodNumber>;
        blurBeforeDifference: z.ZodDefault<z.ZodNumber>;
        invert: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        invert: boolean;
        referenceFrame: number;
        differenceThreshold: number;
        matchTolerance: number;
        blurBeforeDifference: number;
    }, {
        projectId: string;
        componentId: string;
        invert?: boolean | undefined;
        referenceFrame?: number | undefined;
        differenceThreshold?: number | undefined;
        matchTolerance?: number | undefined;
        blurBeforeDifference?: number | undefined;
    }>;
    readonly spill_suppression: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        suppressColor: z.ZodDefault<z.ZodEnum<["green", "blue", "red", "custom"]>>;
        customColor: z.ZodOptional<z.ZodString>;
        suppression: z.ZodDefault<z.ZodNumber>;
        luminancePreservation: z.ZodDefault<z.ZodNumber>;
        edgeSoftness: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        edgeSoftness: number;
        suppressColor: "custom" | "red" | "green" | "blue";
        suppression: number;
        luminancePreservation: number;
        customColor?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        edgeSoftness?: number | undefined;
        suppressColor?: "custom" | "red" | "green" | "blue" | undefined;
        customColor?: string | undefined;
        suppression?: number | undefined;
        luminancePreservation?: number | undefined;
    }>;
    readonly matte_choker: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        chokeSpread: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        choke1: z.ZodDefault<z.ZodNumber>;
        choke2: z.ZodDefault<z.ZodNumber>;
        grayLevel: z.ZodDefault<z.ZodNumber>;
        iterations: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        choke1: number;
        choke2: number;
        grayLevel: number;
        iterations: number;
        chokeSpread?: number[] | undefined;
    }, {
        projectId: string;
        componentId: string;
        chokeSpread?: number[] | undefined;
        choke1?: number | undefined;
        choke2?: number | undefined;
        grayLevel?: number | undefined;
        iterations?: number | undefined;
    }>;
    readonly inner_outer_key: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        innerPath: z.ZodOptional<z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>, "many">>;
        outerPath: z.ZodOptional<z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>, "many">>;
        feather: z.ZodDefault<z.ZodNumber>;
        edgeThreshold: z.ZodDefault<z.ZodNumber>;
        useInnerOnly: z.ZodDefault<z.ZodBoolean>;
        invert: z.ZodDefault<z.ZodBoolean>;
        additionalForegroundPath: z.ZodOptional<z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>, "many">>;
        additionalBackgroundPath: z.ZodOptional<z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        feather: number;
        invert: boolean;
        edgeThreshold: number;
        useInnerOnly: boolean;
        innerPath?: {
            x: number;
            y: number;
        }[] | undefined;
        outerPath?: {
            x: number;
            y: number;
        }[] | undefined;
        additionalForegroundPath?: {
            x: number;
            y: number;
        }[] | undefined;
        additionalBackgroundPath?: {
            x: number;
            y: number;
        }[] | undefined;
    }, {
        projectId: string;
        componentId: string;
        feather?: number | undefined;
        invert?: boolean | undefined;
        innerPath?: {
            x: number;
            y: number;
        }[] | undefined;
        outerPath?: {
            x: number;
            y: number;
        }[] | undefined;
        edgeThreshold?: number | undefined;
        useInnerOnly?: boolean | undefined;
        additionalForegroundPath?: {
            x: number;
            y: number;
        }[] | undefined;
        additionalBackgroundPath?: {
            x: number;
            y: number;
        }[] | undefined;
    }>;
    readonly block_dissolve: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        blockSize: z.ZodDefault<z.ZodNumber>;
        rows: z.ZodDefault<z.ZodNumber>;
        columns: z.ZodDefault<z.ZodNumber>;
        transitionDurationMs: z.ZodDefault<z.ZodNumber>;
        randomness: z.ZodDefault<z.ZodNumber>;
        direction: z.ZodDefault<z.ZodEnum<["dissolve-in", "dissolve-out"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        direction: "dissolve-in" | "dissolve-out";
        blockSize: number;
        transitionDurationMs: number;
        rows: number;
        columns: number;
        randomness: number;
        componentIds?: string[] | undefined;
    }, {
        projectId: string;
        direction?: "dissolve-in" | "dissolve-out" | undefined;
        componentIds?: string[] | undefined;
        blockSize?: number | undefined;
        transitionDurationMs?: number | undefined;
        rows?: number | undefined;
        columns?: number | undefined;
        randomness?: number | undefined;
    }>;
    readonly card_wipe: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        rows: z.ZodDefault<z.ZodNumber>;
        columns: z.ZodDefault<z.ZodNumber>;
        flipAxis: z.ZodDefault<z.ZodEnum<["x", "y"]>>;
        flipDirection: z.ZodDefault<z.ZodEnum<["positive", "negative"]>>;
        transitionDurationMs: z.ZodDefault<z.ZodNumber>;
        randomness: z.ZodDefault<z.ZodNumber>;
        cameraDistance: z.ZodDefault<z.ZodNumber>;
        jitter: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        transitionDurationMs: number;
        rows: number;
        columns: number;
        randomness: number;
        flipAxis: "x" | "y";
        flipDirection: "positive" | "negative";
        cameraDistance: number;
        jitter: number;
        componentIds?: string[] | undefined;
    }, {
        projectId: string;
        componentIds?: string[] | undefined;
        transitionDurationMs?: number | undefined;
        rows?: number | undefined;
        columns?: number | undefined;
        randomness?: number | undefined;
        flipAxis?: "x" | "y" | undefined;
        flipDirection?: "positive" | "negative" | undefined;
        cameraDistance?: number | undefined;
        jitter?: number | undefined;
    }>;
    readonly gradient_wipe: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        gradientLayerId: z.ZodOptional<z.ZodString>;
        transitionDurationMs: z.ZodDefault<z.ZodNumber>;
        completion: z.ZodDefault<z.ZodNumber>;
        isGradientLayerInverted: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        transitionDurationMs: number;
        completion: number;
        isGradientLayerInverted: boolean;
        componentIds?: string[] | undefined;
        gradientLayerId?: string | undefined;
    }, {
        projectId: string;
        componentIds?: string[] | undefined;
        transitionDurationMs?: number | undefined;
        gradientLayerId?: string | undefined;
        completion?: number | undefined;
        isGradientLayerInverted?: boolean | undefined;
    }>;
    readonly iris_wipe: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        irisCenter: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        outerRadius: z.ZodDefault<z.ZodNumber>;
        innerRadius: z.ZodDefault<z.ZodNumber>;
        irisPoints: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        transitionDurationMs: z.ZodDefault<z.ZodNumber>;
        feather: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        rotation: number;
        feather: number;
        innerRadius: number;
        transitionDurationMs: number;
        irisCenter: [number, number];
        outerRadius: number;
        irisPoints: number;
        componentIds?: string[] | undefined;
    }, {
        projectId: string;
        componentIds?: string[] | undefined;
        rotation?: number | undefined;
        feather?: number | undefined;
        innerRadius?: number | undefined;
        transitionDurationMs?: number | undefined;
        irisCenter?: [number, number] | undefined;
        outerRadius?: number | undefined;
        irisPoints?: number | undefined;
    }>;
    readonly linear_wipe: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        angle: z.ZodDefault<z.ZodNumber>;
        feather: z.ZodDefault<z.ZodNumber>;
        transitionDurationMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        feather: number;
        angle: number;
        transitionDurationMs: number;
        componentIds?: string[] | undefined;
    }, {
        projectId: string;
        componentIds?: string[] | undefined;
        feather?: number | undefined;
        angle?: number | undefined;
        transitionDurationMs?: number | undefined;
    }>;
    readonly radial_wipe: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        startAngle: z.ZodDefault<z.ZodNumber>;
        wipeAngle: z.ZodDefault<z.ZodNumber>;
        feather: z.ZodDefault<z.ZodNumber>;
        wipeShape: z.ZodDefault<z.ZodEnum<["clockwise", "counterclockwise", "both"]>>;
        transitionDurationMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        feather: number;
        transitionDurationMs: number;
        startAngle: number;
        wipeAngle: number;
        wipeShape: "both" | "clockwise" | "counterclockwise";
        componentIds?: string[] | undefined;
    }, {
        projectId: string;
        componentIds?: string[] | undefined;
        feather?: number | undefined;
        transitionDurationMs?: number | undefined;
        startAngle?: number | undefined;
        wipeAngle?: number | undefined;
        wipeShape?: "both" | "clockwise" | "counterclockwise" | undefined;
    }>;
    readonly venetian_blinds: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        stripeWidth: z.ZodDefault<z.ZodNumber>;
        transitionDurationMs: z.ZodDefault<z.ZodNumber>;
        direction: z.ZodDefault<z.ZodEnum<["horizontal", "vertical"]>>;
        edgeCompletion: z.ZodDefault<z.ZodNumber>;
        feather: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        direction: "vertical" | "horizontal";
        feather: number;
        transitionDurationMs: number;
        stripeWidth: number;
        edgeCompletion: number;
        componentIds?: string[] | undefined;
    }, {
        projectId: string;
        direction?: "vertical" | "horizontal" | undefined;
        componentIds?: string[] | undefined;
        feather?: number | undefined;
        transitionDurationMs?: number | undefined;
        stripeWidth?: number | undefined;
        edgeCompletion?: number | undefined;
    }>;
    readonly cc_jaws_wipe: z.ZodObject<{
        projectId: z.ZodString;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        shape: z.ZodDefault<z.ZodEnum<["jaws", "line", "scale", "grid", "radial"]>>;
        direction: z.ZodDefault<z.ZodEnum<["top-left", "top-right", "bottom-left", "bottom-right", "all"]>>;
        completion: z.ZodDefault<z.ZodNumber>;
        transitionDurationMs: z.ZodDefault<z.ZodNumber>;
        pointSpacing: z.ZodDefault<z.ZodNumber>;
        shapeLayer: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        shape: "scale" | "line" | "radial" | "jaws" | "grid";
        projectId: string;
        direction: "all" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
        transitionDurationMs: number;
        completion: number;
        pointSpacing: number;
        shapeLayer: boolean;
        componentIds?: string[] | undefined;
    }, {
        projectId: string;
        shape?: "scale" | "line" | "radial" | "jaws" | "grid" | undefined;
        direction?: "all" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | undefined;
        componentIds?: string[] | undefined;
        transitionDurationMs?: number | undefined;
        completion?: number | undefined;
        pointSpacing?: number | undefined;
        shapeLayer?: boolean | undefined;
    }>;
    readonly cc_ball_action: z.ZodObject<{
        projectId: z.ZodString;
        ballSize: z.ZodDefault<z.ZodNumber>;
        spacing: z.ZodDefault<z.ZodNumber>;
        rotationX: z.ZodDefault<z.ZodNumber>;
        rotationY: z.ZodDefault<z.ZodNumber>;
        rotationZ: z.ZodDefault<z.ZodNumber>;
        scatter: z.ZodDefault<z.ZodNumber>;
        gridMode: z.ZodDefault<z.ZodEnum<["rectangular", "hexagonal"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        scatter: number;
        spacing: number;
        ballSize: number;
        rotationX: number;
        rotationY: number;
        rotationZ: number;
        gridMode: "rectangular" | "hexagonal";
    }, {
        projectId: string;
        scatter?: number | undefined;
        spacing?: number | undefined;
        ballSize?: number | undefined;
        rotationX?: number | undefined;
        rotationY?: number | undefined;
        rotationZ?: number | undefined;
        gridMode?: "rectangular" | "hexagonal" | undefined;
    }>;
    readonly cc_bubbles: z.ZodObject<{
        projectId: z.ZodString;
        bubbleCount: z.ZodDefault<z.ZodNumber>;
        minSize: z.ZodDefault<z.ZodNumber>;
        maxSize: z.ZodDefault<z.ZodNumber>;
        speed: z.ZodDefault<z.ZodNumber>;
        wobble: z.ZodDefault<z.ZodNumber>;
        direction: z.ZodDefault<z.ZodEnum<["up", "down", "left", "right"]>>;
        seed: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        direction: "left" | "right" | "up" | "down";
        seed: number;
        speed: number;
        bubbleCount: number;
        minSize: number;
        maxSize: number;
        wobble: number;
    }, {
        projectId: string;
        direction?: "left" | "right" | "up" | "down" | undefined;
        seed?: number | undefined;
        speed?: number | undefined;
        bubbleCount?: number | undefined;
        minSize?: number | undefined;
        maxSize?: number | undefined;
        wobble?: number | undefined;
    }>;
    readonly cc_rainfall: z.ZodObject<{
        projectId: z.ZodString;
        dropCount: z.ZodDefault<z.ZodNumber>;
        dropSize: z.ZodDefault<z.ZodNumber>;
        speed: z.ZodDefault<z.ZodNumber>;
        wind: z.ZodDefault<z.ZodNumber>;
        angle: z.ZodDefault<z.ZodNumber>;
        opacity: z.ZodDefault<z.ZodNumber>;
        blur: z.ZodDefault<z.ZodNumber>;
        seed: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        opacity: number;
        blur: number;
        projectId: string;
        angle: number;
        seed: number;
        speed: number;
        dropCount: number;
        dropSize: number;
        wind: number;
    }, {
        projectId: string;
        opacity?: number | undefined;
        blur?: number | undefined;
        angle?: number | undefined;
        seed?: number | undefined;
        speed?: number | undefined;
        dropCount?: number | undefined;
        dropSize?: number | undefined;
        wind?: number | undefined;
    }>;
    readonly cc_snowfall: z.ZodObject<{
        projectId: z.ZodString;
        flakeCount: z.ZodDefault<z.ZodNumber>;
        minSize: z.ZodDefault<z.ZodNumber>;
        maxSize: z.ZodDefault<z.ZodNumber>;
        speed: z.ZodDefault<z.ZodNumber>;
        wind: z.ZodDefault<z.ZodNumber>;
        wobble: z.ZodDefault<z.ZodNumber>;
        opacity: z.ZodDefault<z.ZodNumber>;
        seed: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        opacity: number;
        projectId: string;
        seed: number;
        speed: number;
        minSize: number;
        maxSize: number;
        wobble: number;
        wind: number;
        flakeCount: number;
    }, {
        projectId: string;
        opacity?: number | undefined;
        seed?: number | undefined;
        speed?: number | undefined;
        minSize?: number | undefined;
        maxSize?: number | undefined;
        wobble?: number | undefined;
        wind?: number | undefined;
        flakeCount?: number | undefined;
    }>;
    readonly cc_star_burst: z.ZodObject<{
        projectId: z.ZodString;
        starCount: z.ZodDefault<z.ZodNumber>;
        speed: z.ZodDefault<z.ZodNumber>;
        scatter: z.ZodDefault<z.ZodNumber>;
        phase: z.ZodDefault<z.ZodNumber>;
        gridSize: z.ZodDefault<z.ZodNumber>;
        color: z.ZodDefault<z.ZodString>;
        seed: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        color: string;
        projectId: string;
        scatter: number;
        seed: number;
        speed: number;
        phase: number;
        starCount: number;
        gridSize: number;
    }, {
        projectId: string;
        color?: string | undefined;
        scatter?: number | undefined;
        seed?: number | undefined;
        speed?: number | undefined;
        phase?: number | undefined;
        starCount?: number | undefined;
        gridSize?: number | undefined;
    }>;
    readonly cell_pattern: z.ZodObject<{
        projectId: z.ZodString;
        patternType: z.ZodDefault<z.ZodEnum<["bubbles", "crystals", "static-plates", "tubular", "spotted", "cracked", "steel", "organic", "stone-rock", "dried-up", "shatter", "scales", "turbulent", "load-bubbles"]>>;
        contrast: z.ZodDefault<z.ZodNumber>;
        dispersal: z.ZodDefault<z.ZodNumber>;
        size: z.ZodDefault<z.ZodNumber>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        tiling: z.ZodDefault<z.ZodBoolean>;
        evolution: z.ZodDefault<z.ZodNumber>;
        speed: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        offset: [number, number];
        projectId: string;
        size: number;
        speed: number;
        patternType: "organic" | "bubbles" | "crystals" | "static-plates" | "tubular" | "spotted" | "cracked" | "steel" | "stone-rock" | "dried-up" | "shatter" | "scales" | "turbulent" | "load-bubbles";
        contrast: number;
        dispersal: number;
        tiling: boolean;
        evolution: number;
    }, {
        projectId: string;
        offset?: [number, number] | undefined;
        size?: number | undefined;
        speed?: number | undefined;
        patternType?: "organic" | "bubbles" | "crystals" | "static-plates" | "tubular" | "spotted" | "cracked" | "steel" | "stone-rock" | "dried-up" | "shatter" | "scales" | "turbulent" | "load-bubbles" | undefined;
        contrast?: number | undefined;
        dispersal?: number | undefined;
        tiling?: boolean | undefined;
        evolution?: number | undefined;
    }>;
    readonly audio_spectrum: z.ZodObject<{
        projectId: z.ZodString;
        audioLayerId: z.ZodOptional<z.ZodString>;
        startPath: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        endPath: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        pathShape: z.ZodDefault<z.ZodEnum<["line", "curve", "closed", "loop"]>>;
        frequencyRange: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        maximumHeight: z.ZodDefault<z.ZodNumber>;
        thickness: z.ZodDefault<z.ZodNumber>;
        insideColor: z.ZodDefault<z.ZodString>;
        outsideColor: z.ZodDefault<z.ZodString>;
        displayOptions: z.ZodDefault<z.ZodArray<z.ZodEnum<["analog", "digital", "log", "analog-frequencies", "digital-frequencies"]>, "many">>;
        hueInterpolation: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        startPath: [number, number];
        endPath: [number, number];
        pathShape: "closed" | "line" | "loop" | "curve";
        frequencyRange: [number, number];
        maximumHeight: number;
        thickness: number;
        insideColor: string;
        outsideColor: string;
        displayOptions: ("analog" | "digital" | "log" | "analog-frequencies" | "digital-frequencies")[];
        hueInterpolation: number;
        audioLayerId?: string | undefined;
    }, {
        projectId: string;
        audioLayerId?: string | undefined;
        startPath?: [number, number] | undefined;
        endPath?: [number, number] | undefined;
        pathShape?: "closed" | "line" | "loop" | "curve" | undefined;
        frequencyRange?: [number, number] | undefined;
        maximumHeight?: number | undefined;
        thickness?: number | undefined;
        insideColor?: string | undefined;
        outsideColor?: string | undefined;
        displayOptions?: ("analog" | "digital" | "log" | "analog-frequencies" | "digital-frequencies")[] | undefined;
        hueInterpolation?: number | undefined;
    }>;
    readonly radio_waves: z.ZodObject<{
        projectId: z.ZodString;
        producerPoint: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wavesPerSecond: z.ZodDefault<z.ZodNumber>;
        waveSpeed: z.ZodDefault<z.ZodNumber>;
        frequency: z.ZodDefault<z.ZodNumber>;
        expansion: z.ZodDefault<z.ZodNumber>;
        maxRadius: z.ZodDefault<z.ZodNumber>;
        strokeWidth: z.ZodDefault<z.ZodNumber>;
        color: z.ZodDefault<z.ZodString>;
        fadeoutTime: z.ZodDefault<z.ZodNumber>;
        startWidth: z.ZodDefault<z.ZodNumber>;
        endWidth: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        color: string;
        projectId: string;
        expansion: number;
        strokeWidth: number;
        frequency: number;
        waveSpeed: number;
        producerPoint: [number, number];
        wavesPerSecond: number;
        maxRadius: number;
        fadeoutTime: number;
        startWidth: number;
        endWidth: number;
    }, {
        projectId: string;
        color?: string | undefined;
        expansion?: number | undefined;
        strokeWidth?: number | undefined;
        frequency?: number | undefined;
        waveSpeed?: number | undefined;
        producerPoint?: [number, number] | undefined;
        wavesPerSecond?: number | undefined;
        maxRadius?: number | undefined;
        fadeoutTime?: number | undefined;
        startWidth?: number | undefined;
        endWidth?: number | undefined;
    }>;
    readonly cartoon_effect: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        edgeThickness: z.ZodDefault<z.ZodNumber>;
        edgeIntensity: z.ZodDefault<z.ZodNumber>;
        shadingSteps: z.ZodDefault<z.ZodNumber>;
        shadingSmoothness: z.ZodDefault<z.ZodNumber>;
        outlineColor: z.ZodDefault<z.ZodString>;
        edgeMode: z.ZodDefault<z.ZodEnum<["inverted", "drawn", "lit", "outline"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        edgeThickness: number;
        edgeIntensity: number;
        shadingSteps: number;
        shadingSmoothness: number;
        outlineColor: string;
        edgeMode: "inverted" | "drawn" | "lit" | "outline";
    }, {
        projectId: string;
        componentId: string;
        edgeThickness?: number | undefined;
        edgeIntensity?: number | undefined;
        shadingSteps?: number | undefined;
        shadingSmoothness?: number | undefined;
        outlineColor?: string | undefined;
        edgeMode?: "inverted" | "drawn" | "lit" | "outline" | undefined;
    }>;
    readonly brush_strokes: z.ZodObject<{
        projectId: z.ZodString;
        brushSize: z.ZodDefault<z.ZodNumber>;
        strokeAngle: z.ZodDefault<z.ZodNumber>;
        strokeLength: z.ZodDefault<z.ZodNumber>;
        strokeDensity: z.ZodDefault<z.ZodNumber>;
        strokeRandomness: z.ZodDefault<z.ZodNumber>;
        paintSurface: z.ZodDefault<z.ZodEnum<["painting", "canvas", "paper", "wet"]>>;
        blendMode: z.ZodDefault<z.ZodEnum<["normal", "multiply", "screen"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        blendMode: "normal" | "multiply" | "screen";
        brushSize: number;
        strokeAngle: number;
        strokeLength: number;
        strokeDensity: number;
        strokeRandomness: number;
        paintSurface: "painting" | "canvas" | "paper" | "wet";
    }, {
        projectId: string;
        blendMode?: "normal" | "multiply" | "screen" | undefined;
        brushSize?: number | undefined;
        strokeAngle?: number | undefined;
        strokeLength?: number | undefined;
        strokeDensity?: number | undefined;
        strokeRandomness?: number | undefined;
        paintSurface?: "painting" | "canvas" | "paper" | "wet" | undefined;
    }>;
    readonly oil_paint: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        brushScale: z.ZodDefault<z.ZodNumber>;
        contrast: z.ZodDefault<z.ZodNumber>;
        cleanColor: z.ZodDefault<z.ZodNumber>;
        invert: z.ZodDefault<z.ZodBoolean>;
        blur: z.ZodDefault<z.ZodNumber>;
        sharpness: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        blur: number;
        projectId: string;
        componentId: string;
        invert: boolean;
        contrast: number;
        brushScale: number;
        cleanColor: number;
        sharpness: number;
    }, {
        projectId: string;
        componentId: string;
        blur?: number | undefined;
        invert?: boolean | undefined;
        contrast?: number | undefined;
        brushScale?: number | undefined;
        cleanColor?: number | undefined;
        sharpness?: number | undefined;
    }>;
    readonly watercolor: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        edgeIntensity: z.ZodDefault<z.ZodNumber>;
        edgeSimplicity: z.ZodDefault<z.ZodNumber>;
        texture: z.ZodDefault<z.ZodNumber>;
        brushSize: z.ZodDefault<z.ZodNumber>;
        wetness: z.ZodDefault<z.ZodNumber>;
        colorVariation: z.ZodDefault<z.ZodNumber>;
        paperType: z.ZodDefault<z.ZodEnum<["cold-press", "hot-press", "rough"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        brushSize: number;
        edgeIntensity: number;
        edgeSimplicity: number;
        texture: number;
        wetness: number;
        colorVariation: number;
        paperType: "cold-press" | "hot-press" | "rough";
    }, {
        projectId: string;
        componentId: string;
        brushSize?: number | undefined;
        edgeIntensity?: number | undefined;
        edgeSimplicity?: number | undefined;
        texture?: number | undefined;
        wetness?: number | undefined;
        colorVariation?: number | undefined;
        paperType?: "cold-press" | "hot-press" | "rough" | undefined;
    }>;
    readonly emboss_effect: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        angle: z.ZodDefault<z.ZodNumber>;
        height: z.ZodDefault<z.ZodNumber>;
        amount: z.ZodDefault<z.ZodNumber>;
        relief: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        height: number;
        projectId: string;
        componentId: string;
        angle: number;
        amount: number;
        relief: number;
    }, {
        projectId: string;
        componentId: string;
        height?: number | undefined;
        angle?: number | undefined;
        amount?: number | undefined;
        relief?: number | undefined;
    }>;
    readonly motion_tile: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        tileCenter: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        tileWidth: z.ZodDefault<z.ZodNumber>;
        tileHeight: z.ZodDefault<z.ZodNumber>;
        outputWidth: z.ZodDefault<z.ZodNumber>;
        outputHeight: z.ZodDefault<z.ZodNumber>;
        phase: z.ZodDefault<z.ZodNumber>;
        horizontalOffset: z.ZodDefault<z.ZodNumber>;
        verticalOffset: z.ZodDefault<z.ZodNumber>;
        mirrorEdges: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        phase: number;
        tileCenter: [number, number];
        tileWidth: number;
        tileHeight: number;
        outputWidth: number;
        outputHeight: number;
        horizontalOffset: number;
        verticalOffset: number;
        mirrorEdges: boolean;
    }, {
        projectId: string;
        componentId: string;
        phase?: number | undefined;
        tileCenter?: [number, number] | undefined;
        tileWidth?: number | undefined;
        tileHeight?: number | undefined;
        outputWidth?: number | undefined;
        outputHeight?: number | undefined;
        horizontalOffset?: number | undefined;
        verticalOffset?: number | undefined;
        mirrorEdges?: boolean | undefined;
    }>;
    readonly scatter_effect: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        scatterAmount: z.ZodDefault<z.ZodNumber>;
        grainAmount: z.ZodDefault<z.ZodNumber>;
        grainSeed: z.ZodDefault<z.ZodNumber>;
        horizontalOnly: z.ZodDefault<z.ZodBoolean>;
        verticalOnly: z.ZodDefault<z.ZodBoolean>;
        monochromatic: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        scatterAmount: number;
        grainAmount: number;
        grainSeed: number;
        horizontalOnly: boolean;
        verticalOnly: boolean;
        monochromatic: boolean;
    }, {
        projectId: string;
        componentId: string;
        scatterAmount?: number | undefined;
        grainAmount?: number | undefined;
        grainSeed?: number | undefined;
        horizontalOnly?: boolean | undefined;
        verticalOnly?: boolean | undefined;
        monochromatic?: boolean | undefined;
    }>;
    readonly threshold_effect: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        level: z.ZodDefault<z.ZodNumber>;
        invert: z.ZodDefault<z.ZodBoolean>;
        channel: z.ZodDefault<z.ZodEnum<["luminance", "red", "green", "blue", "alpha"]>>;
        halftone: z.ZodDefault<z.ZodBoolean>;
        halftoneSize: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        channel: "alpha" | "red" | "green" | "blue" | "luminance";
        invert: boolean;
        level: number;
        halftone: boolean;
        halftoneSize: number;
    }, {
        projectId: string;
        componentId: string;
        channel?: "alpha" | "red" | "green" | "blue" | "luminance" | undefined;
        invert?: boolean | undefined;
        level?: number | undefined;
        halftone?: boolean | undefined;
        halftoneSize?: number | undefined;
    }>;
    readonly analyze_restraint: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly list_recipes: z.ZodObject<{
        category: z.ZodOptional<z.ZodString>;
        query: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        category?: string | undefined;
        query?: string | undefined;
    }, {
        category?: string | undefined;
        query?: string | undefined;
    }>;
    readonly apply_recipe: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        recipeId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        recipeId: string;
    }, {
        projectId: string;
        componentId: string;
        recipeId: string;
    }>;
    readonly save_project_recipe: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        intentKeywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        avoidWhen: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        restraintLevel: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        projectId: string;
        componentId: string;
        description?: string | undefined;
        intentKeywords?: string[] | undefined;
        avoidWhen?: string[] | undefined;
        restraintLevel?: number | undefined;
    }, {
        name: string;
        projectId: string;
        componentId: string;
        description?: string | undefined;
        intentKeywords?: string[] | undefined;
        avoidWhen?: string[] | undefined;
        restraintLevel?: number | undefined;
    }>;
    readonly list_project_recipes: z.ZodObject<{
        projectId: z.ZodString;
        query: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        query?: string | undefined;
    }, {
        projectId: string;
        query?: string | undefined;
    }>;
    readonly apply_project_recipe: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        recipeId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        recipeId: string;
    }, {
        projectId: string;
        componentId: string;
        recipeId: string;
    }>;
    readonly delete_project_recipe: z.ZodObject<{
        projectId: z.ZodString;
        recipeId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        recipeId: string;
    }, {
        projectId: string;
        recipeId: string;
    }>;
    readonly seed_project_recipes: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly list_brand_packs: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly apply_brand_pack: z.ZodObject<{
        projectId: z.ZodString;
        packId: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        packId: string;
        componentId?: string | undefined;
    }, {
        projectId: string;
        packId: string;
        componentId?: string | undefined;
    }>;
    readonly delete_brand_pack: z.ZodObject<{
        projectId: z.ZodString;
        packId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        packId: string;
    }, {
        projectId: string;
        packId: string;
    }>;
    readonly seed_brand_packs: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly set_motion_profile: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<["hero", "supporting", "background", "cta", "decorative", "data", "navigation"]>>;
        temperament: z.ZodOptional<z.ZodEnum<["bold", "subtle", "urgent", "calm", "playful", "precise", "dramatic", "friendly"]>>;
        interactionStyle: z.ZodOptional<z.ZodEnum<["passive", "reactive", "interactive"]>>;
        visualWeight: z.ZodOptional<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        role?: "background" | "data" | "hero" | "supporting" | "cta" | "decorative" | "navigation" | undefined;
        temperament?: "playful" | "calm" | "dramatic" | "urgent" | "bold" | "subtle" | "precise" | "friendly" | undefined;
        interactionStyle?: "passive" | "reactive" | "interactive" | undefined;
        visualWeight?: number | undefined;
        notes?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        role?: "background" | "data" | "hero" | "supporting" | "cta" | "decorative" | "navigation" | undefined;
        temperament?: "playful" | "calm" | "dramatic" | "urgent" | "bold" | "subtle" | "precise" | "friendly" | undefined;
        interactionStyle?: "passive" | "reactive" | "interactive" | undefined;
        visualWeight?: number | undefined;
        notes?: string | undefined;
    }>;
    readonly get_motion_profile: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
    }, {
        projectId: string;
        componentId: string;
    }>;
    readonly list_motion_profiles: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly suggest_motion_profile: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
    }, {
        projectId: string;
        componentId: string;
    }>;
    readonly apply_motion_profile: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
    }, {
        projectId: string;
        componentId: string;
    }>;
    readonly save_motion_capture: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        samples: z.ZodArray<z.ZodObject<{
            t: z.ZodNumber;
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            t: number;
        }, {
            x: number;
            y: number;
            t: number;
        }>, "many">;
        originX: z.ZodOptional<z.ZodNumber>;
        originY: z.ZodOptional<z.ZodNumber>;
        normalize: z.ZodOptional<z.ZodBoolean>;
        smoothing: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        projectId: string;
        samples: {
            x: number;
            y: number;
            t: number;
        }[];
        description?: string | undefined;
        smoothing?: number | undefined;
        originX?: number | undefined;
        originY?: number | undefined;
        normalize?: boolean | undefined;
    }, {
        name: string;
        projectId: string;
        samples: {
            x: number;
            y: number;
            t: number;
        }[];
        description?: string | undefined;
        smoothing?: number | undefined;
        originX?: number | undefined;
        originY?: number | undefined;
        normalize?: boolean | undefined;
    }>;
    readonly list_motion_captures: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly apply_motion_capture: z.ZodObject<{
        projectId: z.ZodString;
        captureId: z.ZodString;
        componentId: z.ZodString;
        normalize: z.ZodOptional<z.ZodBoolean>;
        smoothing: z.ZodOptional<z.ZodNumber>;
        snap: z.ZodOptional<z.ZodNumber>;
        maxKeyframes: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        captureId: string;
        snap?: number | undefined;
        smoothing?: number | undefined;
        normalize?: boolean | undefined;
        maxKeyframes?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        captureId: string;
        snap?: number | undefined;
        smoothing?: number | undefined;
        normalize?: boolean | undefined;
        maxKeyframes?: number | undefined;
    }>;
    readonly delete_motion_capture: z.ZodObject<{
        projectId: z.ZodString;
        captureId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        captureId: string;
    }, {
        projectId: string;
        captureId: string;
    }>;
    readonly seed_motion_captures: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly list_export_presets: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly recommend_export_format: z.ZodObject<{
        projectId: z.ZodString;
        hint: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        hint?: string | undefined;
    }, {
        projectId: string;
        hint?: string | undefined;
    }>;
    readonly apply_export_preset: z.ZodObject<{
        projectId: z.ZodString;
        presetId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        presetId: string;
    }, {
        projectId: string;
        presetId: string;
    }>;
    readonly save_session_snapshot: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodString;
        parentId: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        messageCount: z.ZodOptional<z.ZodNumber>;
        toolsUsed: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        projectId: string;
        parentId?: string | undefined;
        componentIds?: string[] | undefined;
        tags?: string[] | undefined;
        summary?: string | undefined;
        messageCount?: number | undefined;
        toolsUsed?: string[] | undefined;
    }, {
        name: string;
        projectId: string;
        parentId?: string | undefined;
        componentIds?: string[] | undefined;
        tags?: string[] | undefined;
        summary?: string | undefined;
        messageCount?: number | undefined;
        toolsUsed?: string[] | undefined;
    }>;
    readonly list_session_snapshots: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly resume_session_snapshot: z.ZodObject<{
        projectId: z.ZodString;
        sessionId: z.ZodString;
        summary: z.ZodOptional<z.ZodString>;
        messageCount: z.ZodOptional<z.ZodNumber>;
        toolsUsed: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        sessionId: string;
        componentIds?: string[] | undefined;
        tags?: string[] | undefined;
        summary?: string | undefined;
        messageCount?: number | undefined;
        toolsUsed?: string[] | undefined;
    }, {
        projectId: string;
        sessionId: string;
        componentIds?: string[] | undefined;
        tags?: string[] | undefined;
        summary?: string | undefined;
        messageCount?: number | undefined;
        toolsUsed?: string[] | undefined;
    }>;
    readonly get_session_lineage: z.ZodObject<{
        projectId: z.ZodString;
        sessionId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        sessionId?: string | undefined;
    }, {
        projectId: string;
        sessionId?: string | undefined;
    }>;
    readonly delete_session_snapshot: z.ZodObject<{
        projectId: z.ZodString;
        sessionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        sessionId: string;
    }, {
        projectId: string;
        sessionId: string;
    }>;
    readonly check_accessibility: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId?: string | undefined;
    }, {
        projectId: string;
        componentId?: string | undefined;
    }>;
    readonly check_performance: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId?: string | undefined;
    }, {
        projectId: string;
        componentId?: string | undefined;
    }>;
    readonly create_beat: z.ZodObject<{
        projectId: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        sceneId: z.ZodOptional<z.ZodString>;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        transition: z.ZodOptional<z.ZodEnum<["cut", "fade", "slide", "zoom", "dissolve", "wipe"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        title: string;
        sceneId?: string | undefined;
        durationMs?: number | undefined;
        description?: string | undefined;
        componentIds?: string[] | undefined;
        transition?: "zoom" | "dissolve" | "cut" | "wipe" | "fade" | "slide" | undefined;
    }, {
        projectId: string;
        title: string;
        sceneId?: string | undefined;
        durationMs?: number | undefined;
        description?: string | undefined;
        componentIds?: string[] | undefined;
        transition?: "zoom" | "dissolve" | "cut" | "wipe" | "fade" | "slide" | undefined;
    }>;
    readonly list_beats: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly update_beat: z.ZodObject<{
        projectId: z.ZodString;
        beatId: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        sceneId: z.ZodOptional<z.ZodString>;
        componentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        transition: z.ZodOptional<z.ZodEnum<["cut", "fade", "slide", "zoom", "dissolve", "wipe"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        beatId: string;
        sceneId?: string | undefined;
        durationMs?: number | undefined;
        description?: string | undefined;
        title?: string | undefined;
        componentIds?: string[] | undefined;
        transition?: "zoom" | "dissolve" | "cut" | "wipe" | "fade" | "slide" | undefined;
    }, {
        projectId: string;
        beatId: string;
        sceneId?: string | undefined;
        durationMs?: number | undefined;
        description?: string | undefined;
        title?: string | undefined;
        componentIds?: string[] | undefined;
        transition?: "zoom" | "dissolve" | "cut" | "wipe" | "fade" | "slide" | undefined;
    }>;
    readonly reorder_beats: z.ZodObject<{
        projectId: z.ZodString;
        beatIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        beatIds: string[];
    }, {
        projectId: string;
        beatIds: string[];
    }>;
    readonly delete_beat: z.ZodObject<{
        projectId: z.ZodString;
        beatId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        beatId: string;
    }, {
        projectId: string;
        beatId: string;
    }>;
    readonly export_storyboard: z.ZodObject<{
        projectId: z.ZodString;
        format: z.ZodDefault<z.ZodEnum<["markdown", "json"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        format: "markdown" | "json";
    }, {
        projectId: string;
        format?: "markdown" | "json" | undefined;
    }>;
    readonly save_memory: z.ZodObject<{
        projectId: z.ZodString;
        key: z.ZodString;
        value: z.ZodString;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        key: string;
        projectId: string;
        tags?: string[] | undefined;
    }, {
        value: string;
        key: string;
        projectId: string;
        tags?: string[] | undefined;
    }>;
    readonly recall_memory: z.ZodObject<{
        projectId: z.ZodString;
        query: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        query: string;
    }, {
        projectId: string;
        query: string;
    }>;
    readonly list_generated_skills: z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        projectId?: string | undefined;
    }, {
        projectId?: string | undefined;
        limit?: number | undefined;
    }>;
    readonly compile_grammar: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        source: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        source: string;
    }, {
        projectId: string;
        componentId: string;
        source: string;
    }>;
    readonly parse_motion: z.ZodObject<{
        projectId: z.ZodString;
        description: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        description: string;
        componentId?: string | undefined;
    }, {
        projectId: string;
        description: string;
        componentId?: string | undefined;
    }>;
    readonly set_shader_effect: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        effectId: z.ZodString;
        intensity: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        effectId: string;
        intensity?: number | undefined;
    }, {
        projectId: string;
        componentId: string;
        effectId: string;
        intensity?: number | undefined;
    }>;
    readonly save_version: z.ZodObject<{
        projectId: z.ZodString;
        label: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        label: string;
    }, {
        projectId: string;
        label: string;
    }>;
    readonly list_versions: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly restore_version: z.ZodObject<{
        projectId: z.ZodString;
        versionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        versionId: string;
    }, {
        projectId: string;
        versionId: string;
    }>;
    readonly delete_version: z.ZodObject<{
        projectId: z.ZodString;
        versionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        versionId: string;
    }, {
        projectId: string;
        versionId: string;
    }>;
    readonly save_token: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodString;
        category: z.ZodEnum<["duration", "easing", "color", "spacing", "radius", "shadow", "font"]>;
        value: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        name: string;
        projectId: string;
        category: "color" | "easing" | "radius" | "spacing" | "duration" | "shadow" | "font";
        description?: string | undefined;
    }, {
        value: string;
        name: string;
        projectId: string;
        category: "color" | "easing" | "radius" | "spacing" | "duration" | "shadow" | "font";
        description?: string | undefined;
    }>;
    readonly list_tokens: z.ZodObject<{
        projectId: z.ZodString;
        category: z.ZodOptional<z.ZodEnum<["duration", "easing", "color", "spacing", "radius", "shadow", "font"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        category?: "color" | "easing" | "radius" | "spacing" | "duration" | "shadow" | "font" | undefined;
    }, {
        projectId: string;
        category?: "color" | "easing" | "radius" | "spacing" | "duration" | "shadow" | "font" | undefined;
    }>;
    readonly update_token: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodString;
        value: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        projectId: string;
        value?: string | undefined;
        description?: string | undefined;
    }, {
        name: string;
        projectId: string;
        value?: string | undefined;
        description?: string | undefined;
    }>;
    readonly delete_token: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        projectId: string;
    }, {
        name: string;
        projectId: string;
    }>;
    readonly export_lottie: z.ZodObject<{
        projectId: z.ZodString;
        fps: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        fps?: number | undefined;
    }, {
        projectId: string;
        fps?: number | undefined;
    }>;
    readonly save_pipeline: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        steps: z.ZodArray<z.ZodObject<{
            tool: z.ZodString;
            args: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            tool: string;
            args: Record<string, unknown>;
            description?: string | undefined;
        }, {
            tool: string;
            args: Record<string, unknown>;
            description?: string | undefined;
        }>, "many">;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        projectId: string;
        steps: {
            tool: string;
            args: Record<string, unknown>;
            description?: string | undefined;
        }[];
        description?: string | undefined;
        tags?: string[] | undefined;
    }, {
        name: string;
        projectId: string;
        steps: {
            tool: string;
            args: Record<string, unknown>;
            description?: string | undefined;
        }[];
        description?: string | undefined;
        tags?: string[] | undefined;
    }>;
    readonly list_pipelines: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly run_pipeline: z.ZodObject<{
        projectId: z.ZodString;
        pipelineId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        pipelineId: string;
    }, {
        projectId: string;
        pipelineId: string;
    }>;
    readonly delete_pipeline: z.ZodObject<{
        projectId: z.ZodString;
        pipelineId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        pipelineId: string;
    }, {
        projectId: string;
        pipelineId: string;
    }>;
    readonly analyze_mood: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId?: string | undefined;
    }, {
        projectId: string;
        componentId?: string | undefined;
    }>;
    readonly set_mood: z.ZodObject<{
        projectId: z.ZodString;
        mood: z.ZodEnum<["premium", "playful", "calm", "energetic", "dramatic", "minimal", "confident", "gentle", "urgent", "nostalgic"]>;
        componentId: z.ZodOptional<z.ZodString>;
        scope: z.ZodDefault<z.ZodEnum<["component", "project"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        mood: "playful" | "calm" | "energetic" | "dramatic" | "minimal" | "premium" | "confident" | "gentle" | "urgent" | "nostalgic";
        scope: "project" | "component";
        componentId?: string | undefined;
    }, {
        projectId: string;
        mood: "playful" | "calm" | "energetic" | "dramatic" | "minimal" | "premium" | "confident" | "gentle" | "urgent" | "nostalgic";
        componentId?: string | undefined;
        scope?: "project" | "component" | undefined;
    }>;
    readonly suggest_creative: z.ZodObject<{
        projectId: z.ZodString;
        surprise: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        surprise: boolean;
    }, {
        projectId: string;
        surprise?: boolean | undefined;
    }>;
    readonly analyze_visual_context: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId?: string | undefined;
    }, {
        projectId: string;
        componentId?: string | undefined;
    }>;
    readonly synthesize_code: z.ZodObject<{
        projectId: z.ZodString;
        description: z.ZodString;
        format: z.ZodDefault<z.ZodEnum<["css", "react", "html", "vanilla"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        description: string;
        format: "css" | "react" | "html" | "vanilla";
    }, {
        projectId: string;
        description: string;
        format?: "css" | "react" | "html" | "vanilla" | undefined;
    }>;
    readonly compose_state_machine: z.ZodObject<{
        projectId: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        presetId: z.ZodOptional<z.ZodEnum<["hover-press", "toggle-on-off", "loading-sequence", "carousel", "tab-switch"]>>;
        componentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        projectId: string;
        componentIds: string[];
        description?: string | undefined;
        presetId?: "hover-press" | "toggle-on-off" | "loading-sequence" | "carousel" | "tab-switch" | undefined;
    }, {
        name: string;
        projectId: string;
        description?: string | undefined;
        componentIds?: string[] | undefined;
        presetId?: "hover-press" | "toggle-on-off" | "loading-sequence" | "carousel" | "tab-switch" | undefined;
    }>;
    readonly list_state_machines: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly trigger_state_machine: z.ZodObject<{
        projectId: z.ZodString;
        machineId: z.ZodString;
        stateName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        machineId: string;
        stateName: string;
    }, {
        projectId: string;
        machineId: string;
        stateName: string;
    }>;
    readonly analyze_principles: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId?: string | undefined;
    }, {
        projectId: string;
        componentId?: string | undefined;
    }>;
    readonly apply_principle: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        principle: z.ZodEnum<["squash_stretch", "anticipation", "staging", "slow_in_out", "arcs", "secondary_action", "timing", "exaggeration", "solid_drawing", "appeal", "follow_through", "overlapping_action"]>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        principle: "squash_stretch" | "anticipation" | "staging" | "slow_in_out" | "arcs" | "secondary_action" | "timing" | "exaggeration" | "solid_drawing" | "appeal" | "follow_through" | "overlapping_action";
    }, {
        projectId: string;
        componentId: string;
        principle: "squash_stretch" | "anticipation" | "staging" | "slow_in_out" | "arcs" | "secondary_action" | "timing" | "exaggeration" | "solid_drawing" | "appeal" | "follow_through" | "overlapping_action";
    }>;
    readonly synthesize_easing: z.ZodObject<{
        description: z.ZodString;
        format: z.ZodDefault<z.ZodEnum<["bezier", "spring", "css"]>>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        format: "bezier" | "spring" | "css";
    }, {
        description: string;
        format?: "bezier" | "spring" | "css" | undefined;
    }>;
    readonly apply_choreography: z.ZodObject<{
        projectId: z.ZodString;
        pattern: z.ZodEnum<["cascade", "call_response", "unison", "counterpoint", "wave", "canon", "stagger_grid", "ripple_out"]>;
        baseDelayMs: z.ZodOptional<z.ZodNumber>;
        baseDurationMs: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        pattern: "cascade" | "call_response" | "unison" | "counterpoint" | "wave" | "canon" | "stagger_grid" | "ripple_out";
        baseDelayMs?: number | undefined;
        baseDurationMs?: number | undefined;
    }, {
        projectId: string;
        pattern: "cascade" | "call_response" | "unison" | "counterpoint" | "wave" | "canon" | "stagger_grid" | "ripple_out";
        baseDelayMs?: number | undefined;
        baseDurationMs?: number | undefined;
    }>;
    readonly blend_motions: z.ZodObject<{
        projectId: z.ZodString;
        sourceComponentId: z.ZodString;
        targetComponentId: z.ZodString;
        ratio: z.ZodDefault<z.ZodNumber>;
        applyTo: z.ZodDefault<z.ZodEnum<["source", "new"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        targetComponentId: string;
        sourceComponentId: string;
        applyTo: "source" | "new";
        ratio: number;
    }, {
        projectId: string;
        targetComponentId: string;
        sourceComponentId: string;
        applyTo?: "source" | "new" | undefined;
        ratio?: number | undefined;
    }>;
    readonly interpolate_motion: z.ZodObject<{
        projectId: z.ZodString;
        sourceComponentId: z.ZodString;
        targetComponentId: z.ZodString;
        steps: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        steps: number;
        targetComponentId: string;
        sourceComponentId: string;
    }, {
        projectId: string;
        targetComponentId: string;
        sourceComponentId: string;
        steps?: number | undefined;
    }>;
    readonly merge_properties: z.ZodObject<{
        projectId: z.ZodString;
        sourceComponentId: z.ZodString;
        targetComponentId: z.ZodString;
        applyTo: z.ZodDefault<z.ZodEnum<["source", "new"]>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        targetComponentId: string;
        sourceComponentId: string;
        applyTo: "source" | "new";
    }, {
        projectId: string;
        targetComponentId: string;
        sourceComponentId: string;
        applyTo?: "source" | "new" | undefined;
    }>;
    readonly analyze_emotion: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_rhythm: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_narrative: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly adapt_motion: z.ZodObject<{
        projectId: z.ZodString;
        device: z.ZodEnum<["desktop", "tablet", "mobile", "tv"]>;
        viewportWidth: z.ZodNumber;
        viewportHeight: z.ZodNumber;
        performance: z.ZodEnum<["high", "medium", "low"]>;
        accessibility: z.ZodEnum<["full", "reduced", "minimal"]>;
        connectionSpeed: z.ZodEnum<["fast", "slow", "offline"]>;
        batteryLevel: z.ZodDefault<z.ZodNumber>;
        apply: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        device: "desktop" | "tablet" | "mobile" | "tv";
        viewportWidth: number;
        viewportHeight: number;
        performance: "low" | "medium" | "high";
        accessibility: "minimal" | "full" | "reduced";
        connectionSpeed: "fast" | "slow" | "offline";
        batteryLevel: number;
        apply: boolean;
    }, {
        projectId: string;
        device: "desktop" | "tablet" | "mobile" | "tv";
        viewportWidth: number;
        viewportHeight: number;
        performance: "low" | "medium" | "high";
        accessibility: "minimal" | "full" | "reduced";
        connectionSpeed: "fast" | "slow" | "offline";
        batteryLevel?: number | undefined;
        apply?: boolean | undefined;
    }>;
    readonly preview_adaptations: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly generate_responsive_css: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly synthesize_motion: z.ZodObject<{
        projectId: z.ZodString;
        pattern: z.ZodEnum<["heartbeat", "breathing", "walk-cycle", "bounce-ball", "pendulum", "ocean-wave", "tremor", "fidget", "heartbeat-fast", "shake-violent", "sway-gentle", "orbit-elliptical"]>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        loopCount: z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"infinite">]>>>;
        amplitudeScale: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        speedScale: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        componentName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        pattern: "heartbeat" | "breathing" | "walk-cycle" | "bounce-ball" | "pendulum" | "ocean-wave" | "tremor" | "fidget" | "heartbeat-fast" | "shake-violent" | "sway-gentle" | "orbit-elliptical";
        amplitudeScale: number;
        loopCount: number | "infinite";
        speedScale: number;
        durationMs?: number | undefined;
        componentName?: string | undefined;
    }, {
        projectId: string;
        pattern: "heartbeat" | "breathing" | "walk-cycle" | "bounce-ball" | "pendulum" | "ocean-wave" | "tremor" | "fidget" | "heartbeat-fast" | "shake-violent" | "sway-gentle" | "orbit-elliptical";
        durationMs?: number | undefined;
        amplitudeScale?: number | undefined;
        loopCount?: number | "infinite" | undefined;
        speedScale?: number | undefined;
        componentName?: string | undefined;
    }>;
    readonly morph_to_pattern: z.ZodObject<{
        projectId: z.ZodString;
        targetPattern: z.ZodEnum<["heartbeat", "breathing", "walk-cycle", "bounce-ball", "pendulum", "ocean-wave", "tremor", "fidget", "heartbeat-fast", "shake-violent", "sway-gentle", "orbit-elliptical"]>;
        morphSteps: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        durationMs: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        targetPattern: "heartbeat" | "breathing" | "walk-cycle" | "bounce-ball" | "pendulum" | "ocean-wave" | "tremor" | "fidget" | "heartbeat-fast" | "shake-violent" | "sway-gentle" | "orbit-elliptical";
        morphSteps: number;
        durationMs?: number | undefined;
    }, {
        projectId: string;
        targetPattern: "heartbeat" | "breathing" | "walk-cycle" | "bounce-ball" | "pendulum" | "ocean-wave" | "tremor" | "fidget" | "heartbeat-fast" | "shake-violent" | "sway-gentle" | "orbit-elliptical";
        durationMs?: number | undefined;
        morphSteps?: number | undefined;
    }>;
    readonly synthesize_waveform: z.ZodObject<{
        projectId: z.ZodString;
        waveform: z.ZodEnum<["sine", "square", "triangle", "sawtooth", "noise", "pulse"]>;
        amplitude: z.ZodNumber;
        frequency: z.ZodNumber;
        phase: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        property: z.ZodEnum<["translateX", "translateY", "scale", "scaleX", "scaleY", "rotate", "opacity"]>;
        durationMs: z.ZodDefault<z.ZodNumber>;
        loopCount: z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"infinite">]>>>;
        componentName: z.ZodOptional<z.ZodString>;
        keyframeCount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        offset: number;
        projectId: string;
        durationMs: number;
        property: "translateX" | "translateY" | "scale" | "scaleX" | "scaleY" | "rotate" | "opacity";
        frequency: number;
        amplitude: number;
        phase: number;
        loopCount: number | "infinite";
        waveform: "triangle" | "sine" | "square" | "sawtooth" | "noise" | "pulse";
        keyframeCount: number;
        componentName?: string | undefined;
    }, {
        projectId: string;
        property: "translateX" | "translateY" | "scale" | "scaleX" | "scaleY" | "rotate" | "opacity";
        frequency: number;
        amplitude: number;
        waveform: "triangle" | "sine" | "square" | "sawtooth" | "noise" | "pulse";
        offset?: number | undefined;
        durationMs?: number | undefined;
        phase?: number | undefined;
        loopCount?: number | "infinite" | undefined;
        componentName?: string | undefined;
        keyframeCount?: number | undefined;
    }>;
    readonly create_story_arc: z.ZodObject<{
        projectId: z.ZodString;
        genre: z.ZodEnum<["hero", "mystery", "romance", "comedy", "thriller", "documentary", "fantasy", "horror"]>;
        totalDurationMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        totalDurationMs: number;
        genre: "hero" | "mystery" | "romance" | "comedy" | "thriller" | "documentary" | "fantasy" | "horror";
    }, {
        projectId: string;
        genre: "hero" | "mystery" | "romance" | "comedy" | "thriller" | "documentary" | "fantasy" | "horror";
        totalDurationMs?: number | undefined;
    }>;
    readonly analyze_pacing: z.ZodObject<{
        projectId: z.ZodString;
        arcId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        arcId?: string | undefined;
    }, {
        projectId: string;
        arcId?: string | undefined;
    }>;
    readonly apply_story_plan: z.ZodObject<{
        projectId: z.ZodString;
        genre: z.ZodEnum<["hero", "mystery", "romance", "comedy", "thriller", "documentary", "fantasy", "horror"]>;
        totalDurationMs: z.ZodDefault<z.ZodNumber>;
        apply: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        totalDurationMs: number;
        apply: boolean;
        genre: "hero" | "mystery" | "romance" | "comedy" | "thriller" | "documentary" | "fantasy" | "horror";
    }, {
        projectId: string;
        genre: "hero" | "mystery" | "romance" | "comedy" | "thriller" | "documentary" | "fantasy" | "horror";
        totalDurationMs?: number | undefined;
        apply?: boolean | undefined;
    }>;
    readonly generate_image: z.ZodObject<{
        prompt: z.ZodString;
        model: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        negativePrompt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        width?: number | undefined;
        height?: number | undefined;
        model?: string | undefined;
        negativePrompt?: string | undefined;
    }, {
        prompt: string;
        width?: number | undefined;
        height?: number | undefined;
        model?: string | undefined;
        negativePrompt?: string | undefined;
    }>;
    readonly generate_speech: z.ZodObject<{
        text: z.ZodString;
        model: z.ZodOptional<z.ZodString>;
        voiceId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        model?: string | undefined;
        voiceId?: string | undefined;
    }, {
        text: string;
        model?: string | undefined;
        voiceId?: string | undefined;
    }>;
    readonly generate_video: z.ZodObject<{
        prompt: z.ZodString;
        model: z.ZodOptional<z.ZodString>;
        duration: z.ZodOptional<z.ZodNumber>;
        sourceImage: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        duration?: number | undefined;
        model?: string | undefined;
        sourceImage?: string | undefined;
    }, {
        prompt: string;
        duration?: number | undefined;
        model?: string | undefined;
        sourceImage?: string | undefined;
    }>;
    readonly generate_3d: z.ZodObject<{
        prompt: z.ZodString;
        model: z.ZodOptional<z.ZodString>;
        sourceImage: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        model?: string | undefined;
        sourceImage?: string | undefined;
    }, {
        prompt: string;
        model?: string | undefined;
        sourceImage?: string | undefined;
    }>;
    readonly list_models: z.ZodObject<{
        provider: z.ZodOptional<z.ZodString>;
        modality: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        provider?: string | undefined;
        modality?: string | undefined;
    }, {
        provider?: string | undefined;
        modality?: string | undefined;
    }>;
    readonly editor_zoom_canvas: z.ZodObject<{
        zoom: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        zoom: number;
    }, {
        zoom: number;
    }>;
    readonly editor_pan_canvas: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>;
    readonly editor_fit_to_screen: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly editor_reset_view: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly editor_set_playhead: z.ZodObject<{
        timeMs: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        timeMs: number;
    }, {
        timeMs: number;
    }>;
    readonly editor_set_playback_speed: z.ZodObject<{
        speed: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        speed: number;
    }, {
        speed: number;
    }>;
    readonly editor_play: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly editor_pause: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly editor_toggle_rulers: z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled?: boolean | undefined;
    }, {
        enabled?: boolean | undefined;
    }>;
    readonly editor_toggle_snap: z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        gridSize: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled?: boolean | undefined;
        gridSize?: number | undefined;
    }, {
        enabled?: boolean | undefined;
        gridSize?: number | undefined;
    }>;
    readonly editor_toggle_auto_keyframe: z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled?: boolean | undefined;
    }, {
        enabled?: boolean | undefined;
    }>;
    readonly editor_toggle_onion_skin: z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        frames: z.ZodOptional<z.ZodNumber>;
        opacity: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        opacity?: number | undefined;
        enabled?: boolean | undefined;
        frames?: number | undefined;
    }, {
        opacity?: number | undefined;
        enabled?: boolean | undefined;
        frames?: number | undefined;
    }>;
    readonly editor_select_component: z.ZodObject<{
        componentId: z.ZodString;
        additive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        componentId: string;
        additive?: boolean | undefined;
    }, {
        componentId: string;
        additive?: boolean | undefined;
    }>;
    readonly editor_select_components: z.ZodObject<{
        componentIds: z.ZodArray<z.ZodString, "many">;
        clearFirst: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        componentIds: string[];
        clearFirst?: boolean | undefined;
    }, {
        componentIds: string[];
        clearFirst?: boolean | undefined;
    }>;
    readonly editor_clear_selection: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly editor_toggle_visibility: z.ZodObject<{
        componentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        componentId: string;
    }, {
        componentId: string;
    }>;
    readonly editor_toggle_lock: z.ZodObject<{
        componentId: z.ZodString;
        locked: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        componentId: string;
        locked?: boolean | undefined;
    }, {
        componentId: string;
        locked?: boolean | undefined;
    }>;
    readonly editor_set_panel: z.ZodObject<{
        category: z.ZodEnum<["design", "motion", "intel", "assets", "output"]>;
        tab: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        category: "output" | "design" | "motion" | "intel" | "assets";
        tab?: string | undefined;
    }, {
        category: "output" | "design" | "motion" | "intel" | "assets";
        tab?: string | undefined;
    }>;
    readonly editor_toggle_panel: z.ZodObject<{
        collapsed: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        collapsed?: boolean | undefined;
    }, {
        collapsed?: boolean | undefined;
    }>;
    readonly editor_open_overlay: z.ZodObject<{
        overlay: z.ZodEnum<["preview", "export", "templates", "settings", "command_palette"]>;
        open: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        overlay: "preview" | "export" | "templates" | "settings" | "command_palette";
        open?: boolean | undefined;
    }, {
        overlay: "preview" | "export" | "templates" | "settings" | "command_palette";
        open?: boolean | undefined;
    }>;
    readonly editor_undo: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly editor_redo: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly editor_set_artboard: z.ZodObject<{
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        background: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        width?: number | undefined;
        height?: number | undefined;
        background?: string | undefined;
    }, {
        width?: number | undefined;
        height?: number | undefined;
        background?: string | undefined;
    }>;
    readonly editor_trigger_replay: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly editor_toggle_motion_paths: z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled?: boolean | undefined;
    }, {
        enabled?: boolean | undefined;
    }>;
    readonly editor_toggle_performance_monitor: z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled?: boolean | undefined;
    }, {
        enabled?: boolean | undefined;
    }>;
    readonly editor_set_solo: z.ZodObject<{
        componentId: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        componentId: string | null;
    }, {
        componentId: string | null;
    }>;
    readonly editor_toggle_sidebar: z.ZodObject<{
        collapsed: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        collapsed?: boolean | undefined;
    }, {
        collapsed?: boolean | undefined;
    }>;
    readonly editor_timeline_command: z.ZodObject<{
        action: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        action: string;
    }, {
        action: string;
    }>;
    readonly editor_toggle_selection: z.ZodObject<{
        componentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        componentId: string;
    }, {
        componentId: string;
    }>;
    readonly editor_open_skills: z.ZodObject<{
        open: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        open?: boolean | undefined;
    }, {
        open?: boolean | undefined;
    }>;
    readonly editor_open_shortcuts: z.ZodObject<{
        open: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        open?: boolean | undefined;
    }, {
        open?: boolean | undefined;
    }>;
    readonly editor_set_track_order: z.ZodObject<{
        trackIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        trackIds: string[];
    }, {
        trackIds: string[];
    }>;
    readonly editor_set_loop_region: z.ZodObject<{
        startMs: z.ZodNumber;
        endMs: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        startMs: number;
        endMs: number;
    }, {
        startMs: number;
        endMs: number;
    }>;
    readonly editor_clear_loop_region: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly rollback_last_action: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly list_checkpoints: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly rollback_to_checkpoint: z.ZodObject<{
        projectId: z.ZodString;
        checkpointId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        checkpointId: string;
    }, {
        projectId: string;
        checkpointId: string;
    }>;
    readonly cancel_plan: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly get_plan_state: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly seek_to_frame: z.ZodObject<{
        projectId: z.ZodString;
        frame: z.ZodNumber;
        fps: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        frame: number;
        fps?: number | undefined;
    }, {
        projectId: string;
        frame: number;
        fps?: number | undefined;
    }>;
    readonly render_frames: z.ZodObject<{
        projectId: z.ZodString;
        startFrame: z.ZodOptional<z.ZodNumber>;
        endFrame: z.ZodOptional<z.ZodNumber>;
        fps: z.ZodOptional<z.ZodNumber>;
        sampleStep: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        fps?: number | undefined;
        startFrame?: number | undefined;
        endFrame?: number | undefined;
        sampleStep?: number | undefined;
    }, {
        projectId: string;
        fps?: number | undefined;
        startFrame?: number | undefined;
        endFrame?: number | undefined;
        sampleStep?: number | undefined;
    }>;
    readonly export_html_composition: z.ZodObject<{
        projectId: z.ZodString;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        fps: z.ZodOptional<z.ZodNumber>;
        includeControls: z.ZodOptional<z.ZodBoolean>;
        loop: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        width?: number | undefined;
        height?: number | undefined;
        loop?: boolean | undefined;
        fps?: number | undefined;
        includeControls?: boolean | undefined;
    }, {
        projectId: string;
        width?: number | undefined;
        height?: number | undefined;
        loop?: boolean | undefined;
        fps?: number | undefined;
        includeControls?: boolean | undefined;
    }>;
    readonly resolve_media: z.ZodObject<{
        modality: z.ZodEnum<["audio", "image", "video", "voice", "icon", "logo", "lut", "font"]>;
        purpose: z.ZodEnum<["background-music", "sound-effect", "voiceover", "background-image", "foreground-image", "transition", "overlay", "color-grade", "caption", "watermark"]>;
        description: z.ZodString;
        durationSec: z.ZodOptional<z.ZodNumber>;
        allowGeneration: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        modality: "image" | "video" | "audio" | "font" | "voice" | "icon" | "logo" | "lut";
        purpose: "overlay" | "transition" | "background-music" | "sound-effect" | "voiceover" | "background-image" | "foreground-image" | "color-grade" | "caption" | "watermark";
        durationSec?: number | undefined;
        allowGeneration?: boolean | undefined;
    }, {
        description: string;
        modality: "image" | "video" | "audio" | "font" | "voice" | "icon" | "logo" | "lut";
        purpose: "overlay" | "transition" | "background-music" | "sound-effect" | "voiceover" | "background-image" | "foreground-image" | "color-grade" | "caption" | "watermark";
        durationSec?: number | undefined;
        allowGeneration?: boolean | undefined;
    }>;
    readonly route_skill: z.ZodObject<{
        userInput: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userInput: string;
    }, {
        userInput: string;
    }>;
    readonly list_skills: z.ZodObject<{
        category: z.ZodOptional<z.ZodEnum<["creation", "analysis", "optimization", "export", "editing", "intelligence"]>>;
    }, "strip", z.ZodTypeAny, {
        category?: "export" | "creation" | "analysis" | "optimization" | "editing" | "intelligence" | undefined;
    }, {
        category?: "export" | "creation" | "analysis" | "optimization" | "editing" | "intelligence" | undefined;
    }>;
    readonly plan_sequence: z.ZodObject<{
        description: z.ZodString;
        arc: z.ZodOptional<z.ZodEnum<["hero-journey", "product-launch", "tutorial", "product-reveal", "emotional-arc", "action-sequence", "documentary", "celebration"]>>;
        totalDurationMs: z.ZodOptional<z.ZodNumber>;
        sceneCount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        totalDurationMs?: number | undefined;
        arc?: "documentary" | "hero-journey" | "product-launch" | "tutorial" | "product-reveal" | "emotional-arc" | "action-sequence" | "celebration" | undefined;
        sceneCount?: number | undefined;
    }, {
        description: string;
        totalDurationMs?: number | undefined;
        arc?: "documentary" | "hero-journey" | "product-launch" | "tutorial" | "product-reveal" | "emotional-arc" | "action-sequence" | "celebration" | undefined;
        sceneCount?: number | undefined;
    }>;
    readonly list_narrative_arcs: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
    readonly list_motion_themes: z.ZodObject<{
        personality: z.ZodOptional<z.ZodEnum<["precise", "organic", "playful", "dramatic", "minimal", "luxurious", "technical", "warm"]>>;
    }, "strip", z.ZodTypeAny, {
        personality?: "playful" | "dramatic" | "minimal" | "organic" | "precise" | "luxurious" | "technical" | "warm" | undefined;
    }, {
        personality?: "playful" | "dramatic" | "minimal" | "organic" | "precise" | "luxurious" | "technical" | "warm" | undefined;
    }>;
    readonly apply_motion_theme: z.ZodObject<{
        projectId: z.ZodString;
        themeId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        themeId: string;
    }, {
        projectId: string;
        themeId: string;
    }>;
    readonly list_rhythm_patterns: z.ZodObject<{
        category: z.ZodOptional<z.ZodEnum<["metric", "expressive", "biological", "compound"]>>;
    }, "strip", z.ZodTypeAny, {
        category?: "metric" | "expressive" | "biological" | "compound" | undefined;
    }, {
        category?: "metric" | "expressive" | "biological" | "compound" | undefined;
    }>;
    readonly apply_rhythm: z.ZodObject<{
        patternId: z.ZodEnum<["steady-beat", "syncopated", "swing", "rubato", "polyrhythm-3-2", "gallop", "waltz", "fanfare", "heartbeat", "wave-flow", "accelerando", "decelerando"]>;
        itemCount: z.ZodNumber;
        bpm: z.ZodOptional<z.ZodNumber>;
        scale: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        patternId: "heartbeat" | "steady-beat" | "syncopated" | "swing" | "rubato" | "polyrhythm-3-2" | "gallop" | "waltz" | "fanfare" | "wave-flow" | "accelerando" | "decelerando";
        itemCount: number;
        scale?: number | undefined;
        bpm?: number | undefined;
    }, {
        patternId: "heartbeat" | "steady-beat" | "syncopated" | "swing" | "rubato" | "polyrhythm-3-2" | "gallop" | "waltz" | "fanfare" | "wave-flow" | "accelerando" | "decelerando";
        itemCount: number;
        scale?: number | undefined;
        bpm?: number | undefined;
    }>;
    readonly generate_variants: z.ZodObject<{
        projectId: z.ZodString;
        count: z.ZodOptional<z.ZodNumber>;
        strategies: z.ZodOptional<z.ZodArray<z.ZodEnum<["easing", "timing", "choreography", "intensity", "direction", "palette"]>, "many">>;
        seed: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        seed?: number | undefined;
        count?: number | undefined;
        strategies?: ("easing" | "direction" | "choreography" | "intensity" | "timing" | "palette")[] | undefined;
    }, {
        projectId: string;
        seed?: number | undefined;
        count?: number | undefined;
        strategies?: ("easing" | "direction" | "choreography" | "intensity" | "timing" | "palette")[] | undefined;
    }>;
    readonly evolve_motion: z.ZodObject<{
        projectId: z.ZodString;
        strategy: z.ZodOptional<z.ZodEnum<["balanced", "playful", "accessible", "performant", "harmonious"]>>;
        generations: z.ZodOptional<z.ZodNumber>;
        populationSize: z.ZodOptional<z.ZodNumber>;
        mutationRate: z.ZodOptional<z.ZodNumber>;
        apply: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        apply?: boolean | undefined;
        strategy?: "playful" | "balanced" | "accessible" | "performant" | "harmonious" | undefined;
        generations?: number | undefined;
        populationSize?: number | undefined;
        mutationRate?: number | undefined;
    }, {
        projectId: string;
        apply?: boolean | undefined;
        strategy?: "playful" | "balanced" | "accessible" | "performant" | "harmonious" | undefined;
        generations?: number | undefined;
        populationSize?: number | undefined;
        mutationRate?: number | undefined;
    }>;
    readonly list_evolution_strategies: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly predict_perception: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly predict_chronopath: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_creative_context: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly list_semantic_concepts: z.ZodObject<{
        category: z.ZodOptional<z.ZodEnum<["emotion", "brand", "energy", "aesthetic"]>>;
    }, "strip", z.ZodTypeAny, {
        category?: "emotion" | "brand" | "energy" | "aesthetic" | undefined;
    }, {
        category?: "emotion" | "brand" | "energy" | "aesthetic" | undefined;
    }>;
    readonly infer_intent: z.ZodObject<{
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        description: string;
    }, {
        description: string;
    }>;
    readonly blend_concepts: z.ZodObject<{
        conceptA: z.ZodString;
        conceptB: z.ZodString;
        weightA: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        conceptA: string;
        conceptB: string;
        weightA?: number | undefined;
    }, {
        conceptA: string;
        conceptB: string;
        weightA?: number | undefined;
    }>;
    readonly simulate_physics: z.ZodObject<{
        type: z.ZodEnum<["spring", "gravity", "projectile", "friction", "pendulum"]>;
        config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        type: "spring" | "gravity" | "pendulum" | "projectile" | "friction";
        config?: Record<string, number> | undefined;
    }, {
        type: "spring" | "gravity" | "pendulum" | "projectile" | "friction";
        config?: Record<string, number> | undefined;
    }>;
    readonly list_physics_presets: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly run_physics_preset: z.ZodObject<{
        presetId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        presetId: string;
    }, {
        presetId: string;
    }>;
    readonly generate_path_motion: z.ZodObject<{
        type: z.ZodEnum<["bezier", "lissajous", "spiral", "figure-eight", "heart", "circle", "svg-path"]>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        samples: z.ZodOptional<z.ZodNumber>;
        scale: z.ZodOptional<z.ZodNumber>;
        loop: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "bezier" | "circle" | "spiral" | "lissajous" | "figure-eight" | "heart" | "svg-path";
        scale?: number | undefined;
        durationMs?: number | undefined;
        loop?: boolean | undefined;
        samples?: number | undefined;
    }, {
        type: "bezier" | "circle" | "spiral" | "lissajous" | "figure-eight" | "heart" | "svg-path";
        scale?: number | undefined;
        durationMs?: number | undefined;
        loop?: boolean | undefined;
        samples?: number | undefined;
    }>;
    readonly list_path_presets: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly run_path_preset: z.ZodObject<{
        presetId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        presetId: string;
    }, {
        presetId: string;
    }>;
    readonly encode_motion: z.ZodObject<{
        projectId: z.ZodString;
        format: z.ZodEnum<["lottie", "css", "waapi", "smil", "gsap", "react-spring"]>;
        minify: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        format: "css" | "lottie" | "waapi" | "smil" | "gsap" | "react-spring";
        minify?: boolean | undefined;
    }, {
        projectId: string;
        format: "css" | "lottie" | "waapi" | "smil" | "gsap" | "react-spring";
        minify?: boolean | undefined;
    }>;
    readonly list_codec_formats: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly extract_style_dna: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly transfer_project_style: z.ZodObject<{
        projectId: z.ZodString;
        sourceProjectId: z.ZodString;
        easingStrength: z.ZodOptional<z.ZodNumber>;
        tempoStrength: z.ZodOptional<z.ZodNumber>;
        energyStrength: z.ZodOptional<z.ZodNumber>;
        colorStrength: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        sourceProjectId: string;
        easingStrength?: number | undefined;
        tempoStrength?: number | undefined;
        energyStrength?: number | undefined;
        colorStrength?: number | undefined;
    }, {
        projectId: string;
        sourceProjectId: string;
        easingStrength?: number | undefined;
        tempoStrength?: number | undefined;
        energyStrength?: number | undefined;
        colorStrength?: number | undefined;
    }>;
    readonly blend_styles: z.ZodObject<{
        projectIdA: z.ZodString;
        projectIdB: z.ZodString;
        ratio: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        ratio: number;
        projectIdA: string;
        projectIdB: string;
    }, {
        ratio: number;
        projectIdA: string;
        projectIdB: string;
    }>;
    readonly describe_style: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly compare_styles: z.ZodObject<{
        projectIdA: z.ZodString;
        projectIdB: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectIdA: string;
        projectIdB: string;
    }, {
        projectIdA: string;
        projectIdB: string;
    }>;
    readonly list_style_archetypes: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly apply_style_archetype: z.ZodObject<{
        projectId: z.ZodString;
        archetypeId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        archetypeId: string;
    }, {
        projectId: string;
        archetypeId: string;
    }>;
    readonly build_knowledge_graph: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly query_concept: z.ZodObject<{
        conceptId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        conceptId: string;
    }, {
        conceptId: string;
    }>;
    readonly find_related: z.ZodObject<{
        conceptId: z.ZodString;
        relationship: z.ZodOptional<z.ZodEnum<["enables", "complements", "conflicts", "requires", "specializes", "alternative", "combines", "transitions", "contrasts", "evolves"]>>;
    }, "strip", z.ZodTypeAny, {
        conceptId: string;
        relationship?: "enables" | "complements" | "conflicts" | "requires" | "specializes" | "alternative" | "combines" | "transitions" | "contrasts" | "evolves" | undefined;
    }, {
        conceptId: string;
        relationship?: "enables" | "complements" | "conflicts" | "requires" | "specializes" | "alternative" | "combines" | "transitions" | "contrasts" | "evolves" | undefined;
    }>;
    readonly find_concept_path: z.ZodObject<{
        fromId: z.ZodString;
        toId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        fromId: string;
        toId: string;
    }, {
        fromId: string;
        toId: string;
    }>;
    readonly search_concepts: z.ZodObject<{
        query: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        query: string;
    }, {
        query: string;
    }>;
    readonly suggest_connections: z.ZodObject<{
        conceptIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        conceptIds: string[];
    }, {
        conceptIds: string[];
    }>;
    readonly recommend_next: z.ZodObject<{
        usedConceptIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        usedConceptIds: string[];
    }, {
        usedConceptIds: string[];
    }>;
    readonly analyze_graph: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly run_all_tests: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly run_tests_by_category: z.ZodObject<{
        projectId: z.ZodString;
        category: z.ZodEnum<["accessibility", "performance", "visual", "principles", "timing", "consistency"]>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        category: "timing" | "performance" | "accessibility" | "visual" | "principles" | "consistency";
    }, {
        projectId: string;
        category: "timing" | "performance" | "accessibility" | "visual" | "principles" | "consistency";
    }>;
    readonly run_test_suite: z.ZodObject<{
        projectId: z.ZodString;
        suiteId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        suiteId: string;
    }, {
        projectId: string;
        suiteId: string;
    }>;
    readonly list_test_suites: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly synthesize_from_emotion: z.ZodObject<{
        projectId: z.ZodString;
        emotionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        emotionId: string;
    }, {
        projectId: string;
        emotionId: string;
    }>;
    readonly detect_emotion: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
    }, {
        projectId: string;
        componentId: string;
    }>;
    readonly blend_emotions: z.ZodObject<{
        projectId: z.ZodString;
        emotions: z.ZodArray<z.ZodObject<{
            emotionId: z.ZodString;
            weight: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            emotionId: string;
            weight: number;
        }, {
            emotionId: string;
            weight: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        emotions: {
            emotionId: string;
            weight: number;
        }[];
    }, {
        projectId: string;
        emotions: {
            emotionId: string;
            weight: number;
        }[];
    }>;
    readonly plan_emotion_journey: z.ZodObject<{
        projectId: z.ZodString;
        emotionIds: z.ZodArray<z.ZodString, "many">;
        totalDurationMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        totalDurationMs: number;
        emotionIds: string[];
    }, {
        projectId: string;
        emotionIds: string[];
        totalDurationMs?: number | undefined;
    }>;
    readonly list_emotions: z.ZodObject<{
        category: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        category?: string | undefined;
    }, {
        category?: string | undefined;
    }>;
    readonly get_taste_profile: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly recommend_for_project: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly record_motion_observation: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        action: z.ZodEnum<["created", "accepted", "rejected", "modified"]>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        action: "created" | "accepted" | "rejected" | "modified";
    }, {
        projectId: string;
        componentId: string;
        action: "created" | "accepted" | "rejected" | "modified";
    }>;
    readonly compute_context_adjustments: z.ZodObject<{
        projectId: z.ZodString;
        device: z.ZodOptional<z.ZodString>;
        performance: z.ZodOptional<z.ZodString>;
        timeOfDay: z.ZodOptional<z.ZodString>;
        ambientLight: z.ZodOptional<z.ZodString>;
        userState: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        device?: string | undefined;
        performance?: string | undefined;
        timeOfDay?: string | undefined;
        ambientLight?: string | undefined;
        userState?: string | undefined;
    }, {
        projectId: string;
        device?: string | undefined;
        performance?: string | undefined;
        timeOfDay?: string | undefined;
        ambientLight?: string | undefined;
        userState?: string | undefined;
    }>;
    readonly adapt_component_for_context: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
        device: z.ZodOptional<z.ZodString>;
        performance: z.ZodOptional<z.ZodString>;
        timeOfDay: z.ZodOptional<z.ZodString>;
        ambientLight: z.ZodOptional<z.ZodString>;
        userState: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
        device?: string | undefined;
        performance?: string | undefined;
        timeOfDay?: string | undefined;
        ambientLight?: string | undefined;
        userState?: string | undefined;
    }, {
        projectId: string;
        componentId: string;
        device?: string | undefined;
        performance?: string | undefined;
        timeOfDay?: string | undefined;
        ambientLight?: string | undefined;
        userState?: string | undefined;
    }>;
    readonly auto_detect_context: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly list_context_options: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly plan_collaboration: z.ZodObject<{
        projectId: z.ZodString;
        request: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        request: string;
    }, {
        projectId: string;
        request: string;
    }>;
    readonly execute_collaboration: z.ZodObject<{
        projectId: z.ZodString;
        request: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        request: string;
    }, {
        projectId: string;
        request: string;
    }>;
    readonly list_collaboration_modules: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly analyze_resonance: z.ZodObject<{
        projectId: z.ZodString;
        viewerState: z.ZodOptional<z.ZodObject<{
            attention: z.ZodOptional<z.ZodNumber>;
            arousal: z.ZodOptional<z.ZodNumber>;
            valence: z.ZodOptional<z.ZodNumber>;
            fatigue: z.ZodOptional<z.ZodNumber>;
            timeOfDay: z.ZodOptional<z.ZodEnum<["morning", "afternoon", "evening", "night"]>>;
        }, "strip", z.ZodTypeAny, {
            timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
            attention?: number | undefined;
            arousal?: number | undefined;
            valence?: number | undefined;
            fatigue?: number | undefined;
        }, {
            timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
            attention?: number | undefined;
            arousal?: number | undefined;
            valence?: number | undefined;
            fatigue?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        viewerState?: {
            timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
            attention?: number | undefined;
            arousal?: number | undefined;
            valence?: number | undefined;
            fatigue?: number | undefined;
        } | undefined;
    }, {
        projectId: string;
        viewerState?: {
            timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
            attention?: number | undefined;
            arousal?: number | undefined;
            valence?: number | undefined;
            fatigue?: number | undefined;
        } | undefined;
    }>;
    readonly tune_resonance: z.ZodObject<{
        projectId: z.ZodString;
        viewerState: z.ZodOptional<z.ZodObject<{
            attention: z.ZodOptional<z.ZodNumber>;
            arousal: z.ZodOptional<z.ZodNumber>;
            valence: z.ZodOptional<z.ZodNumber>;
            fatigue: z.ZodOptional<z.ZodNumber>;
            timeOfDay: z.ZodOptional<z.ZodEnum<["morning", "afternoon", "evening", "night"]>>;
        }, "strip", z.ZodTypeAny, {
            timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
            attention?: number | undefined;
            arousal?: number | undefined;
            valence?: number | undefined;
            fatigue?: number | undefined;
        }, {
            timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
            attention?: number | undefined;
            arousal?: number | undefined;
            valence?: number | undefined;
            fatigue?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        viewerState?: {
            timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
            attention?: number | undefined;
            arousal?: number | undefined;
            valence?: number | undefined;
            fatigue?: number | undefined;
        } | undefined;
    }, {
        projectId: string;
        viewerState?: {
            timeOfDay?: "morning" | "afternoon" | "evening" | "night" | undefined;
            attention?: number | undefined;
            arousal?: number | undefined;
            valence?: number | undefined;
            fatigue?: number | undefined;
        } | undefined;
    }>;
    readonly translate_synesthesia: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly map_sensory_to_motion: z.ZodObject<{
        modality: z.ZodEnum<["color", "sound", "texture", "emotion"]>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        modality: "color" | "texture" | "emotion" | "sound";
    }, {
        value: string;
        modality: "color" | "texture" | "emotion" | "sound";
    }>;
    readonly dream_from_prompt: z.ZodObject<{
        projectId: z.ZodString;
        prompt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        prompt: string;
    }, {
        projectId: string;
        prompt: string;
    }>;
    readonly generate_dream_sequence: z.ZodObject<{
        projectId: z.ZodString;
        length: z.ZodOptional<z.ZodNumber>;
        seed: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        length?: number | undefined;
        seed?: string | undefined;
    }, {
        projectId: string;
        length?: number | undefined;
        seed?: string | undefined;
    }>;
    readonly list_dream_concepts: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly analyze_harmonics: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly find_harmonics: z.ZodObject<{
        projectId: z.ZodString;
        componentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        componentId: string;
    }, {
        projectId: string;
        componentId: string;
    }>;
    readonly analyze_entropy: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly identify_information_hotspots: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_cognitive_load: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_topology: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly find_temporal_path: z.ZodObject<{
        projectId: z.ZodString;
        fromId: z.ZodString;
        toId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        fromId: string;
        toId: string;
    }, {
        projectId: string;
        fromId: string;
        toId: string;
    }>;
    readonly analyze_poetics: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_ecosystem: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_calligraphy: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_mythology: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_weather: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_alchemy: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_architecture: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_cartography: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_genealogy: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_astronomy: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_chemistry: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_musicology: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_botany: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_geology: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_physics: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_linguistics: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly analyze_cinema: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly verify_motion: z.ZodObject<{
        projectId: z.ZodString;
        /** Optional intent override; defaults to the most recent user message. */
        intent: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        intent?: string | undefined;
    }, {
        projectId: string;
        intent?: string | undefined;
    }>;
    readonly self_correct: z.ZodObject<{
        projectId: z.ZodString;
        /** Optional intent override; defaults to the most recent user message. */
        intent: z.ZodOptional<z.ZodString>;
        /** When false, only reports what would be fixed without applying patches. Default true. */
        apply: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        apply?: boolean | undefined;
        intent?: string | undefined;
    }, {
        projectId: string;
        apply?: boolean | undefined;
        intent?: string | undefined;
    }>;
    readonly predict_intent: z.ZodObject<{
        /** The partial user input to predict intent from. May be empty. */
        partial: z.ZodString;
        /** Optional project id to use the spec as a prior. */
        projectId: z.ZodOptional<z.ZodString>;
        /** How many predictions to return. Default 5. */
        topK: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        partial: string;
        projectId?: string | undefined;
        topK?: number | undefined;
    }, {
        partial: string;
        projectId?: string | undefined;
        topK?: number | undefined;
    }>;
    readonly forecast_motion: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly genesis_motion: z.ZodObject<{
        projectId: z.ZodString;
        /** Which mathematical generator to use. */
        kind: z.ZodEnum<["lissajous", "goldenSpiral", "waveInterference", "dampedOscillator", "phyllotaxis", "lorenzAttractor"]>;
        /** Number of keyframe samples. Default 24. */
        samples: z.ZodOptional<z.ZodNumber>;
        /** Animation duration in ms. Default 2000. */
        durationMs: z.ZodOptional<z.ZodNumber>;
        /** Frequency a. Default 3. */
        a: z.ZodOptional<z.ZodNumber>;
        /** Frequency b. Default 2. */
        b: z.ZodOptional<z.ZodNumber>;
        /** Amplitude in pixels. Default 120. */
        amplitude: z.ZodOptional<z.ZodNumber>;
        /** Damping coefficient. Default 0.15. */
        damping: z.ZodOptional<z.ZodNumber>;
        /** Angular frequency. Default 4. */
        omega: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        kind: "lissajous" | "goldenSpiral" | "waveInterference" | "dampedOscillator" | "phyllotaxis" | "lorenzAttractor";
        damping?: number | undefined;
        durationMs?: number | undefined;
        amplitude?: number | undefined;
        samples?: number | undefined;
        a?: number | undefined;
        b?: number | undefined;
        omega?: number | undefined;
    }, {
        projectId: string;
        kind: "lissajous" | "goldenSpiral" | "waveInterference" | "dampedOscillator" | "phyllotaxis" | "lorenzAttractor";
        damping?: number | undefined;
        durationMs?: number | undefined;
        amplitude?: number | undefined;
        samples?: number | undefined;
        a?: number | undefined;
        b?: number | undefined;
        omega?: number | undefined;
    }>;
    readonly analyze_symbiosis: z.ZodObject<{
        /** First project id (parent A). */
        projectIdA: z.ZodString;
        /** Second project id (parent B). */
        projectIdB: z.ZodString;
        /** When true, persist the bred hybrid offspring as components in project A. Default false. */
        persistOffspring: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectIdA: string;
        projectIdB: string;
        persistOffspring?: boolean | undefined;
    }, {
        projectIdA: string;
        projectIdB: string;
        persistOffspring?: boolean | undefined;
    }>;
    readonly reflect_consciousness: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly decide_volition: z.ZodObject<{
        /** The partial user input to evaluate. May be empty. */
        partial: z.ZodString;
        /** Optional project id to read the current spec as a prior. */
        projectId: z.ZodOptional<z.ZodString>;
        /** Number of consecutive prior turns that ended in an ASK. */
        consecutiveAsks: z.ZodOptional<z.ZodNumber>;
        /** Whether the same keyword appeared in the prior turn. */
        repeatedKeyword: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        partial: string;
        projectId?: string | undefined;
        consecutiveAsks?: number | undefined;
        repeatedKeyword?: boolean | undefined;
    }, {
        partial: string;
        projectId?: string | undefined;
        consecutiveAsks?: number | undefined;
        repeatedKeyword?: boolean | undefined;
    }>;
    readonly translate_lexicon: z.ZodObject<{
        /** The natural-language intent to translate (English or Chinese). */
        input: z.ZodString;
        /** Optional project id, reserved for future spec-aware routing. */
        projectId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        input: string;
        projectId?: string | undefined;
    }, {
        input: string;
        projectId?: string | undefined;
    }>;
    readonly run_motion_debate: z.ZodObject<{
        projectId: z.ZodString;
        request: z.ZodString;
        accessibilityWeight: z.ZodOptional<z.ZodNumber>;
        performanceWeight: z.ZodOptional<z.ZodNumber>;
        brandWeight: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        request: string;
        accessibilityWeight?: number | undefined;
        performanceWeight?: number | undefined;
        brandWeight?: number | undefined;
    }, {
        projectId: string;
        request: string;
        accessibilityWeight?: number | undefined;
        performanceWeight?: number | undefined;
        brandWeight?: number | undefined;
    }>;
    readonly run_reflection_loop: z.ZodObject<{
        projectId: z.ZodString;
        maxPasses: z.ZodDefault<z.ZodNumber>;
        autoApply: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        maxPasses: number;
        autoApply: boolean;
    }, {
        projectId: string;
        maxPasses?: number | undefined;
        autoApply?: boolean | undefined;
    }>;
    readonly get_flow_state: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly run_heuristics: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly get_atelier_report: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    readonly generate_manifesto: z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
};
export type ToolName = keyof typeof TOOL_INPUT_SCHEMAS;
export type ToolInput<T extends ToolName> = z.infer<(typeof TOOL_INPUT_SCHEMAS)[T]>;
export declare const TOOL_NAMES: ToolName[];
/** Human-readable descriptions, surfaced to the LLM as tool metadata. */
export declare const TOOL_DESCRIPTIONS: Record<ToolName, string>;
//# sourceMappingURL=tools.d.ts.map