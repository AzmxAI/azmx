# Translating AZMX into a new language

> The first-run onboarding card auto-detects the user's language. Five languages ship today — help us reach the next billion users.

## Where translations land

The "First steps" onboarding card (`Welcome! Let's get you set up.`) is the highest-impact in-app translatable surface. It's the first thing a new user sees.

Currently seeded: **English · Mandarin · Hindi · Spanish · Arabic** (~5B native speakers).

Next priority languages:

- **Bengali** (`bn`) — 270M speakers
- **Portuguese** (`pt`) — 260M
- **Russian** (`ru`) — 260M
- **Japanese** (`ja`) — 125M
- **German** (`de`) — 130M
- **French** (`fr`) — 280M
- **Indonesian** (`id`) — 200M
- **Korean** (`ko`) — 80M
- **Vietnamese** (`vi`) — 75M
- **Italian** (`it`) — 60M
- **Turkish** (`tr`) — 80M
- **Polish** (`pl`) — 40M

If your native language isn't listed, send a PR anyway — we want broad coverage.

## What to translate

Eight short strings. Concrete, action-first, no jargon. Tone: friendly, warm, professional — like a knowledgeable friend setting things up for you.

| Key | English source | Notes |
|---|---|---|
| `title` | "Welcome! Let's get you set up." | One short sentence. Welcoming. |
| `ai.label` | "Connect to AI" | Verb-first imperative. |
| `ai.sub` | "Pick where AZMX talks to." | One short sentence explaining what the click does. |
| `ai.cta` | "Set it up" | Button label, 1–3 words. |
| `ai.done` | "AI connected" | Past-tense state when the step is complete. |
| `project.label` | "Open your project" | |
| `project.sub` | "Show AZMX what you're working on." | |
| `project.cta` | "Pick a folder" | |
| `project.done` | "Project open" | |
| `skip` | "Skip — I'll figure it out" | Lighthearted opt-out. |

## How to submit

1. **Fork this repo.**
2. **Open a Discussion or Issue** titled `i18n: <language name>` so we can coordinate (avoid two people doing the same one).
3. **Write the translation** as a comment in the issue OR as a PR adding a file at `guidelines/translations/<locale>.md` with this shape:

```markdown
# <Language name>

- locale: <ISO 639-1 code, e.g. bn>
- rtl: <true if right-to-left, else false>
- native-speaker-reviewed: <your name or @handle>

| Key | Translation |
|---|---|
| title | … |
| ai.label | … |
| ai.sub | … |
| ai.cta | … |
| ai.done | … |
| project.label | … |
| project.sub | … |
| project.cta | … |
| project.done | … |
| skip | … |
```

4. We'll route the strings into the in-app i18n file and credit you in release notes.

## Quality bar

- **Native speaker review.** Machine translation alone isn't enough — local idiom matters. If you've used a machine to draft, get one native-speaker review before submitting.
- **No literal translation.** "Let's get you set up" doesn't translate well word-for-word into most languages. Optimize for natural cadence + the same warmth.
- **No tech jargon.** "API key" is jargon even in English. Use plain words ("AI account", "where AZMX talks to").
- **Gender neutrality.** Where the target language has grammatical gender, prefer the most-inclusive form available.
- **RTL languages** (Arabic, Hebrew, Persian, Urdu) need the `rtl: true` flag. The card swaps direction automatically.

## What we won't accept

- Auto-translation pasted unchanged.
- Translations that change the tone (e.g. casual English → corporate target).
- "Funny" or meme-y translations that don't survive a year.
- Translations that omit the "Skip" affordance — accessibility-critical.

## Beyond the onboarding card

Once the onboarding card is multilingual, the next surfaces in priority order:

1. The 5-step welcome tour
2. Approval-policy descriptions
3. The settings menu labels
4. The empty-state placeholder strings ("Ask anything, or type / for commands…")
5. Error messages

We'll tackle these together as translator interest emerges. Express interest in a Discussion.

## Credit

Every translator is credited in:

- The release notes for the version that introduces the language
- An `i18n-credits.md` we'll publish once we have ≥ 5 community translators
- The annual community thank-you post

Thank you. Reaching someone in their own language is a thing software rarely does well — we want to do it well.
