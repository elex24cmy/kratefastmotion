import { createApp } from "./server/app.js";
import { ensureDirs } from "./db/index.js";
import { migrate } from "./db/migrate.js";
import { config, providerMode } from "./config.js";
import { logger } from "./utils/logger.js";
import { getProvider } from "./agent/provider/index.js";
import { hasPuppeteer, hasFfmpeg, hasNodeSqlite } from "./utils/env.js";

async function main(): Promise<void> {
  process.on("uncaughtException", (err) => {
    logger.error("uncaughtException", { stack: err?.stack ?? String(err) });
  });
  process.on("unhandledRejection", (reason) => {
    logger.error("unhandledRejection", { reason: String(reason) });
  });

  ensureDirs();
  migrate();

  const app = createApp();

  // Warm the provider so the first chat is fast and any provider error surfaces now.
  await getProvider();

  const [db, ffmpeg] = await Promise.all([hasNodeSqlite(), hasFfmpeg()]);

  app.listen(config.PORT, config.HOST, () => {
    logger.info(`KrateFastMotion server listening on http://${config.HOST}:${config.PORT}`, {
      provider: providerMode(),
      db,
      ffmpeg,
    });
    logger.info(`API root: http://${config.HOST}:${config.PORT}/api`);
    logger.info(`Health:   http://${config.HOST}:${config.PORT}/api/health`);
    // The optional browser-driven exporter imports puppeteer-core, which can
    // take tens of seconds on Windows. Resolve it after the server is already
    // accepting requests so it never delays startup.
    void hasPuppeteer().then((puppeteer) => {
      logger.info("Video export capability resolved", { puppeteer });
    });
  });
}

main().catch((err) => {
  logger.error("fatal startup error", { stack: err?.stack ?? String(err) });
  process.exit(1);
});
