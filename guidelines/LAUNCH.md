# Launch playbook

> What to do when a major version ships. The goal is to convert one "release happened" event into the maximum number of net-new users, stars, and conversations.

This playbook is for **major** launches (a 0.x → 0.y bump with a genuinely new capability). Patch releases get a tweet + a discussion post; that's it.

## T-minus 2 weeks

### Demo asset
- [ ] **Record a 6–10s demo GIF** of the new capability. The asset that sells the launch. Loops cleanly, no narration needed, makes a viewer say "I want that."
- [ ] **A 60–90s explainer video** for the website hero + YouTube. Voice-over optional; product-doing-thing visuals mandatory.
- [ ] **A 3–5s "thumbnail" hero image** for Twitter / LinkedIn / OG previews.

### Copy
- [ ] **Show HN title** — under 80 chars, no "Show HN: AZMX — the…" filler. Lead with the user value. E.g. "Show HN: AZMX – an AI terminal that never sends your code to the cloud".
- [ ] **HN body** — 4 short paragraphs: what it is, why we built it, the privacy/free-local angle, how to install. End with a question for the reader ("what would make this useful for your workflow?"). Never end with "thanks!".
- [ ] **ProductHunt tagline** (60 chars), description (260 chars), gallery (5 images + 1 GIF).
- [ ] **Twitter/X thread** — 6 tweets max. Tweet 1 = visceral problem statement. Tweets 2–4 = capability + demo clip. Tweet 5 = how to install. Tweet 6 = call-to-action ("star + try").
- [ ] **LinkedIn post** — same shape, longer-form, tagged with 5 relevant accounts.
- [ ] **Blog post** at `azmx.ai/blog/<slug>` — engineering deep-dive on a hard problem solved in this release. 800–1500 words.
- [ ] **Release notes** on the GitHub release page — bullet list of changes + thank-you list for contributors.

### Distribution surfaces
- [ ] Update README hero with the new tagline + screenshot.
- [ ] Update `docs/ROADMAP.md` — move shipped items to "shipped", surface the next themes.
- [ ] Update `guidelines/SHOWCASE.md` with this cycle's featured community work.
- [ ] Pre-write replies to the 20 most-likely HN comments (do this for real — the comments matter more than the post).
- [ ] Make sure the auto-updater manifest is published BEFORE the launch posts (`releases/latest/download/latest.json` must resolve to the new tag).

## T-minus 3 days

### Internal validation
- [ ] **Eat your own food.** Use the new feature for ≥3 hours of real work yourself. Find the embarrassing bug.
- [ ] **3 friendly testers** with their own ~30 min of use. Take their bug list seriously — fix the top 3.
- [ ] Run the full installer chain on a CLEAN VM per platform — Apple Silicon, Intel, Linux x86_64, Windows. The launch fails on day 1 if "the installer doesn't launch on macOS Ventura" is the top comment.

### Reach-outs
- [ ] **Email 5 dev YouTubers** (a curated, personal note — never a bulk template) offering early access + a complimentary Teams license for review purposes. Don't expect a "yes" — one in five is realistic.
- [ ] **DM 10 dev influencers** on Twitter/X whose audience overlaps. Same shape: personal note, real reason you think they'd care.
- [ ] **Email 3 newsletters** (TLDR, ChangeLog, JavaScript Weekly, Rust Weekly) with a 50-word pitch + a 15-second clip.
- [ ] **Notify your existing users** (the in-app updater) that vN.0 is out — but only if the update represents real value. Don't burn that channel for patches.

## Launch day

### Pacing
- **Sunday 9:00 AM PT / 12:00 PM ET / 5:00 PM UK** = best time for Show HN. Tuesday/Wednesday 12:01 AM PT = ProductHunt.
- Do **one** launch surface per day. ProductHunt Tuesday → wait → Show HN Sunday. Spreading lets each one breathe and lets you respond to comments.

### The 4-hour window
- **First 4 hours of Show HN matter most.** Be at your keyboard. Reply to every comment. Be brief, direct, no PR voice.
- Pre-positioned tweets fire at +0, +1h, +4h linking the post.
- Anyone who emails you about the launch — respond same day, even if briefly.

### What to NOT do
- **Don't beg for upvotes.** HN auto-detects + downranks vote rings.
- **Don't reply defensively to negative comments.** "That's fair — we don't support X today; here's the tradeoff" wins over "actually you're wrong".
- **Don't drop and run.** A launch where the founder vanishes after posting is the most common reason a Show HN dies on page 2.

## Launch +24h

- [ ] **Aggregate metrics** — stars, downloads, signups, Pro trial activations. Compare against the prior launch.
- [ ] **Triage the new issue tracker activity** — bugs that came out of the launch get priority for the next patch.
- [ ] **Thank everyone** who covered the launch with a personal note.

## Launch +1 week

- [ ] **Post-launch blog post** — "What we learned shipping vN" with honest numbers + the one thing that surprised us most.
- [ ] **Email any contact who showed interest but didn't convert** — once, briefly, no follow-up.
- [ ] **Schedule the next launch.** Cadence matters — 4–8 weeks between majors keeps mindshare without burning out.

## What to track

| Metric | Why it matters | Target for a "good" launch |
|---|---|---|
| Show HN points after 4h | Position on front page | ≥ 50 |
| Show HN comments after 24h | Engagement quality | ≥ 30 |
| ProductHunt rank after 24h | Surface for dev tooling | Top 3 of day |
| GitHub stars in launch week | Discovery → action conversion | +1,000 |
| Total downloads in launch week | Actual usage | +5,000 |
| Pro trial activations | Commercial signal | ≥ 1% of downloads |
| Press / podcast mentions | Compounding visibility | ≥ 2 |

## What absolutely must NOT break on launch day

- The download link
- The install command (`brew`, `curl`, `winget` — or fallback to release)
- The auto-updater on existing installs
- The website (`azmx.ai`)
- The Pro checkout flow
- The license activation flow
- The first 60s of the new-user experience

If any of these has a P1 bug, **delay the launch by a day**. A launched-but-broken product loses 10× the goodwill it gains.

## Long-tail (the boring stuff that compounds)

- [ ] **Add to every relevant awesome-list** — awesome-llm, awesome-cli-apps, awesome-mac-apps, awesome-ai-agents, awesome-developer-tools, awesome-mcp-servers. Slow drip of ~50–200 stars/week.
- [ ] **Comparison content** — "AZMX vs Cursor", "AZMX vs Claude Code", "AZMX vs Warp + Aider". One per quarter. SEO compounds.
- [ ] **Sponsor adjacent OSS** — $100–500/mo to llama.cpp, Ollama, MCP servers. Goodwill is downstream of generosity, not adjacent to it.
- [ ] **Conference talk pitches** — KubeCon, RustConf, JSConf, AI Engineer Summit. Even an unaccepted talk often gets you a hallway conversation that matters.

## After 12 months

If the loop is working you should have:

- 10K+ stars (top-100 dev tool repo)
- 100K+ downloads
- 50+ community-contributed skills / agents / MCP servers / snippets
- 5+ press mentions worth screenshotting
- A real Discord/Slack with daily activity
- A predictable launch rhythm (4–8 weeks between majors)

If the loop **isn't** working, the symptom is "we shipped great features and nothing happened." Re-read this playbook and check which steps were skipped. Almost always: the demo asset wasn't strong enough, or the founder didn't show up in the comments.

The product matters most — but distribution is half the job. Both, or neither.
