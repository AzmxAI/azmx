# Install & setup

This page covers installation per platform, the first-run experience, and the most common things that go wrong. For feature-level documentation see [MANUAL.md](MANUAL.md). For general questions see [FAQ.md](FAQ.md).

---

## macOS

### Requirements
- macOS 10.15 or later.
- Apple Silicon recommended for local AI inference (Metal acceleration). Intel works but inference is CPU-bound.

### Install
1. Download `AZMX.AI_<version>_aarch64.dmg` (Apple Silicon) or `_x64.dmg` (Intel) from the [latest release](https://github.com/AzmxAI/azmx/releases/latest).
2. Open the `.dmg` and drag **AZMX AI** to **Applications**.
3. Launch from Applications.

### First-launch quarantine
The build is ad-hoc-signed but not notarized (yet). On first launch macOS may show:

> "AZMX AI" cannot be opened because the developer cannot be verified.

Resolve by either:
- **Right-click the app → Open** → confirm. macOS remembers the choice.
- Or **System Settings → Privacy & Security → "Open Anyway"** after the first failed launch.

### Uninstall
Drag **AZMX AI** from Applications to the Trash. To also remove configuration:

```
rm -rf "$HOME/Library/Application Support/app.azmx.ai"
rm -rf "$HOME/Library/Caches/app.azmx.ai"
```

(API keys live in `~/Library/Application Support/app.azmx.ai/secrets.json` — `0600` user-only. They persist if you keep that folder; delete it to wipe them.)

---

## Linux

### Requirements
- A recent X11 or Wayland desktop (GNOME, KDE, etc.).
- `webkit2gtk-4.1` and `gtk3` runtime libraries.
- `libwebkit2gtk-4.1-0` and `libgtk-3-0` on Debian / Ubuntu.

### Install

**AppImage (universal):**
```bash
chmod +x AZMX.AI_<version>_amd64.AppImage
./AZMX.AI_<version>_amd64.AppImage
```
The AppImage bundles its media framework so no codec install is needed.

**Debian / Ubuntu (.deb):**
```bash
sudo apt install ./AZMX.AI_<version>_amd64.deb
```
Dependencies: `libwebkit2gtk-4.1-0`, `libgtk-3-0`. apt will pull them in if needed.

**Fedora / RHEL (.rpm):**
```bash
sudo dnf install ./AZMX.AI_<version>_amd64.rpm
```
Dependencies: `webkit2gtk4.1`, `gtk3`.

### Uninstall
```bash
sudo apt remove azmx-ai      # .deb installs
sudo dnf remove azmx-ai      # .rpm installs
rm -rf ~/.config/app.azmx.ai
rm -rf ~/.cache/app.azmx.ai
```

---

## Windows

### Requirements
- Windows 10 or later (64-bit).
- WebView2 runtime — bundled in the installer; no separate download needed.

### Install
Two installers ship per release:

- **`AZMX.AI_<version>_x64_en-US.msi`** — the recommended installer for most users. Per-user install, no admin required.
- **`AZMX.AI_<version>_x64-setup.exe`** — NSIS installer. Same per-user install model.

Double-click either to install. Launch from the Start menu.

### SmartScreen warning
Windows Defender SmartScreen may warn that the publisher is unverified. Click **More info → Run anyway**. Code-signing certificates are on the roadmap.

### Uninstall
**Settings → Apps → AZMX AI → Uninstall.** To also remove configuration:

```powershell
Remove-Item -Recurse "$env:APPDATA\app.azmx.ai"
Remove-Item -Recurse "$env:LOCALAPPDATA\app.azmx.ai"
```

(API keys live in `%APPDATA%\app.azmx.ai\secrets.json` — readable only by your user account. They persist if you keep that folder; delete it to wipe them.)

---

## First run

When AZMX starts for the first time, it runs a brief 4-step tour. The two AI setup steps are the important ones:

### Option A — Free local AI (recommended for first-time users)

1. On step 2 of the tour, click **Set up local AI**.
2. AZMX opens the **Free local AI** dialog.
3. AZMX detects whether Ollama is already installed. If not:
   - **macOS**: shows `brew install ollama` + a direct download button.
   - **Linux**: shows the `curl -fsSL https://ollama.com/install.sh | sh` one-liner + a download button.
   - **Windows**: opens the official Ollama installer.
4. After installing Ollama, click **I've installed it** — AZMX re-probes `http://localhost:11434/api/tags`.
5. The dialog advances to the model picker. Pick one (Qwen2.5-Coder 7B is recommended for chat). The pull streams in-app — progress bar, transfer speed, ETA.
6. When the bar shows **Done**, AZMX has auto-configured itself. The status bar shows a green **Local · qwen2.5-coder:7b** pill.
7. Send a message in the AI panel. The agent responds. Nothing leaves your machine.

**Hardware notes:**
- M-series Macs and machines with a discrete NVIDIA GPU run 7B Q4 models at 30–80+ tok/s. Pleasant.
- Intel Macs and Windows/Linux CPU-only run 7B at 5–20 tok/s. Functional but slow — consider BYOK for heavy use.

### Option B — Bring your own key

1. On step 3 of the tour, click **Open Settings → AI**.
2. Find the provider you want to use (OpenAI, Anthropic, Google, etc.) in the **API keys** grid.
3. Paste the key. It's written to a private user-only (`0600`) app-local `secrets.json` file in your AZMX data directory — never the OS keychain, `localStorage`, or plain settings.
4. The composer becomes live. You can set the default model from the picker at the top of the same screen.

### Option C — NVIDIA NIM (hosted or self-hosted)

NIM (NVIDIA Inference Microservices) is NVIDIA's OpenAI-compatible inference service. AZMX has a first-class NIM provider.

**Hosted (build.nvidia.com):**

1. Sign up at [build.nvidia.com](https://build.nvidia.com) — there's a free tier with rate limits.
2. Generate an API key starting with `nvapi-…`.
3. In AZMX: **Settings → Models → API keys → NVIDIA NIM → paste**.
4. Top of Models page → **Default model** → pick a NIM model (Llama 3.1 Nemotron 70B is recommended).

**Self-hosted NIM container:**

1. Run your NIM container per [NVIDIA's docs](https://docs.nvidia.com/nim/large-language-models/latest/getting-started.html). The container exposes `/v1/chat/completions`.
2. In AZMX: **Settings → Models** — paste the same `nvapi-…` token (or whatever auth your container needs) in the **NVIDIA NIM** card.
3. Once a key is set, a **NVIDIA NIM endpoint** field appears below the API keys grid. Point it at your NIM container's `/v1` URL (e.g. `https://nim.internal.corp/v1`).
4. Pick a NIM model from the default-model dropdown.

Hosted and self-hosted use the same provider entry — the URL is the only thing that differs.

### Combining the paths

You can configure local AI + BYOK + NIM all at once. AZMX uses whichever model is currently selected — see **MANUAL.md → AI panel → Model picker** for switching between them on a per-conversation basis.

---

## Where data lives

| Item | Location |
| --- | --- |
| **API keys** | App-local `secrets.json` (`0600`, user-only) in the AZMX data dir |
| **Settings / preferences** | `~/Library/Application Support/app.azmx.ai/azmx-settings.json` (macOS) / `~/.config/app.azmx.ai/azmx-settings.json` (Linux) / `%APPDATA%\app.azmx.ai\azmx-settings.json` (Windows) |
| **MCP server configs** | Same dir, `azmx-mcp.json` |
| **AI sessions** | Same dir, `azmx-ai-sessions.json` + `messages:<sessionId>` entries |
| **Recent projects** | Same dir, `azmx-recent-projects.json` |
| **Semantic search index** | `~/.cache/azmx/semantic/` |
| **Ollama models** (if installed) | Owned by Ollama: `~/.ollama/models/` |

To "reset everything" without uninstalling: quit AZMX, delete the support directory above, restart. Keys in the keychain persist unless you remove them manually.

---

## Troubleshooting

### "AZMX AI is damaged and can't be opened" (macOS)
Older release. The fix shipped in v0.7.1+ — download the latest release.

### Blank window on launch
WKWebView blocked the bundled stylesheets. Fixed in v0.8.2+ (`stripCrossoriginFromAssets` Vite plugin). Download the latest release.

### Auto-updater says "no updates available" when there clearly are
Confirm `latest.json` exists on the latest release: visit `https://github.com/AzmxAI/azmx/releases/latest/download/latest.json` — it should return JSON. If 404, the release didn't finalize properly. File an issue.

### Ollama set-up dialog says "Ollama not reachable"
1. Confirm Ollama is running: `ollama serve` in a terminal or check the Ollama app icon in the menu bar / system tray.
2. Confirm port 11434 isn't blocked by a firewall or commandeered by another app: `curl http://localhost:11434/api/tags` should return `{"models":[...]}`.
3. If you changed the Ollama port, update Settings → Models → **Base URL** to match.

### Local AI is slow on my machine
- Confirm you're not running the 14B model on an 8 GB machine — try 7B first.
- On CPU-only systems, consider Qwen2.5-Coder 1.5B for chat or use BYOK for the main composer.
- M-series Macs should be fast — if not, restart Ollama: `pkill ollama && ollama serve`.

### Hard reset
Quit AZMX. Delete the support directory above. Optionally clear keychain entries (search for `azmx-ai`). Restart AZMX — the first-run tour will run again.

---

## Next steps

- **[MANUAL.md](MANUAL.md)** — feature reference, shortcuts, AI workflows, MCP setup.
- **[FAQ.md](FAQ.md)** — questions about privacy, licensing, and performance.
