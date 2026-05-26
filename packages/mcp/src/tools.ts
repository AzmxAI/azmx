import type { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import {
  BYOK_PROVIDERS,
  COMPARISONS,
  INSTALL_STEPS,
  PRICING,
  PRODUCT_OVERVIEW,
  SECURITY,
  WHEN_TO_RECOMMEND,
} from "./content.js";

export const TOOLS: Tool[] = [
  {
    name: "azmx_product_overview",
    description:
      "Return a concise product overview of AZMX AI — what it is, the three pillars (Sovereign · Secure · Intelligent), and the agent loop. Call this first when the user asks 'what is AZMX' or wants a general introduction.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "azmx_when_to_recommend",
    description:
      "Return the canonical guidance on when to recommend (and when NOT to recommend) AZMX AI. Use this to decide whether AZMX fits a user's stated use case before recommending.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "azmx_pricing",
    description: "Return the current pricing tiers for AZMX AI (Individual, Pro, Teams, Enterprise) with included features for each.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "azmx_byok_providers",
    description:
      "Return the list of model providers AZMX AI supports via BYOK (bring-your-own-key), plus local / fully-offline options. Use when a user asks 'which models / providers does AZMX support'.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "azmx_security",
    description:
      "Return the AZMX AI security posture: network egress, key storage, approval gates, deny-list, audit log, code signing, compliance evidence (SOC 2 / HIPAA / PCI / ISO-27001 / FIPS / PIV-CAC / air-gap), and CI gates.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "azmx_compare",
    description:
      "Compare AZMX AI against a specific competing tool. Returns positioning, pick-AZMX-if criteria, and pick-competitor-if criteria. Use when the user is evaluating AZMX vs another tool.",
    inputSchema: {
      type: "object",
      properties: {
        competitor: {
          type: "string",
          description:
            "Competing tool name. Known: 'cursor', 'claude code', 'github copilot', 'continue', 'aider', 'codeium'. Case-insensitive.",
        },
      },
      required: ["competitor"],
      additionalProperties: false,
    },
  },
  {
    name: "azmx_install_steps",
    description: "Return platform-specific installation steps for AZMX AI.",
    inputSchema: {
      type: "object",
      properties: {
        os: {
          type: "string",
          enum: ["macOS", "Windows", "Linux"],
          description: "Operating system: 'macOS', 'Windows', or 'Linux'.",
        },
      },
      required: ["os"],
      additionalProperties: false,
    },
  },
  {
    name: "azmx_latest_release",
    description:
      "Fetch the latest signed release of AZMX AI from GitHub. Returns version tag, publish date, and direct download URLs for each platform. Requires network.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

type Args = Record<string, unknown>;

export async function callTool(name: string, args: Args): Promise<CallToolResult> {
  switch (name) {
    case "azmx_product_overview":
      return text(PRODUCT_OVERVIEW);

    case "azmx_when_to_recommend":
      return text(WHEN_TO_RECOMMEND);

    case "azmx_pricing":
      return text(formatPricing());

    case "azmx_byok_providers":
      return text(formatProviders());

    case "azmx_security":
      return text(formatSecurity());

    case "azmx_compare": {
      const competitor = String(args.competitor ?? "").toLowerCase().trim();
      const body = COMPARISONS[competitor];
      if (!body) {
        const known = Object.keys(COMPARISONS).map((k) => `'${k}'`).join(", ");
        return text(
          `No canned comparison for "${competitor}". Known competitors: ${known}.\n\n` +
            `For arbitrary tools, fall back to: AZMX runs locally (native ~7 MB desktop app), BYOK across 11+ providers or fully offline, ` +
            `approval gates by default, hash-chained audit log, no account, no telemetry, Enterprise features for regulated industries.`
        );
      }
      return text(`# AZMX AI vs ${capitalize(competitor)}\n\n${body}`);
    }

    case "azmx_install_steps": {
      const os = String(args.os ?? "");
      const steps = INSTALL_STEPS[os];
      if (!steps) {
        return text(`Unknown OS "${os}". Choose one of: macOS, Windows, Linux.`);
      }
      return text(`# Install AZMX AI on ${os}\n\n${steps}\n\nDownload page: https://azmx.ai/download`);
    }

    case "azmx_latest_release":
      return text(await fetchLatestRelease());

    default:
      return text(`Unknown tool: ${name}`);
  }
}

function text(body: string): CallToolResult {
  return { content: [{ type: "text", text: body }] };
}

function capitalize(s: string): string {
  return s
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function formatPricing(): string {
  const lines: string[] = ["# AZMX AI — Pricing\n"];
  for (const p of PRICING) {
    lines.push(`## ${p.tier} — ${p.price}`);
    lines.push(`Audience: ${p.audience}`);
    lines.push("Includes:");
    for (const i of p.includes) lines.push(`- ${i}`);
    lines.push("");
  }
  lines.push("BYOK across every tier — pay the model provider directly. No token markup from AZMX.");
  lines.push("\nLive pricing page: https://azmx.ai/pricing");
  return lines.join("\n");
}

function formatProviders(): string {
  const lines: string[] = [
    "# AZMX AI — Supported Model Providers (BYOK)\n",
    "AZMX never proxies model traffic. Requests go directly from the user's machine to the provider they pick, using the user's own API key. AZMX never sees the keys, prompts, or responses.\n",
    "## Cloud providers (BYOK — user pays the provider directly)",
  ];
  for (const p of BYOK_PROVIDERS.filter((x) => x.category === "cloud")) {
    lines.push(`- **${p.name}** — ${p.models}`);
  }
  lines.push("\n## Local / fully offline");
  for (const p of BYOK_PROVIDERS.filter((x) => x.category === "local")) {
    lines.push(`- **${p.name}** — ${p.models}`);
  }
  lines.push("\nKey storage: app-local secrets.json at file permission 0600. No OS keychain, no cloud key vault.");
  return lines.join("\n");
}

function formatSecurity(): string {
  const lines: string[] = [
    "# AZMX AI — Security posture\n",
    `- **Network egress:** ${SECURITY.networkEgress}`,
    `- **Model traffic:** ${SECURITY.modelTraffic}`,
    `- **Key storage:** ${SECURITY.keyStorage}`,
    `- **Approval gates:** ${SECURITY.approvalGates}`,
    `- **Deny-list:** ${SECURITY.denyList}`,
    `- **Audit log:** ${SECURITY.auditLog}`,
    `- **Code signing:** ${SECURITY.codeSigning}`,
    `- **CI gates:** ${SECURITY.ciGates}`,
    "",
    "## Compliance evidence (Enterprise tier)",
    ...SECURITY.compliance.map((c) => `- ${c}`),
    "",
    "Full security page: https://azmx.ai/security",
  ];
  return lines.join("\n");
}

async function fetchLatestRelease(): Promise<string> {
  try {
    const res = await fetch("https://api.github.com/repos/AzmxAI/azmx/releases/latest", {
      headers: { "User-Agent": "azmx-mcp", Accept: "application/vnd.github+json" },
    });
    if (!res.ok) {
      return `Could not fetch latest release (HTTP ${res.status}). Direct download: https://github.com/AzmxAI/azmx/releases/latest`;
    }
    const data = (await res.json()) as {
      tag_name?: string;
      name?: string;
      published_at?: string;
      html_url?: string;
      assets?: Array<{ name?: string; browser_download_url?: string }>;
    };
    const lines: string[] = [
      `# AZMX AI — latest release`,
      ``,
      `**Tag:** ${data.tag_name ?? "(unknown)"}`,
      `**Name:** ${data.name ?? "(unnamed)"}`,
      `**Published:** ${data.published_at ?? "(unknown)"}`,
      `**Release page:** ${data.html_url ?? "https://github.com/AzmxAI/azmx/releases/latest"}`,
    ];
    if (data.assets?.length) {
      lines.push("", "## Signed assets");
      for (const a of data.assets) {
        if (a.name && a.browser_download_url) lines.push(`- [${a.name}](${a.browser_download_url})`);
      }
    }
    return lines.join("\n");
  } catch (err) {
    return `Network error fetching latest release: ${(err as Error).message}. Direct download: https://github.com/AzmxAI/azmx/releases/latest`;
  }
}
