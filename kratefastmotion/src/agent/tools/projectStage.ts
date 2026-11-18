// Project stage geometry.
//
// A project's artboard is published in its tokens when a plan is composed, so
// anything added later — a graphic, a caption, a cutaway — can place itself
// against the same coordinate space the composition was designed in. Without
// this, a graphic added to a portrait social edit would be positioned against
// the 1920x1080 film stage and land off-frame.

import { getProject } from "../../db/repositories/projects.js";
import { STAGE_HEIGHT, STAGE_WIDTH, contentArea, type Area } from "../../motion/layout.js";

export interface StageSize {
  width: number;
  height: number;
}

/** The design stage a project is composed against. Defaults to the film stage. */
export function projectStage(projectId: string): StageSize {
  const tokens = getProject(projectId)?.tokens ?? {};
  const w = Number(tokens.artboardWidth);
  const h = Number(tokens.artboardHeight);
  return {
    width: Number.isFinite(w) && w > 0 ? w : STAGE_WIDTH,
    height: Number.isFinite(h) && h > 0 ? h : STAGE_HEIGHT,
  };
}

/**
 * The content rectangle a project's layers must stay inside. The film stage
 * keeps its fixed 96px margin so existing films audit exactly as before; a
 * portrait artboard gets a proportional margin, which is what reads as a
 * safe area at social sizes.
 */
export function projectArea(projectId: string): Area {
  const { width, height } = projectStage(projectId);
  return contentArea(width, height);
}
