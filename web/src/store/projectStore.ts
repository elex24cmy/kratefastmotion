import { create } from "zustand";
import type { MotionComponent, MotionProject, MotionSpec, ProjectResponse } from "@kratefastmotion/shared";
import * as api from "../api/endpoints.js";
import { useUiStore } from "./uiStore.js";

let loadRequestId = 0;

const HISTORY_LIMIT = 50;
const LAST_PROJECT_KEY = "kratefastmotion:lastProjectId";

/** Remembered project id so a reload reopens the work in progress. */
export function readLastProjectId(): string | null {
  try {
    return localStorage.getItem(LAST_PROJECT_KEY);
  } catch {
    return null;
  }
}

export function clearLastProjectId(): void {
  try {
    localStorage.removeItem(LAST_PROJECT_KEY);
  } catch {
    /* storage unavailable */
  }
}

/**
 * Persist a history snapshot to the server. Undo/redo used to mutate only the
 * client store, so a reload resurrected undone work. The component set is
 * replaced atomically with the snapshot (ids preserved) and the artboard tokens
 * are written back alongside it.
 */
function persistSnapshot(projectId: string, snap: Snapshot): void {
  void api.replaceComponents(projectId, snap.components).catch(() => {
    // Fall back to server truth so the canvas never claims unsaved state.
    void useProjectStore.getState().loadProject(projectId);
  });
  if (snap.project) {
    void api.updateProject(projectId, { tokens: snap.project.tokens }).catch(() => {
      /* non-critical: the next edit will rewrite the tokens */
    });
  }
}

interface Snapshot {
  components: MotionComponent[];
  project: MotionProject | null;
}

interface ProjectState {
  projectId: string | null;
  project: MotionProject | null;
  components: MotionComponent[];
  loading: boolean;
  past: Snapshot[];
  future: Snapshot[];

  loadProject: (id: string) => Promise<void>;
  setArtboard: (size: { width: number; height: number }, background?: string) => Promise<void>;
  applySpecUpdate: (components: MotionComponent[], project?: MotionProject) => void;
  addComponentLocal: (component: MotionComponent) => void;
  patchComponentLocal: (componentId: string, patch: Partial<MotionComponent>) => void;
  updateComponentLive: (componentId: string, stylePatch: Record<string, string | number>) => void;
  removeComponentLocal: (componentId: string) => void;
  reorderComponentsLocal: (orderedIds: string[]) => void;
  groupComponentsLocal: (componentIds: string[], groupId: string) => void;
  ungroupComponentsLocal: (groupId: string) => void;
  ungroupComponentLocal: (componentId: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

function snapshot(state: ProjectState): Snapshot {
  return { components: state.components, project: state.project };
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectId: null,
  project: null,
  components: [],
  loading: false,
  past: [],
  future: [],

  loadProject: async (id) => {
    const myRequestId = ++loadRequestId;
    set({ loading: true });
    try {
      const resp = await api.getProject(id);
      if (myRequestId !== loadRequestId) return;
      const spec = resp.spec as MotionSpec;
      const project = spec.project ?? (resp as unknown as MotionProject);
      const tokens = project.tokens ?? {};
      // Legacy films (authored on a 1920x1080 stage) predate the artboard
      // tokens. Fall back to the stage size rather than the default 640x360
      // artboard, otherwise their pixel-based layers overflow a tiny canvas.
      const isFilm = String(tokens.__film ?? "0") === "1";
      const defaultW = isFilm ? 1920 : 640;
      const defaultH = isFilm ? 1080 : 360;
      const w = Number(tokens.artboardWidth) || defaultW;
      const h = Number(tokens.artboardHeight) || defaultH;
      useUiStore.getState().setCanvasSize({ width: w, height: h });
      set({
        projectId: id,
        project,
        components: spec.components ?? [],
        loading: false,
        past: [],
        future: [],
      });
      try {
        localStorage.setItem(LAST_PROJECT_KEY, id);
      } catch {
        /* storage unavailable */
      }
    } catch {
      if (myRequestId !== loadRequestId) return;
      set({ loading: false });
    }
  },

  setArtboard: async (size, background) => {
    const state = get();
    if (!state.projectId || !state.project) return;
    const tokens = { ...state.project.tokens };
    tokens.artboardWidth = size.width;
    tokens.artboardHeight = size.height;
    if (background) tokens.artboardBackground = background;
    useUiStore.getState().setCanvasSize(size);
    const past = [...state.past, snapshot(state)].slice(-HISTORY_LIMIT);
    set({ project: { ...state.project, tokens }, past, future: [] });
    await api.updateProject(state.projectId, { tokens });
  },

  applySpecUpdate: (components, project) => {
    const state = get();
    const past = [...state.past, snapshot(state)].slice(-HISTORY_LIMIT);
    set(project ? { components, project, past, future: [] } : { components, past, future: [] });
  },

  addComponentLocal: (component) => {
    const state = get();
    const past = [...state.past, snapshot(state)].slice(-HISTORY_LIMIT);
    set({ components: [...state.components, component], past, future: [] });
  },

  patchComponentLocal: (componentId, patch) => {
    const state = get();
    const past = [...state.past, snapshot(state)].slice(-HISTORY_LIMIT);
    const components = state.components.map((c) =>
      c.id === componentId ? { ...c, ...patch } : c,
    );
    set({ components, past, future: [] });
  },

  updateComponentLive: (componentId, stylePatch) => {
    const state = get();
    const components = state.components.map((c) =>
      c.id === componentId ? { ...c, style: { ...c.style, ...stylePatch } } : c,
    );
    set({ components });
  },

  removeComponentLocal: (componentId) => {
    const state = get();
    const past = [...state.past, snapshot(state)].slice(-HISTORY_LIMIT);
    set({ components: state.components.filter((c) => c.id !== componentId), past, future: [] });
  },

  reorderComponentsLocal: (orderedIds) => {
    const state = get();
    const past = [...state.past, snapshot(state)].slice(-HISTORY_LIMIT);
    const idToIndex = new Map(orderedIds.map((id, i) => [id, i]));
    const reordered = [...state.components]
      .map((c) => ({ ...c, orderIndex: idToIndex.get(c.id) ?? c.orderIndex }))
      .sort((a, b) => a.orderIndex - b.orderIndex);
    set({ components: reordered, past, future: [] });
  },

  groupComponentsLocal: (componentIds, groupId) => {
    const state = get();
    const past = [...state.past, snapshot(state)].slice(-HISTORY_LIMIT);
    const idSet = new Set(componentIds);
    const components = state.components.map((c) =>
      idSet.has(c.id) ? { ...c, parentId: groupId } : c,
    );
    set({ components, past, future: [] });
  },

  ungroupComponentsLocal: (groupId) => {
    const state = get();
    const past = [...state.past, snapshot(state)].slice(-HISTORY_LIMIT);
    const components = state.components.map((c) =>
      c.parentId === groupId ? { ...c, parentId: null } : c,
    );
    set({ components, past, future: [] });
  },

  ungroupComponentLocal: (componentId) => {
    const state = get();
    const past = [...state.past, snapshot(state)].slice(-HISTORY_LIMIT);
    const components = state.components.map((c) =>
      c.id === componentId ? { ...c, parentId: null } : c,
    );
    set({ components, past, future: [] });
  },

  undo: () => {
    const state = get();
    if (state.past.length === 0) return;
    const previous = state.past[state.past.length - 1];
    const past = state.past.slice(0, -1);
    const future = [snapshot(state), ...state.future].slice(0, HISTORY_LIMIT);
    set({ components: previous.components, project: previous.project, past, future });
    if (state.projectId) persistSnapshot(state.projectId, previous);
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return;
    const next = state.future[0];
    const future = state.future.slice(1);
    const past = [...state.past, snapshot(state)].slice(-HISTORY_LIMIT);
    set({ components: next.components, project: next.project, past, future });
    if (state.projectId) persistSnapshot(state.projectId, next);
  },

  reset: () => {
    clearLastProjectId();
    set({
      projectId: null,
      project: null,
      components: [],
      loading: false,
      past: [],
      future: [],
    });
  },
}));
