# Database

## Provider

Supabase Postgres, accessed directly via `@supabase/supabase-js`. There is no ORM / no Prisma in this project (despite what earlier docs say) — schema changes are tracked as plain SQL files under `docs/project/migrations/` and applied manually to Supabase.

## Current Purpose (updated 12/8)

The database backs four things today, not just dedupe:

1. Preventing the same AliExpress product from being published twice (`published_products`).
2. Distributed cron locking, so overlapping scheduled runs can't publish concurrently (`cron_locks`).
3. Discovery run history, used by the V2 diversity scheduler's cooldown logic (`discovery_run_history`).
4. Category/keyword diversity of what's already been published, so the scheduler avoids repeating the same category back-to-back (`published_product_diversity`).

There is still **no** click/conversion/revenue tracking table — publishing remains publish-and-forget with no attribution loop back.

## Table: published_products

| Column | Type | Description |
|---|---|---|
| id | uuid | Internal primary key |
| source | text | Product provider, currently `aliexpress` |
| external_id | text | Product ID from the provider |
| telegram_message_id | text | Telegram message ID returned after publishing |
| published_at | timestamptz | Publication timestamp |

Constraints:
- `source` and `external_id` must be unique together.
- A failed Telegram publication must not create a database record.
- The insert is retried with backoff on transient errors (see `src/features/publishing/published-products-repository.ts`) so a dropped write right after a successful Telegram post doesn't leave the product unrecorded and eligible for re-publishing.

## Table: cron_locks

Distributed lock so only one cron execution runs at a time. See `docs/project/migrations/v3_cron_locks.sql`.

| Column | Type | Description |
|---|---|---|
| lock_key | text (PK) | Fixed key identifying the lock, e.g. `affiliate-publish-cron` |
| owner_id | text | Identifier of the process holding the lock |
| acquired_at | timestamptz | When the lock was acquired |
| expires_at | timestamptz | Lock lease expiry (TTL-based, default 900s) |
| updated_at | timestamptz | Last update timestamp |

Also defines RPC functions `try_acquire_cron_lock` / `release_cron_lock` used for atomic acquire/release.

## Table: discovery_run_history

See `docs/project/migrations/v2_diversity_scheduler.sql`.

| Column | Type | Description |
|---|---|---|
| id | uuid | Internal primary key |
| run_at | timestamptz | When the discovery run happened |
| category_ids | text[] | Categories queried in this run |
| keywords | text[] | Keywords queried in this run |

## Table: published_product_diversity

| Column | Type | Description |
|---|---|---|
| product_id | text (PK) | External product ID |
| category_id | text | Category the published product belonged to |
| keyword | text | Keyword that surfaced the product |
| product_type | text | Optional product type classification |
| published_at | timestamptz | Publication timestamp |

## General Constraints

- Database access must happen only on the server (`import 'server-only'` in repository files).
- Supabase secret keys must never be exposed to the browser.

## Migrations

No Prisma migration history exists. Schema changes live as plain SQL files under `docs/project/migrations/` (`v2_diversity_scheduler.sql`, `v3_cron_locks.sql`) and must be applied manually against the Supabase instance.

## Future Tables

Deferred until needed:

- products
- generated_posts
- categories
- channels
- settings
- publish_runs
- a click/conversion/revenue tracking table — this is the biggest actual gap today; without it there's no way to know which categories/products/post times convert.
