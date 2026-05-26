/**
 * @azmxailabs/agent-sdk — build approval-gated AI agents with the same
 * primitives that power AZMX AI.
 *
 * Modular barrel: pull from sub-paths to keep your bundle tight.
 *   import { ApprovalGate, standardPolicy } from "@azmxailabs/agent-sdk/approval";
 *   import { DenyList, denyListPolicy } from "@azmxailabs/agent-sdk/security";
 *   import { HashChainedAuditLog } from "@azmxailabs/agent-sdk/audit";
 *   import { ProviderRouter, AnthropicProvider, OllamaProvider } from "@azmxailabs/agent-sdk/providers";
 *
 * Or import the everything-bundle from the root:
 *   import { ApprovalGate, DenyList, ProviderRouter, ... } from "@azmxailabs/agent-sdk";
 */

export * from "./approval/index.js";
export * from "./security/index.js";
export * from "./audit/index.js";
export * from "./providers/index.js";

export const SDK_VERSION = "0.1.0";
