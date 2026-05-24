# Recipes

> Real workflows. Copy + adapt.

## Draft a release commit

In any git repo:

```
/commit
```

The agent reads `git status` + `git diff --cached`, drafts a focused commit message in your repo's style (it samples `git log` for tone), and shows it for you to approve before running `git commit`.

## Explain the last terminal error

Run anything → it fails → press `⌘I` → click the **Explain the last error** suggestion. The agent reads the recent terminal buffer and points at the line + the likely fix.

## Generate a shell command from intent

Press `⌘;`, describe what you want ("show the 20 largest files under /var"), get back a command. Approve to run inline.

## Review the diff before push

```
/review
```

Agent reads the staged + unstaged diff, surfaces correctness bugs at the requested effort level (`low` / `medium` / `high` / `max`), comments inline if you pass `--comment` on a PR branch.

## Bootstrap a new repo with project memory

In a fresh clone:

```
/init
```

The agent walks the tree, samples the surface area, and writes an `AZMX.md` to the workspace root — a load-on-open memory file similar to `AGENTS.md` / `CLAUDE.md`. Every future agent turn in that repo picks it up automatically.

## Debug an OOM on an NVIDIA box

```
@error (the OOM stack trace pasted in)
@file the_script.py
What batch size would fit on a 24GB GPU? Use nvidia-smi to check live state.
```

If the `nvidia` connector is enabled, the agent reads `nvidia-smi`, models the headroom, and proposes a batch size that fits.

## Generate a production Dockerfile

```
/dockerfile
```

Reads `package.json` / `Cargo.toml` / `pyproject.toml`, picks the right base image, multi-stages it, hardens permissions, drops a `.dockerignore`.

## Refresh a stale README

```
/readme
```

Reads the current `README.md`, the project's `package.json` description, recent commit messages, and the public surface. Proposes an updated README — you approve diff-by-diff.

## Scan for leaked secrets

```
/secscan
```

Walks the diff (or full tree if `--all`) for high-confidence secret patterns. The on-device DLP secret-egress guard catches these before they reach the AI; this command surfaces ones that are already committed.

## Threat-model a change

```
/threat-model
```

Reads the diff, surfaces the trust boundaries crossed, lists the new attack surface in plain language. Useful before merging a security-sensitive change.

## Cross-device sync your settings (Pro)

**Settings → Sync → Pick a passphrase → Enable**. From a second device: enter the same passphrase, paste the recovery receipt you got at sign-up, accept the preview. Everything except API keys flows.

## Air-gapped install (Enterprise)

1. Download installers + the auto-updater manifest on a connected machine.
2. Move the `.dmg` / `.AppImage` / `.msi` and `latest.json` onto the air-gapped device.
3. Install, then drop the manifest at the path AZMX expects (Settings → Privacy → Software updates shows the location).
4. License via the offline trust evaluator using your customer-rooted issuer.

## Contribute a recipe

Got one that works? PR it into this file. Recipes get used by everyone.
