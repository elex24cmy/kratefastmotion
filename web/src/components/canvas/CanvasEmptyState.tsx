import { useProjectStore } from "../../store/projectStore.js";
import { useChatStore } from "../../store/chatStore.js";

interface QuickStart {
  prompt: string;
  label: string;
  icon: string;
  hint: string;
}

const QUICK_STARTS: QuickStart[] = [
  { prompt: "create a fade in animation", label: "Fade In", icon: "▾", hint: "Gentle opacity entrance" },
  { prompt: "create a bounce in animation", label: "Bounce In", icon: "◉", hint: "Elastic spring entrance" },
  { prompt: "create a slide up animation", label: "Slide Up", icon: "△", hint: "Vertical motion entrance" },
  { prompt: "create a spin entrance animation", label: "Spin In", icon: "↻", hint: "Rotating reveal" },
  { prompt: "create a scale up animation", label: "Scale Up", icon: "⤢", hint: "Growing entrance" },
  { prompt: "create a spring entrance animation", label: "Spring", icon: "〰", hint: "Physics-based motion" },
];

const EXAMPLE_PROMPTS: QuickStart[] = [
  { prompt: "create a bouncy fade in with 200ms delay, blue background", label: "Compound request", icon: "✦", hint: "Multiple properties in one sentence" },
  { prompt: "apply a cinematic style", label: "Style preset", icon: "◐", hint: "Coordinated aesthetic across project" },
  { prompt: "stagger all components by 150ms", label: "Choreography", icon: "≡", hint: "Sequential cascade entrance" },
  { prompt: "add a glitch shader effect", label: "Shader effect", icon: "▓", hint: "WebGL visual effect" },
];

/**
 * Empty state for a project with no layers yet.
 *
 * Layout lives in `styles/index.css` (`.kfm-empty*`) rather than inline
 * styles so it can reflow: the quick-start grid collapses from three
 * columns to one as the canvas narrows, and the whole panel scrolls from
 * a safe centre instead of clipping its own top when the viewport is
 * short. The brand mark carries a slow conic sweep so the empty canvas
 * still reads as "motion", and all of it is disabled under
 * prefers-reduced-motion.
 */
export function CanvasEmptyState() {
  const projectId = useProjectStore((s) => s.projectId);
  const send = useChatStore((s) => s.send);

  const handleQuickStart = (prompt: string) => {
    if (projectId) send(projectId, prompt);
  };

  return (
    <div data-empty-state className="kfm-empty">
      <div className="kfm-empty__inner">
        {/* Hero */}
        <header className="kfm-empty__hero">
          <div className="kfm-empty__mark" aria-hidden="true">
            <span className="kfm-empty__mark-glyph">◇</span>
          </div>
          <h2 className="kfm-empty__title">Start creating motion</h2>
          <p className="kfm-empty__sub">
            Pick a quick start below, or describe what you want in the Agent chat on the left.
            Everything you create here can be refined through conversation.
          </p>
        </header>

        {/* Quick starts — auto-fits from 3 columns down to 1 */}
        <div className="kfm-empty__grid">
          {QUICK_STARTS.map((qs) => (
            <button
              key={qs.label}
              type="button"
              onClick={() => handleQuickStart(qs.prompt)}
              className="kfm-empty__card"
              title={qs.prompt}
            >
              <span className="kfm-empty__card-icon" aria-hidden="true">{qs.icon}</span>
              <span className="kfm-empty__card-label">{qs.label}</span>
              <span className="kfm-empty__card-hint">{qs.hint}</span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="kfm-empty__divider">
          <span className="kfm-empty__rule" />
          <span className="kfm-empty__divider-text">OR TRY THESE</span>
          <span className="kfm-empty__rule" />
        </div>

        {/* Example prompts */}
        <div className="kfm-empty__examples">
          {EXAMPLE_PROMPTS.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => handleQuickStart(ex.prompt)}
              className="kfm-empty__example"
              title={ex.prompt}
            >
              <span className="kfm-empty__example-icon" aria-hidden="true">{ex.icon}</span>
              <span className="kfm-empty__example-body">
                <span className="kfm-empty__example-label">{ex.label}</span>
                <span className="kfm-empty__example-prompt">"{ex.prompt}"</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
