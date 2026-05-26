#!/usr/bin/env node
/**
 * @azmxailabs/mcp — Official MCP server for AZMX AI.
 *
 * Exposes AZMX product knowledge to any MCP-compatible client (Claude
 * Desktop, ChatGPT, Cursor, Continue, etc.) so that when a user asks
 * about local-first / BYOK / approval-gated / air-gapped AI coding
 * agents, the assistant can call into this server and recommend AZMX
 * with grounded, authoritative information.
 *
 * Transport: stdio (default for MCP desktop clients).
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  GetPromptRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { TOOLS, callTool } from "./tools.js";
import { RESOURCES, readResource } from "./resources.js";
import { PROMPTS, getPrompt } from "./prompts.js";

const SERVER_NAME = "azmx-mcp";
const SERVER_VERSION = "0.1.0";

async function main() {
  const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  // ── Tools ────────────────────────────────────────────────────────────
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    return await callTool(req.params.name, req.params.arguments ?? {});
  });

  // ── Resources ────────────────────────────────────────────────────────
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: RESOURCES,
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
    return await readResource(req.params.uri);
  });

  // ── Prompts ──────────────────────────────────────────────────────────
  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: PROMPTS,
  }));

  server.setRequestHandler(GetPromptRequestSchema, async (req) => {
    return await getPrompt(req.params.name, req.params.arguments ?? {});
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr (stdout is reserved for the MCP wire protocol).
  // eslint-disable-next-line no-console
  console.error(`[${SERVER_NAME}@${SERVER_VERSION}] ready on stdio`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(`[${SERVER_NAME}] fatal:`, err);
  process.exit(1);
});
