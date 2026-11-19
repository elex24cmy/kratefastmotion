import { useMemo, useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { useProjectStore } from "../../store/projectStore.js";
import { useUiStore } from "../../store/uiStore.js";
import { useChatStore } from "../../store/chatStore.js";
import { renderSpec } from "../../motion/cssRenderer.js";
import { useLayoutFlip } from "../../hooks/useMotionValue.js";
import { canvasFlipRegistry } from "../../motion/layoutAnimations.js";
import * as api from "../../api/endpoints.js";
import type { Keyframe } from "@kratefastmotion/shared";
import { AlignmentToolbar } from "./AlignmentToolbar.js";
import { SelectionOverlay } from "./SelectionOverlay.js";
import { QuickActionBar } from "./QuickActionBar.js";
import { MultiSelectGizmo } from "./MultiSelectGizmo.js";
import { MotionPathOverlay } from "./MotionPathOverlay.js";
import { PerformanceMonitor } from "./PerformanceMonitor.js";
import { CanvasEmptyState } from "./CanvasEmptyState.js";
import { RuntimeLayer } from "./RuntimeLayer.js";
import { computeGuides, parsePx } from "../../motion/smartGuides.js";

const MIN_DIM = 64;
const MAX_DIM = 4096;

function keyframeTransform(kf: Keyframe): string {
  const props = kf.properties as Record<string, string | number>;
  const parts: string[] = [];
  if (props.translateX != null) parts.push(`translateX(${props.translateX})`);
  if (props.translateY != null) parts.push(`translateY(${props.translateY})`);
  if (props.scale != null) parts.push(`scale(${props.scale})`);
  if (props.scaleX != null) parts.push(`scaleX(${props.scaleX})`);
  if (props.scaleY != null) parts.push(`scaleY(${props.scaleY})`);
  if (props.rotate != null) parts.push(`rotate(${props.rotate}deg)`);
  if (props.skewX != null) parts.push(`skewX(${props.skewX}deg)`);
  if (props.skewY != null) parts.push(`skewY(${props.skewY}deg)`);
  return parts.join(" ");
}

function keyframeOpacity(kf: Keyframe): number {
  const props = kf.properties as Record<string, string | number>;
  return typeof props.opacity === "number" ? props.opacity : 1;
}

interface ViewToggle {
  id: string;
  label: string;
  icon: string;
  active: boolean;
  onToggle: () => void;
}

interface MenuAction {
  id: string;
  label: string;
  icon: string;
  onSelect: () => void;
}

/** Shape tools offered by the canvas toolbar (and the overflow menu). */
const SHAPES: Array<{ id: "rectangle" | "circle" | "text" | "triangle" | "star" | "polygon" | "line" | "arrow"; label: string; icon: string }> = [
  { id: "rectangle", label: "Rectangle", icon: "▭" },
  { id: "circle", label: "Circle", icon: "○" },
  { id: "triangle", label: "Triangle", icon: "△" },
  { id: "star", label: "Star", icon: "★" },
  { id: "polygon", label: "Pentagon", icon: "⬠" },
  { id: "line", label: "Line", icon: "─" },
  { id: "arrow", label: "Arrow", icon: "➤" },
  { id: "text", label: "Text", icon: "T" },
];

/**
 * Compact overflow menu for the canvas view toggles and (on narrow canvases)
 * the shape tools and view commands. Keeping these behind a single button
 * lets the canvas toolbar stay one or two rows instead of overflowing and
 * clipping its controls.
 */
function ViewMenu({
  toggles,
  groups,
}: {
  toggles: ViewToggle[];
  groups?: Array<{ heading?: string; items: MenuAction[] }>;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const activeCount = toggles.filter((t) => t.active).length;

  return (
    <div className="relative z-50" ref={rootRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative px-2 py-0.5 text-[10px] rounded ${open || activeCount > 0 ? "bg-accent/20 text-accent" : "text-gray-500 hover:text-gray-300"}`}
        title="View options"
        aria-label="View options"
        aria-haspopup="menu"
        aria-expanded={open}
        data-view-menu
      >
        ⋯
        {activeCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-accent" />
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-44 max-h-[70vh] overflow-y-auto rounded-md border border-edge bg-panel2 shadow-xl py-1 z-50"
          role="menu"
        >
          {toggles.map((t) => (
            <button
              key={t.id}
              role="menuitemcheckbox"
              aria-checked={t.active}
              onClick={() => t.onToggle()}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] text-gray-300 hover:bg-panel3 text-left transition-colors"
            >
              <span className="w-3 text-center text-accent">{t.active ? "✓" : ""}</span>
              <span className="text-xs w-4 text-center">{t.icon}</span>
              <span className="flex-1">{t.label}</span>
            </button>
          ))}
          {groups?.map((g) => (
            <div key={g.heading ?? g.items[0]?.id} role="group" aria-label={g.heading}>
              <div className="my-1 h-px bg-edge" />
              {g.heading && (
                <div className="px-2.5 py-1 text-[9px] uppercase tracking-wide text-gray-600">{g.heading}</div>
              )}
              {g.items.map((a) => (
                <button
                  key={a.id}
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    a.onSelect();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] text-gray-300 hover:bg-panel3 text-left transition-colors"
                >
                  <span className="w-3" />
                  <span className="text-xs w-4 text-center">{a.icon}</span>
                  <span className="flex-1">{a.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MotionCanvas() {
  const components = useProjectStore((s) => s.components);
  const loading = useProjectStore((s) => s.loading);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const projectId = useProjectStore((s) => s.projectId);
  const project = useProjectStore((s) => s.project);
  const loadProject = useProjectStore((s) => s.loadProject);
  const selectedId = useUiStore((s) => s.selectedComponentId);
  const selectedIds = useUiStore((s) => s.selectedIds);
  const selectComponent = useUiStore((s) => s.selectComponent);
  const toggleSelection = useUiStore((s) => s.toggleSelection);
  const clearSelection = useUiStore((s) => s.clearSelection);
  const triggerReplay = useUiStore((s) => s.triggerReplay);
  const replayTrigger = useUiStore((s) => s.replayTrigger);
  const hiddenIds = useUiStore((s) => s.hiddenIds);
  const soloedId = useUiStore((s) => s.soloedId);
  const lockedIds = useUiStore((s) => s.lockedIds);
  const canvasSize = useUiStore((s) => s.canvasSize);
  const setCanvasSize = useUiStore((s) => s.setCanvasSize);
  const setArtboard = useProjectStore((s) => s.setArtboard);
  const playbackSpeed = useUiStore((s) => s.playbackSpeed);
  const onionSkin = useUiStore((s) => s.onionSkin);
  const setOnionSkin = useUiStore((s) => s.setOnionSkin);
  const setPreviewOpen = useUiStore((s) => s.setPreviewOpen);
  const canvasPan = useUiStore((s) => s.canvasPan);
  const canvasZoom = useUiStore((s) => s.canvasZoom);
  const setCanvasPan = useUiStore((s) => s.setCanvasPan);
  const setCanvasZoom = useUiStore((s) => s.setCanvasZoom);
  const resetCanvasView = useUiStore((s) => s.resetCanvasView);
  const spaceHeld = useUiStore((s) => s.spaceHeld);
  const snapToGrid = useUiStore((s) => s.snapToGrid);
  const setSnapToGrid = useUiStore((s) => s.setSnapToGrid);
  const showRulers = useUiStore((s) => s.showRulers);
  const setShowRulers = useUiStore((s) => s.setShowRulers);
  const setContextMenu = useUiStore((s) => s.setContextMenu);
  const setMarqueeRect = useUiStore((s) => s.setMarqueeRect);
  const marqueeRect = useUiStore((s) => s.marqueeRect);
  const smartGuides = useUiStore((s) => s.smartGuides);
  const showMotionPaths = useUiStore((s) => s.showMotionPaths);
  const setShowMotionPaths = useUiStore((s) => s.setShowMotionPaths);
  const showPerformanceMonitor = useUiStore((s) => s.showPerformanceMonitor);
  const setShowPerformanceMonitor = useUiStore((s) => s.setShowPerformanceMonitor);
  const fitToScreenTrigger = useUiStore((s) => s.fitToScreenTrigger);
  const hoveredId = useUiStore((s) => s.hoveredComponentId);
  const setHoveredId = useUiStore((s) => s.setHoveredComponentId);
  const generationFlashTrigger = useUiStore((s) => s.generationFlashTrigger);
  const marqueeRef = useRef<{ startX: number; startY: number } | null>(null);
  // Track in-progress component drag-to-move so we can update live and commit on release.
  const componentDragRef = useRef<{
    componentId: string;
    startMouseX: number;
    startMouseY: number;
    startLeft: number;
    startTop: number;
    moved: boolean;
  } | null>(null);
  const CANVAS_W = canvasSize.width;
  const CANVAS_H = canvasSize.height;

  const visibleComponents = components.filter((c) => !hiddenIds.has(c.id) && (soloedId === null || c.id === soloedId));
  const [replayKey, setReplayKey] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const canvasAreaRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  // True when the canvas card is too narrow for the full toolbar — the
  // "Canvas" label is dropped so the controls keep their own row.
  const [compact, setCompact] = useState(false);
  // True when it is too narrow for the shape strip as well; those tools then
  // move into the overflow menu so the toolbar stays short.
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    setReplayKey((k) => k + 1);
  }, [replayTrigger]);

  const { css, nodes, stageMode } = useMemo(
    () => renderSpec(visibleComponents, playbackSpeed),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleComponents, replayKey, playbackSpeed],
  );

  // FLIP layout animations: when the component list changes (reorder,
  // insert, remove, resize), animate the position/size transition instead
  // of letting the DOM jump. The trigger is the ordered id list so the
  // hook captures the "first" rect before the browser paints the new layout.
  const flipTrigger = useMemo(
    () => nodes.map((n) => n.componentId).join("|"),
    [nodes],
  );
  useLayoutFlip(flipTrigger, { duration: 220, enterNew: true });

  // 3D camera: when project tokens carry a camera config, apply perspective
  // + perspective-origin to the canvas viewport. Layers with translateZ in
  // their transform automatically receive parallax via CSS 3D.
  const cameraStyle = useMemo<React.CSSProperties>(() => {
    const raw = project?.tokens?.camera;
    if (typeof raw !== "string") return {};
    try {
      const cam = JSON.parse(raw) as {
        positionX: number; positionY: number; positionZ: number;
        focalLength: number; rotateX?: number; rotateY?: number; rotateZ?: number;
      };
      // Perspective distance scales with camera Z and focal length. Higher
      // focal length = more zoomed-in feel (smaller perspective distance).
      const perspective = Math.max(100, cam.positionZ * (50 / Math.max(20, cam.focalLength)));
      const style: React.CSSProperties = {
        perspective: `${perspective}px`,
        perspectiveOrigin: `${50 + (cam.positionX / 10)}% ${50 + (cam.positionY / 10)}%`,
        transformStyle: "preserve-3d",
      };
      if (cam.rotateX || cam.rotateY || cam.rotateZ) {
        style.transform = `rotateX(${cam.rotateX ?? 0}deg) rotateY(${cam.rotateY ?? 0}deg) rotateZ(${cam.rotateZ ?? 0}deg)`;
      }
      return style;
    } catch {
      return {};
    }
  }, [project?.tokens?.camera]);

  // Parse listeners from project tokens
  const listeners = useMemo(() => {
    const raw = project?.tokens?.listeners;
    if (typeof raw !== "string") return [];
    try {
      const parsed = JSON.parse(raw) as { listeners: Array<Record<string, unknown>> };
      return parsed.listeners ?? [];
    } catch {
      return [];
    }
  }, [project?.tokens?.listeners]);

  const listenersByComponent = useMemo(() => {
    const map = new Map<string, typeof listeners>();
    for (const l of listeners) {
      const cid = String(l.componentId);
      if (!map.has(cid)) map.set(cid, []);
      map.get(cid)!.push(l);
    }
    return map;
  }, [listeners]);

  const executeListenerAction = useCallback(
    (action: Record<string, unknown>) => {
      const type = String(action.type);
      const target = String(action.target);
      if (type === "playAnimation") {
        triggerReplay();
      } else if (type === "setProperty") {
        const prop = String(action.property ?? "opacity");
        const val = action.value as string | number;
        const comp = useProjectStore.getState().components.find((c) => c.id === target);
        if (comp && projectId) {
          const newStyle = { ...comp.style, [prop]: val };
          void api.patchComponent(projectId, target, { style: newStyle }).then(() => {
            if (projectId) void loadProject(projectId);
          });
        }
      } else if (type === "applyState") {
        const tokens = project?.tokens;
        const smRaw = tokens?.stateMachine;
        if (typeof smRaw === "string") {
          try {
            const sm = JSON.parse(smRaw) as { states: Array<{ id: string; components: Record<string, { style: Record<string, string | number> }> }> };
            const state = sm.states.find((s) => s.id === target);
            if (state) {
              for (const [compId, data] of Object.entries(state.components)) {
                useProjectStore.getState().updateComponentLive(compId, data.style);
                if (projectId) void api.patchComponent(projectId, compId, { style: data.style }).catch(() => {});
              }
            }
          } catch { /* ignore */ }
        }
      }
    },
    [triggerReplay, projectId, project?.tokens, loadProject],
  );

  const totalDuration = visibleComponents.reduce(
    (max, c) =>
      Math.max(
        max,
        c.delayMs +
          c.durationMs * (c.iterationCount === "infinite" ? 1 : Number(c.iterationCount) || 1),
      ),
    0,
  );

  const zoomIn = useCallback(() => setCanvasZoom(canvasZoom + 0.25), [canvasZoom, setCanvasZoom]);
  const zoomOut = useCallback(() => setCanvasZoom(canvasZoom - 0.25), [canvasZoom, setCanvasZoom]);

  const fitToScreen = useCallback(() => {
    const area = canvasAreaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const padding = 64;
    const scaleW = (rect.width - padding) / CANVAS_W;
    const scaleH = (rect.height - padding) / CANVAS_H;
    const scale = Math.min(scaleW, scaleH, 1);
    setCanvasZoom(scale);
    setCanvasPan({ x: 0, y: 0 });
  }, [CANVAS_W, CANVAS_H, setCanvasZoom, setCanvasPan]);

  const frameSelected = useCallback(() => {
    if (!selectedId) { fitToScreen(); return; }
    const comp = components.find((c) => c.id === selectedId);
    if (!comp) { fitToScreen(); return; }
    const w = Number(comp.style.width) || CANVAS_W;
    const h = Number(comp.style.height) || CANVAS_H;
    const area = canvasAreaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const padding = 80;
    const scale = Math.min((rect.width - padding) / w, (rect.height - padding) / h, 3);
    setCanvasZoom(scale);
    setCanvasPan({ x: 0, y: 0 });
  }, [selectedId, components, CANVAS_W, CANVAS_H, setCanvasZoom, setCanvasPan, fitToScreen]);

  // Auto-fit canvas to center generated content after AI generation.
  useEffect(() => {
    if (fitToScreenTrigger > 0) fitToScreen();
  }, [fitToScreenTrigger, fitToScreen]);

  // Keep the artboard fitted whenever its dimensions change — project load,
  // AI generation, or a manual resize. Without this a large artboard (e.g. a
  // 1920x1080 film stage) opens at 100% and is clipped by the canvas viewport,
  // so the user only sees the top-left corner of the composition.
  //
  // Fit synchronously rather than in requestAnimationFrame: rAF is throttled
  // while a tab is not painting, which would leave the canvas unfitted.
  useEffect(() => {
    const area = canvasAreaRef.current;
    if (!area || area.clientWidth < 32 || area.clientHeight < 32) return;
    fitToScreen();
  }, [CANVAS_W, CANVAS_H, fitToScreen]);

  // Track the card width so the toolbar can drop optional chrome instead of
  // wrapping into a tall stack of rows.
  // Measure the card synchronously on mount (a ResizeObserver callback is
  // deferred while a tab is hidden, which would otherwise leave the first
  // paint with the full-width toolbar), then keep it in sync on resize.
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const apply = (w: number) => {
      setCompact(w < 560);
      setNarrow(w < 430);
    };
    apply(el.clientWidth);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? el.clientWidth;
      apply(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Wheel zoom anchored at the pointer.
  //
  // Attached natively rather than through React's onWheel because React
  // registers wheel listeners as passive, which silently ignores
  // preventDefault() and lets the page scroll underneath the canvas. Zooming
  // around the cursor (instead of the canvas centre) is what makes the
  // gesture feel like it is following the mouse.
  useEffect(() => {
    const area = canvasAreaRef.current;
    if (!area) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = area.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const { canvasZoom: z0, canvasPan: pan0 } = useUiStore.getState();
      // Exponential factor: touchpads fire many small deltas, mice a few
      // large ones; this keeps the feel consistent across both.
      const z1 = Math.max(0.1, Math.min(5, z0 * Math.exp(-e.deltaY * 0.0015)));
      if (z1 === z0) return;
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const r = z1 / z0;
      // The canvas is flex-centred then transformed from its own centre, so
      // the point under the cursor is q = (p - c - pan) / zoom. Solving for
      // the pan that leaves q fixed gives pan' = (p - c) - (p - c - pan) * r.
      useUiStore.getState().setCanvasZoom(z1);
      useUiStore.getState().setCanvasPan({
        x: px - cx - (px - cx - pan0.x) * r,
        y: py - cy - (py - cy - pan0.y) * r,
      });
    };
    area.addEventListener("wheel", onWheel, { passive: false });
    return () => area.removeEventListener("wheel", onWheel);
  }, []);

  // Generation flash — when a spec_update lands with new components,
  // trigger a brief CSS animation on the canvas to draw the eye. The
  // flash class is applied for the animation duration then removed.
  const [flashKey, setFlashKey] = useState(0);
  useEffect(() => {
    if (generationFlashTrigger > 0) setFlashKey((k) => k + 1);
  }, [generationFlashTrigger]);

  // Pan + marquee handlers
  const onCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) return; // right-click handled by onContextMenu
    if (spaceHeld || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY, panX: canvasPan.x, panY: canvasPan.y };
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    } else if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("canvas-area-bg")) {
      clearSelection();
      // Start marquee selection
      const rect = canvasAreaRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        marqueeRef.current = { startX: x, startY: y };
        setMarqueeRect({ x, y, w: 0, h: 0 });
      }
    }
  }, [spaceHeld, canvasPan, clearSelection, setMarqueeRect]);

  // Marquee drag handler
  useEffect(() => {
    if (!marqueeRef.current) return;
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvasAreaRef.current?.getBoundingClientRect();
      if (!rect || !marqueeRef.current) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const sx = marqueeRef.current.startX;
      const sy = marqueeRef.current.startY;
      setMarqueeRect({
        x: Math.min(sx, x),
        y: Math.min(sy, y),
        w: Math.abs(x - sx),
        h: Math.abs(y - sy),
      });
    };
    const onMouseUp = () => {
      const mr = marqueeRef.current;
      const rect = useUiStore.getState().marqueeRect;
      if (mr && rect && rect.w > 3 && rect.h > 3) {
        // Compute which components intersect the marquee (in canvas coordinates)
        const canvasEl = document.querySelector("[data-om-canvas]") as HTMLElement | null;
        if (canvasEl) {
          const cRect = canvasEl.getBoundingClientRect();
          // Marquee is in screen coords relative to canvas area; convert to canvas coords
          const scaleX = CANVAS_W / cRect.width;
          const scaleY = CANVAS_H / cRect.height;
          const mx = (rect.x - (cRect.left - (canvasAreaRef.current?.getBoundingClientRect().left ?? 0))) * scaleX;
          const my = (rect.y - (cRect.top - (canvasAreaRef.current?.getBoundingClientRect().top ?? 0))) * scaleY;
          const mw = rect.w * scaleX;
          const mh = rect.h * scaleY;
          const intersected = components.filter((c) => {
            const s = c.style as Record<string, string | number> | undefined;
            const cl = typeof s?.left === "number" ? s.left : parseFloat(String(s?.left ?? "0")) || 0;
            const ct = typeof s?.top === "number" ? s.top : parseFloat(String(s?.top ?? "0")) || 0;
            const cw = typeof s?.width === "number" ? s.width : parseFloat(String(s?.width ?? "100")) || 100;
            const ch = typeof s?.height === "number" ? s.height : parseFloat(String(s?.height ?? "100")) || 100;
            return cl < mx + mw && cl + cw > mx && ct < my + mh && ct + ch > my;
          }).map((c) => c.id);
          if (intersected.length > 0) {
            useUiStore.getState().setSelectedIds(intersected);
          }
        }
      }
      marqueeRef.current = null;
      setMarqueeRect(null);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [CANVAS_W, CANVAS_H, components, setMarqueeRect]);

  // Component drag-to-move: when a component drag is in progress, update its
  // position live via updateComponentLive (no history entries during drag),
  // then commit the final position on mouseup via patchComponentLocal.
  // Smart alignment guides snap the dragged box to sibling edges/centers and
  // artboard midlines for a Figma-like feel.
  const GRID_STEP = 8;
  useEffect(() => {
    if (!componentDragRef.current) return;
    const onMouseMove = (e: MouseEvent) => {
      const drag = componentDragRef.current;
      if (!drag) return;
      const dx = (e.clientX - drag.startMouseX) / canvasZoom;
      const dy = (e.clientY - drag.startMouseY) / canvasZoom;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && !drag.moved) return;
      drag.moved = true;
      let newLeft = drag.startLeft + dx;
      let newTop = drag.startTop + dy;
      if (snapToGrid) {
        newLeft = Math.round(newLeft / GRID_STEP) * GRID_STEP;
        newTop = Math.round(newTop / GRID_STEP) * GRID_STEP;
      }
      // Smart guides: snap to sibling edges/centers and artboard midlines.
      const comp = useProjectStore.getState().components.find((c) => c.id === drag.componentId);
      if (comp) {
        const s = comp.style as Record<string, string | number>;
        const w = parsePx(s.width, 100);
        const h = parsePx(s.height, 100);
        const guideResult = computeGuides(
          drag.componentId,
          { left: newLeft, top: newTop, width: w, height: h },
          useProjectStore.getState().components,
          CANVAS_W,
          CANVAS_H,
        );
        newLeft += guideResult.snapDx;
        newTop += guideResult.snapDy;
        useUiStore.getState().setSmartGuides(guideResult.guides);
      }
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      useProjectStore.getState().updateComponentLive(drag.componentId, { left: newLeft, top: newTop });
    };
    const onMouseUp = () => {
      const drag = componentDragRef.current;
      componentDragRef.current = null;
      useUiStore.getState().setSmartGuides([]);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      if (drag && drag.moved) {
        const comp = useProjectStore.getState().components.find((c) => c.id === drag.componentId);
        if (comp) {
          const s = comp.style as Record<string, string | number>;
          const finalLeft = typeof s.left === "number" ? s.left : parseFloat(String(s.left ?? "0")) || 0;
          const finalTop = typeof s.top === "number" ? s.top : parseFloat(String(s.top ?? "0")) || 0;
          useProjectStore.getState().patchComponentLocal(drag.componentId, {
            style: { ...comp.style, left: finalLeft, top: finalTop },
          });
          // Sync to backend so the change persists
          if (projectId) {
            api.patchComponent(projectId, drag.componentId, {
              style: { ...comp.style, left: finalLeft, top: finalTop },
            }).catch(() => {});
          }
        }
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [canvasZoom, snapToGrid, projectId, CANVAS_W, CANVAS_H]);

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Determine if right-clicked on a component
    const target = e.target as HTMLElement;
    const compEl = target.closest("[data-om-name]") as HTMLElement | null;
    const componentId = compEl?.getAttribute("data-om-name") ?? null;
    // Find actual component by matching name
    let matchedId: string | null = null;
    if (compEl) {
      const name = compEl.getAttribute("data-om-name");
      const comp = components.find((c) => c.name === name);
      if (comp) {
        matchedId = comp.id;
        if (!useUiStore.getState().selectedIds.has(matchedId)) {
          selectComponent(matchedId);
        }
      }
    }
    setContextMenu({ x: e.clientX, y: e.clientY, componentId: matchedId });
  }, [components, selectComponent, setContextMenu]);

  useEffect(() => {
    if (!isPanning) return;
    const onMouseMove = (e: MouseEvent) => {
      if (!panStartRef.current) return;
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setCanvasPan({ x: panStartRef.current.panX + dx, y: panStartRef.current.panY + dy });
    };
    const onMouseUp = () => {
      setIsPanning(false);
      panStartRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isPanning, setCanvasPan]);

  const handleAddShape = useCallback(async (shape: "rectangle" | "circle" | "text" | "triangle" | "star" | "polygon" | "line" | "arrow") => {
    if (!projectId) return;
    const names: Record<string, string> = {
      rectangle: "Rectangle", circle: "Circle", text: "Text",
      triangle: "Triangle", star: "Star", polygon: "Pentagon",
      line: "Line", arrow: "Arrow",
    };
    const comp = await api.createComponent(projectId, { name: names[shape] });
    const baseStyle: Record<string, string | number> = { position: "absolute" };
    if (shape === "rectangle") {
      baseStyle.left = "40%"; baseStyle.top = "40%"; baseStyle.width = 120; baseStyle.height = 80;
      baseStyle.backgroundColor = "#e5e5e5"; baseStyle.borderRadius = "8px";
    } else if (shape === "circle") {
      baseStyle.left = "42%"; baseStyle.top = "40%"; baseStyle.width = 80; baseStyle.height = 80;
      baseStyle.backgroundColor = "#e5e5e5"; baseStyle.borderRadius = "50%";
    } else if (shape === "text") {
      baseStyle.left = "40%"; baseStyle.top = "45%"; baseStyle._content = "Text";
      baseStyle.fontSize = 24; baseStyle.color = "#f4f6fb"; baseStyle.fontWeight = 600;
    } else if (shape === "triangle") {
      baseStyle.left = "42%"; baseStyle.top = "40%"; baseStyle.width = 90; baseStyle.height = 80;
      baseStyle.backgroundColor = "#e5e5e5";
      baseStyle.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
    } else if (shape === "star") {
      baseStyle.left = "42%"; baseStyle.top = "40%"; baseStyle.width = 90; baseStyle.height = 90;
      baseStyle.backgroundColor = "#e5e5e5";
      baseStyle.clipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
    } else if (shape === "polygon") {
      baseStyle.left = "42%"; baseStyle.top = "40%"; baseStyle.width = 90; baseStyle.height = 90;
      baseStyle.backgroundColor = "#e5e5e5";
      baseStyle.clipPath = "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)";
    } else if (shape === "line") {
      baseStyle.left = "30%"; baseStyle.top = "48%"; baseStyle.width = 180; baseStyle.height = 2;
      baseStyle.backgroundColor = "#e5e5e5";
    } else if (shape === "arrow") {
      baseStyle.left = "35%"; baseStyle.top = "45%"; baseStyle.width = 120; baseStyle.height = 40;
      baseStyle.backgroundColor = "#e5e5e5";
      baseStyle.clipPath = "polygon(0% 40%, 60% 40%, 60% 0%, 100% 50%, 60% 100%, 60% 60%, 0% 60%)";
    }
    await api.patchComponent(projectId, comp.id, { style: baseStyle });
    await loadProject(projectId);
    selectComponent(comp.id);
  }, [projectId, loadProject, selectComponent]);

  const cursorStyle = isPanning ? "grabbing" : spaceHeld ? "grab" : "default";
  const artboardBg = String(project?.tokens?.artboardBackground ?? "");
  const canvasBg = artboardBg || artboardBg === "transparent"
    ? artboardBg
    : "radial-gradient(120% 120% at 50% 0%, #161616 0%, #000000 60%)";

  // Secondary view toggles live in the overflow menu so the toolbar keeps
  // one row on narrow canvases.
  const viewToggles: ViewToggle[] = [
    { id: "snap", label: "Snap to grid", icon: "🧲", active: snapToGrid, onToggle: () => setSnapToGrid(!snapToGrid) },
    { id: "rulers", label: "Rulers", icon: "📊", active: showRulers, onToggle: () => setShowRulers(!showRulers) },
    { id: "onion", label: "Onion skin", icon: "◊", active: onionSkin.enabled, onToggle: () => setOnionSkin({ enabled: !onionSkin.enabled }) },
    { id: "paths", label: "Motion paths", icon: "∿", active: showMotionPaths, onToggle: () => setShowMotionPaths(!showMotionPaths) },
    { id: "perf", label: "Performance", icon: "⚙", active: showPerformanceMonitor, onToggle: () => setShowPerformanceMonitor(!showPerformanceMonitor) },
  ];

  // On a very narrow canvas the shape tools and the two convenience view
  // commands move into the overflow menu, so the toolbar stays short and
  // nothing is lost.
  const shapeActions: MenuAction[] = SHAPES.map((s) => ({
    id: s.id,
    label: s.label,
    icon: s.icon,
    onSelect: () => void handleAddShape(s.id),
  }));
  const viewActions: MenuAction[] = [
    { id: "reset-view", label: "Reset view to 100%", icon: "◱", onSelect: resetCanvasView },
    { id: "frame-selected", label: "Frame selected", icon: "▤", onSelect: frameSelected },
  ];
  const menuGroups = narrow
    ? [
        ...(projectId ? [{ heading: "Add shape", items: shapeActions }] : []),
        { heading: "View", items: viewActions },
      ]
    : undefined;

  return (
    <div ref={cardRef} className="flex flex-col h-full bg-ink rounded-xl border border-edge">
      {/* Canvas toolbar */}
      <div data-canvas-toolbar className="rounded-t-xl px-3 py-1.5 border-b border-edge flex flex-wrap items-center gap-x-2 gap-y-1 bg-panel flex-shrink-0">
        {!compact && <span className="text-[10px] uppercase tracking-wide text-gray-500 whitespace-nowrap">Canvas</span>}
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={MIN_DIM}
            max={MAX_DIM}
            step={16}
            value={CANVAS_W}
            onChange={(e) => {
              const w = Math.min(MAX_DIM, Math.max(MIN_DIM, Number(e.target.value) || MIN_DIM));
              setCanvasSize({ width: w, height: CANVAS_H });
            }}
            onBlur={() => void setArtboard({ width: CANVAS_W, height: CANVAS_H })}
            className="w-14 bg-panel2 border border-edge rounded px-1 py-0.5 text-[10px] text-gray-100 font-mono focus:outline-none focus:border-accent"
            aria-label="Canvas width in pixels"
          />
          <span className="text-[10px] text-gray-600">×</span>
          <input
            type="number"
            min={MIN_DIM}
            max={MAX_DIM}
            step={16}
            value={CANVAS_H}
            onChange={(e) => {
              const h = Math.min(MAX_DIM, Math.max(MIN_DIM, Number(e.target.value) || MIN_DIM));
              setCanvasSize({ width: CANVAS_W, height: h });
            }}
            onBlur={() => void setArtboard({ width: CANVAS_W, height: CANVAS_H })}
            className="w-14 bg-panel2 border border-edge rounded px-1 py-0.5 text-[10px] text-gray-100 font-mono focus:outline-none focus:border-accent"
            aria-label="Canvas height in pixels"
          />
        </div>
        {/* Shape creation buttons — hidden on very narrow canvases, where
            they move into the overflow menu instead of wrapping the toolbar. */}
        {projectId && !narrow && (
          <div className="flex flex-wrap items-center gap-0.5 ml-1">
            {SHAPES.map((s) => (
              <button
                key={s.id}
                onClick={() => handleAddShape(s.id)}
                className="w-6 h-6 flex items-center justify-center text-[10px] text-gray-500 hover:text-accent bg-panel2 border border-edge rounded"
                title={`Add ${s.label.toLowerCase()}`}
                aria-label={`Add ${s.label.toLowerCase()}`}
              >
                {s.icon}
              </button>
            ))}
          </div>
        )}
        <div className="ml-auto flex flex-wrap items-center justify-end gap-1 min-w-0">
          <button onClick={() => setShowGrid((v) => !v)} className={`px-2 py-0.5 text-[10px] rounded ${showGrid ? "bg-accent/20 text-accent" : "text-gray-500 hover:text-gray-300"}`} title="Toggle grid" aria-label="Toggle grid" aria-pressed={showGrid}>⊞</button>
          <ViewMenu toggles={viewToggles} groups={menuGroups} />
          <button onClick={() => setPreviewOpen(true)} className="px-2 py-0.5 text-[10px] text-gray-500 hover:text-accent bg-panel2 border border-edge rounded" title="Fullscreen preview" aria-label="Open fullscreen preview">⤢</button>
          <div className="flex items-center border border-edge rounded overflow-hidden">
            <button onClick={zoomOut} className="w-6 h-6 flex items-center justify-center text-xs text-gray-400 hover:text-accent bg-panel2" title="Zoom out" aria-label="Zoom out">−</button>
            <span className="text-[10px] text-gray-500 font-mono w-10 text-center bg-panel border-l border-r border-edge py-0.5">{Math.round(canvasZoom * 100)}%</span>
            <button onClick={zoomIn} className="w-6 h-6 flex items-center justify-center text-xs text-gray-400 hover:text-accent bg-panel2" title="Zoom in" aria-label="Zoom in">+</button>
          </div>
          <button onClick={fitToScreen} className="px-2 py-0.5 text-[10px] text-gray-400 hover:text-accent bg-panel2 border border-edge rounded" title="Fit to screen" aria-label="Fit to screen">Fit</button>
          {/* These two are conveniences; they yield first when the canvas is
              narrow so the toolbar stays two rows instead of three. */}
          {!narrow && (
            <>
              <button onClick={resetCanvasView} className="px-2 py-0.5 text-[10px] text-gray-400 hover:text-accent bg-panel2 border border-edge rounded" title="Reset view to 100%" aria-label="Reset view to 100%">1:1</button>
              <button onClick={frameSelected} className="px-2 py-0.5 text-[10px] text-gray-400 hover:text-accent bg-panel2 border border-edge rounded" title="Frame selected" aria-label="Frame selected">▤</button>
            </>
          )}
          <button onClick={triggerReplay} className="ml-1 px-2.5 py-0.5 text-[10px] rounded bg-accent hover:bg-accent2 text-black font-medium" title="Replay (Shift+R)" aria-label="Replay animation">{narrow ? "▶" : "▶ Replay"}</button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={canvasAreaRef}
        className={`flex-1 overflow-hidden flex items-center justify-center relative ${showGrid ? "canvas-grid" : ""} canvas-area-bg`}
        style={{ cursor: cursorStyle }}
        onMouseDown={onCanvasMouseDown}
        onContextMenu={onContextMenu}
        onDoubleClick={(e) => {
          // Double-clicking the empty backdrop re-fits the artboard — the
          // quick way back if a pan/zoom lost the canvas off-screen.
          const t = e.target as HTMLElement;
          if (t === e.currentTarget || t.classList.contains("canvas-area-bg")) fitToScreen();
        }}
      >
        <style>{css}</style>
        {isStreaming && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, transparent, var(--text), transparent)",
              backgroundSize: "200% 100%",
              animation: "om-agent-scan 1.5s linear infinite",
              zIndex: 100,
              pointerEvents: "none",
            }}
          />
        )}
        {isStreaming && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 12,
              zIndex: 101,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 10,
              fontFamily: "var(--mono)",
              color: "var(--text)",
              background: "rgba(0,0,0,0.6)",
              border: "1px solid var(--border)",
              borderRadius: 4,
              padding: "2px 8px",
              letterSpacing: "0.04em",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--text)",
                animation: "om-pulse 1.2s ease-in-out infinite",
              }}
            />
            AGENT WORKING
          </div>
        )}
        <style>{`
          @keyframes om-agent-scan {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @keyframes om-pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
        `}</style>
        <AlignmentToolbar />
        {/* Marquee selection rectangle */}
        {marqueeRect && marqueeRect.w > 0 && (
          <div
            className="absolute pointer-events-none border border-white/30 bg-white/5"
            style={{
              left: marqueeRect.x,
              top: marqueeRect.y,
              width: marqueeRect.w,
              height: marqueeRect.h,
            }}
          />
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500 text-sm animate-pulse">Loading project…</div>
          </div>
        )}
        {!loading && nodes.length === 0 && (
          <CanvasEmptyState />
        )}
        <div
          key={replayKey}
          data-om-canvas
          className={`relative fade-in-up ${flashKey > 0 ? "gen-flash" : ""}`}
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            // Keep the true artboard pixel size: the flex parent would
            // otherwise shrink the canvas horizontally (leaving the height
            // untouched) and distort every layer. Zoom handles fitting instead.
            flexShrink: 0,
            transform: `translate(${canvasPan.x}px, ${canvasPan.y}px) scale(${canvasZoom})`,
            transformOrigin: "center center",
            background: canvasBg,
            borderRadius: 8,
            border: "1px solid #262626",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02)",
          }}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Dimension labels */}
          <div className="absolute -top-5 left-0 right-0 flex justify-center text-[9px] text-gray-600 font-mono">{CANVAS_W}px</div>
          <div className="absolute top-0 bottom-0 -left-5 flex items-center text-[9px] text-gray-600 font-mono" style={{ writingMode: "vertical-rl" }}>{CANVAS_H}px</div>

          {/* Rendered components. Staged specs (layers pinned to the artboard)
              fill the stage; flow specs (simple effect templates with no
              offsets) are centered the same way the preview and the export
              center them, so they never stack in the top-left corner. */}
          <div
            className={
              stageMode
                ? "absolute inset-0 overflow-hidden"
                : "absolute inset-0 flex items-center justify-center flex-wrap gap-4 p-8"
            }
            style={cameraStyle}
          >
            {nodes.map((node) => {
              const Tag = node.tag as React.ElementType;
              const isSelected = selectedIds.has(node.componentId);
              const isLocked = lockedIds.has(node.componentId);
              const compListeners = listenersByComponent.get(node.componentId) ?? [];
              const findListener = (evt: string) => compListeners.find((l) => l.eventType === evt);
              const isMediaTag = node.tag === "img" || node.tag === "video" || node.tag === "audio";
              const isVoidTag = node.tag === "img" || node.tag === "input" || node.tag === "br" || node.tag === "hr";
              // JS-driven layers (particle emitters, audio bindings, live
              // expressions) delegate to <RuntimeLayer> instead of a plain
              // tag — the runtime owns the RAF loop and DOM mutations.
              if (node.runtime) {
                return (
                  <RuntimeLayer
                    key={node.componentId}
                    node={node}
                    className={`${node.className} ${isSelected ? "selection-outline" : ""}`}
                  />
                );
              }
              const mediaProps = isMediaTag ? {
                src: node.src ?? undefined,
                poster: node.poster ?? undefined,
                loop: node.loop || undefined,
                muted: node.muted || undefined,
                // A timeline-synced clip (one with a source in-point) must not
                // free-run: the canvas shows it paused on its in-point, which is
                // the frame the export starts from.
                autoPlay: (node.autoplay && node.start == null) || undefined,
                controls: node.controls || undefined,
                playsInline: true,
                preload: "auto" as const,
              } : {};
              // Register the element with the flip registry, and for a synced
              // clip park it on its in-point so the canvas is deterministic.
              const registerRef = (el: HTMLElement | null) => {
                canvasFlipRegistry.register(node.componentId, el);
                if (!el || !isMediaTag || node.start == null) return;
                const media = el as HTMLMediaElement;
                const at = node.start;
                try {
                  media.pause();
                  if (media.readyState >= 1) {
                    media.currentTime = at;
                  } else {
                    media.addEventListener(
                      "loadedmetadata",
                      () => {
                        try { media.currentTime = at; } catch { /* not seekable */ }
                      },
                      { once: true },
                    );
                  }
                } catch {
                  /* not seekable */
                }
              };
              const eventHandlers = {
                onClick: (e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (isLocked) {
                    // Locked layers still select so the user can see what they
                    // clicked and unlock it from the inspector — they just
                    // cannot be dragged or edited on the canvas.
                    if (e.shiftKey) toggleSelection(node.componentId);
                    else selectComponent(node.componentId);
                    return;
                  }
                  const cl = findListener("click");
                  if (cl && cl.action) executeListenerAction(cl.action as Record<string, unknown>);
                  if (e.shiftKey) {
                    toggleSelection(node.componentId);
                  } else {
                    selectComponent(isSelected && selectedIds.size === 1 ? null : node.componentId);
                  }
                },
                onMouseEnter: (e: React.MouseEvent) => {
                  e.stopPropagation();
                  setHoveredId(node.componentId);
                  const cl = findListener("pointerEnter");
                  if (cl && cl.action) executeListenerAction(cl.action as Record<string, unknown>);
                },
                onMouseLeave: (e: React.MouseEvent) => {
                  e.stopPropagation();
                  setHoveredId(null);
                  const cl = findListener("pointerLeave");
                  if (cl && cl.action) executeListenerAction(cl.action as Record<string, unknown>);
                },
                onMouseDown: (e: React.MouseEvent) => {
                  const cl = findListener("pointerDown");
                  if (cl && cl.action) executeListenerAction(cl.action as Record<string, unknown>);
                  // Initiate drag-to-move when: left button, not space-panning,
                  // not shift-multiselecting, and component is not locked.
                  if (e.button === 0 && !spaceHeld && !e.shiftKey && !isLocked) {
                    const comp = components.find((c) => c.id === node.componentId);
                    if (comp) {
                      const s = comp.style as Record<string, string | number>;
                      const startLeft = typeof s?.left === "number" ? s.left : parseFloat(String(s?.left ?? "0")) || 0;
                      const startTop = typeof s?.top === "number" ? s.top : parseFloat(String(s?.top ?? "0")) || 0;
                      componentDragRef.current = {
                        componentId: node.componentId,
                        startMouseX: e.clientX,
                        startMouseY: e.clientY,
                        startLeft,
                        startTop,
                        moved: false,
                      };
                      // Select the component on drag start
                      selectComponent(node.componentId);
                    }
                  }
                },
                onMouseUp: (e: React.MouseEvent) => {
                  const cl = findListener("pointerUp");
                  if (cl && cl.action) executeListenerAction(cl.action as Record<string, unknown>);
                },
              };
              const isHovered = hoveredId === node.componentId;
              const outlineClass = isSelected
                ? "selection-outline"
                : isHovered && !isLocked
                ? "canvas-hover-outline"
                : "";
              if (isVoidTag) {
                return (
                  <Tag
                    key={node.componentId}
                    ref={registerRef}
                    className={`${node.className} ${isLocked ? "cursor-not-allowed" : "cursor-pointer"} ${outlineClass}`}
                    data-om-name={node.name}
                    data-om-component-id={node.componentId}
                    style={isLocked ? { opacity: 0.5 } : undefined}
                    {...mediaProps}
                    {...eventHandlers}
                  />
                );
              }
              return (
                <Tag
                  key={node.componentId}
                  ref={registerRef}
                  className={`${node.className} ${isLocked ? "cursor-not-allowed" : "cursor-pointer"} ${outlineClass}`}
                  data-om-name={node.name}
                  data-om-component-id={node.componentId}
                  style={isLocked ? { opacity: 0.5 } : undefined}
                  {...mediaProps}
                  {...eventHandlers}
                >
                  {isMediaTag ? null : node.content}
                  {isLocked && <span className="ml-1 text-[9px] text-gray-500">🔒</span>}
                </Tag>
              );
            })}
          </div>

          {/* Smart alignment guides */}
          {smartGuides.length > 0 && (
            <svg className="absolute inset-0 pointer-events-none" width={CANVAS_W} height={CANVAS_H} style={{ overflow: "visible" }}>
              {smartGuides.map((g, i) =>
                g.axis === "x" ? (
                  <line key={i} x1={g.position} y1={g.start} x2={g.position} y2={g.start + g.length} stroke="white" strokeWidth={1} />
                ) : (
                  <line key={i} x1={g.start} y1={g.position} x2={g.start + g.length} y2={g.position} stroke="white" strokeWidth={1} />
                ),
              )}
            </svg>
          )}

          {/* Motion path visualization overlay (all components, easing-colored) */}
          <MotionPathOverlay />

          {/* Real-time performance overlay (FPS, animations, memory) */}
          <PerformanceMonitor />

          {/* Selection overlay with resize/rotate handles (single selection) */}
          {selectedId && selectedIds.size <= 1 && <SelectionOverlay />}

          {/* Multi-select group gizmo (2+ selected) */}
          {selectedIds.size > 1 && <MultiSelectGizmo />}

          {/* Onion skin ghost frames */}
          {onionSkin.enabled && selectedId && (() => {
            const comp = components.find((c) => c.id === selectedId);
            if (!comp || comp.keyframes.length < 2) return null;
            const ghostKfs = comp.keyframes.slice(0, onionSkin.frames + 1);
            return (
              <div className="absolute inset-0 flex items-center justify-center flex-wrap gap-4 p-8 pointer-events-none">
                {ghostKfs.map((kf, i) => {
                  const transform = keyframeTransform(kf);
                  const opacity = keyframeOpacity(kf) * onionSkin.opacity * (1 - i / (ghostKfs.length + 1));
                  const style: React.CSSProperties = { transform, opacity, ...comp.style };
                  const Tag = "div" as keyof JSX.IntrinsicElements;
                  return <Tag key={`ghost-${i}`} className="rounded-lg border border-edge" style={style}>{comp.name}</Tag>;
                })}
              </div>
            );
          })()}

          {/* Selection label */}
          {selectedId && (
            <div className="absolute -top-5 right-0 text-[9px] text-accent font-mono bg-ink/80 px-1.5 py-0.5 rounded" style={{ pointerEvents: "none" }}>
              {selectedIds.size > 1 ? `${selectedIds.size} selected` : (components.find((c) => c.id === selectedId)?.name ?? "selected")}
            </div>
          )}

          {/* Quick action floating toolbar */}
          {selectedId && <QuickActionBar />}
        </div>
      </div>

      {/* Status bar */}
      <div className="rounded-b-xl px-3 py-1 border-t border-edge flex items-center gap-2 text-[10px] text-gray-600 bg-panel flex-shrink-0">
        <span className="font-medium">{components.length}</span>
        <span className="text-gray-700">layers</span>
        <span className="text-gray-700">·</span>
        <span>{totalDuration > 0 ? `${totalDuration}ms total` : "empty"}</span>
        <span className="text-gray-700">·</span>
        <span>{visibleComponents.length} rendered</span>
        {lockedIds.size > 0 && (<><span className="text-gray-700">·</span><span>{lockedIds.size} locked</span></>)}
        <div className="ml-auto flex items-center gap-2">
          {selectedId && (<span className="text-accent">▸ {components.find((c) => c.id === selectedId)?.name}</span>)}
          <span className="text-gray-700">·</span>
          <span>{playbackSpeed}× speed</span>
          <span className="text-gray-700">·</span>
          <span>{Math.round(canvasZoom * 100)}% zoom</span>
        </div>
      </div>
    </div>
  );
}
