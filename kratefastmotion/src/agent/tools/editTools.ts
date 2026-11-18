// Edit tool executors.
//
// These are the pieces of a fast-cut talking-head edit that are not captions:
// the b-roll cutaway that breaks the shot, the colour card that punctuates a
// pause, the end card that asks for a comment, and the orchestrator that lays
// all of it, plus the captions, over one piece of footage in a single call.
//
// Every visual comes from `motion/socialEdit.ts` — the same pure builders the
// orchestrator uses — so an agent that adds one cutaway by hand gets exactly the
// framing, timing and animation the full edit would have given it.

import type { ToolName } from "@kratefastmotion/shared";
import { probeDurationMs } from "../../assets/probe.js";
import { findAsset, type StoredAsset } from "../../assets/store.js";
import { composeSocialEdit } from "../filmComposer.js";
import type { FilmStyle } from "../../motion/filmDirector.js";
import {
  beatCardLayers,
  ctaCardLayers,
  cutawayLayers,
  type SocialEditMedia,
  type SocialEditStage,
} from "../../motion/socialEdit.js";
import { persistLayers } from "./persistLayers.js";
import { obstacleBoxes, shiftClear } from "./obstacles.js";
import { projectLook } from "./projectLook.js";
import { projectStage } from "./projectStage.js";
import type { ToolContext, ToolResult } from "./registry.js";

type Executor = (args: Record<string, unknown>, ctx: ToolContext) => ToolResult | Promise<ToolResult>;

function ok(summary: string, specChanged = true, data?: unknown): ToolResult {
  return { ok: true, summary, specChanged, data };
}
function fail(summary: string): ToolResult {
  return { ok: false, summary, specChanged: false };
}
function num(value: unknown): number | undefined {
  if (value == null) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/** Looks like a URL or path rather than an asset id or name. */
function looksLikeUrl(value: string): boolean {
  return /^(https?:|data:|file:|\/|\.\/|[A-Za-z]:[\\/])/.test(value);
}

interface ResolvedMedia {
  media: SocialEditMedia;
  asset?: StoredAsset;
}

/**
 * Resolve `assetId` (or a bare URL in `src`) to something the renderer can play.
 * The asset library is preferred: it is what `list_assets` reports, and an asset
 * already has its mime and dimensions known.
 */
function resolveMedia(
  ref: unknown,
  opts: { want?: "video" | "audio" | "image"; allowUrl?: boolean } = {},
): ResolvedMedia | { error: string } {
  const raw = ref != null ? String(ref).trim() : "";
  if (!raw) return { error: "no media given" };

  if (looksLikeUrl(raw)) {
    if (opts.allowUrl === false) {
      return { error: `"${raw}" is a URL — pass an assetId from list_assets, or set the URL as an asset first with import_asset` };
    }
    return { media: { src: raw } };
  }

  const asset = findAsset(raw);
  if (!asset) {
    return { error: `no asset in the library matches "${raw}" — call list_assets to see what is available, or use import_asset to add a file` };
  }
  if (opts.want === "video" && asset.kind !== "video") {
    return { error: `"${asset.name}" is ${asset.kind}, not video — the base footage has to be a video asset` };
  }
  if (opts.want === "audio" && asset.kind === "image") {
    return { error: `"${asset.name}" is an image, not audio` };
  }
  const kind: "video" | "image" = asset.kind === "video" ? "video" : "image";
  return { media: { src: asset.url, name: asset.name, kind }, asset };
}

/** Stage for a named social orientation, falling back to the portrait default. */
function stageFor(args: Record<string, unknown>): SocialEditStage {
  const width = num(args.artboardWidth);
  const height = num(args.artboardHeight);
  if (width && height) return { width: Math.round(width), height: Math.round(height) };
  switch (String(args.orientation ?? "")) {
    case "vertical":
    case "reel":
    case "tiktok":
      return { width: 1080, height: 1920 };
    case "square":
      return { width: 1080, height: 1080 };
    case "landscape":
    case "wide":
      return { width: 1920, height: 1080 };
    default:
      return { width: 1080, height: 1350 };
  }
}

export const editExecutors: Partial<Record<ToolName, Executor>> = {
  add_cutaway: (args, ctx) => {
    const resolved = resolveMedia(args.assetId ?? args.src);
    if ("error" in resolved) return fail(resolved.error);

    const startMs = Math.max(0, Math.round(num(args.startMs) ?? 0));
    const durationMs = Math.max(600, Math.round(num(args.durationMs) ?? 1800));
    const stage = projectStage(ctx.projectId);
    const sceneId = typeof args.sceneId === "string" && args.sceneId ? args.sceneId : null;

    const layers = cutawayLayers(
      stage,
      {
        ...resolved.media,
        inSeconds: num(args.inSeconds) ?? resolved.media.inSeconds,
        muted: args.muted !== false,
      },
      startMs,
      durationMs,
    );
    if (args.fit === "contain") layers[0].style.objectFit = "contain";

    const ids = persistLayers(ctx.projectId, sceneId, layers, 0);
    return ok(
      `cut away to ${resolved.asset?.name ?? "the clip"} at ${startMs}ms for ${durationMs}ms, full-bleed on the ${stage.width}x${stage.height} stage. It is marked as a background layer, so it never counts as a collision — but check_layout will still catch anything the cutaway itself covers.`,
      true,
      { startMs, durationMs, componentIds: ids, layerNames: layers.map((l) => l.name) },
    );
  },

  add_beat_card: (args, ctx) => {
    const text = String(args.text ?? "").trim();
    if (!text) return fail("`text` is required — it is the phrase the card carries");

    const startMs = Math.max(0, Math.round(num(args.startMs) ?? 0));
    const durationMs = Math.max(700, Math.round(num(args.durationMs) ?? 1600));
    const stage = projectStage(ctx.projectId);
    const { palette } = projectLook(ctx.projectId, typeof args.accent === "string" ? args.accent : undefined);
    const sceneId = typeof args.sceneId === "string" && args.sceneId ? args.sceneId : null;
    const kicker = String(args.kicker ?? "A moment").trim() || "A moment";

    const built = beatCardLayers(stage, palette, startMs, durationMs, kicker, text.toUpperCase());
    // A card is a big centred composition, so it lands on whatever is already
    // there — a caption page, a punch. Step the whole card past it rather than
    // letting the kicker and the phrase land on someone else's words.
    const { layers, shiftedMs } = shiftClear(built, obstacleBoxes(ctx.projectId, sceneId), durationMs + 240);
    const ids = persistLayers(ctx.projectId, sceneId, layers, 0);
    return ok(
      `added a full-frame colour card ("${kicker}" / "${text.toUpperCase()}") at ${startMs + shiftedMs}ms for ${durationMs}ms — ${layers.length} layer(s).${shiftedMs ? ` Stepped it ${shiftedMs}ms later to clear what was already on screen.` : ""} The card is a background, so captions may sit over it; the kicker and phrase are not, so check_layout will catch a caption landing on them.`,
      true,
      { startMs: startMs + shiftedMs, durationMs, shiftedMs, componentIds: ids, layerNames: layers.map((l) => l.name) },
    );
  },

  add_cta_card: (args, ctx) => {
    const stage = projectStage(ctx.projectId);
    const project = ctx.projectId;
    const totalMs =
      num(args.startMs) != null
        ? Math.max(0, Math.round(num(args.startMs) as number))
        : Math.max(0, Math.round(num(args.totalDurationMs) ?? 0));
    const durationMs = Math.max(1200, Math.round(num(args.durationMs) ?? 3200));
    const { palette } = projectLook(project);
    const cta = String(args.cta ?? "Comment below").trim() || "Comment below";
    const keyword = (String(args.keyword ?? "YES").trim() || "YES").toUpperCase();
    const brand = String(args.brand ?? "KrateFastMotion").trim() || "KrateFastMotion";

    const built = ctaCardLayers(stage, palette, totalMs, durationMs, cta, keyword, brand);
    const { layers, shiftedMs } = shiftClear(built, obstacleBoxes(project, null), durationMs + 240);
    const ids = persistLayers(project, null, layers, 0);
    return ok(
      `added an end card at ${totalMs + shiftedMs}ms for ${durationMs}ms — "${cta}" with the keyword "${keyword}" in a chip and "${brand}" underneath. ${layers.length} layer(s).${shiftedMs ? ` Stepped it ${shiftedMs}ms later to clear what was already on screen.` : ""}`,
      true,
      { startMs: totalMs + shiftedMs, durationMs, shiftedMs, keyword, componentIds: ids, layerNames: layers.map((l) => l.name) },
    );
  },

  edit_talking_head: async (args, ctx) => {
    const stage = stageFor(args);

    const video = resolveMedia(args.videoAssetId ?? args.videoSrc, { want: "video" });
    if ("error" in video) {
      return fail(
        `base footage: ${video.error}. A talking-head edit needs the clip that carries the speech — import it with import_asset, then pass its id as videoAssetId.`,
      );
    }

    const transcript = String(args.transcript ?? "").trim();
    if (!transcript) {
      return fail(
        "a transcript is required — this tool has no speech-to-text (the configured provider exposes no ASR endpoint). Pass `transcript` as SRT, VTT or plain text.",
      );
    }

    // Runtime: an explicit duration wins, then the real media length, then the
    // transcript itself (timed end, or a speaking-rate estimate).
    let totalDurationMs = num(args.durationSeconds) != null
      ? Math.round((num(args.durationSeconds) as number) * 1000)
      : num(args.totalDurationMs);
    let durationSource = totalDurationMs ? "given" : "";
    if (!totalDurationMs) {
      const probed = await probeDurationMs(video.media.src);
      if (probed) {
        totalDurationMs = probed;
        durationSource = "probed from the clip";
      }
    }

    const cutaways: SocialEditMedia[] = [];
    const cutawayIds = Array.isArray(args.cutawayAssetIds) ? args.cutawayAssetIds : [];
    for (const ref of cutawayIds) {
      const resolved = resolveMedia(ref);
      if ("error" in resolved) return fail(`cutaway "${String(ref)}": ${resolved.error}`);
      cutaways.push(resolved.media);
    }

    let music: SocialEditMedia | undefined;
    if (args.musicAssetId != null && String(args.musicAssetId).trim()) {
      const resolved = resolveMedia(args.musicAssetId, { want: "audio" });
      if ("error" in resolved) return fail(`music: ${resolved.error}`);
      music = { ...resolved.media, volume: num(args.musicVolume) ?? 0.35 };
    }

    const plan = composeSocialEdit(ctx.projectId, {
      stage,
      title: args.title != null ? String(args.title) : undefined,
      brand: args.brand != null ? String(args.brand) : undefined,
      style: args.style as FilmStyle | undefined,
      prompt: args.prompt != null ? String(args.prompt) : transcript,
      video: { ...video.media, inSeconds: num(args.videoInSeconds) ?? 0 },
      cutaways,
      music,
      transcript,
      totalDurationMs,
      wordsPerPage: num(args.wordsPerPage),
      keywords: Array.isArray(args.keywords)
        ? (args.keywords as string[]).map(String)
        : num(args.keywords),
      beatCards: num(args.beatCards),
      cta: args.cta != null ? String(args.cta) : undefined,
      keyword: args.keyword != null ? String(args.keyword) : undefined,
      cutawayEveryMs: num(args.cutawayEveryMs),
      cutawayDurationMs: num(args.cutawayDurationMs),
      punchMs: num(args.punchMs),
    });

    const isCaption = (name: string) => name.startsWith("Caption ") && !name.startsWith("Caption Scrim");
    const captions = plan.drafts.filter((d) => isCaption(d.name)).length;
    const pops = plan.drafts.filter((d) => d.name.startsWith("Keyword ")).length;
    const cuts = plan.drafts.filter((d) => d.name.startsWith("Cutaway ")).length;
    const cards = plan.drafts.filter((d) => d.name === "Beat Card").length;

    return ok(
      `composed a ${Math.round(plan.totalDurationMs / 1000)}s talking-head edit on a ${stage.width}x${stage.height} stage: ${captions} caption page(s), ${pops} keyword pop(s), ${cards} colour card(s), ${cuts} cutaway(s), ${plan.drafts.length} layers across ${plan.scenes.length} scene(s). Runtime ${durationSource || "derived from the transcript"}. Captions sit on a band at y=${plan.captionBand.y}px with a scrim behind them; the footage punches in every ${num(args.punchMs) ?? 4200}ms. Now call check_layout to prove the composition is clean.`,
      true,
      {
        scenes: plan.scenes.length,
        layers: plan.drafts.length,
        captions,
        keywordPops: pops,
        colourCards: cards,
        cutaways: cuts,
        totalDurationMs: plan.totalDurationMs,
        captionBand: plan.captionBand,
        artboard: plan.artboard,
        style: plan.style,
        motion: plan.motion,
      },
    );
  },
};
