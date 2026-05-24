# Compliance

> What we have, in plain language. The legally-binding artifacts are in the Enterprise compliance pack — request via **sales@azmx.app**.

## SBOM (Software Bill of Materials)

Every release ships a **signed CycloneDX 1.5 SBOM** that enumerates every direct and transitive dependency of the application — npm side and cargo side — with version, license, hash. Attached to each tagged release on this repo. Verifiable with the bundled `verify:sbom` task.

## SOC 2

AZMX maintains a SOC 2 Type II posture. The attestation report and the policies that back it (Access Control, Change Management, Incident Response, Vendor Management, Data Retention, Business Continuity) are available under NDA via **sales@azmx.app**.

## DPA (Data Processing Addendum)

Required by GDPR for any EU-based customer processing personal data through AZMX. Standard sub-processor list + the technical-and-organizational measures. Available on request.

## FIPS 140-3

The Enterprise build uses an allowlist evaluator that restricts the application to FIPS-approved cryptographic primitives. Required by some U.S. federal procurement.

## PIV / CAC

The Enterprise build supports U.S. federal smart-card authentication — X.509 trust evaluator, challenge issuance, RSA-SHA256 + ECDSA-SHA256 verification.

## SCIM 2.0

Teams+ supports SCIM Users provisioning from Okta, Azure AD, Google Workspace, and any standards-compliant IdP. RFC 7644 + RFC 7643.

## SAML 2.0 SSO

Teams+ supports SAML SP — AuthnRequest, Response parsing, IdP certificate + issuer pinning, full XML-DSig SignatureValue + DigestValue verification. Standard `/sso/metadata` endpoint for IdP auto-configuration.

## Audit export

The hash-chained local audit log exports to **JSONL** suitable for Splunk, Datadog, or any OTel forwarder. Each export page is signed with your fleet's key (Teams+) so the receiving SIEM can verify integrity.

## Air-gapped

Enterprise customers can run AZMX entirely offline:

- **Self-hosted license issuer** with customer-rooted trust — your own Ed25519 keypair.
- **Offline activation + renewal** — receipt + token verify without the network.
- **Customer-pinned MCP allowlist** — fleet sees only the connectors you approve.
- **Local-only AI lock** — every cloud provider refused at the model-build chokepoint.
- **No outbound from the app by default** — updater, attribution beacons, all toggle-able.

## Signed manifests

Every release publishes a **signed update manifest** (`releases/latest/download/latest.json`) — the auto-updater verifies the signature against an embedded Ed25519 public key before applying the binary. Customer-rooted Enterprise builds verify against your key.

## Compliance manifest endpoint

Operators can fetch `/compliance/manifest` from the fleet's license issuer — a signed JSON description of the running policy + key fingerprints + feature flags. Useful for periodic compliance evidence collection.

## Penetration testing

Annual third-party pentest. Findings and remediation are summarized in the SOC 2 report.

## Vulnerability disclosure

[`SECURITY.md`](../SECURITY.md). 24-hour acknowledgement, public credit on request, no retaliation.

## Open questions

- **HIPAA**: not currently certified. The architecture is compatible (no PHI ever touches AZMX infrastructure) but BAA + attestation aren't done yet.
- **ISO 27001**: scoped, not yet attested.
- **CSA STAR**: not in scope today.

If your procurement gate needs something not listed, ask — we've answered most things.
