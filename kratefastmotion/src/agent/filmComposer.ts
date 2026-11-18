import type { MotionComponent, Scene } from "@kratefastmotion/shared";
import { createId, now } from "../utils/id.js";
import { createComponent, deleteComponent, listComponents } from "../db/repositories/components.js";
import { getProject, updateProject } from "../db/repositories/projects.js";
import { analyzeBrief, buildFilm, STAGE_HEIGHT, STAGE_WIDTH, type FilmAssets, type FilmPlan } from "../motion/filmDirector.js";
import { buildSocialEdit, type SocialEditOptions, type SocialEditResult } from "../motion/socialEdit.js";
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
  /** Uploaded media the film should feature (logo in the title/end card, b-roll). */
  assets?: FilmAssets;
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

  const brand =
    opts.brand ??
    (project.name && project.name !== "Untitled motion" ? project.name : "KrateFastMotion");

  const brief = analyzeBrief(opts.hints ? `${prompt}. ${opts.hints}` : prompt, brand);
  if (opts.title) {
    brief.title = opts.title;
    brief.mark = markFor(opts.title);
  }

  const plan = buildFilm(brief, opts.assets);
  return persistPlan(projectId, plan, { replace: opts.replace });
}

/**
 * Persist a composed plan — scenes, components, artboard and art direction —
 * into a project. Shared by the film director and the social-edit composer so
 * both produce an identically-shaped project.
 */
export function persistPlan(
  projectId: string,
  plan: FilmPlan,
  opts: { replace?: boolean; extraTokens?: Record<string, string | number> } = {},
): ComposeFilmResult {
  const project = getProject(projectId);
  if (!project) throw new Error(`project not found: ${projectId}`);

  const replace = opts.replace ?? true;
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

  // The artboard is the single source of truth for the design stage. A social
  // edit composes against a portrait frame; the film director against 1920x1080.
  const artboard = plan.artboard ?? { width: STAGE_WIDTH, height: STAGE_HEIGHT };

  updateProject(projectId, {
    name: nextName,
    scenes: replace ? scenes : [...project.scenes, ...scenes],
    globalTiming: { ...project.globalTiming, totalDurationMs: plan.totalDurationMs },
    tokens: {
      ...project.tokens,
      __stage: "1",
      __film: "1",
      __filmTitle: plan.title,
      // Publishing the art direction lets anything added later — a graphic from
      // `compose_graphic`, a refinement pass — draw from the same palette and
      // beat amplitude instead of inventing its own colours.
      __filmStyle: plan.style,
      __filmMotion: plan.motion,
      // Publishing the artboard size keeps the editor canvas, the preview and
      // the export in the same coordinate space, so px-sized layers (glows,
      // headline type) scale correctly instead of being laid out against a
      // 640x360 default.
      artboardWidth: artboard.width,
      artboardHeight: artboard.height,
      ...(opts.extraTokens ?? {}),
    },
  });

  logger.info(
    `plan composed project=${projectId} scenes=${scenes.length} components=${plan.drafts.length} duration=${plan.totalDurationMs}ms style=${plan.style} motion=${plan.motion} artboard=${artboard.width}x${artboard.height}`,
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

/**
 * Compose a "talking head, cut to a rhythm" edit from base footage and a
 * transcript, and persist it. Returns the plan so the caller can report the
 * caption band and the resolved runtime.
 */
export function composeSocialEdit(projectId: string, opts: SocialEditOptions): SocialEditResult {
  const plan = buildSocialEdit(opts);
  persistPlan(projectId, plan, {
    replace: true,
    extraTokens: { __edit: "social", __captionBand: plan.captionBand.y },
  });
  return plan;
}

/** A short, human-readable summary of a composed film. */
export function filmSummary(result: ComposeFilmResult): string {
  const secs = (result.totalDurationMs / 1000).toFixed(1).replace(/\.0$/, "");
  return (
    `Composed "${result.title}" — ${result.sceneCount} scenes, ` +
    `${result.componentCount} animated layers, ${secs}s runtime ` +
    `(${result.plan.style} direction, ${result.plan.motion} motion).`
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

/** Nouns that unambiguously name a whole motion *piece*, not a single effect. */
const PIECE_NOUN =
  /\b(film|motion graphic|motion design|logo reveal|wordmark reveal|intro|outro|title card|title sequence|opening sequence|promo|teaser|trailer|showreel|reel|ident|sting|montage|sizzle|bumper|opener|end card|story|sequence|multi-scene|multi scene)\b/i;

/**
 * Whether a message asks for a whole *piece* (film, promo, title sequence, …)
 * rather than a single named effect. The rule-based structured planner uses
 * this to stand down: without it, a brief like
 * "create a 30 second tech **motion** film" greedily captures "30 second tech"
 * as a layer name and adds a stray layer instead of composing a film.
 */
export function isPieceRequest(message: string): boolean {
  if (!message) return false;
  const m = message.trim();
  if (m.length < 4) return false;
  return CREATE_VERB.test(m) && PIECE_NOUN.test(m);
}

/** Whether the project currently has no rendered layers at all. */
export function specIsEmpty(projectId: string): boolean {
  return listComponents(projectId).length === 0;
}
