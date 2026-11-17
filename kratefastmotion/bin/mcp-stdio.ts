#!/usr/bin/env -S npx tsx
/**
 * KrateFastMotion MCP server over stdio.
 *
 * Entry point for external MCP clients (Claude Desktop, Cursor, etc.). The
 * Streamable HTTP transport is mounted by the main server at `/api/mcp`; this
 * is the same tool surface, but driven over stdin/stdout.
 *
 * Run with: `npm run mcp:stdio` (or `tsx bin/mcp-stdio.ts`).
 */

// stdout is the JSON-RPC channel here — route all logging to stderr. This must
// be set before any module (the logger in particular) is imported, hence the
// dynamic imports below.
process.env.KRATEFASTMOTION_LOG_STDERR = "1";

const { ensureDirs } = await import("../src/db/index.js");
const { migrate } = await import("../src/db/migrate.js");
const { createMcpServer } = await import("../src/mcp/server.js");
const { startStdio } = await import("../src/mcp/transport-stdio.js");

ensureDirs();
migrate();

await startStdio(createMcpServer());

export {};
