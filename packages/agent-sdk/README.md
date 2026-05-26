# @azmxailabs/agent-sdk

> Build approval-gated AI agents with the same primitives that power **[AZMX AI](https://azmx.ai)** — BYOK provider router, approval gate, deny-list, hash-chained audit log. Secure by default. BYOK direct (no proxy). No telemetry.

```bash
npm install @azmxailabs/agent-sdk
```

## Why this exists

Most "AI agent" frameworks bolt safety on as middleware. AZMX builds it in. This SDK ships the four primitives that make that possible as standalone, dependency-free TypeScript so you can use them in your own agent — whether that's a CI script, a CLI, a desktop app, or a server.

- **Approval gate** — every side-effecting action passes through a configurable policy chain before it runs.
- **Deny-list** — refuses `.env`, `.ssh`, credentials, and any other path you care about by glob.
- **Hash-chained audit log** — every entry includes the previous entry's hash; tampering breaks the chain detectably.
- **Provider router** — one ergonomic interface across Anthropic, Ollama, and any other backend you plug in.

Zero runtime dependencies. Node ≥ 18. ESM.

## Quick start

```ts
import {
  ApprovalGate,
  standardPolicy,
  destructiveShellDenyPolicy,
  DenyList,
  denyListPolicy,
  HashChainedAuditLog,
  ProviderRouter,
  AnthropicProvider,
  OllamaProvider,
} from "@azmxailabs/agent-sdk";

// 1. Audit log (hash-chained, tamper-evident)
const log = new HashChainedAuditLog({ path: "./agent-audit.jsonl" });

// 2. Deny-list (refuses sensitive paths)
const deny = new DenyList(); // ships with sensible defaults

// 3. Approval gate (the heart of the safety model)
const gate = new ApprovalGate({
  policies: [
    denyListPolicy(deny),
    destructiveShellDenyPolicy(),
    standardPolicy(),
  ],
  onPrompt: async ({ action, reasons }) => {
    // Your UI shows the action; user picks. Reasons = the policies that asked.
    console.log(`\n[approval needed] ${action.kind}: ${action.summary}`);
    console.log(`reasons: ${reasons.join(", ")}`);
    // Real code: prompt the user. Here we auto-approve for the example.
    return "approve";
  },
  onDecision: (event) => log.append({ type: "approval", ...event }),
});

// 4. Provider router (BYOK — direct, no proxy)
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
    messages: [{ role: "user", content: "Summarize what `ls -la` shows." }],
  });
  console.log(result.text);
}

// Verify the audit log later
const verification = await log.verify();
if (!verification.ok) {
  console.error("Audit log tampered at seq", verification.brokenAtSeq);
}
```

## API

### `ApprovalGate`

Every side-effecting action passes through here. Policies vote (`auto` / `ask` / `deny`); most-restrictive wins.

```ts
const gate = new ApprovalGate({
  policies: [denyListPolicy(), destructiveShellDenyPolicy(), standardPolicy()],
  onPrompt: async ({ action, reasons }) => "approve" | "approve-and-trust" | "reject",
  onDecision: (event) => auditLog.append(event), // optional sink
});

const decision = await gate.check({
  kind: "shell" | "file:write" | "file:read" | "file:delete" | "network" | "git" | "process:spawn" | "tool" | (string & {}),
  summary: "human-readable one-liner",
  target: "/path or URL",
  payload: anyObject, // optional structured verb
});
// → "approved" | "denied"
```

**Built-in policies** (importable from `@azmxailabs/agent-sdk/approval`):

| Policy | Behavior |
|---|---|
| `standardPolicy()` | The AZMX default. Reads auto; writes / deletes / shell / spawns ask; destructive shell verbs always ask. |
| `paranoidPolicy()` | Asks for everything — even reads. For untrusted code, classified work, compliance demos. |
| `permissivePolicy()` | Auto-approves everything. For trusted CI agents with their own external guardrails. |
| `destructiveShellDenyPolicy(extra?)` | Hard-blocks `rm`, `dd`, `shutdown`, etc. — no prompt. Adds your verbs to the list. |

### `DenyList` + `denyListPolicy`

```ts
import { DenyList, DEFAULT_DENY_LIST, denyListPolicy } from "@azmxailabs/agent-sdk/security";

const deny = new DenyList(); // defaults: .env, .ssh, credentials, .aws/credentials, .kube/config, cookies, keychain files, ...
deny.add("**/proprietary/**");
deny.matches("/Users/me/.ssh/id_rsa"); // true
deny.matching("/Users/me/.ssh/id_rsa"); // ["**/.ssh/**", "**/id_rsa"]

// Plug into the gate:
const policy = denyListPolicy(deny);
```

Globs: `*` (any chars except `/`), `**` (any chars), `?` (single char), `[abc]` (char class).

### `HashChainedAuditLog`

Append-only log where each entry's hash includes the previous entry's hash. Tampering with any past entry breaks the chain.

```ts
import { HashChainedAuditLog, FileStorage, InMemoryStorage } from "@azmxailabs/agent-sdk/audit";

const log = new HashChainedAuditLog({ path: "./audit.jsonl" }); // FileStorage by default
await log.append({ type: "shell", cmd: "ls -la /tmp" });
await log.append({ type: "approval", decision: "approve" });

const v = await log.verify();
// v.ok === true  → all entries valid
// v.ok === false → { brokenAtSeq, reason, expected?, found? }
```

Genesis prevHash = 64 zero bytes. Each entry's hash = `sha256(JSON.stringify({seq, ts, prevHash, data}))`. File mode is 0600.

### `ProviderRouter`

```ts
import {
  ProviderRouter,
  AnthropicProvider,
  OllamaProvider,
} from "@azmxailabs/agent-sdk/providers";

const router = new ProviderRouter()
  .register("claude-fast", new AnthropicProvider({ apiKey: process.env.ANTHROPIC_API_KEY!, model: "claude-haiku-4-5" }))
  .register("claude-smart", new AnthropicProvider({ apiKey: process.env.ANTHROPIC_API_KEY!, model: "claude-opus-4-7" }))
  .register("local", new OllamaProvider({ model: "qwen2.5-coder:14b" }));

const r = await router.complete({
  model: "claude-fast",
  messages: [
    { role: "system", content: "You are concise." },
    { role: "user", content: "Hello" },
  ],
  temperature: 0.2,
  maxTokens: 200,
});
console.log(r.text, r.usage);

// Streaming
for await (const chunk of router.stream({ model: "local", messages: [...] })) {
  process.stdout.write(chunk.delta);
  if (chunk.done) console.log("\n[finishReason]", chunk.finishReason);
}
```

**Built-in adapters:**

| Adapter | API | BYOK / local |
|---|---|---|
| `AnthropicProvider` | POST `/v1/messages` | BYOK direct |
| `OllamaProvider` | POST `/api/chat` | Local |

**Adding your own:** implement the `Provider` interface — `name`, `complete`, `stream`. ~50 lines of code per provider; see `src/providers/ollama.ts` for a minimal reference.

## Design choices

- **No runtime dependencies.** Provider adapters call HTTP via `fetch` directly. Adding the official SDK for any provider is a 5-line wrapper at most — but the SDK doesn't need it.
- **Approval is the first-class concept.** Every other primitive plugs into the gate (deny-list → policy; audit log → onDecision sink). The brand-DNA path is "gate then act."
- **BYOK direct.** Provider adapters take an `apiKey` and call the provider's own endpoint. AZMX servers never see your prompts or tokens.
- **Audit log is tamper-evident, not tamper-proof.** Hash chains prove that something changed — they don't prevent change. Pair with append-only storage (immutable S3 bucket, WORM volume) for hard guarantees.

## Roadmap (v0.2+)

- Tool / function-calling support across the provider interface
- `OpenAIProvider` (covers OpenAI + most OpenAI-compatible APIs: Groq, Cerebras, xAI, DeepSeek, Azure, NVIDIA NIM)
- `GoogleProvider` (Gemini)
- An `MCPClient` for talking to MCP servers (`@modelcontextprotocol/sdk` wrapper)
- Streaming tool calls
- Cost tracking middleware

File an issue at https://github.com/AzmxAI/azmx/issues if you want any of these prioritized — or open a PR.

## License

MIT — see [LICENSE](./LICENSE).

## About AZMX AI

AZMX AI is a native (~7 MB) AI coding agent that runs on your machine, with your keys (BYOK across 11+ providers, or fully offline via Ollama / LM Studio). Every write is gated by per-call approval. No account, no telemetry. Free forever for individuals.

- Homepage: https://azmx.ai
- Docs: https://azmx.ai/docs
- MCP server: https://www.npmjs.com/package/@azmxailabs/mcp
- Source: https://github.com/AzmxAI/azmx
