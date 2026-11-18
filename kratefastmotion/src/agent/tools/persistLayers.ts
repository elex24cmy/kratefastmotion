// Shared layer writer.
//
// Every tool that draws something — `compose_graphic`, `add_captions`,
// `add_cutaway`, `add_beat_card`, `add_cta_card` — produces `GraphicLayer`
// descriptors and then needs them to become rows in the project. This is the one
// place that does that, so ordering, the reserved `_group` token, the minimum
// animation length and the absolute-vs-relative timing rule behave identically
// no matter which tool drew the layer.

import type { MotionComponent } from "@kratefastmotion/shared";
import { createComponent, listComponents } from "../../db/repositories/components.js";
import type { GraphicLayer } from "../../motion/filmGraphics.js";
import { createId, now } from "../../utils/id.js";

/**
 * Persist graphic layers into `projectId`.
 *
 * `timeOffset` shifts every layer's delay — a scene-scoped graphic animates
 * inside its scene's beat rather than at t=0.
 */
export function persistLayers(
  projectId: string,
  sceneId: string | null,
  layers: GraphicLayer[],
  timeOffset = 0,
): string[] {
  const all = listComponents(projectId);
  let order = all.reduce((max, c) => Math.max(max, c.orderIndex), -1) + 1;
  const ts = now();
  const ids: string[] = [];

  for (const layer of layers) {
    const id = createId("c_");
    const style: Record<string, string | number> = { ...layer.style, position: "absolute" };
    if (layer.group) style._group = layer.group;
    const component: MotionComponent = {
      id,
      projectId,
      templateId: null,
      name: layer.name,
      selector: null,
      sceneId,
      orderIndex: order++,
      easing: layer.easing ?? { type: "preset", name: "ease-out" },
      // A layer's own lifetime never goes below 400ms: the kit subtracts a tail
      // from the scene length, and a very short scene would otherwise produce a
      // sub-frame animation that reads as a flicker.
      durationMs: Math.max(400, Math.round(layer.durationMs)),
      delayMs: Math.max(0, Math.round(timeOffset + layer.delayMs)),
      iterationCount: layer.iterationCount ?? 1,
      direction: layer.direction ?? "normal",
      fillMode: "both",
      playState: "running",
      trigger: "onLoad",
      keyframes: layer.keyframes,
      style,
      parentId: null,
      createdAt: ts,
      updatedAt: ts,
    };
    createComponent(component);
    ids.push(id);
  }
  return ids;
}
