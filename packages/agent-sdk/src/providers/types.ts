/**
 * Shared provider types — minimal, intentionally close to the union of
 * OpenAI-shape and Anthropic-shape APIs so adapters can translate
 * losslessly in both directions.
 */

export type Role = "system" | "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface ChatRequest {
  /** Logical model alias registered in the router (NOT the provider's model id). */
  model: string;
  messages: ChatMessage[];
  /** Temperature 0..2. */
  temperature?: number;
  /** Max tokens to generate. */
  maxTokens?: number;
  /** Stop sequences. */
  stop?: string[];
  /** Provider-specific overrides; forwarded as-is. */
  providerOptions?: Record<string, unknown>;
  /** AbortSignal — adapter MUST honor it. */
  signal?: AbortSignal;
}

export interface ChatResponse {
  /** Concatenated text content. */
  text: string;
  /** Reason the provider stopped: "stop", "length", "abort", "error" etc. */
  finishReason: string;
  /** Usage if the provider reports it. */
  usage?: TokenUsage;
  /** The raw provider response, for callers that need it. */
  raw?: unknown;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  /** Some providers (Anthropic) report cache hits — surface them. */
  cacheReadTokens?: number;
  cacheCreationTokens?: number;
}

export interface StreamChunk {
  /** Incremental text — append in order. */
  delta: string;
  /** Set on the final chunk only. */
  done?: boolean;
  /** Usage on the final chunk if provider reports it. */
  usage?: TokenUsage;
  /** Finish reason on the final chunk. */
  finishReason?: string;
}

/**
 * Provider — implement this to add a new BYOK backend. The SDK doesn't
 * inspect the body; it just calls .complete or .stream and surfaces
 * whatever you return. Errors should throw with a clear message.
 */
export interface Provider {
  /** Stable identifier for logs / errors. */
  readonly name: string;
  complete(req: ChatRequest): Promise<ChatResponse>;
  stream(req: ChatRequest): AsyncIterable<StreamChunk>;
}
