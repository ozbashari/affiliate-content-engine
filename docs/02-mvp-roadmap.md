# 02-mvp-roadmap.md

# MVP Roadmap

## מטרת המסמך

מסמך זה מגדיר את סדר הפיתוח של המערכת.

כל שלב חייב להיות קטן, עצמאי וניתן לבדיקה.

אין להתחיל שלב חדש לפני שהשלב הקודם עובד במלואו.

---

# MVP 0 — Project Setup

## המטרה

להקים תשתית יציבה לפיתוח.

## משימות

* Create Next.js Project
* Configure TypeScript
* Configure Prisma
* Connect Supabase
* Configure Environment Variables
* Configure ESLint
* Configure Prettier
* Verify Local Development

## Definition of Done

* הפרויקט עולה.
* Supabase מחובר.
* Prisma עובד.
* אין שגיאות Build.

---

# MVP 1 — Products Scan

## המטרה

לקבל מוצרים אמיתיים מ-AliExpress.

## משימות

* התחברות ל-AliExpress API.
* שליחת בקשת Scan.
* קבלת מוצרים.
* טיפול בשגיאות API.
* Logging בסיסי.

## Definition of Done

בלחיצה על Scan מתקבלים לפחות מוצרים אמיתיים מה-API.

לא נדרש עדיין לשמור אותם.

---

# MVP 2 — Save Products

## המטרה

לשמור את המוצרים במסד הנתונים.

## משימות

* Save Product.
* Prevent Duplicates.
* Save Affiliate Link.
* Save Product Status.

## Definition of Done

סריקה יוצרת מוצרים חדשים ב-Supabase.

סריקה נוספת אינה יוצרת כפילויות.

---

# MVP 3 — Products Page

## המטרה

לאפשר לראות את כל המוצרים.

## משימות

* Products List.
* Product Card.
* Product Image.
* Product Price.
* Affiliate Link.
* Refresh Products.

## Definition of Done

ניתן לראות את כל המוצרים שנשמרו.

---

# MVP 4 — Publish Basic

## המטרה

לפרסם מוצר לטלגרם ללא AI.

## משימות

* Telegram Connection.
* Send Photo.
* Send Caption.
* Send Affiliate Button.
* Handle Errors.

## Definition of Done

לחיצה על Publish שולחת מוצר לערוץ הטלגרם.

---

# MVP 5 — AI Content

## המטרה

לאפשר יצירת תוכן איכותי.

## משימות

* Gemini Integration.
* Generate Title.
* Generate Description.
* Save AI Content.
* Retry on Failure.

## Definition of Done

ניתן ליצור תוכן חדש למוצר.

אם Gemini אינו מוגדר, המערכת ממשיכה לעבוד.

---

# MVP 6 — Publish AI

## המטרה

לפרסם את גרסת ה-AI.

## משימות

* Publish Generated Content.
* Preview Before Publish.

## Definition of Done

ניתן לבחור אם לפרסם את הגרסה המקורית או את גרסת ה-AI.

---

# MVP Complete

כאשר כל השלבים הסתיימו, המערכת צריכה לאפשר:

1. Scan Products.
2. Save Products.
3. View Products.
4. Publish Product.
5. Generate AI Content.
6. Publish AI Version.

אם כל ששת השלבים עובדים, ה-MVP הושלם.

---

# Post MVP

רק לאחר השלמת ה-MVP ניתן להתחיל לעבוד על:

* Automation
* Scheduler
* Cron
* Dashboard
* Analytics
* Redirect Tracking
* Multi Channel
* Additional Affiliate Networks

