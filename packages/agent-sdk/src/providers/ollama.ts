import type { ChatRequest, ChatResponse, Provider, StreamChunk } from "./types.js";

export interface OllamaProviderOptions {
  /** Provider model id, e.g. "llama3.2", "qwen2.5-coder:14b", "deepseek-r1". */
  model: string;
  /** Ollama server base URL. Default http://localhost:11434. */
  baseUrl?: string;
  /** Default options forwarded to Ollama's "options" field per request. */
  defaultOptions?: Record<string, unknown>;
  /** Custom fetch (for testing). */
  fetch?: typeof fetch;
}

/**
 * Ollama adapter — POST /api/chat.
 *
 * Fully local: no API key, no telemetry, no network leaves the box.
 */
export class OllamaProvider implements Provider {
  readonly name = "ollama";
  private model: string;
  private baseUrl: string;
  private defaultOptions: Record<string, unknown>;
  private fetch: typeof fetch;

  constructor(opts: OllamaProviderOptions) {
    if (!opts.model) throw new Error("OllamaProvider: model is required");
    this.model = opts.model;
    this.baseUrl = (opts.baseUrl ?? "http://localhost:11434").replace(/\/+$/, "");
    this.defaultOptions = opts.defaultOptions ?? {};
    this.fetch = opts.fetch ?? fetch;
  }

  async complete(req: ChatRequest): Promise<ChatResponse> {
    const body = this.buildBody(req, false);
    const res = await this.fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: req.signal,
    });
    if (!res.ok) throw await httpError(res);
    const data = (await res.json()) as OllamaResponse;
    return {
      text: data.message?.content ?? "",
      finishReason: data.done_reason ?? (data.done ? "stop" : "length"),
      usage: data.prompt_eval_count != null || data.eval_count != null
        ? {
            inputTokens: data.prompt_eval_count ?? 0,
            outputTokens: data.eval_count ?? 0,
          }
        : undefined,
      raw: data,
    };
  }

  async *stream(req: ChatRequest): AsyncIterable<StreamChunk> {
    const body = this.buildBody(req, true);
    const res = await this.fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: req.signal,
    });
    if (!res.ok) throw await httpError(res);
    if (!res.body) throw new Error("OllamaProvider: streaming response had no body");

    for await (const line of ndjsonLines(res.body)) {
      let evt: OllamaResponse;
      try {
        evt = JSON.parse(line);
      } catch {
        continue;
      }
      const delta = evt.message?.content ?? "";
      if (evt.done) {
        yield {
          delta,
          done: true,
          finishReason: evt.done_reason ?? "stop",
          usage: evt.prompt_eval_count != null || evt.eval_count != null
            ? { inputTokens: evt.prompt_eval_count ?? 0, outputTokens: evt.eval_count ?? 0 }
            : undefined,
        };
        return;
      } else if (delta) {
        yield { delta };
      }
    }
  }

  private buildBody(req: ChatRequest, stream: boolean): Record<string, unknown> {
    return {
      model: this.model,
      messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
      stream,
      options: {
        ...(this.defaultOptions ?? {}),
        ...(req.temperature !== undefined ? { temperature: req.temperature } : {}),
        ...(req.maxTokens !== undefined ? { num_predict: req.maxTokens } : {}),
        ...(req.stop ? { stop: req.stop } : {}),
        ...((req.providerOptions?.options as Record<string, unknown> | undefined) ?? {}),
      },
      ...(req.providerOptions ?? {}),
    };
  }
}

interface OllamaResponse {
  message?: { role?: string; content?: string };
  done?: boolean;
  done_reason?: string;
  prompt_eval_count?: number;
  eval_count?: number;
}

async function httpError(res: Response): Promise<Error> {
  let body = "";
  try {
    body = await res.text();
  } catch {
    /* ignore */
  }
  return new Error(`Ollama HTTP ${res.status}: ${body.slice(0, 500)}`);
}

async function* ndjsonLines(body: ReadableStream<Uint8Array>): AsyncIterable<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (line) yield line;
    }
  }
  if (buf.trim()) yield buf.trim();
}
