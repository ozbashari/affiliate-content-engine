# Project State

## סטטוס כללי

🟢 שלב: Automation חי בפרודקשן (עודכן 12/8)

המסמך הזה תיאר במקור שלב "הקמת תשתית" ראשוני. בפועל הפרויקט עבר משמעותית מעבר לזה: יש Discovery V2 עם Diversity Scheduler, Quality Gate בשל, AI Content (Gemini) פעיל בכל ריצה אוטומטית, ופרסום אוטומטי לטלגרם על Cron (Render, כל כ-15 דק') עם נעילה מבוזרת ב-Supabase.

---

## מטרת הפרויקט

בניית מערכת מודולרית לניהול מוצרי Affiliate, יצירת תוכן באמצעות AI והפצה לערוצי תוכן.

---

## מה הושלם

* ✅ מבנה תיקיות ראשוני ומורחב (Sprint 01 - Feature-first architecture).
* ✅ README (עדיין boilerplate של create-next-app — טרם עודכן).
* ✅ 00 - Project Overview.
* ✅ 01 - Development Rules.
* ✅ 02 - MVP Roadmap.
* ✅ 03 - Tech Stack.
* ✅ AliExpress discovery + Quality Gate (סף מחיר/rating/מכירות + בלאקליסט ביטויים).
* ✅ Discovery V2 Diversity Scheduler + cooldown history, עם fallback ל-V1.
* ✅ יצירת תוכן עברי אוטומטית עם Gemini (לא רק אופציה ידנית — פעיל בכל ריצת cron).
* ✅ פרסום אוטומטי לטלגרם (photo + caption + כפתור + קישור גולמי) כל כ-15 דק', כולל Cron Lock מבוזר ב-Supabase.
* ✅ מנגנון Retry עם backoff לשמירת רשומת פרסום ב-DB, למניעת פרסום כפול אם השמירה נכשלת אחרי שהפרסום לטלגרם הצליח.

---

## המשימה הנוכחית

עדכון תיעוד (`docs/`) כך שישקף את המצב האמיתי בקוד, אחרי שנמצא פער משמעותי בין המסמכים (MVP ראשוני, Prisma, Vercel) לבין המציאות (Automation חי, ללא Prisma, Render).

---

## המשימה הבאה

הצעדים הבאים שזוהו אך עדיין לא בוצעו: מעקב קליקים/המרות (Analytics/Attribution), Alerting על כשלים (Telegram/AliExpress API), הרחבה רב-ערוצית (וואטסאפ וכו').

---

## החלטות שהתקבלו

* Frontend: Next.js (App Router)
* Language: TypeScript
* Styling: Tailwind CSS
* Database: Supabase PostgreSQL
* ORM: **אין Prisma בפועל** — גישה ישירה עם `@supabase/supabase-js`. (ראו עדכון ב-`03-tech-stack.md`.)
* Package Manager: npm
* Hosting: **Render** להרצת ה-Cron (לא Vercel — ראו עדכון ב-`03-tech-stack.md`).
* Source Control: Git + GitHub
* Product Provider: AliExpress Affiliate API
* Publishing: Telegram Bot API
* AI: Gemini — פעיל בכל ריצה אוטומטית, לא רק אופציונלי ידני.
- UI Components: Shadcn/UI בצורה נקודתית בלבד.
- Dependency Policy: כל ספרייה חדשה דורשת הצדקה ואישור.

---

## Known Issues

* אין Alerting על כשלים (Telegram API / AliExpress API) — כשלים נראים רק בלוגים של Render.
* אין מעקב קליקים/המרות/רווח — אין attribution loop בין פרסום לתוצאה עסקית.
* אין retry/backoff כללי על קריאות רשת חוצות (Telegram/AliExpress) מעבר לתיקון שבוצע ב-`savePublishedProduct`.

---

## הערות

בפרויקט הזה עובדים לפי העיקרון:

**כל שלב חייב להיות עובד לפני שממשיכים לשלב הבא.**

אין להוסיף פיצ'רים מעבר למשימה הנוכחית.
