import type { TransformProperty } from "@kratefastmotion/shared";
import { isTransformProperty } from "@kratefastmotion/shared";
import type { KeyValue } from "@kratefastmotion/shared";

/** Default unit per property (numbers get this appended; strings pass through). */
const UNITS: Partial<Record<TransformProperty, string>> = {
  translateX: "px",
  translateY: "px",
  translateZ: "px",
  scale: "",
  scaleX: "",
  scaleY: "",
  rotate: "deg",
  rotateX: "deg",
  rotateY: "deg",
  rotateZ: "deg",
  skewX: "deg",
  skewY: "deg",
  opacity: "",
  borderRadius: "px",
  width: "px",
  height: "px",
  fontSize: "px",
  letterSpacing: "px",
  blur: "px",
  color: "",
  backgroundColor: "",
  boxShadow: "",
};

export function formatValue(prop: TransformProperty, value: KeyValue): string {
  if (typeof value === "string") return value;
  const unit = UNITS[prop] ?? "";
  return `${value}${unit}`;
}

/** Build a CSS `transform` string from transform-family properties present in a frame. */
export function buildTransformString(
  props: Partial<Record<TransformProperty, KeyValue>>,
): string | null {
  const order: TransformProperty[] = [
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skewX",
    "skewY",
  ];
  const parts: string[] = [];
  for (const p of order) {
    const v = props[p];
    if (v === undefined) continue;
    parts.push(`${p}(${formatValue(p, v)})`);
  }
  return parts.length ? parts.join(" ") : null;
}

export function isFilterProperty(p: string): boolean {
  return p === "blur";
}

/**
 * Read a boolean out of a component style token.
 *
 * Style values are `string | number`, so a flag arrives as `1`, `"1"`, `"true"`,
 * `0`, `"0"` or `"false"` depending on who wrote it. `Boolean("0")` is `true`,
 * which is exactly the trap this closes: a layer marked `_muted: "0"` was
 * being muted anyway.
 */
export function styleFlag(value: string | number | boolean | undefined | null): boolean {
  if (value == null) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  const v = value.trim().toLowerCase();
  return v !== "" && v !== "0" && v !== "false" && v !== "off" && v !== "no";
}

export { isTransformProperty };
