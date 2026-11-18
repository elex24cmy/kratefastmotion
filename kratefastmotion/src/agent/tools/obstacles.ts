// What a new layer has to work around.
//
// Every drawing tool needs the same answer to "what is already on the stage?",
// and every tool that answers it differently drifts. This is the single answer:
// the measurable layers, with their boxes and their time windows, minus the
// full-bleed backgrounds that exist to be covered and the audio that has no
// visual footprint at all.
//
// Timing matters as much as geometry. A caption and a keyword punch that are a
// second apart never collide, even though their boxes overlap; a tool that
// ignores the windows will move a graphic out of the way of something that is
// not there.

import type { MotionComponent } from "@kratefastmotion/shared";
import { listComponents } from "../../db/repositories/components.js";
import { clearOf, styleToBox, type Box, type NamedBox } from "../../motion/layout.js";
import { styleFlag } from "../../motion/units.js";
import type { GraphicLayer } from "../../motion/filmGraphics.js";

/**
 * Measurable, non-background layers as boxes with their time windows.
 *
 * `sceneId` limits the result to one scene, which is what a scene-scoped
 * graphic needs — it is placed inside that scene's beat, not against the whole
 * film.
 */
export function obstacleBoxes(projectId: string, sceneId?: string | null): NamedBox[] {
  const boxes: NamedBox[] = [];
  for (const c of listComponents(projectId)) {
    if (sceneId && c.sceneId !== sceneId) continue;
    const box = componentBox(c);
    if (box) boxes.push(box);
  }
  return boxes;
}

/**
 * One component as a timed box, or null when it cannot block anything: audio,
 * a full-bleed background, or a layer whose position cannot be measured.
 */
export function componentBox(c: MotionComponent): NamedBox | null {
  if (String(c.style?._tag ?? "") === "audio") return null;
  if (styleFlag(c.style._background)) return null;
  const box = styleToBox(c.style);
  if (!box || box.w <= 0 || box.h <= 0) return null;
  return {
    name: c.name,
    ...box,
    startMs: c.delayMs,
    endMs: c.delayMs + c.durationMs,
  };
}

interface Part {
  name: string;
  box: Box;
  start: number;
  end: number;
}

/** The visible parts of a composition — everything a viewer could see clash. */
function visibleParts(layers: GraphicLayer[]): Part[] {
  const parts: Part[] = [];
  for (const layer of layers) {
    if (styleFlag(layer.style._background)) continue;
    const box = styleToBox(layer.style);
    if (!box) continue;
    parts.push({ name: layer.name, box, start: layer.delayMs, end: layer.delayMs + layer.durationMs });
  }
  return parts;
}

/**
 * Shift a whole composition later until none of its visible parts lands on a
 * layer that is on screen at the same moment.
 *
 * A card is a composition, so its parts move together: a kicker that dodges
 * while the phrase stays put is worse than the collision it avoided. Returns the
 * layers unchanged when they are already clear, so a caller can report whether
 * anything moved.
 */
export function shiftClear(
  layers: GraphicLayer[],
  obstacles: NamedBox[],
  stepMs: number,
  attempts = 24,
): { layers: GraphicLayer[]; shiftedMs: number } {
  const parts = visibleParts(layers);
  if (!parts.length || !obstacles.length) return { layers, shiftedMs: 0 };

  const clashes = (delta: number) =>
    parts.some((p) =>
      obstacles.some(
        (o) =>
          !clearOf(p.box, o, 0) &&
          (o.startMs ?? Number.NEGATIVE_INFINITY) < p.end + delta &&
          p.start + delta < (o.endMs ?? Number.POSITIVE_INFINITY),
      ),
    );

  for (let i = 0; i < attempts; i += 1) {
    const delta = i * stepMs;
    if (!clashes(delta)) {
      return delta === 0
        ? { layers, shiftedMs: 0 }
        : { layers: layers.map((l) => ({ ...l, delayMs: l.delayMs + delta })), shiftedMs: delta };
    }
  }
  return { layers, shiftedMs: 0 };
}
