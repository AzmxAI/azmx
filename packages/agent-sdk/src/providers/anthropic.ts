import type { ChatRequest, ChatResponse, Provider, StreamChunk } from "./types.js";

export interface AnthropicProviderOptions {
  apiKey: string;
  /** Provider model id, e.g. "claude-opus-4-7", "claude-sonnet-4-6", "claude-haiku-4-5". */
  model: string;
  /** Override the API host. Useful for proxies / on-prem gateways. */
  baseUrl?: string;
  /** Anthropic API version header. */
  version?: string;
  /** Default max_tokens — Anthropic requires this; caller can still override per-request. */
  defaultMaxTokens?: number;
  /** Custom fetch (for testing). */
  fetch?: typeof fetch;
}

/**
 * Anthropic Messages API adapter — POST /v1/messages.
 *
 * BYOK direct: requests go from the caller's machine straight to
 * api.anthropic.com (or a custom baseUrl). No proxy via AZMX servers.
 */
export class AnthropicProvider implements Provider {
  readonly name = "anthropic";
  private apiKey: string;
  private model: string;
  private baseUrl: string;
  private version: string;
  private defaultMaxTokens: number;
  private fetch: typeof fetch;

  constructor(opts: AnthropicProviderOptions) {
    if (!opts.apiKey) throw new Error("AnthropicProvider: apiKey is required");
    if (!opts.model) throw new Error("AnthropicProvider: model is required");
    this.apiKey = opts.apiKey;
    this.model = opts.model;
    this.baseUrl = (opts.baseUrl ?? "https://api.anthropic.com").replace(/\/+$/, "");
    this.version = opts.version ?? "2023-06-01";
    this.defaultMaxTokens = opts.defaultMaxTokens ?? 4096;
    this.fetch = opts.fetch ?? fetch;
  }

  async complete(req: ChatRequest): Promise<ChatResponse> {
    const body = this.buildBody(req, false);
    const res = await this.fetch(`${this.baseUrl}/v1/messages`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
      signal: req.signal,
    });
    if (!res.ok) throw await httpError(res);
    const data = (await res.json()) as AnthropicResponse;
    const text = (data.content ?? [])
      .filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("");
    return {
      text,
      finishReason: data.stop_reason ?? "stop",
      usage: data.usage
        ? {
            inputTokens: data.usage.input_tokens ?? 0,
            outputTokens: data.usage.output_tokens ?? 0,
            cacheReadTokens: data.usage.cache_read_input_tokens,
            cacheCreationTokens: data.usage.cache_creation_input_tokens,
          }
        : undefined,
      raw: data,
    };
  }

  async *stream(req: ChatRequest): AsyncIterable<StreamChunk> {
    const body = this.buildBody(req, true);
    const res = await this.fetch(`${this.baseUrl}/v1/messages`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
      signal: req.signal,
    });
    if (!res.ok) throw await httpError(res);
    if (!res.body) throw new Error("AnthropicProvider: streaming response had no body");

    let usage: ChatResponse["usage"] | undefined;
    let finishReason: string | undefined;

    for await (const event of sseLines(res.body)) {
      if (!event.data) continue;
      let parsed: AnthropicStreamEvent;
      try {
        parsed = JSON.parse(event.data);
      } catch {
        continue;
      }
      if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
        yield { delta: parsed.delta.text ?? "" };
      } else if (parsed.type === "message_delta") {
        if (parsed.delta?.stop_reason) finishReason = parsed.delta.stop_reason;
        if (parsed.usage) {
          usage = {
            inputTokens: parsed.usage.input_tokens ?? 0,
            outputTokens: parsed.usage.output_tokens ?? 0,
            cacheReadTokens: parsed.usage.cache_read_input_tokens,
            cacheCreationTokens: parsed.usage.cache_creation_input_tokens,
          };
        }
      } else if (parsed.type === "message_stop") {
        yield { delta: "", done: true, finishReason: finishReason ?? "stop", usage };
        return;
      }
    }
    yield { delta: "", done: true, finishReason: finishReason ?? "stop", usage };
  }

  private buildBody(req: ChatRequest, stream: boolean): Record<string, unknown> {
    const system = req.messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
    const messages = req.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role, content: m.content }));
    return {
      model: this.model,
      max_tokens: req.maxTokens ?? this.defaultMaxTokens,
      temperature: req.temperature,
      stop_sequences: req.stop,
      system: system || undefined,
      messages,
      stream,
      ...(req.providerOptions ?? {}),
    };
  }

  private headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "x-api-key": this.apiKey,
      "anthropic-version": this.version,
    };
  }
}

interface AnthropicResponse {
  content?: Array<{ type: string; text?: string }>;
  stop_reason?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };
}

interface AnthropicStreamEvent {
  type: string;
  delta?: { type?: string; text?: string; stop_reason?: string };
  usage?: AnthropicResponse["usage"];
}

async function httpError(res: Response): Promise<Error> {
  let body = "";
  try {
    body = await res.text();
  } catch {
    /* ignore */
  }
  return new Error(`Anthropic HTTP ${res.status}: ${body.slice(0, 500)}`);
}

interface SseEvent {
  event?: string;
  data: string;
}

async function* sseLines(body: ReadableStream<Uint8Array>): AsyncIterable<SseEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n\n")) !== -1) {
      const chunk = buf.slice(0, nl);
      buf = buf.slice(nl + 2);
      const ev: SseEvent = { data: "" };
      for (const line of chunk.split("\n")) {
        if (line.startsWith("event:")) ev.event = line.slice(6).trim();
        else if (line.startsWith("data:")) ev.data += line.slice(5).trim();
      }
      yield ev;
    }
  }
}
