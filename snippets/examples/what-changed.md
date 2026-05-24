---
handle: what-changed
description: Summarize a diff by purpose — useful for PR descriptions, standups, daily logs.
metadata:
  type: snippet
  category: review
---

# What changed

For when you've just made a multi-purpose change and need to describe it in three lines.

## Prompt

Read the staged + unstaged diff. Group the changes by purpose (not by file). For each group:

- One subject line summarizing it ("Fix login redirect on session expiry").
- 1–2 bullets of detail — the "why", not the "what" (the diff is the what).
- The user-visible effect, if any.

Output in this shape:

```
Group 1: <subject>
- <why>
- <user-visible effect, if any>

Group 2: <subject>
- ...
```

If there's only one purpose, say so explicitly — don't fabricate a second group.
