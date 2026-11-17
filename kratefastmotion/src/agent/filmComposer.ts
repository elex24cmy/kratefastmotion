import type { MotionComponent, Scene } from "@kratefastmotion/shared";
import { createId, now } from "../utils/id.js";
import { createComponent, deleteComponent, listComponents } from "../db/repositories/components.js";
import { getProject, updateProject } from "../db/repositories/projects.js";
import { analyzeBrief, buildFilm, STAGE_HEIGHT, STAGE_WIDTH, type FilmPlan } from "../motion/filmDirector.js";
import { logger } from "../utils/logger.js";

/**
 * Film composer — the bridge between the deterministic film director and the
 * persisted project. It turns a free-form brief into real scenes + components
 * in the database, so "make me a motion film" can never resolve to an empty
 * canvas regardless of which agent path handled the turn.
 */

export interface ComposeFilmOptions {
  /** Replace the project's scenes/components instead of appending. Default true. */
  replace?: boolean;
  /** Explicit film title (skips title extraction from the prompt). */
  title?: string;
  /** Brand name used for the outro tagline. Defaults to the project name. */
  brand?: string;
  /** Extra art-direction hints appended to the brief (e.g. style keywords). */
  hints?: string;
}

export interface ComposeFilmResult {
  plan: FilmPlan;
  componentCount: number;
  sceneCount: number;
  totalDurationMs: number;
  replaced: boolean;
  title: string;
}

function markFor(title: string): string {
  return (
    title
      .split(/\s+/)
      .filter((w) => /[A-Za-z0-9]/.test(w))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") || "KF"
  );
}

/** Build a film from `prompt` and persist it into `projectId`. */
export function composeFilm(
  projectId: string,
  prompt: string,
  opts: ComposeFilmOptions = {},
): ComposeFilmResult {
  const project = getProject(projectId);
  if (!project) throw new Error(`project not found: ${projectId}`);

  const replace = opts.replace ?? true;
  const brand =
    opts.brand ??
    (project.name && project.name !== "Untitled motion" ? project.name : "KrateFastMotion");

  const brief = analyzeBrief(opts.hints ? `${prompt}. ${opts.hints}` : prompt, brand);
  if (opts.title) {
    brief.title = opts.title;
    brief.mark = markFor(opts.title);
  }

  const plan = buildFilm(brief);
  const ts = now();

  if (replace) {
    for (const c of listComponents(projectId)) deleteComponent(projectId, c.id);
  }

  for (const d of plan.drafts) {
    const comp: MotionComponent = {
      ...d,
      id: createId("c_"),
      projectId,
      createdAt: ts,
      updatedAt: ts,
    };
    createComponent(comp);
  }

  const scenes: Scene[] = plan.scenes.map((s) => ({
    id: s.id,
    name: s.name,
    durationMs: s.durationMs,
  }));

  const nextName =
    replace && (!project.name || project.name === "Untitled motion") ? plan.title : project.name;

  updateProject(projectId, {
    name: nextName,
    scenes: replace ? scenes : [...project.scenes, ...scenes],
    globalTiming: { ...project.globalTiming, totalDurationMs: plan.totalDurationMs },
    tokens: {
      ...project.tokens,
      __stage: "1",
      __film: "1",
      __filmTitle: plan.title,
      // The film is art-directed on a 1920x1080 stage. Publishing the artboard
      // size keeps the editor canvas, the preview and the export in the same
      // coordinate space, so px-sized layers (glows, headline type) scale
      // correctly instead of being laid out against a 640x360 default.
      artboardWidth: STAGE_WIDTH,
      artboardHeight: STAGE_HEIGHT,
    },
  });

  logger.info(
    `film composed project=${projectId} scenes=${scenes.length} components=${plan.drafts.length} duration=${plan.totalDurationMs}ms style=${plan.style}`,
  );

  return {
    plan,
    componentCount: plan.drafts.length,
    sceneCount: scenes.length,
    totalDurationMs: plan.totalDurationMs,
    replaced: replace,
    title: plan.title,
  };
}

/** A short, human-readable summary of a composed film. */
export function filmSummary(result: ComposeFilmResult): string {
  const secs = (result.totalDurationMs / 1000).toFixed(1).replace(/\.0$/, "");
  return (
    `Composed "${result.title}" — ${result.sceneCount} scenes, ` +
    `${result.componentCount} animated layers, ${secs}s runtime (${result.plan.style} direction).`
  );
}

const CREATE_VERB = /\b(create|make|build|design|generate|produce|compose|animate|render|craft|put together)\b/i;
const VISUAL_NOUN =
  /\b(film|animation|animated|motion|video|graphic|logo|wordmark|intro|outro|title card|title sequence|reveal|promo|advert|ad|teaser|trailer|story|sequence|scene|clip|reel|ident|sting|sizzle|montage|bumper|opener|showreel)\b/i;

/**
 * Whether a message is asking for a visual piece to be created. Used as the
 * trigger for the "never leave an empty canvas" guarantee.
 */
export function isFilmIntent(message: string): boolean {
  if (!message) return false;
  const m = message.trim();
  if (m.length < 4) return false;
  return CREATE_VERB.test(m) && VISUAL_NOUN.test(m);
}

/** Whether the project currently has no rendered layers at all. */
export function specIsEmpty(projectId: string): boolean {
  return listComponents(projectId).length === 0;
}
