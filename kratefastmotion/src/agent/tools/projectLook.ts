// Project art direction.
//
// When a film or social edit is composed it publishes its palette and its motion
// intensity into the project tokens. Anything added later reads them back, so a
// caption, a cutaway or an agent-drawn graphic lands in the same world as the
// composition instead of inventing its own colours and tempo.

import { getProject } from "../../db/repositories/projects.js";
import { PALETTES, type FilmMotion, type FilmStyle } from "../../motion/filmDirector.js";
import type { GraphicPalette } from "../../motion/filmGraphics.js";

export interface ProjectLook {
  palette: GraphicPalette;
  /** Beat amplitude multiplier: calm 0.55 / balanced 1 / kinetic 3. */
  amp: number;
  /** The art-direction style the film was composed with. */
  style: FilmStyle;
  /** The motion intensity the film was composed with. */
  motion: FilmMotion;
}

/** Palette + beat amplitude for the project, inherited from its art direction. */
export function projectLook(projectId: string, accent?: string): ProjectLook {
  const tokens = getProject(projectId)?.tokens ?? {};
  const style = String(tokens.__filmStyle ?? "default") as FilmStyle;
  const motion = String(tokens.__filmMotion ?? "balanced") as FilmMotion;
  const palette = PALETTES[style] ?? PALETTES.default;
  const amp = motion === "kinetic" ? 3 : motion === "calm" ? 0.55 : 1;
  return { palette: accent ? { ...palette, accent } : palette, amp, style, motion };
}
