import type { KeyValue, MotionComponent, TransformProperty } from "@kratefastmotion/shared";
import { easingToCss } from "@kratefastmotion/shared";
import { buildTransformString, formatValue, isTransformProperty } from "../units.js";

export interface GeneratedCss {
  animationName: string;
  keyframesBlock: string;
  ruleBlock: string;
}

function percent(offset: number): string {
  return `${(offset * 100).toFixed(2).replace(/\.?0+$/, "")}%`;
}

const UNITLESS_NUMERIC = new Set([
  "fontWeight",
  "opacity",
  "zIndex",
  "flexGrow",
  "flexShrink",
  "order",
  "lineHeight",
]);

function styleToCss(style: Record<string, string | number>): string {
  return Object.entries(style)
    .filter(([k]) => !k.startsWith("_"))
    .map(([k, v]) => {
      const kebab = camelToKebab(k);
      if (typeof v === "number") {
        return `${kebab}: ${UNITLESS_NUMERIC.has(k) ? v : `${v}px`};`;
      }
      return `${kebab}: ${v};`;
    })
    .join(" ");
}

export function camelToKebab(s: string): string {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

type Keyframe = MotionComponent["keyframes"][number];

/**
 * A keyframe that declares *some* transform properties but not others replaces
 * the whole `transform` value, silently resetting the omitted ones to identity.
 *
 * That is how a "travel + hold + fade" loop authored as
 * `0% {translateY(640) scale(.5)} / 18% {scale(1)} / 82% {scale(1)} / 100% {translateY(-640)}`
 * ended up frozen for the middle 64% of every cycle: the 18%/82% frames only
 * restated `scale`, so the travel was replaced by `transform: scale(1)`.
 *
 * For every keyframe that declares at least one transform property, fill in the
 * transform properties it omits by interpolating the neighbouring keyframes that
 * do declare them. Keyframes that declare no transform at all are left untouched
 * so CSS still interpolates them between the surrounding transform keyframes.
 */
function fillPartialTransforms(frames: Keyframe[]): Keyframe[] {
  const used = new Set<TransformProperty>();
  for (const f of frames) {
    for (const key of Object.keys(f.properties)) {
      if (isTransformProperty(key)) used.add(key as TransformProperty);
    }
  }
  if (used.size === 0) return frames;

  const sorted = [...frames].sort((a, b) => a.offset - b.offset);
  const valueOf = (f: Keyframe, p: TransformProperty): KeyValue | undefined =>
    (f.properties as Record<string, KeyValue>)[p];

  return sorted.map((frame) => {
    const declaresTransform = Object.keys(frame.properties).some((k) => isTransformProperty(k));
    if (!declaresTransform) return frame;

    const properties: Record<string, KeyValue> = { ...(frame.properties as Record<string, KeyValue>) };
    for (const p of used) {
      if (properties[p] !== undefined) continue;
      const before = [...sorted].reverse().find((g) => g.offset <= frame.offset && valueOf(g, p) !== undefined);
      const after = sorted.find((g) => g.offset >= frame.offset && valueOf(g, p) !== undefined);
      const bv = before && valueOf(before, p);
      const av = after && valueOf(after, p);
      if (typeof bv === "number" && typeof av === "number" && before && after && after.offset > before.offset) {
        const t = (frame.offset - before.offset) / (after.offset - before.offset);
        properties[p] = bv + (av - bv) * t;
      } else if (bv !== undefined) {
        properties[p] = bv;
      } else if (av !== undefined) {
        properties[p] = av;
      }
    }
    return { ...frame, properties } as Keyframe;
  });
}

/** Generate @keyframes + the element rule for a single component. */
export function generateComponentCss(component: MotionComponent): GeneratedCss {
  const animationName = `om-anim-${component.id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const selector = component.selector || `.om-c-${component.id}`;

  // ---- @keyframes ----
  const frames = fillPartialTransforms(component.keyframes);
  const kfLines: string[] = [];
  for (const frame of frames) {
    const decls: string[] = [];
    const transform = buildTransformString(frame.properties);
    if (transform) decls.push(`transform: ${transform};`);
    let filter: string | null = null;
    for (const [prop, value] of Object.entries(frame.properties)) {
      if (prop === "blur") {
        filter = `blur(${formatValue("blur", value)})`;
        continue;
      }
      if (isTransformProperty(prop)) continue;
      decls.push(`${camelToKebab(prop)}: ${formatValue(prop as never, value)};`);
    }
    if (filter) decls.push(`filter: ${filter};`);
    if (frame.easing && frame.easing.type !== "preset") {
      // per-keyframe easing (animation-timing-function inside keyframes)
      decls.push(`animation-timing-function: ${easingToCss(frame.easing)};`);
    }
    kfLines.push(`  ${percent(frame.offset)} { ${decls.join(" ")} }`);
  }
  const keyframesBlock = frames.length
    ? `@keyframes ${animationName} {\n${kfLines.join("\n")}\n}`
    : "";

  // ---- element rule ----
  const iteration =
    component.iterationCount === "infinite" ? "infinite" : String(component.iterationCount);
  const staticCss = styleToCss(component.style);
  const ruleDecls = [
    staticCss,
    `animation-name: ${frames.length ? animationName : "none"};`,
    `animation-duration: ${component.durationMs}ms;`,
    `animation-timing-function: ${easingToCss(component.easing)};`,
    `animation-delay: ${component.delayMs}ms;`,
    `animation-iteration-count: ${iteration};`,
    `animation-direction: ${component.direction};`,
    `animation-fill-mode: ${component.fillMode};`,
    `animation-play-state: ${component.playState};`,
  ].filter(Boolean);
  const ruleBlock = `${selector} { ${ruleDecls.join(" ")} }`;

  return { animationName, keyframesBlock, ruleBlock };
}

/** Generate the full stylesheet for a spec (all components). */
export function generateSpecCss(components: MotionComponent[]): string {
  const blocks = components
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((c) => {
      const g = generateComponentCss(c);
      return [g.keyframesBlock, g.ruleBlock].filter(Boolean).join("\n");
    })
    .filter(Boolean);
  const main = blocks.join("\n\n");

  // Accessibility: respect the user's OS-level motion preference by disabling
  // all animations when prefers-reduced-motion is set.
  const selectors = components
    .map((c) => c.selector || `.om-c-${c.id}`)
    .filter(Boolean);
  if (selectors.length === 0) return main;

  const reducedMotion = `@media (prefers-reduced-motion: reduce) {\n  ${selectors.join(",\n  ")} {\n    animation: none !important;\n    transition: none !important;\n  }\n}`;

  return `${main}\n\n${reducedMotion}`;
}
