# Uninstall

> How to fully remove AZMX. Your data and keys are kept until you delete them — uninstalling the binary leaves the data dir behind unless you tell it not to.

## macOS

```bash
# Quit AZMX first
osascript -e 'quit app "AZMX AI"' 2>/dev/null || true

# Remove the app
rm -rf "/Applications/AZMX AI.app"

# Remove user data (settings, sessions, secrets, audit log, …)
rm -rf "$HOME/Library/Application Support/app.azmx.ai"

# Remove cache (code-graph index)
rm -rf "$HOME/Library/Caches/app.azmx.ai"

# Remove window state + autostart entries
rm -rf "$HOME/Library/Saved Application State/app.azmx.ai.savedState"
launchctl unload -w "$HOME/Library/LaunchAgents/com.azmx.autostart.plist" 2>/dev/null || true
rm -f "$HOME/Library/LaunchAgents/com.azmx.autostart.plist"
```

To keep your data + keys for a re-install later, skip the `Application Support` line.

## Linux

```bash
# Quit AZMX first
pkill -x azmx || true

# AppImage: just delete the file
rm -f ~/Downloads/AZMX-AI-*.AppImage    # or wherever you put it

# .deb: remove the package
sudo apt remove azmx-ai

# Remove user data
rm -rf "$HOME/.config/app.azmx.ai"

# Remove cache
rm -rf "$HOME/.cache/azmx"

# Remove autostart entry
rm -f "$HOME/.config/autostart/azmx-ai.desktop"
```

## Windows

```powershell
# Quit AZMX first
Stop-Process -Name "azmx" -Force -ErrorAction SilentlyContinue

# Uninstall via Control Panel: Apps & features → AZMX AI → Uninstall
# Or via msiexec:
msiexec /x "$env:USERPROFILE\Downloads\AZMX-AI-Setup.msi" /quiet

# Remove user data
Remove-Item -Path "$env:APPDATA\app.azmx.ai" -Recurse -Force

# Remove cache
Remove-Item -Path "$env:LOCALAPPDATA\app.azmx.ai" -Recurse -Force

# Remove autostart entry
Remove-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "AZMX AI" -ErrorAction SilentlyContinue
```

## What an uninstall removes

- The application binary itself.
- (When you also wipe the data dir) Your settings, sessions, todos, snippets, agent memory, audit log, MCP server configs, license token, **API keys**.
- (When you also wipe the cache dir) The code-graph + semantic search index. Rebuilt on next index.

## What an uninstall does NOT remove

- The Ollama install — that's separate, manage via Ollama's own uninstaller.
- LM Studio — same.
- Any external tool the connectors used (`kubectl`, `gh`, `aws`, etc.) — system tools, you installed them.
- Files outside AZMX — your code, your repos, your terminal history.

## Pro / Teams / Enterprise notes

- **License token** lives in the data dir as `license.json`. Deleting the data dir wipes it. The activation receipt on Polar (or your self-hosted issuer) is still valid — re-activate on the same machine without losing your subscription.
- **Sync (Pro)** — uninstalling on one device doesn't affect sync on others. They keep working. To stop sync entirely, **Settings → Sync → Turn off** before uninstall.
- **Org-policy file** (Teams) — placed at `~/.azmx/org-policy.json`; not in the AZMX data dir. Remove separately if needed.

## Re-installing later

Just install the latest release and (if you kept your data dir) AZMX comes back exactly where you left off — same settings, same sessions, same memory tree, same trial-time-remaining, same license. The data dir is fully portable.
