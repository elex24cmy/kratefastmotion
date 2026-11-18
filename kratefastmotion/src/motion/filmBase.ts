/**
 * Shared film primitives.
 *
 * The timing vocabulary (easings, the entrance→hold→exit beat) and the font
 * stacks are used by both the film director and the graphic kit, so they live
 * here rather than being duplicated. Keeping one definition means a graphic
 * built by the kit and a title built by the director breathe at the same rate.
 */
import type { Easing, Keyframe } from "@kratefastmotion/shared";
import { easingBezier } from "@kratefastmotion/shared";

export const FONT_STACK =
  "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
export const MONO_STACK = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** Fast-out entrance, accelerated exit, and a neutral hold. */
export const EASE_OUT: Easing = easingBezier([0.16, 1], [0.3, 1]);
export const EASE_IN: Easing = easingBezier([0.7, 0], [0.84, 0]);
export const EASE_IN_OUT: Easing = easingBezier([0.65, 0], [0.35, 1]);
export const EASE_BACK: Easing = easingBezier([0.34, 1.56], [0.64, 1]);

/**
 * Entrance → hold → exit, with fast-out in and accelerated out. `drift` is
 * merged into the hold so a layer keeps creeping after it lands — the reference
 * films never let anything sit completely still.
 */
export function beat(
  from: Record<string, string | number>,
  hold: Record<string, string | number>,
  exit: Record<string, string | number> = {},
  drift: Record<string, string | number> = {},
): Keyframe[] {
  const drifted = { ...hold, ...drift };
  return [
    { offset: 0, properties: { opacity: 0, ...from } as Keyframe["properties"], easing: EASE_OUT },
    { offset: 0.18, properties: { opacity: 1, ...hold } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: 0.82, properties: { opacity: 1, ...drifted } as Keyframe["properties"], easing: EASE_IN },
    { offset: 1, properties: { opacity: 0, ...drifted, ...exit } as Keyframe["properties"] },
  ];
}

/**
 * Entrance → hold, ending visible. Used by the closing scene so the film — and
 * the editor canvas at rest, which keeps each layer's final `fill-mode: both`
 * state — ends on a composed end card instead of a blank stage after every
 * layer has faded out.
 */
export function beatHold(
  from: Record<string, string | number>,
  hold: Record<string, string | number>,
  drift: Record<string, string | number> = {},
): Keyframe[] {
  const drifted = { ...hold, ...drift };
  return [
    { offset: 0, properties: { opacity: 0, ...from } as Keyframe["properties"], easing: EASE_OUT },
    { offset: 0.22, properties: { opacity: 1, ...hold } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: 1, properties: { opacity: 1, ...drifted } as Keyframe["properties"] },
  ];
}

/**
 * A looping pulse used by ornaments (rings, chevrons, dots) that need to keep
 * moving for a whole scene without an exit of their own.
 */
export function pulse(
  from: Record<string, string | number>,
  hold: Record<string, string | number>,
): Keyframe[] {
  return [
    { offset: 0, properties: { opacity: 0, ...from } as Keyframe["properties"], easing: EASE_OUT },
    { offset: 0.2, properties: { opacity: 1, ...hold } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: 0.5, properties: { opacity: 0.55, ...from } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: 0.8, properties: { opacity: 1, ...hold } as Keyframe["properties"], easing: EASE_IN_OUT },
    { offset: 1, properties: { opacity: 1, ...hold } as Keyframe["properties"] },
  ];
}

/** Apply an alpha channel to a hex colour, passing anything else through. */
export function withAlpha(color: string, alpha: number): string {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!match) return color;
  let hex = match[1];
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
