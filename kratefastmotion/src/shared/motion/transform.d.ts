import { z } from "zod";
/**
 * Animatable properties. Transform-family props are folded into a single
 * CSS `transform` string by the generator; the rest map to their own CSS keys.
 */
export declare const TRANSFORM_PROPERTIES: readonly ["translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY"];
export declare const NON_TRANSFORM_PROPERTIES: readonly ["opacity", "blur", "color", "backgroundColor", "width", "height", "borderRadius", "fontSize", "letterSpacing", "boxShadow", "clipPath"];
export declare const TransformPropertySchema: z.ZodEnum<["translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "opacity", "blur", "color", "backgroundColor", "width", "height", "borderRadius", "fontSize", "letterSpacing", "boxShadow", "clipPath"]>;
export type TransformProperty = z.infer<typeof TransformPropertySchema>;
export declare const isTransformProperty: (p: string) => boolean;
/** A keyframe value: numbers are unitless (interpreted per-property), strings pass through. */
export declare const KeyValueSchema: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
export type KeyValue = z.infer<typeof KeyValueSchema>;
//# sourceMappingURL=transform.d.ts.map