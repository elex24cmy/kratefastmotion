// Film tool executors. `generate_film` is the first-class route to the film
// director: it composes a real, art-directed, multi-scene motion film and
// persists it as animatable layers, so the agent always produces a composed
// canvas rather than a plan or a single generic layer.

import type { ToolName } from "@kratefastmotion/shared";
import type { ToolContext, ToolResult } from "./registry.js";
import { composeFilm, filmSummary } from "../filmComposer.js";

type Executor = (args: Record<string, unknown>, ctx: ToolContext) => ToolResult | Promise<ToolResult>;

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

    const result = composeFilm(ctx.projectId, prompt, {
      replace,
      ...(title ? { title } : {}),
      ...(style ? { hints: style } : {}),
    });

    return {
      ok: true,
      summary: filmSummary(result),
      specChanged: true,
      data: {
        kind: "film",
        title: result.title,
        scenes: result.sceneCount,
        components: result.componentCount,
        totalDurationMs: result.totalDurationMs,
        style: result.plan.style,
        palette: result.plan.palette,
      },
      editorCommands: [{ command: "refresh_canvas", args: {} }],
    };
  },
};
