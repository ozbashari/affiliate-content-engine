# Database

## Provider

Supabase Postgres.

## Current Purpose

The database is currently used only to prevent publishing the same AliExpress product more than once.

## Table: published_products

| Column | Type | Description |
|---|---|---|
| id | uuid | Internal primary key |
| source | text | Product provider, currently `aliexpress` |
| external_id | text | Product ID from the provider |
| telegram_message_id | text | Telegram message ID returned after publishing |
| published_at | timestamptz | Publication timestamp |

## Constraints

- `source` and `external_id` must be unique together.
- Database access must happen only on the server.
- Supabase secret keys must never be exposed to the browser.
- A failed Telegram publication must not create a database record.

## Future Tables

Deferred until needed:

- products
- generated_posts
- categories
- channels
- settings
- publish_runs