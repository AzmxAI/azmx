import type { ChatRequest, ChatResponse, Provider, StreamChunk } from "./types.js";

/**
 * ProviderRouter — register providers under stable alias names; route
 * each ChatRequest to the right one. Keeps the rest of your code
 * independent of which model you're using.
 *
 * Example:
 *   const router = new ProviderRouter();
 *   router.register("claude-fast", new AnthropicProvider({ apiKey: ..., model: "claude-haiku-4-5" }));
 *   router.register("claude-smart", new AnthropicProvider({ apiKey: ..., model: "claude-opus-4-7" }));
 *   router.register("local",        new OllamaProvider({ model: "qwen2.5-coder:14b" }));
 *
 *   const r = await router.complete({ model: "claude-fast", messages: [...] });
 *   for await (const c of router.stream({ model: "local", messages: [...] })) { ... }
 */
export class ProviderRouter {
  private providers = new Map<string, Provider>();
  private default?: string;

  /** Register a provider under an alias used by ChatRequest.model. */
  register(alias: string, provider: Provider, opts: { default?: boolean } = {}): this {
    this.providers.set(alias, provider);
    if (opts.default || this.providers.size === 1) {
      this.default = alias;
    }
    return this;
  }

  /** Make `alias` the default. Used when ChatRequest.model is omitted. */
  setDefault(alias: string): this {
    if (!this.providers.has(alias)) {
      throw new Error(`ProviderRouter: cannot set default to "${alias}" — not registered`);
    }
    this.default = alias;
    return this;
  }

  /** All registered aliases. */
  list(): string[] {
    return [...this.providers.keys()];
  }

  /** Direct access to a registered provider. */
  get(alias: string): Provider | undefined {
    return this.providers.get(alias);
  }

  async complete(req: ChatRequest): Promise<ChatResponse> {
    return this.resolve(req).complete(req);
  }

  async *stream(req: ChatRequest): AsyncIterable<StreamChunk> {
    yield* this.resolve(req).stream(req);
  }

  private resolve(req: ChatRequest): Provider {
    const alias = req.model || this.default;
    if (!alias) {
      throw new Error("ProviderRouter: no model specified and no default registered");
    }
    const p = this.providers.get(alias);
    if (!p) {
      throw new Error(
        `ProviderRouter: no provider registered for "${alias}". Registered: ${this.list().join(", ") || "(none)"}`,
      );
    }
    return p;
  }
}
