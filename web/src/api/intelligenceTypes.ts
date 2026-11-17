/**
 * Response types for the Motion Intelligence panel.
 *
 * The server owns these shapes (it produces them), but the shared package does
 * not re-export them yet. Re-exporting them type-only keeps the web app on the
 * server's actual contract without duplicating the interfaces or pulling any
 * server runtime code into the browser bundle.
 */
export type { IntelligenceSummary } from "../../../kratefastmotion/src/agent/intelligenceSummary.js";
export type { ChronopathReport } from "../../../kratefastmotion/src/agent/motionChronopath.js";
export type { CreativeContextReport } from "../../../kratefastmotion/src/agent/motionCreativeContext.js";
export type { FlowStateSnapshot } from "../../../kratefastmotion/src/agent/motionFlowState.js";
export type { HeuristicsReport } from "../../../kratefastmotion/src/agent/motionHeuristics.js";
export type { AtelierReport, AtelierManifesto } from "../../../kratefastmotion/src/agent/motionAtelier.js";
