---
name: postgres-query-review
description: Review a Postgres query for correctness, performance, and safety before it runs in production.
metadata:
  type: skill
  category: data
---

# Postgres query review

When the user asks for a SQL review, or pastes a query and asks "is this safe to run", load this discipline.

## What to look for

### Correctness

- **NULL handling.** Does the query produce the expected result when nullable columns are present? `WHERE col != x` excludes rows where `col IS NULL`. Surface this.
- **Join cardinality.** A 1-to-many join with `SUM()` without `DISTINCT` inflates totals. Spot it.
- **Implicit casts.** `WHERE int_col = '5'` works but disables index use. Flag it.
- **Aggregate without GROUP BY.** Postgres allows it in some shapes; the answer is rarely what the user meant.
- **OFFSET on a large table.** O(N) — paginate by indexed cursor instead.

### Performance

- **Sequential scan on a column you'd expect to be indexed.** Use `EXPLAIN ANALYZE` mentally — if `WHERE user_id = ?` and there's no `(user_id)` index, surface it.
- **Wildcard prefix on LIKE.** `LIKE '%foo%'` can't use a btree index. Trigram (`pg_trgm`) helps; suggest it.
- **CTE as optimization fence.** Pre-Postgres 12, a `WITH` was always materialized. Post-12, only when `MATERIALIZED` is explicit. If the user is on PG ≤ 11, an inlining hint matters.
- **`ORDER BY ... LIMIT N` on a non-indexed column.** Postgres sorts the whole result then takes N. An index on the order column makes it O(log N + N rows).

### Safety

- **No `WHERE` clause on `UPDATE` or `DELETE`.** Refuse. Always.
- **`TRUNCATE` mentioned.** Confirm explicitly — irreversible, no row trigger.
- **Schema-modifying DDL inside a long transaction.** Locks. Pump the brakes.
- **`pg_dump` of production at peak hours.** Flag the load impact, suggest off-peak or `--jobs`.
- **Anonymization of PII before export.** If the query selects emails, names, phones — propose hashing or masking before it leaves the cluster.

## What to do

1. Walk the query top-down.
2. For each pattern above, say what's at stake in plain language. Not "this is sub-optimal" — "this will scan 4M rows because there's no index on `created_at`; add one with `CREATE INDEX CONCURRENTLY idx_created_at ON orders (created_at);`".
3. End with a one-line verdict: **safe to run · review before running · don't run**.
4. If unsafe, suggest the smallest fix that makes it safe.

## Examples

### Bad

```sql
DELETE FROM orders WHERE customer_id = 12345;
```

> **Verdict: review before running.**
> No date or status filter — this deletes *every* order ever placed by this customer, including completed ones. Likely intent: cancel pending orders only. Try `WHERE customer_id = 12345 AND status = 'pending'` and run `SELECT COUNT(*) FROM orders WHERE … ;` first to confirm the row count.

### Good

```sql
SELECT user_id, COUNT(DISTINCT session_id) AS sessions
FROM events
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY user_id
ORDER BY sessions DESC
LIMIT 50;
```

> **Verdict: safe to run.**
> Time-bounded, indexed `created_at` (assumed), top-N with `LIMIT`, `DISTINCT` on the join cardinality. One thing to verify: does the `(created_at)` index exist? `\d+ events` to check.

## Anti-patterns

- Don't suggest "add an index" without checking if one exists.
- Don't recommend `SELECT *` "for clarity" — explicit columns let Postgres skip TOAST columns.
- Don't quote pgAdmin / DataGrip features as if they were Postgres features.
