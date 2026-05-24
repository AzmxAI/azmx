---
name: rust-error-handling
description: Pick the right Rust error pattern for the call site — anyhow, thiserror, or hand-rolled enums.
metadata:
  type: skill
  category: code
---

# Rust error handling

When the user is writing or reviewing Rust error types, load this skill.

## The decision tree

- **Binary code (`main`, build scripts, CLIs):** prefer `anyhow::Error` everywhere. Cheap, ergonomic, carries context, prints well.
- **Library code (a crate others depend on):** use `thiserror`-derived enums. Stable shape, downstream users can `match` on variants, no `anyhow` in your public API.
- **Hot loop / no-alloc contexts:** custom enum without `Box<dyn Error>`. Numeric or `&'static str` payloads.
- **You're prototyping and haven't decided yet:** `anyhow`. Refactor later — it costs nothing to start there.

## With `anyhow`

```rust
use anyhow::{Context, Result};

fn load_config(path: &Path) -> Result<Config> {
    let raw = std::fs::read_to_string(path)
        .with_context(|| format!("read {}", path.display()))?;
    let cfg: Config = serde_json::from_str(&raw)
        .with_context(|| format!("parse {}", path.display()))?;
    Ok(cfg)
}
```

The `.with_context(|| …)` adds a layer the user can see in the printed chain. Closure form avoids the allocation when there's no error.

## With `thiserror`

```rust
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ConfigError {
    #[error("read {path}: {source}")]
    Read { path: PathBuf, #[source] source: std::io::Error },

    #[error("parse {path}: {source}")]
    Parse { path: PathBuf, #[source] source: serde_json::Error },

    #[error("missing required field `{0}`")]
    Missing(&'static str),
}
```

Downstream callers can `match cfg_err { ConfigError::Missing(_) => … , _ => bubble }`. Stable across versions.

## Avoid

- **`unwrap()` / `expect()` in library code.** Panics aren't recoverable for the caller. Reserve for "this can't happen by construction" with a comment.
- **Stringly-typed errors.** `Err("bad input".to_string())` loses type information forever.
- **`From<anyhow::Error>` impls on your public types.** Locks your callers into anyhow.
- **Swallowing context.** `?` is great; `.map_err(|_| MyError::Generic)?` throws away the cause. Wrap, don't replace.

## When to use `Result<T, Box<dyn Error>>`

Mostly: don't. It's a worse `anyhow::Error` (no context chaining, no backtrace). Pick `anyhow` for binaries and `thiserror` for libraries.

The one exception: a callback signature that ships before either crate was available, and you can't change it.

## Backtraces

Set `RUST_BACKTRACE=1` to see them. `anyhow` captures one automatically on error construction; `thiserror` doesn't unless you wire it in.

## Examples to refuse

```rust
let user = db.get_user(id).unwrap();  // panics on every DB error
```

```rust
fn parse(s: &str) -> Result<i32, String> {   // stringly typed
    s.parse().map_err(|e| e.to_string())
}
```

```rust
#[derive(Debug)]
pub enum MyError { Bad }                      // no Display, no source, no Context
impl std::error::Error for MyError {}
```

Surface these and propose the canonical alternative.
