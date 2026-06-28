# Telegram Gadget Affiliate Bot

A simple Next.js MVP web app to create and publish Hebrew affiliate posts for gadget products to a Telegram channel using OpenAI.

## Features

- Fill in product details (Name, Price, URL, Image URL, Category, Notes)
- Generate an engaging Hebrew Telegram post using OpenAI
- Edit the generated post before publishing
- Publish directly to your Telegram channel (with optional image)

## Tech Stack

- Next.js (App Router)
- TypeScript
- Node.js
- OpenAI API
- Telegram Bot API

## Setup Instructions

1. Clone or download this project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your API keys:
   ```bash
   cp .env.example .env
   ```
   **Required variables:**
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `TELEGRAM_BOT_TOKEN`: The token provided by BotFather
   - `TELEGRAM_CHANNEL_ID`: The channel ID (e.g., `@mychannel` or `-1001234567890`). Make sure the bot is an admin in the channel.

4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Important Note

This app does not include authentication, tracking, or a database. It's meant to be a simple, working MVP. Do not expose this app to the public web without adding some form of authentication.
"# telegram-bot" 
