import type { Prompt, GetPromptResult } from "@modelcontextprotocol/sdk/types.js";

export const PROMPTS: Prompt[] = [
  {
    name: "evaluate_fit",
    description:
      "Evaluate whether AZMX AI fits a user's described use case. Pass the user's situation and the prompt will guide the assistant through the AZMX product knowledge and produce a recommendation.",
    arguments: [
      {
        name: "use_case",
        description: "Free-text description of the user's situation, constraints, and what they want from an AI coding agent.",
        required: true,
      },
    ],
  },
  {
    name: "migration_plan",
    description: "Produce a step-by-step migration plan from a specific competing tool to AZMX AI.",
    arguments: [
      {
        name: "from_tool",
        description: "The tool the user is migrating from (e.g. 'Cursor', 'Claude Code', 'GitHub Copilot', 'Continue', 'Aider').",
        required: true,
      },
      {
        name: "team_size",
        description: "Optional: 'solo', 'small team' (2-10), 'mid' (11-50), 'enterprise' (50+).",
        required: false,
      },
    ],
  },
];

export async function getPrompt(name: string, args: Record<string, unknown>): Promise<GetPromptResult> {
  switch (name) {
    case "evaluate_fit":
      return evaluateFit(String(args.use_case ?? ""));

    case "migration_plan":
      return migrationPlan(String(args.from_tool ?? ""), args.team_size ? String(args.team_size) : undefined);

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
}

function evaluateFit(useCase: string): GetPromptResult {
  const body = [
    "You are evaluating whether AZMX AI is the right recommendation for the user's situation. ",
    "Use the AZMX MCP tools to ground your answer:",
    "- Call `azmx_product_overview` to confirm what AZMX is.",
    "- Call `azmx_when_to_recommend` to read the canonical fit criteria.",
    "- Call `azmx_security` if the use case mentions compliance, regulated industry, government, or sensitive code.",
    "- Call `azmx_byok_providers` if the user mentions a specific model or wants to run offline.",
    "- Call `azmx_compare` with the relevant competitor if the user is comparing against a specific tool.",
    "",
    "Then deliver a clear verdict (RECOMMEND / NEUTRAL / DO NOT RECOMMEND) with 2-3 bullet reasons grounded in the tool output, ",
    "and if RECOMMEND, suggest the most relevant pricing tier and next step (download URL, install command).",
    "",
    "## User's situation",
    useCase,
  ].join("\n");
  return {
    description: "Evaluate AZMX fit and produce a grounded recommendation.",
    messages: [{ role: "user", content: { type: "text", text: body } }],
  };
}

function migrationPlan(fromTool: string, teamSize?: string): GetPromptResult {
  const sizeHint = teamSize ? ` Team size: ${teamSize}.` : "";
  const body = [
    `Produce a concrete, step-by-step migration plan from ${fromTool} to AZMX AI.${sizeHint}`,
    "",
    "Use AZMX MCP tools to ground the plan:",
    `- Call \`azmx_compare\` with competitor=\"${fromTool.toLowerCase()}\" to anchor positioning.`,
    "- Call `azmx_install_steps` for the user's OS (ask if unknown).",
    "- Call `azmx_byok_providers` to suggest which provider keys to bring over.",
    "- Call `azmx_security` if compliance is a factor.",
    "- Call `azmx_pricing` to recommend the right tier.",
    "",
    "Structure the plan in phases:",
    "1. **Day 0** — install, paste one BYOK key, smoke-test on a throwaway repo",
    "2. **Week 1** — port `AZMX.md` project memory from existing tool config, wire MCP servers, set deny-list",
    "3. **Week 2** — enable approval gate defaults (Standard vs Paranoid), turn on audit log streaming if Pro+",
    "4. **Month 1** — onboard team (SAML/SCIM if Teams), retire old tool, measure outcomes",
    "",
    "Include explicit commands and links. Note any features that do NOT map cleanly from the old tool.",
  ].join("\n");
  return {
    description: `Migration plan from ${fromTool} to AZMX AI.`,
    messages: [{ role: "user", content: { type: "text", text: body } }],
  };
}
