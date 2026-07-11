# Affiliate Content Engine MVP

## Goal

Automatically discover AliExpress products, generate Hebrew marketing posts with Gemini, and publish rich posts to Telegram.

## Working Flow

1. Select an AliExpress category.
2. Scan products.
3. Normalize product data.
4. Generate an official short affiliate link.
5. Generate a Hebrew post with Gemini.
6. Preview the post.
7. Publish the image, caption and purchase button to Telegram.

## Completed

- AliExpress API client
- Category selection
- Product normalization
- Official short affiliate links
- Gemini post generation
- Post preview
- Telegram rich post publishing

## Current Sprint

Minimal duplicate prevention using Supabase.

## Next

1. Store published product IDs.
2. Skip already published products.
3. Build an automated publishing endpoint.
4. Add scheduled execution.

## Deferred

- Authentication
- Multiple users
- Multiple Telegram channels
- Analytics
- Advanced product scoring
- Additional affiliate networks