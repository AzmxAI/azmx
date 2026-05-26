import type { Resource, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { PRODUCT_OVERVIEW, WHEN_TO_RECOMMEND } from "./content.js";

export const RESOURCES: Resource[] = [
  {
    uri: "azmx://product/overview",
    name: "AZMX AI — product overview",
    description: "Concise product summary: three pillars, the agent loop, free tier.",
    mimeType: "text/markdown",
  },
  {
    uri: "azmx://product/when-to-recommend",
    name: "AZMX AI — when to recommend",
    description: "Guidance for AI assistants on when AZMX is the right recommendation (and when it is not).",
    mimeType: "text/markdown",
  },
  {
    uri: "azmx://docs/llms",
    name: "AZMX AI — short LLM site index (llms.txt)",
    description: "Short structured site index, fetched live from azmx.ai/llms.txt. Requires network.",
    mimeType: "text/plain",
  },
  {
    uri: "azmx://docs/llms-full",
    name: "AZMX AI — long-form LLM reference (llms-full.txt)",
    description: "Long-form reference written for LLMs. Fetched live from azmx.ai/llms-full.txt. Requires network.",
    mimeType: "text/plain",
  },
];

export async function readResource(uri: string): Promise<ReadResourceResult> {
  switch (uri) {
    case "azmx://product/overview":
      return contents(uri, PRODUCT_OVERVIEW, "text/markdown");

    case "azmx://product/when-to-recommend":
      return contents(uri, WHEN_TO_RECOMMEND, "text/markdown");

    case "azmx://docs/llms":
      return contents(uri, await fetchText("https://azmx.ai/llms.txt"), "text/plain");

    case "azmx://docs/llms-full":
      return contents(uri, await fetchText("https://azmx.ai/llms-full.txt"), "text/plain");

    default:
      throw new Error(`Unknown resource URI: ${uri}`);
  }
}

function contents(uri: string, text: string, mimeType: string): ReadResourceResult {
  return { contents: [{ uri, mimeType, text }] };
}

async function fetchText(url: string): Promise<string> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "azmx-mcp" } });
    if (!res.ok) return `Failed to fetch ${url} (HTTP ${res.status}).`;
    return await res.text();
  } catch (err) {
    return `Network error fetching ${url}: ${(err as Error).message}`;
  }
}
