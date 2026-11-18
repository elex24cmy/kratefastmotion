// Film tool executors. `generate_film` is the first-class route to the film
// director: it composes a real, art-directed, multi-scene motion film and
// persists it as animatable layers, so the agent always produces a composed
// canvas rather than a plan or a single generic layer.

import type { ToolName } from "@kratefastmotion/shared";
import type { ToolContext, ToolResult } from "./registry.js";
import { composeFilm, filmSummary } from "../filmComposer.js";
import { findAsset } from "../../assets/store.js";
import type { FilmAsset, FilmAssets } from "../../motion/filmDirector.js";

type Executor = (args: Record<string, unknown>, ctx: ToolContext) => ToolResult | Promise<ToolResult>;

/** Resolve one library reference into a film asset (images and video only). */
function resolveFilmAsset(ref: string): FilmAsset | null {
  const asset = findAsset(ref);
  if (!asset || asset.kind === "audio") return null;
  return { src: asset.url, name: asset.name, kind: asset.kind };
}

export const filmExecutors: Partial<Record<ToolName, Executor>> = {
  generate_film: (args, ctx) => {
    const prompt = typeof args.prompt === "string" ? args.prompt.trim() : "";
    if (!prompt) {
      return {
        ok: false,
        summary: "generate_film requires a prompt describing the film",
        specChanged: false,
      };
    }
    const title = typeof args.title === "string" && args.title.trim() ? args.title.trim() : undefined;
    const style = typeof args.style === "string" ? args.style : undefined;
    const replace = typeof args.replace === "boolean" ? args.replace : true;

    // Uploaded media: a logo for the title/end card, plus b-roll for the
    // statement beats. Unresolvable ids are reported instead of failing the
    // whole film, so a stale reference never costs the user their composition.
    const assets: FilmAssets = {};
    const unresolved: string[] = [];
    if (typeof args.logoAssetId === "string" && args.logoAssetId.trim()) {
      const logo = resolveFilmAsset(args.logoAssetId.trim());
      if (logo) assets.logo = logo;
      else unresolved.push(args.logoAssetId.trim());
    }
    if (Array.isArray(args.mediaAssetIds)) {
      const media: FilmAsset[] = [];
      for (const raw of args.mediaAssetIds) {
        const ref = String(raw ?? "").trim();
        if (!ref) continue;
        const asset = resolveFilmAsset(ref);
        if (asset) media.push(asset);
        else unresolved.push(ref);
      }
      if (media.length) assets.media = media;
    }

    const result = composeFilm(ctx.projectId, prompt, {
      replace,
      ...(title ? { title } : {}),
      ...(style ? { hints: style } : {}),
      ...(assets.logo || assets.media ? { assets } : {}),
    });

    const placed: string[] = [];
    if (assets.logo) placed.push(`logo ${assets.logo.name ?? "asset"}`);
    if (assets.media?.length) placed.push(`${assets.media.length} media beat${assets.media.length === 1 ? "" : "s"}`);
    const placedNote = placed.length ? ` Featuring ${placed.join(" and ")}.` : "";
    const unresolvedNote = unresolved.length ? ` (could not resolve: ${unresolved.join(", ")})` : "";

    return {
      ok: true,
      summary: `${filmSummary(result)}${placedNote}${unresolvedNote}`,
      specChanged: true,
      data: {
        kind: "film",
        title: result.title,
        scenes: result.sceneCount,
        components: result.componentCount,
        totalDurationMs: result.totalDurationMs,
        style: result.plan.style,
        motion: result.plan.motion,
        palette: result.plan.palette,
        logoAssetId: assets.logo ? (args.logoAssetId ?? null) : null,
        mediaAssetIds: assets.media?.map((m) => m.name ?? m.src) ?? [],
        unresolved,
      },
      editorCommands: [{ command: "refresh_canvas", args: {} }],
    };
  },
};
