# Air-gapped operation

> Run AZMX with zero outbound — for regulated, classified, or sovereign environments.

This guide is for operators preparing AZMX for an air-gapped fleet. End-user features work the same; the difference is the network model.

## What "air-gapped" means here

- No outbound to the public internet.
- All AI inference happens **on-device** via local model servers (Ollama / LM Studio).
- License verification is **offline** — no calls to azmx.ai.
- Software updates are **delivered manually** — operator copies the next version onto each machine.
- All MCP connectors talk only to **internal services** within the air-gap boundary.

## Prereqs

- AZMX Enterprise (Customer-rooted trust requires it).
- A local model server reachable on the air-gapped network (or on each device).
- A trusted intermediary machine ("transfer station") that can fetch from `github.com/AzmxAI/azmx/releases` and copy to the air-gap.

## One-time setup

### 1. Pin Local-only AI on the fleet

In your **org policy file** (Settings → Security → Org policy file, or deploy via MDM):

```json
{
  "localOnlyAi": true,
  "agentAllowShell": true,
  "approvalPolicy": "standard",
  "blockedPathPatterns": ["*.kubeconfig", "vault.yaml", "/secrets/"]
}
```

Place at `~/.azmx/org-policy.json` on every device. AZMX picks it up on launch; the user can't relax these centrally-pinned values.

### 2. Set up the local model server

```bash
# On each device or on a shared internal server reachable from devices
ollama serve --host 0.0.0.0:11434
ollama pull qwen2.5-coder
ollama pull llama3.1
```

In AZMX: **Settings → Models → Local AI → Ollama** — point at the shared server URL or `http://localhost:11434`.

### 3. Self-host the license issuer

Stand up the license issuer per the Enterprise integration docs (received via **sales@azmx.app**). Your operator team signs licenses with **your own Ed25519 keypair** — AZMX's signer is removed from the path.

Distribute the new public-key set to every device via the org policy:

```json
{
  "altIssuerPubkeys": ["..."]
}
```

### 4. Disable the public update channel

In the org policy:

```json
{
  "updateChannel": "manual"
}
```

AZMX no longer hits `releases/latest/download/latest.json` on the public network. The user-facing **Settings → About → "Check for updates"** button is hidden.

## Manual updates

To upgrade an air-gapped fleet:

1. From the transfer station, download the new installer + manifest from this repo's releases.
2. Copy them onto a known location on each device (e.g. `/opt/azmx/updates/`).
3. Run the installer the normal way.
4. AZMX boots, verifies the signed manifest against the embedded (or customer-rooted) public key, applies.

## Verification

After setup, validate:

- **Settings → Privacy & network** shows "Local" for Outbound AI calls, "Manual" for Software updates, "Local" for Work plane.
- **Settings → Security** shows Local-only AI on, the path patterns enforced, the alt-issuer pubkeys recognized.
- **Settings → License** shows your customer-rooted issuer in the trust chain.
- **OS firewall** can block `azmx-ai.app` outbound entirely without breaking the user experience. By design.

## Common questions

### Can we use SCIM / SAML in an air-gapped network?
Yes — SCIM + SAML are operator-controlled endpoints. Point them at your internal Okta / AD / Keycloak. No public-internet dependency.

### How do we ship audit logs to our SIEM?
The local hash-chained audit log exports to JSONL. Configure your SIEM forwarder (Splunk Universal Forwarder, Datadog Agent, an OTel collector) to tail `azmx-audit.json`.

### How do we sync between two air-gapped machines?
Sync requires a blob endpoint. Two options: (a) stand up an internal R2-compatible bucket within the air-gap and point Sync at it, or (b) use the manual **Settings → Data → Encrypted backup** flow — move the `.azmxenc` file between machines via your existing secure transport (USB, internal SMB, etc.).

### Compliance evidence?
The Enterprise compliance pack (SBOM + SOC 2 + DPA + signed compliance manifest endpoint) is delivered with your purchase. Request via **sales@azmx.app**.

## Support

Air-gapped contracts include named SLA support. Your support contact ships with the contract. For pre-sales technical questions, **enterprise@azmx.app**.
