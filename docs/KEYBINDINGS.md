# Keybindings

> Every shortcut AZMX ships with, by category. All are rebindable in **Settings → Shortcuts**.

Notation: `⌘` (Cmd on macOS, Ctrl on Linux/Windows), `⇧` (Shift), `⌥` (Alt/Option), `⌃` (Control), `↵` (Enter).

## The five-and-one

Memorize these. They cover most of AZMX.

| Keys | Action |
|---|---|
| `⌘K` | **Command palette** — jump to anything |
| `⌘P` | **Quick-open** any file in the project |
| `⌘O` | **Open / switch project folder** |
| `⌘;` | **Ask AI to generate a shell command** |
| `⌘I` | **Toggle the AI side-panel** |
| `⌘,` | **Open Settings** |

## AI panel

| Keys | Action |
|---|---|
| `⌘I` | Toggle the panel |
| `⌘↵` | Send message (when composer is focused) |
| `⇧↵` | Newline in composer |
| `Esc` | Cancel pending agent run |
| `@` | Mention picker — files, diffs, PRs, errors, snippets, todos, MCP resources |
| `#` | Snippet picker — saved templates + commands |
| `/` | Slash-command picker — `/init`, `/commit`, `/review`, `/test`, `/docs`, … |
| `⌘⇧K` | New AI chat session |
| `⌘\\` | Switch between chat sessions |

## Terminal

| Keys | Action |
|---|---|
| `⌘T` | New terminal tab |
| `⌘W` | Close terminal tab |
| `⌘⇧]` / `⌘⇧[` | Next / previous tab |
| `⌘⇧D` | Split pane horizontally |
| `⌘D` | Split pane vertically |
| `⌘K` (in terminal) | Clear terminal |
| `⌘F` | Find in terminal buffer |

## Editor

| Keys | Action |
|---|---|
| `⌘P` | Quick-open file |
| `⌘⇧F` | Search across project |
| `⌘S` | Save |
| `⌘Z` / `⌘⇧Z` | Undo / redo |
| `⌘/` | Toggle line comment |
| `⌥↑` / `⌥↓` | Move line up / down |
| `⌘D` | Add next occurrence to selection (multi-cursor) |
| `Tab` (when ghost-text shown) | Accept inline AI autocomplete |
| `Esc` | Dismiss inline autocomplete |

## File explorer

| Keys | Action |
|---|---|
| `⌘N` | New file |
| `⌘⇧N` | New folder |
| `↵` | Open selected file |
| `⌘↵` | Open in new editor tab |
| `Space` | Preview |
| `F2` | Rename |
| `Backspace` | Move to trash (with confirm) |

## Window

| Keys | Action |
|---|---|
| `⌘⇧P` | Toggle panel layout (side / bottom) |
| `⌘⇧E` | Focus file explorer |
| `⌘1` | Focus terminal |
| `⌘2` | Focus editor |
| `⌘3` | Focus AI panel |
| `F11` (Linux/Windows) / `⌃⌘F` (macOS) | Fullscreen |

## Vim mode

Toggle via **Settings → General → Vim mode**. When on, the editor uses CodeMirror's vim emulation — `:w`, `:q`, hjkl, visual mode, etc.

## Rebinding

**Settings → Shortcuts** lists every action. Click a row, press a new chord, save. Conflicts are detected and surfaced. Reset-to-default per binding or wholesale.

Workspace-level overrides (per project) and team-level overrides (Teams via the org-policy file) are coming.
