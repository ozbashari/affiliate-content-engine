# Telegram Post Template

## 1. Purpose & Output Schema

This template defines the JSON formatting rules for transforming product data into a publication-ready Telegram post.

### Output JSON Format
Return ONLY valid JSON. Do not wrap the JSON in markdown code blocks or add text outside the object structure. All text fields MUST be plain text only, containing NO HTML tags or Markdown formatting (like `<b>`, `<s>`, `*`, `_`, or backticks). The application code is solely responsible for adding the final styling to the Telegram message.

```json
{
  "headline": "",
  "body": "",
  "cta": "",
  "telegramPost": ""
}
```

---

## 2. Field-Specific Rules

### A. headline
- Max 8 words. Focuses on a relatable problem, observation, question, or situation. Never start with product names or specifications.
- **Emoji**: Add exactly **one** category emoji (e.g. 🚗, 💡, 🏡, 🧹) at the **END** of the headline.

### B. body
- Max 55 words. Explains the practical usefulness of the product in everyday life (max 1-2 paragraphs, max 2 sentences each).
- **Bullets**: If bullets improve readability, choose **ONE** style for the entire post (e.g. `🔹`, `🔸`, `🟢`, `🔵`, `✔️`). Never mix styles.
- **Transition Prefix**: Prefix the bullets with a natural spoken introduction (e.g. "למה אהבנו אותו:", "כמה דברים ששווה לדעת:", "מתאים במיוחד אם אתם רוצים:").

### C. cta
- Max 4 words. Select the CTA based on product metadata:
  - If free shipping is verified and exists: `✈️ להזמנה עם משלוח חינם 👇`
  - If a verified discount exists: `🏷️ להזמנה בהנחה 👇`
  - Otherwise, rotate naturally: `👇 למוצר`, `👇 לכל הפרטים`, `👇 להזמנה`, `👇 להצצה`, `👇 שווה לבדוק`, `👇 לעמוד המוצר`.
- Do not repeat the same CTA across consecutive posts. Do not include URLs or prices.

### D. telegramPost
Combines the fields into a single post with single blank line spacing.
**Required Layout**:
```text
[Headline]

[Body Paragraphs or Bullets]

[Price Line]

[CTA]
[Affiliate URL]
```

---

## 3. Price Placement Rules
- Place exactly one clean price line between the body and the CTA.
- **Do NOT include the word "מחיר:" or tags like "רק" / "בלבד".**
- Price layouts (copy exact values and currency):
  - **ILS**: `💰 ₪184`
  - **ILS with Original Price**: `💰 ₪51.49 במקום ₪93.62`
  - **USD Fallback**: `💰 $54.48`
  - **USD Fallback with Original Price**: `💰 $54.48 במקום $108.96`

---

## 4. URL & Link Rules
- The `affiliateUrl` must appear **exactly once** as the final line of `telegramPost`.
- No characters, labels, or spaces must share the line or follow the URL.
- Copy the URL exactly as provided. Do not wrap in markdown or parentheses.

---

## 5. Final Validation Checklist
Before returning, verify:
1. **Headline Hook**: Scroll-stopping hook with 1 category emoji at the end.
2. **Word Limits**: Headline <= 8 words, Body <= 55 words, CTA <= 4 words. Total post 35-75 words.
3. **No Brochure Jargon**: Avoided פתרון, מאפשר, מציע, מיועד, מעניק, אידיאלי.
4. **Single Bullet Style**: If bullets are used, exactly one style is chosen and prefixed with a transition.
5. **Clean Price**: Only one price line starting with `💰 ₪` or `💰 $` (no "מחיר:").
6. **CTA Selection**: Selected according to metadata (shipping/discount) or rotated fallback.
7. **URL Position**: Plain HTTPS affiliate URL is exactly on the final line of `telegramPost`.
8. **Valid JSON**: Output is directly parseable JSON without markdown wrapping.