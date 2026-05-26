import type { Policy, AgentAction, PolicyDecision } from "./gate.js";

/**
 * Standard mode — the AZMX default.
 *
 * Reads (file:read, network GET-like) are auto-approved.
 * Writes, deletes, shell, process spawns ask once per category-target.
 * Destructive shell verbs (rm, dd, shutdown, etc.) always ask.
 */
export function standardPolicy(): Policy {
  return {
    name: "standard",
    classify(action) {
      switch (action.kind) {
        case "file:read":
          return "auto";
        case "file:write":
        case "file:delete":
        case "git":
        case "process:spawn":
          return "ask";
        case "shell":
          return isDestructiveShell(action) ? "ask" : "ask";
        case "network":
          return isReadOnlyNetwork(action) ? "auto" : "ask";
        case "tool":
          return "ask";
        default:
          return "ask";
      }
    },
  };
}

/**
 * Paranoid mode — ask for everything, even reads.
 * Suitable for: untrusted codebases, classified work, compliance demos.
 */
export function paranoidPolicy(): Policy {
  return {
    name: "paranoid",
    classify() {
      return "ask";
    },
  };
}

/**
 * Default-allow — opposite of paranoid. Useful for trusted CI agents
 * with their own external guardrails. Use with deliberation.
 */
export function permissivePolicy(): Policy {
  return {
    name: "permissive",
    classify() {
      return "auto";
    },
  };
}

/**
 * Auto-deny a list of dangerous shell verbs regardless of approval flow.
 * Use as an early stop-gap before standardPolicy / paranoidPolicy vote.
 */
export function destructiveShellDenyPolicy(extraVerbs: string[] = []): Policy {
  const dangerous = new Set<string>([
    "rm",
    "dd",
    "mkfs",
    "shutdown",
    "reboot",
    "halt",
    "poweroff",
    "fdisk",
    "shred",
    "chown",
    "chmod",
    ...extraVerbs.map((v) => v.toLowerCase()),
  ]);

  return {
    name: "destructive-shell-deny",
    classify(action): PolicyDecision {
      if (action.kind !== "shell") return "auto";
      const cmd = String(action.summary || "").trim().toLowerCase();
      const first = cmd.split(/\s+/)[0] || "";
      const verb = first.split("/").pop() || "";
      return dangerous.has(verb) ? "deny" : "auto";
    },
  };
}

function isDestructiveShell(action: AgentAction): boolean {
  const cmd = String(action.summary || "").toLowerCase();
  return /\b(rm|dd|shred|mkfs|shutdown|reboot|halt|poweroff|fdisk|chown|chmod)\b/.test(cmd);
}

function isReadOnlyNetwork(action: AgentAction): boolean {
  const meta = action.meta as { method?: string } | undefined;
  const method = String(meta?.method ?? "GET").toUpperCase();
  return method === "GET" || method === "HEAD";
}
