# winget manifests

> Ready-to-submit Microsoft winget manifest set for AZMX AI. Three YAML files following the [winget-pkgs v1.6 schema](https://github.com/microsoft/winget-cli/blob/master/doc/ManifestSpecv1.6.md).

After acceptance, Windows users can install with:

```cmd
winget install AzmxAI.AZMX
```

## Files

| File | Purpose |
|---|---|
| `AzmxAI.AZMX.yaml` | Version manifest (top-level pointer) |
| `AzmxAI.AZMX.installer.yaml` | Installer manifest (URL + SHA256 + install modes) |
| `AzmxAI.AZMX.locale.en-US.yaml` | Default-locale manifest (description, tags, links) |

## How to submit each new version

1. **Fork** [`microsoft/winget-pkgs`](https://github.com/microsoft/winget-pkgs).
2. **Bump** all three files for the new version — `PackageVersion`, the `InstallerUrl`, and the `InstallerSha256`. Verify the SHA against the released artifact:
   ```bash
   curl -fSL https://github.com/AzmxAI/azmx/releases/download/vN.N.N/AZMX.AI_N.N.N_x64_en-US.msi | sha256sum
   ```
3. **Copy** the three files into the right path inside your fork:
   ```
   manifests/a/AzmxAI/AZMX/<version>/AzmxAI.AZMX.yaml
   manifests/a/AzmxAI/AZMX/<version>/AzmxAI.AZMX.installer.yaml
   manifests/a/AzmxAI/AZMX/<version>/AzmxAI.AZMX.locale.en-US.yaml
   ```
4. **Validate** locally:
   ```bash
   winget validate --manifest manifests/a/AzmxAI/AZMX/<version>
   ```
5. **Open a PR** against `microsoft/winget-pkgs` main. The bot runs automated checks; expect 1–7 days for human review.

## Automate on every release

Once the first submission lands, future releases can auto-PR using [vedantmgoyal9/winget-releaser](https://github.com/vedantmgoyal9/winget-releaser) inside the existing `release.yml` workflow. Drop in:

```yaml
- name: Submit to winget
  if: success() && !github.event.release.prerelease
  uses: vedantmgoyal9/winget-releaser@v2
  with:
    identifier: AzmxAI.AZMX
    installers-regex: 'AZMX\.AI_.*_x64_en-US\.msi$'
    token: ${{ secrets.WINGET_TOKEN }}
```

(`WINGET_TOKEN` is a PAT with `public_repo` scope on a personal account that forks `winget-pkgs` for the bot.)

## Notes

- **InstallerType: wix** — AZMX ships an MSI built with WiX; this is the right type.
- **Scope: machine** — installs for all users (matches what the MSI does).
- **Architecture: x64** — Windows builds are x86_64 only today. ARM64 will be added when those binaries ship.
- **License: Proprietary** — the application is proprietary; the winget manifest itself is free to use.
