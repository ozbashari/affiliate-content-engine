# Telegram Post Template

## Purpose

This template defines how the AI should transform structured product data into a Telegram post.

The AI must follow the project writing rules and system prompt.

---

## Input

The AI will receive structured product information similar to:

```json
{
  "title": "...",
  "price": "...",
  "originalPrice": "...",
  "discount": "...",
  "brand": "...",
  "category": "...",
  "rating": "...",
  "sales": "...",
  "imageUrl": "...",
  "productUrl": "...",
  "affiliateUrl": "...",
  "description": "..."
}
```

Some fields may be empty.

Never invent missing information.

---

## Thinking Process

Before writing the post, silently determine:

1. What is this product?
2. Who would actually use it?
3. What is its biggest benefit?
4. Why would someone stop scrolling?
5. What is the most interesting angle?

Use those answers to guide the writing.

Do not include this reasoning in the output.

---

## Writing Instructions

The post should naturally follow this flow:

1. Grab attention.
2. Explain what the product is.
3. Explain why it is useful.
4. Highlight the main benefits.
5. Show the current price.
6. End with a natural call to action.

The exact wording and structure may vary.

Avoid repetitive posts.

---

## Output Format

Return only valid JSON.

Do not wrap the JSON inside markdown.

Do not add explanations.

Return exactly this structure:

```json
{
  "headline": "",
  "body": "",
  "cta": "",
  "telegramPost": ""
}
```

---

## Headline

The headline should:

- Attract attention.
- Be short.
- Communicate the main value.
- Avoid clickbait.
- Avoid all caps.

---

## Body

The body should:

- Explain the product naturally.
- Focus on benefits.
- Avoid repeating the title.
- Remain concise.
- Feel human.
- Avoid marketing clichés.
- Include only information supported by the provided product data.

---

## CTA

The CTA should:

- Feel natural.
- Invite curiosity.
- Never pressure the reader.
- Never create fake urgency.

Good examples:

- לפרטים 👇
- שווה להציץ 👇
- לכל הפרטים 👇

The CTA field should contain text only.

Do not include the affiliate URL inside the CTA field.

---

## Telegram Post

The `telegramPost` field must contain the complete post exactly as it should be published on Telegram.

It should combine:

1. The headline.
2. The body.
3. The current price, when available.
4. The CTA.
5. The affiliate URL.

Use natural line breaks between sections.

The `telegramPost` field must be ready for direct publication without additional writing or formatting logic in the application.

The affiliate URL must appear only once.

Do not use Markdown code blocks.

Do not add internal labels such as:

- Headline
- Body
- CTA
- Price
- Link

The final post should feel like one coherent Telegram message.

---

## Price Handling

When a valid current price is provided:

- Include it clearly in the final Telegram post.
- Do not modify the price.
- Do not convert currencies.
- Do not invent savings.

When both current price and original price are provided:

- Mention the original price only if it adds clear value.
- Do not calculate a discount unless a verified discount value is provided.

When no valid price is provided:

- Do not invent or estimate one.
- Omit the price naturally.

---

## Link Handling

Use only the provided affiliate URL.

Do not replace it with the product URL when an affiliate URL exists.

Do not shorten, modify, or reconstruct the URL.

If the affiliate URL is missing, return an empty `telegramPost` and do not invent a link.

---

## Formatting

The final Telegram post should be easy to scan.

Prefer:

- Short paragraphs.
- Natural line breaks.
- Limited use of emojis.
- Clear separation between the explanation, price, and CTA.

Avoid:

- Long blocks of text.
- Excessive punctuation.
- Repeated emojis.
- Hashtags unless explicitly requested.
- Bulleted lists when they make the post feel mechanical.

---

## Forbidden

Never:

- Invent specifications.
- Invent prices.
- Invent discounts.
- Invent reviews.
- Invent capabilities.
- Claim medical benefits.
- Create fake scarcity.
- Create fake urgency.
- Use manipulative language.
- Add unsupported brand claims.
- Add unsupported warranty or shipping claims.
- Add text that is not based on the provided data.

---

## Final Validation

Before returning the JSON, silently verify:

- The product is easy to understand.
- The biggest benefit is obvious.
- The post sounds natural.
- The post feels trustworthy.
- The price is accurate.
- The affiliate URL appears exactly once.
- The `telegramPost` field is ready for direct publication.
- The JSON is valid.
- All four fields are strings.

Only then return the response.
