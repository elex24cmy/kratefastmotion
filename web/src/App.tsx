import { useEffect, useState } from "react";
import { useUiStore } from "./store/uiStore.js";
import { useProjectStore, readLastProjectId, clearLastProjectId } from "./store/projectStore.js";
import * as api from "./api/endpoints.js";
import { Editor } from "./routes/Editor.js";
import { ShortcutsModal } from "./components/modals/ShortcutsModal.js";
import { CommandPalette } from "./components/modals/CommandPalette.js";
import { ErrorBoundary } from "./components/ErrorBoundary.js";

export default function App() {
  const setHealth = useUiStore((s) => s.setHealth);
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useUiStore((s) => s.setSidebarCollapsed);
  const [backend, setBackend] = useState<"checking" | "ok" | "error">("checking");

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempt = 0;

    const check = () => {
      api
        .health()
        .then((h) => {
          if (cancelled) return;
          setHealth(h);
          setBackend("ok");
          // Reopen the project that was being edited before the reload. A stale
          // id (project deleted elsewhere) simply falls back to the landing page.
          const last = readLastProjectId();
          if (!last) return;
          void useProjectStore
            .getState()
            .loadProject(last)
            .then(() => {
              if (!cancelled && !useProjectStore.getState().projectId) clearLastProjectId();
            });
        })
        .catch(() => {
          if (cancelled) return;
          setHealth(null);
          // The first health call also warms the backend (browser + provider
          // probes), which can take several seconds on a cold start — retry
          // before declaring it unavailable.
          if (attempt < 15) {
            attempt += 1;
            timer = setTimeout(check, 3000);
          } else {
            setBackend("error");
          }
        });
    };

    check();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [setHealth]);

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-ink text-gray-100">
        <nav className="flex items-center justify-between px-4 py-1.5 border-b border-edge bg-panel flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-7 h-7 rounded-md text-gray-400 hover:text-gray-200 hover:bg-panel2 flex items-center justify-center transition-colors"
              title={sidebarCollapsed ? "Show conversations" : "Hide conversations"}
              aria-label={sidebarCollapsed ? "Show conversations" : "Hide conversations"}
              aria-expanded={!sidebarCollapsed}
            >
              <span className="text-sm">≣</span>
            </button>
            <img src="/kratefastmotion-icon.png" alt="KrateFastMotion" className="w-5 h-5 rounded" />
            <span className="text-sm font-semibold tracking-tight">KrateFastMotion</span>
            <span className="text-[10px] text-gray-600">AI-Native Motion Design Platform</span>
          </div>
        </nav>

        {backend === "checking" && (
          <div className="bg-panel2 border-b border-edge px-4 py-1.5 text-xs text-gray-400 text-center">
            Connecting to backend…
          </div>
        )}

        {backend === "error" && (
          <div className="bg-red-950/60 border-b border-red-900 px-4 py-1.5 text-xs text-red-300 text-center">
            Backend unavailable — start it with `npm -w @kratefastmotion/server run dev`.
          </div>
        )}

        <div className="flex-1 min-h-0">
          <Editor />
        </div>

        <ShortcutsModal />
        <CommandPalette />
      </div>
    </ErrorBoundary>
  );
}
