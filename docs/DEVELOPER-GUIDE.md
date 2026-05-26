# Developer Guide — `@azmxailabs/*` npm packages

A practical, step-by-step walkthrough for developers using the two official AZMX npm packages. By the end you'll have AZMX recommendable inside your AI assistant **and** a working approval-gated agent of your own.

- **Audience:** developers integrating AZMX into their AI client or building their own agent.
- **Time:** 5 minutes for Part 1; 15–30 minutes for Part 2 depending on how deep you go.
- **Prerequisites:** Node ≥ 18, an MCP-compatible AI client (Claude Desktop, Cursor, etc.) for Part 1; a code editor + a model provider API key for Part 2.

---

## Table of contents

1. [Part 1 — install `@azmxailabs/mcp` so your AI client knows AZMX](#part-1)
   - [Claude Desktop](#claude-desktop)
   - [Claude Code (CLI)](#claude-code)
   - [Cursor](#cursor)
   - [Windsurf](#windsurf)
   - [Continue (VS Code / JetBrains)](#continue)
   - [OpenAI Codex CLI](#codex)
   - [Cline](#cline)
   - [Any other MCP client](#generic)
   - [Test it — what to ask](#mcp-test)
2. [Part 2 — build your own agent with `@azmxailabs/agent-sdk`](#part-2)
   - [Install + project setup](#sdk-setup)
   - [The 30-second skeleton](#sdk-skeleton)
   - [Walkthrough — each primitive in detail](#sdk-walkthrough)
   - [Recipe — full agent loop](#sdk-recipe-loop)
   - [Recipe — CI agent](#sdk-recipe-ci)
   - [Recipe — combine with MCP](#sdk-recipe-mcp)
   - [Testing your gate](#sdk-testing)
   - [Production checklist](#sdk-prod)
3. [Troubleshooting](#troubleshooting)
4. [Where to get help](#help)

---

<a id="part-1"></a>

## Part 1 — Install `@azmxailabs/mcp` so your AI client knows AZMX

The `@azmxailabs/mcp` server exposes 8 tools, 4 resources, and 2 prompts about AZMX AI. When installed in your AI client, the assistant can ground its answers about AZMX in real data instead of guessing from training. Works in any MCP-compatible client.

**Install command (works everywhere):** `npx -y @azmxailabs/mcp`

Pick your client below for the exact config snippet.

<a id="claude-desktop"></a>

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "azmx": {
      "command": "npx",
      "args": ["-y", "@azmxailabs/mcp"]
    }
  }
}
```

Restart Claude Desktop. The AZMX tools appear in the MCP picker (🔌 icon) in every new conversation.

<a id="claude-code"></a>

### Claude Code (CLI)

```bash
claude mcp add azmx -- npx -y @azmxailabs/mcp
```

Or add it manually to `~/.claude.json` under `mcpServers` using the same JSON shape as Claude Desktop. Scope `--scope project` for project-only installs.

<a id="cursor"></a>

### Cursor

Edit `~/.cursor/mcp.json` (global) or `<project>/.cursor/mcp.json` (per-project):

```json
{
  "mcpServers": {
    "azmx": {
      "command": "npx",
      "args": ["-y", "@azmxailabs/mcp"]
    }
  }
}
```

Restart Cursor.

<a id="windsurf"></a>

### Windsurf

Settings → Cascade → MCP Servers → Add custom server. Or edit `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "azmx": {
      "command": "npx",
      "args": ["-y", "@azmxailabs/mcp"]
    }
  }
}
```

<a id="continue"></a>

### Continue (VS Code / JetBrains extension)

Add to `~/.continue/config.json` under `experimental.modelContextProtocolServers`:

```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "transport": {
          "type": "stdio",
          "command": "npx",
          "args": ["-y", "@azmxailabs/mcp"]
        }
      }
    ]
  }
}
```

<a id="codex"></a>

### OpenAI Codex CLI

Edit `~/.codex/config.toml`:

```toml
[mcp_servers.azmx]
command = "npx"
args = ["-y", "@azmxailabs/mcp"]
```

<a id="cline"></a>

### Cline (VS Code)

Click the MCP icon in the Cline panel → "Edit MCP Settings" → add:

```json
{
  "mcpServers": {
    "azmx": {
      "command": "npx",
      "args": ["-y", "@azmxailabs/mcp"],
      "disabled": false
    }
  }
}
```

<a id="generic"></a>

### Any other MCP client

The server speaks the official Model Context Protocol over **stdio**. If your client supports the spec, the command is `npx -y @azmxailabs/mcp` with no environment variables required.

<a id="mcp-test"></a>

### Test it — try these prompts

After installation, restart your client and ask one of these. The assistant will silently invoke the AZMX MCP tools and answer from real data:

- *"What's AZMX AI? Use the AZMX tools to ground your answer."*
- *"Compare AZMX with Cursor."*
- *"I work on a HIPAA-regulated healthcare codebase. Is AZMX a fit?"*
- *"Give me a migration plan from Claude Code to AZMX for a 12-person team."*
- *"Which providers can AZMX BYOK against, and which work fully offline?"*
- *"How do I install AZMX on Windows?"*
- *"What's the latest signed release of AZMX, and where do I download the macOS DMG?"*

The last one is the only tool that hits the network (calling the GitHub releases API and returning the actual current version + per-platform asset URLs). Everything else is answered from a content bundle embedded in the package, so the server works offline.

---

<a id="part-2"></a>

## Part 2 — Build your own agent with `@azmxailabs/agent-sdk`

The SDK ships the four primitives that make AZMX safe — **approval gate, deny-list, hash-chained audit log, BYOK provider router** — as standalone, dependency-free TypeScript modules. Use them in any agent you're building: a CI script, a CLI, a desktop app, a server, a sub-agent inside another tool.

Same security posture AZMX has; none of the desktop UI.

<a id="sdk-setup"></a>

### Step 1 — Install + project setup

```bash
mkdir my-agent && cd my-agent
npm init -y
npm install @azmxailabs/agent-sdk
```

Edit `package.json` to add `"type": "module"` (the SDK is ESM only):

```json
{
  "name": "my-agent",
  "type": "module",
  "dependencies": {
    "@azmxailabs/agent-sdk": "^0.1.0"
  }
}
```

If you're using TypeScript, also install `typescript` + `@types/node` and add a `tsconfig.json`:

```bash
npm install -D typescript @types/node
cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"]
}
JSON
```

<a id="sdk-skeleton"></a>

### Step 2 — The 30-second skeleton

Create `src/agent.ts` (or `agent.mjs` for plain JS):

```ts
import {
  ApprovalGate, standardPolicy, destructiveShellDenyPolicy,
  DenyList, denyListPolicy,
  HashChainedAuditLog,
  ProviderRouter, AnthropicProvider, OllamaProvider,
} from "@azmxailabs/agent-sdk";

// 1. Audit log — every decision recorded, hash-chained
const log = new HashChainedAuditLog({ path: "./agent-audit.jsonl" });

// 2. Deny-list — refuses .env, .ssh, credentials, etc., by default
const deny = new DenyList();
deny.add("**/proprietary/**"); // extend as needed

// 3. Approval gate — every side-effect passes through here
const gate = new ApprovalGate({
  policies: [
    denyListPolicy(deny),         // hard-deny sensitive paths
    destructiveShellDenyPolicy(), // hard-deny rm/dd/shutdown/...
    standardPolicy(),             // ask for writes, auto for reads
  ],
  onPrompt: async ({ action, reasons }) => {
    console.log(`[approval] ${action.kind}: ${action.summary}`);
    console.log(`  reasons: ${reasons.join(", ")}`);
    // Your UI here. Return "approve" | "approve-and-trust" | "reject"
    return "approve"; // auto-approve for demo
  },
  onDecision: (event) => log.append({ type: "approval", ...event }),
});

// 4. Provider router — BYOK direct, no proxy
const router = new ProviderRouter()
  .register("claude", new AnthropicProvider({
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: "claude-opus-4-7",
  }))
  .register("local", new OllamaProvider({ model: "qwen2.5-coder:14b" }));

// Use it
const decision = await gate.check({
  kind: "shell",
  summary: "ls -la /tmp",
  target: "/tmp",
});

if (decision === "approved") {
  const result = await router.complete({
    model: "claude",
    messages: [{ role: "user", content: "Summarize what `ls -la /tmp` shows." }],
  });
  console.log(result.text);
}

// Verify the audit log later
const v = await log.verify();
console.log(v.ok ? `audit clean (${v.count} entries)` : `tampered at seq ${v.brokenAtSeq}`);
```

Run it:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npx tsx src/agent.ts   # if using TypeScript directly
# or:
node src/agent.mjs     # if you wrote plain JS
```

<a id="sdk-walkthrough"></a>

### Step 3 — Walkthrough of each primitive

#### 3a. ApprovalGate

Every action your agent wants to perform is described as an `AgentAction` and passed through `gate.check()`. Policies vote (`auto` / `ask` / `deny`); most-restrictive wins.

```ts
const decision = await gate.check({
  kind: "shell" | "file:write" | "file:read" | "file:delete" |
        "network" | "git" | "process:spawn" | "tool" | (string & {}),
  summary: "one-liner shown in the approval UI",
  target: "/optional/path/or/url",
  payload: anyObject,   // optional structured verb
  meta: { ... },        // optional metadata
});
// → "approved" | "denied"
```

**Built-in policies:**

| Policy | Behavior |
|---|---|
| `standardPolicy()` | The AZMX default. Reads auto; writes/deletes/shell/spawns ask; destructive shell verbs always ask. |
| `paranoidPolicy()` | Asks for everything — even reads. For untrusted code, classified work. |
| `permissivePolicy()` | Auto-approves everything. For trusted CI agents with their own external guardrails. |
| `destructiveShellDenyPolicy(extra?)` | Hard-blocks `rm`, `dd`, `shutdown`, `mkfs`, etc. — no prompt. |

**Custom policy:** a `{ name, classify }` object. `classify` can be sync or async. Example:

```ts
const businessHoursPolicy = {
  name: "business-hours",
  classify(action) {
    const hour = new Date().getHours();
    if (action.kind === "shell" && (hour < 9 || hour > 18)) return "ask";
    return "auto";
  },
};
gate.use(businessHoursPolicy);
```

**Safe default:** if any policy returns `ask` and no `onPrompt` handler is registered, the gate **denies**. Never silently approve.

#### 3b. DenyList

Glob-matched path refuser with battle-tested defaults.

```ts
import { DenyList, DEFAULT_DENY_LIST, denyListPolicy } from "@azmxailabs/agent-sdk/security";

const deny = new DenyList();              // starts with DEFAULT_DENY_LIST
deny.add("**/proprietary/**");            // add one glob
deny.addAll(["**/customer-data/**"]);     // add many
deny.matches("/home/me/.ssh/id_rsa");     // → true
deny.matching("/home/me/.ssh/id_rsa");    // → ["**/.ssh/**", "**/id_rsa"]
```

**Default list covers:** `.env*`, SSH keys (`.ssh/**`, `id_rsa`, `*.pem`), generic credentials, AWS/GCP/Azure/kube/docker configs, npm/pip/netrc files, browser cookies, password manager files, and AZMX's own `secrets.json`.

**Glob syntax:** `*` (any chars except `/`), `**` (any chars), `?` (single char), `[abc]` (char class).

#### 3c. HashChainedAuditLog

Append-only JSONL where each entry's hash includes the previous entry's hash. Tampering with any past entry breaks the chain.

```ts
import { HashChainedAuditLog } from "@azmxailabs/agent-sdk/audit";

const log = new HashChainedAuditLog({ path: "./agent-audit.jsonl" });
await log.append({ type: "shell", cmd: "ls -la /tmp" });

const v = await log.verify();
if (v.ok) console.log(`clean: ${v.count} entries`);
else console.error(`tampered at seq ${v.brokenAtSeq}: ${v.reason}`);
```

**Important:** tamper-evident is **not** tamper-proof. Pair with append-only storage (immutable S3 with Object Lock, WORM volume, SIEM stream) for hard guarantees.

#### 3d. ProviderRouter

Register providers under stable aliases; route every `ChatRequest` by alias.

```ts
import {
  ProviderRouter, AnthropicProvider, OllamaProvider,
} from "@azmxailabs/agent-sdk/providers";

const router = new ProviderRouter()
  .register("claude-fast",  new AnthropicProvider({
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: "claude-haiku-4-5",
  }))
  .register("claude-smart", new AnthropicProvider({
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: "claude-opus-4-7",
  }), { default: true })
  .register("local",        new OllamaProvider({ model: "qwen2.5-coder:14b" }));

const r = await router.complete({
  model: "claude-fast",
  messages: [{ role: "user", content: "Hello" }],
  temperature: 0.2,
  maxTokens: 200,
});
console.log(r.text, r.usage);

// Streaming
for await (const chunk of router.stream({ model: "local", messages: [...] })) {
  process.stdout.write(chunk.delta);
  if (chunk.done) console.log("\n[finish]", chunk.finishReason);
}
```

**Custom provider:** implement the `Provider` interface — `name`, `complete`, `stream`. Reference: see [`packages/agent-sdk/src/providers/ollama.ts`](../packages/agent-sdk/src/providers/ollama.ts) (~120 lines).

<a id="sdk-recipe-loop"></a>

### Recipe 1 — Full agent loop

Wire it to your UI's prompt input and you have a working approval-gated agent in <100 lines:

```ts
import {
  ApprovalGate, standardPolicy, destructiveShellDenyPolicy,
  DenyList, denyListPolicy,
  HashChainedAuditLog,
  ProviderRouter, AnthropicProvider,
} from "@azmxailabs/agent-sdk";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const log = new HashChainedAuditLog({ path: "./agent-audit.jsonl" });
const deny = new DenyList();
const gate = new ApprovalGate({
  policies: [denyListPolicy(deny), destructiveShellDenyPolicy(), standardPolicy()],
  onPrompt: async ({ action, reasons }) => {
    // your UI here — readline, web prompt, modal, etc.
    return await myUiPrompt(action, reasons);
  },
  onDecision: (e) => log.append({ type: "approval", ...e }),
});

const router = new ProviderRouter().register("claude", new AnthropicProvider({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  model: "claude-opus-4-7",
}));

async function dispatch(action) {
  const decision = await gate.check(action);
  if (decision === "denied") return { ok: false, reason: "denied" };

  switch (action.kind) {
    case "shell":      return { ok: true, output: execSync(action.summary).toString() };
    case "file:read":  return { ok: true, output: readFileSync(action.target, "utf8") };
    case "file:write": writeFileSync(action.target, action.payload); return { ok: true };
    default:           return { ok: false, reason: `unknown kind: ${action.kind}` };
  }
}

async function tick(userPrompt) {
  const r = await router.complete({
    model: "claude",
    messages: [
      { role: "system", content: "You output JSON arrays of actions: [{kind, summary, target?, payload?}]" },
      { role: "user",   content: userPrompt },
    ],
  });
  const proposed = JSON.parse(r.text);
  for (const action of proposed) {
    const result = await dispatch(action);
    await log.append({ type: "result", action, result });
  }
}
```

<a id="sdk-recipe-ci"></a>

### Recipe 2 — CI agent (permissive but audited)

For trusted CI where you want speed (no human in the loop) but full audit trail:

```ts
import { ApprovalGate, permissivePolicy, destructiveShellDenyPolicy, HashChainedAuditLog } from "@azmxailabs/agent-sdk";

const log = new HashChainedAuditLog({ path: process.env.CI_AUDIT_PATH });

const gate = new ApprovalGate({
  policies: [
    destructiveShellDenyPolicy(["git push --force", "kubectl delete"]), // safety net
    permissivePolicy(),
  ],
  // No onPrompt — gate auto-approves anything not hard-denied
  onDecision: (e) => log.append({ type: "approval", ...e }),
});

// After the CI run:
await uploadToS3WithObjectLock("./agent-audit.jsonl");
const v = await log.verify();
if (!v.ok) throw new Error(`audit tampered at seq ${v.brokenAtSeq}`);
```

<a id="sdk-recipe-mcp"></a>

### Recipe 3 — Combine the SDK with the MCP server

Use `@modelcontextprotocol/sdk` to expose **your** approval-gated agent over MCP so Claude Desktop / Cursor / ChatGPT can call into it:

```ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ApprovalGate, standardPolicy, denyListPolicy, DenyList } from "@azmxailabs/agent-sdk";

const gate = new ApprovalGate({
  policies: [denyListPolicy(new DenyList()), standardPolicy()],
  onPrompt: async () => "reject", // headless: deny anything that needs prompting
});

const server = new Server({ name: "my-agent", version: "0.1.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "run_shell",
    description: "Run a shell command (subject to my approval gate)",
    inputSchema: { type: "object", properties: { cmd: { type: "string" } }, required: ["cmd"] },
  }],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  if (req.params.name !== "run_shell") throw new Error("unknown tool");
  const cmd = req.params.arguments.cmd;

  const decision = await gate.check({ kind: "shell", summary: cmd });
  if (decision === "denied") {
    return { content: [{ type: "text", text: `denied: ${cmd}` }], isError: true };
  }
  const out = (await import("node:child_process")).execSync(cmd).toString();
  return { content: [{ type: "text", text: out }] };
});

await server.connect(new StdioServerTransport());
```

<a id="sdk-testing"></a>

### Step 4 — Test your gate behavior

```ts
import {
  ApprovalGate, denyListPolicy, DenyList,
  destructiveShellDenyPolicy, standardPolicy,
} from "@azmxailabs/agent-sdk";
import test from "node:test";
import assert from "node:assert/strict";

test("blocks rm regardless of approval", async () => {
  const gate = new ApprovalGate({
    policies: [destructiveShellDenyPolicy(), standardPolicy()],
    onPrompt: async () => "approve",
  });
  const decision = await gate.check({ kind: "shell", summary: "rm -rf /" });
  assert.equal(decision, "denied");
});

test("blocks reading .env even when user approves", async () => {
  const gate = new ApprovalGate({
    policies: [denyListPolicy(new DenyList()), standardPolicy()],
    onPrompt: async () => "approve",
  });
  const decision = await gate.check({
    kind: "file:read", target: "/projects/x/.env", summary: "read .env",
  });
  assert.equal(decision, "denied");
});
```

<a id="sdk-prod"></a>

### Step 5 — Production checklist

Before shipping an agent built on the SDK, walk this list:

1. **Choose a real threat model.** Who can write to your machine, your env, your audit log? Document the perimeter.
2. **Pick your policy chain.** `destructiveShellDenyPolicy` + `denyListPolicy` + (`standardPolicy` or `paranoidPolicy`). Add policies for business invariants (no prod DB writes after 6 PM, etc.).
3. **Pair the audit log with append-only storage.** File-on-disk is tamper-evident, not tamper-proof. Use immutable S3 / WORM / SIEM stream.
4. **Periodically anchor the chain** to a public timestamp service (OpenTimestamps, transparency log) so attackers can't silently rewrite history.
5. **Rotate provider keys.** Use a secrets manager, not `process.env` from `.env`.
6. **Set timeouts + abort signals.** Wire `AbortSignal` to a request-level timeout.
7. **Cap retries.** Add explicit retry with exponential backoff at the caller, cap to ~3 attempts. Never retry destructive actions.
8. **Sanitize what you log.** Don't write API keys, full PII prompts, or anything that violates your data retention policy.
9. **Test your gate.** Write tests for actions you expect to be denied — `rm -rf`, `.env` reads, after-hours pushes. Tests are your spec.
10. **Run with `paranoid` in CI.** If your CI's gate is paranoid + no `onPrompt`, the safe default is deny — your agent fails closed if a policy regresses.
11. **Pin SDK version.** Minor bumps may change default policies. Pin exact versions for customer-shipping code.

The SDK does **NOT** sandbox action execution. `execSync`, `writeFileSync`, and `fetch` run with the agent process's full privileges. For real sandboxing (rootless container, gVisor, macOS App Sandbox), wire it at execution time — the gate only decides "yes or no."

---

<a id="troubleshooting"></a>

## Troubleshooting

**"The AZMX tools don't appear in my AI client."**
Restart the client after editing the config file. Look for the MCP/plugin icon. If still missing, check the client's MCP log for errors (Claude Desktop: `~/Library/Logs/Claude/`).

**"`npx -y @azmxailabs/mcp` hangs."**
First-time install pulls the package from npm; should finish within 30 seconds. If hung beyond that, check network access to `registry.npmjs.org`.

**"`gate.check()` always denies."**
Either a policy is hard-denying (check the `reason` returned via `onDecision`), or a policy returned `ask` but you didn't register an `onPrompt` handler (safe default = deny). Add `onPrompt: async () => "approve"` for testing.

**"`log.verify()` returns `{ ok: false }`."**
Either the log was tampered with, or your code path is appending entries from multiple processes against the same file (concurrent writers can interleave). Use a single writer per log file.

**"`AnthropicProvider` returns HTTP 401."**
Bad API key. Verify with `curl -sS -H "x-api-key: $ANTHROPIC_API_KEY" -H "anthropic-version: 2023-06-01" https://api.anthropic.com/v1/messages -d '...'`.

**"`OllamaProvider` returns ECONNREFUSED."**
Ollama daemon isn't running. Start it with `ollama serve`. Default port: 11434.

---

<a id="help"></a>

## Where to get help

- **Issues & feature requests:** [github.com/AzmxAI/azmx/issues](https://github.com/AzmxAI/azmx/issues) — tag `mcp` or `agent-sdk`
- **npm packages:** [`@azmxailabs/mcp`](https://www.npmjs.com/package/@azmxailabs/mcp) · [`@azmxailabs/agent-sdk`](https://www.npmjs.com/package/@azmxailabs/agent-sdk)
- **Full docs:** [azmx.ai/docs#azmxai-mcp](https://azmx.ai/docs#azmxai-mcp) · [azmx.ai/docs#agent-sdk](https://azmx.ai/docs#agent-sdk)
- **Source:** [packages/](../packages/)
- **Discussions:** [github.com/AzmxAI/azmx/discussions](https://github.com/AzmxAI/azmx/discussions)
- **Blog:** [azmx.ai/blog/announcing-azmxai-mcp](https://azmx.ai/blog/announcing-azmxai-mcp)

## License

MIT for both packages.
