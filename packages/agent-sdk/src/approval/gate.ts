/**
 * ApprovalGate — every side-effecting action passes through here.
 *
 * The pattern AZMX uses in its desktop app: the agent never executes a
 * shell command, writes a file, or hits the network until the action
 * has been classified by every registered policy and approved by the
 * user (or auto-approved if every policy returns "auto").
 *
 * Policies are pure functions: action → "auto" | "ask" | "deny". The
 * gate aggregates them with the most-restrictive-wins rule: any "deny"
 * blocks; any "ask" prompts the user; "auto" only fires if every
 * policy agreed.
 */

export type ActionKind =
  | "shell"
  | "file:write"
  | "file:read"
  | "file:delete"
  | "network"
  | "git"
  | "process:spawn"
  | "tool"
  | (string & {});

export interface AgentAction {
  /** Coarse category — used by policies for fast routing. */
  kind: ActionKind;
  /** One-line human summary shown to the user in the approval UI. */
  summary: string;
  /** Optional path / URL / target the action touches. */
  target?: string;
  /** Optional structured payload (the verb the agent staged). */
  payload?: unknown;
  /** Arbitrary metadata; passed through to policies + onPrompt. */
  meta?: Record<string, unknown>;
}

export type PolicyDecision = "auto" | "ask" | "deny";

export interface Policy {
  /** Short stable identifier — appears in audit log + denial reason. */
  name: string;
  /** Pure classifier. Sync or async. Throw nothing. */
  classify(action: AgentAction): PolicyDecision | Promise<PolicyDecision>;
}

export type UserDecision = "approve" | "approve-and-trust" | "reject";

export interface PromptContext {
  action: AgentAction;
  /** Names of policies that returned "ask" — the reason we're prompting. */
  reasons: string[];
}

export type PromptHandler = (ctx: PromptContext) => UserDecision | Promise<UserDecision>;

export interface GateOptions {
  policies?: Policy[];
  /** Required when any policy returns "ask". */
  onPrompt?: PromptHandler;
  /** Optional sink — called on every decision (for audit log wiring). */
  onDecision?: (event: DecisionEvent) => void | Promise<void>;
}

export interface DecisionEvent {
  action: AgentAction;
  classifications: Array<{ policy: string; decision: PolicyDecision }>;
  finalDecision: "approved" | "denied";
  reason?: string;
  timestamp: string;
}

export class ApprovalGate {
  private policies: Policy[];
  private onPrompt?: PromptHandler;
  private onDecision?: GateOptions["onDecision"];
  private trustedActions = new Set<string>();

  constructor(opts: GateOptions = {}) {
    this.policies = opts.policies ?? [];
    this.onPrompt = opts.onPrompt;
    this.onDecision = opts.onDecision;
  }

  /** Add a policy at runtime. Order doesn't matter — all policies vote. */
  use(policy: Policy): void {
    this.policies.push(policy);
  }

  /**
   * Classify + (if needed) prompt + return the final decision.
   *
   * Most-restrictive-wins:
   *   any "deny" → "denied" without prompting.
   *   any "ask"  → call onPrompt; user's reject → "denied".
   *   all "auto" → "approved" without prompting.
   */
  async check(action: AgentAction): Promise<"approved" | "denied"> {
    const trustKey = this.trustKeyFor(action);
    if (this.trustedActions.has(trustKey)) {
      return this.finalize(action, [], "approved", "trusted-by-user");
    }

    const classifications: Array<{ policy: string; decision: PolicyDecision }> = [];
    for (const p of this.policies) {
      const d = await p.classify(action);
      classifications.push({ policy: p.name, decision: d });
    }

    const denials = classifications.filter((c) => c.decision === "deny");
    if (denials.length > 0) {
      const reason = `denied by policy: ${denials.map((d) => d.policy).join(", ")}`;
      return this.finalize(action, classifications, "denied", reason);
    }

    const asks = classifications.filter((c) => c.decision === "ask");
    if (asks.length === 0) {
      return this.finalize(action, classifications, "approved", "auto-approved");
    }

    if (!this.onPrompt) {
      const reason = `no onPrompt handler registered; asks=${asks.map((a) => a.policy).join(", ")}`;
      return this.finalize(action, classifications, "denied", reason);
    }

    const user = await this.onPrompt({
      action,
      reasons: asks.map((a) => a.policy),
    });

    if (user === "reject") {
      return this.finalize(action, classifications, "denied", "rejected by user");
    }
    if (user === "approve-and-trust") {
      this.trustedActions.add(trustKey);
    }
    return this.finalize(action, classifications, "approved", `${user}-by-user`);
  }

  private async finalize(
    action: AgentAction,
    classifications: Array<{ policy: string; decision: PolicyDecision }>,
    finalDecision: "approved" | "denied",
    reason: string,
  ): Promise<"approved" | "denied"> {
    const event: DecisionEvent = {
      action,
      classifications,
      finalDecision,
      reason,
      timestamp: new Date().toISOString(),
    };
    if (this.onDecision) {
      try {
        await this.onDecision(event);
      } catch {
        // never let an audit sink failure mask the user's decision
      }
    }
    return finalDecision;
  }

  private trustKeyFor(action: AgentAction): string {
    return `${action.kind}::${action.target ?? ""}::${action.summary}`;
  }
}
