# Docs style

> How we write across this repo. Read this before opening a doc PR.

## Audience

Mid-experience developer who's never used AZMX. Reading the docs is in front of a terminal, not on a beach. They want answers, not theory.

## Voice

- **Direct.** "Press ⌘O" not "You can press ⌘O".
- **Active.** "AZMX writes the key to `secrets.json`" not "the key is written to `secrets.json`".
- **Confident.** "This is the right shape" not "We think this might be a reasonable approach".
- **Honest.** "This doesn't work yet" not "this is in beta with quality issues".
- **Brief.** Cut a third of any first draft.

We talk like a knowledgeable colleague, not a marketing department.

## Capitalization

- **AZMX**, **AZMX AI** — always caps.
- **Pro**, **Teams**, **Enterprise**, **Free** — capitalized when naming a tier.
- **macOS**, **iOS**, **PostgreSQL** — official brand casing.
- **GitHub**, **Markdown**, **JavaScript**, **TypeScript** — official casing.
- **Internet** — lowercase ("internet").

## Numbers

- **0–9** spelled out (one, three, seven) **except** when paired with a unit ("7 MB", "5 days").
- **10+** as digits.
- **Percentages** as digits ("80%", not "eighty percent").
- **Byte sizes** with binary or SI prefixes, no preference — be consistent within a doc.

## Code blocks

- Use language hints (` ```bash`, ` ```typescript`, ` ```json`).
- One command per line in shell blocks. No `&&`-stacks unless they're idiomatically grouped.
- Show the prompt only when context demands it. Default to no prompt prefix.
- Long output → truncate with `…` rather than copy-paste 200 lines.

## Headers

- ATX-style (`#`, `##`, `###`) not Setext (`====`).
- Sentence case — "Where data lives", not "Where Data Lives".
- One blank line above + below.

## Links

- Inline `[label](url)` not reference-style — easier to grep.
- Internal links use relative paths (`[`MANUAL.md`](MANUAL.md)`).
- External links are full HTTPS URLs.

## Emphasis

- **Bold** for in-flow product names, tier names, key terms on first use.
- *Italic* sparingly for emphasis only — never for product names.
- `code` for filenames, paths, env vars, commands, JSON keys.

## Tables

- Use them for genuine matrices (feature × tier, key × value).
- Don't use them for two-column lists where a bulleted list would work better.
- Headers always present (`| --- | --- |`).

## What not to include

- **Internal code names**, **IPC command names**, **Rust function names**, **TS module paths**.
- **Specific signing key handling**, **license format internals**, **the underlying app framework**.
- **Roadmap PR numbers**, **internal Slack channels**, **founder personal handles**.
- **Specific Cloudflare endpoints**, **D1 database IDs**, **R2 bucket names**.
- **Anything that would help an attacker** — be conservative.

## What to always include

- A "see also" pointer at the end of every doc.
- The tier where a feature lands (Free / Pro / Teams / Enterprise).
- Concrete examples for any abstract claim.

## Markdown quirks

- Use `>` for callouts (advisory) — one line.
- Use `> **note**` only for genuinely tangential information.
- Numbered lists when sequence matters; bullet lists when it doesn't.
- Inline `<details><summary>` only for the longest collapsible content.

## Examples

### Tight

> Press `⌘O` to switch projects. AZMX remembers the last 20.

### Loose (rewrite this)

> You can use the keyboard shortcut ⌘+O in order to open the project switcher dialog box, which will display a list of recently-used projects (up to 20 of them are remembered automatically for your convenience).

### Better

> ⌘O switches projects. The 20 most-recent are listed.

## Reviewing your own doc

Read it out loud. If a sentence makes you stumble, rewrite.

Search for these and reconsider:

- "very", "really", "extremely" — almost always cut
- "simply", "just", "easily" — patronizing; cut
- "powerful", "robust", "elegant" — marketing-speak; cut or replace with a concrete claim
- "etc." — usually means "I didn't finish the list"; finish or cut
- "leverage" — say "use"
- "utilize" — say "use"
- "in order to" — say "to"

## When in doubt

Read the existing docs. Match the cadence. Ask in a PR comment if a style choice isn't covered here.
