import type { MotionComponent, IterationCount } from "@kratefastmotion/shared";
import { createId, now } from "../../utils/id.js";
import { HttpError } from "../middleware/error.js";
import { ensureProjectExists } from "./projectService.js";
import {
  listComponents,
  getComponent,
  patchComponent,
  createComponent,
  deleteComponent,
  batchDeleteComponents,
  type ComponentPatch,
} from "../../db/repositories/components.js";
import { instantiateTemplate } from "../../motion/templates/index.js";

export interface CreateComponentInput {
  name?: string;
  templateId?: string;
  sceneId?: string;
  selector?: string;
  durationMs?: number;
  delayMs?: number;
  iterationCount?: IterationCount;
  direction?: MotionComponent["direction"];
  fillMode?: MotionComponent["fillMode"];
  easing?: MotionComponent["easing"];
  keyframes?: MotionComponent["keyframes"];
  style?: MotionComponent["style"];
  orderIndex?: number;
  parentId?: string | null;
}

export function listProjectComponents(projectId: string): MotionComponent[] {
  ensureProjectExists(projectId);
  return listComponents(projectId);
}

export function createProjectComponent(
  projectId: string,
  input: CreateComponentInput,
): MotionComponent {
  ensureProjectExists(projectId);
  const id = createId("c_");
  const ts = now();
  const tpl = input.templateId ? instantiateTemplate(input.templateId, projectId)[0] : null;
  const existing = listComponents(projectId);
  const maxOrder = existing.reduce((max, c) => Math.max(max, c.orderIndex), -1);
  const component: MotionComponent = {
    id,
    projectId,
    sceneId: input.sceneId ?? null,
    name: input.name ?? "Layer",
    selector: input.selector ?? null,
    templateId: input.templateId ?? tpl?.templateId ?? null,
    durationMs: tpl?.durationMs ?? input.durationMs ?? 800,
    delayMs: tpl?.delayMs ?? input.delayMs ?? 0,
    iterationCount: tpl?.iterationCount ?? input.iterationCount ?? 1,
    direction: tpl?.direction ?? input.direction ?? "normal",
    fillMode: tpl?.fillMode ?? input.fillMode ?? "forwards",
    playState: "running",
    trigger: "onLoad",
    easing: tpl?.easing ?? input.easing ?? { type: "preset", name: "ease-out" },
    keyframes: tpl?.keyframes ?? input.keyframes ?? [],
    style: tpl?.style ?? input.style ?? {},
    orderIndex: input.orderIndex ?? maxOrder + 1,
    parentId: input.parentId ?? null,
    createdAt: ts,
    updatedAt: ts,
  };
  createComponent(component);
  return component;
}

export function getProjectComponent(projectId: string, componentId: string): MotionComponent {
  ensureProjectExists(projectId);
  const c = getComponent(projectId, componentId);
  if (!c) throw new HttpError(404, "component not found");
  return c;
}

export function patchProjectComponent(
  projectId: string,
  componentId: string,
  patch: ComponentPatch,
): MotionComponent {
  ensureProjectExists(projectId);
  const updated = patchComponent(projectId, componentId, patch);
  if (!updated) throw new HttpError(404, "component not found");
  return updated;
}

export function deleteProjectComponent(projectId: string, componentId: string): void {
  ensureProjectExists(projectId);
  const ok = deleteComponent(projectId, componentId);
  if (!ok) throw new HttpError(404, "component not found");
}

/** Remove multiple components in one operation. Returns the count actually deleted. */
export function batchDeleteProjectComponents(projectId: string, componentIds: string[]): number {
  ensureProjectExists(projectId);
  return batchDeleteComponents(projectId, componentIds);
}

/** Apply a patch to multiple components in one operation. */
export function batchUpdateComponents(
  projectId: string,
  updates: { componentId: string; patch: ComponentPatch }[],
): MotionComponent[] {
  ensureProjectExists(projectId);
  const results: MotionComponent[] = [];
  for (const { componentId, patch } of updates) {
    const updated = patchComponent(projectId, componentId, patch);
    if (!updated) throw new HttpError(404, `component ${componentId} not found`);
    results.push(updated);
  }
  return results;
}

/** Clone a component with a fresh id and incremented order index. */
export function duplicateProjectComponent(
  projectId: string,
  componentId: string,
): MotionComponent {
  ensureProjectExists(projectId);
  const source = getComponent(projectId, componentId);
  if (!source) throw new HttpError(404, "component not found");
  const existing = listComponents(projectId);
  const maxOrder = existing.reduce((max, c) => Math.max(max, c.orderIndex), -1);
  const ts = now();
  // Offset the clone so it does not hide exactly behind the original, and
  // derive a unique, human-readable name instead of stacking "Copy Copy".
  const style: Record<string, string | number> = { ...source.style };
  for (const axis of ["left", "top"] as const) {
    const raw = style[axis];
    if (raw === undefined) continue;
    const n = Number(String(raw).replace(/px$/, ""));
    if (Number.isFinite(n)) style[axis] = `${n + 20}px`;
  }
  const baseName =
    source.name.replace(/\s*(?:\(copy\)|copy(?:\s+\d+)?)$/i, "").trim() || source.name;
  const taken = new Set(existing.map((c) => c.name));
  let name = `${baseName} copy`;
  for (let n = 2; taken.has(name); n += 1) name = `${baseName} copy ${n}`;
  const clone: MotionComponent = {
    ...source,
    id: createId("c_"),
    name,
    orderIndex: maxOrder + 1,
    style,
    createdAt: ts,
    updatedAt: ts,
  };
  createComponent(clone);
  return clone;
}

/**
 * Replace the project's full component set with the given snapshot.
 *
 * Used by undo/redo so history is durable: the previous client-only history
 * reverted the canvas but left the database untouched, which meant a reload
 * resurrected undone work. Components keep their ids (inserts reuse the
 * incoming id), so selection and references survive the round trip.
 */
export function replaceProjectComponents(
  projectId: string,
  components: MotionComponent[],
): MotionComponent[] {
  ensureProjectExists(projectId);
  const existing = listComponents(projectId);
  const incomingIds = new Set(components.map((c) => c.id));
  const removed = existing.filter((c) => !incomingIds.has(c.id)).map((c) => c.id);
  if (removed.length > 0) batchDeleteComponents(projectId, removed);

  const timestamp = now();
  const results: MotionComponent[] = [];
  for (const incoming of components) {
    if (getComponent(projectId, incoming.id)) {
      const updated = patchComponent(projectId, incoming.id, {
        name: incoming.name,
        sceneId: incoming.sceneId,
        selector: incoming.selector,
        durationMs: incoming.durationMs,
        delayMs: incoming.delayMs,
        iterationCount: incoming.iterationCount,
        direction: incoming.direction,
        fillMode: incoming.fillMode,
        playState: incoming.playState,
        trigger: incoming.trigger,
        easing: incoming.easing,
        keyframes: incoming.keyframes,
        style: incoming.style,
        orderIndex: incoming.orderIndex,
        parentId: incoming.parentId,
      });
      results.push(updated ?? incoming);
    } else {
      const created: MotionComponent = {
        ...incoming,
        projectId,
        createdAt: incoming.createdAt || timestamp,
        updatedAt: timestamp,
      };
      createComponent(created);
      results.push(created);
    }
  }
  return results;
}

/** Set order indices for all components by position in the ordered id list. */
export function reorderProjectComponents(
  projectId: string,
  orderedIds: string[],
): MotionComponent[] {
  ensureProjectExists(projectId);
  const results: MotionComponent[] = [];
  orderedIds.forEach((id, index) => {
    const updated = patchComponent(projectId, id, { orderIndex: index });
    if (!updated) throw new HttpError(404, `component ${id} not found`);
    results.push(updated);
  });
  return results;
}
