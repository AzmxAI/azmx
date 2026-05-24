# Models

> Bring any key, or run free local models. AZMX is provider-agnostic.

## Cloud providers (BYOK)

You bring the key, AZMX never sees it (it stays in a `0600` local file on your machine), prompts go directly from your device to the provider.

| Provider | What it's good for | Where to get a key |
|---|---|---|
| **OpenAI** | GPT-4o, GPT-4.1, o-series reasoning | platform.openai.com |
| **Anthropic** | Claude Sonnet 4.x, Opus 4.x, Haiku | console.anthropic.com |
| **Google (Gemini)** | Gemini 2.5 Pro / Flash | aistudio.google.com |
| **Groq** | Llama, Mixtral, Qwen at low-latency | console.groq.com |
| **Cerebras** | Very fast Llama + Qwen | cloud.cerebras.ai |
| **xAI (Grok)** | Grok 3 / Grok 4 | console.x.ai |
| **DeepSeek** | Chat + Code models, low cost | platform.deepseek.com |
| **NVIDIA NIM** | Self-hosted or build.nvidia.com | build.nvidia.com |
| **Azure OpenAI** | Any resource + deployment | portal.azure.com |
| **OpenAI-compatible endpoint** | Vertex AI, Bedrock-via-LiteLLM, any compatible URL | your endpoint |

Configure at **Settings → Models**. Paste the key, pick the model, send.

## Local models (free, no key)

### Ollama

Best for most users. One-click setup from inside AZMX or:

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1          # general-purpose
ollama pull qwen2.5-coder     # code
ollama pull granite-code      # code, Apache-2.0
```

Then in AZMX: **Settings → Models → Local AI → Ollama** — it auto-detects.

### LM Studio

For users who prefer a GUI model manager. Install LM Studio, start the local server, point AZMX at `http://localhost:1234/v1` (or your custom port).

## Local-only mode

**Settings → Security → "Local-only AI"** refuses every cloud provider at the model-build chokepoint. With this on, even if you have keys configured, no external AI request can be issued. Useful for:

- Air-gapped environments
- Regulated work (no data leaves the device)
- Travel / hotspots

## Spend control

AZMX tracks BYOK spend **on-device** (estimated from each provider's published pricing). The figure never leaves your machine. You can set a monthly budget cap (**Settings → Security → AI spend & budget**) and a warning threshold; cross the budget and AZMX refuses to call cloud models until you raise the cap.

## Adding a new model

If a model is new and AZMX hasn't picked it up yet, you can add it in **Settings → Models → "Add custom model"** for OpenAI-compatible APIs. We also ship a regular `verify-models` task that catches new model IDs from the major providers.

If you want a provider that isn't here, [open a Feature request](https://github.com/AzmxAI/azmx/issues/new/choose).
