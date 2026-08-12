# 03 - Tech Stack

## מטרת המסמך

מסמך זה מגדיר את הטכנולוגיות הרשמיות של הפרויקט.

כל שינוי בטכנולוגיה המרכזית מחייב החלטה חדשה ועדכון המסמך.

---

# Frontend

**Next.js (App Router)**

נבחר בגלל:

* Frontend ו-Backend באותו פרויקט.
* API Routes מובנים.
* פריסה פשוטה ל-Vercel.
* קהילה גדולה ותיעוד מצוין.

---

# Language

TypeScript

כל הקוד בפרויקט ייכתב ב-TypeScript.

---

# Styling

Tailwind CSS

---

# Database

Supabase (PostgreSQL)

נבחר בגלל:

* PostgreSQL אמיתי.
* שירות מנוהל.
* תוכנית חינמית מצוינת ל-MVP.
* אינטגרציה טובה עם Prisma.

---

# ORM

**עדכון (12/8): בפועל אין Prisma בפרויקט.** אין תלות ב-Prisma ב-`package.json` ואין `schema.prisma`. הגישה למסד הנתונים מתבצעת ישירות באמצעות `@supabase/supabase-js`, וה-schema (טבלאות, אינדקסים, RPC) מנוהל כ-migrations ידניים תחת `docs/project/migrations/`.

ההחלטה המקורית (לצורך היסטוריה) הייתה Prisma — זה לא מה שיושם בפועל, ואין תוכנית נוכחית לעבור אליו.

---

# AI

Gemini API

בשלב ה-MVP השימוש ב-Gemini הוא אופציונלי.

אם אין API Key, המערכת תמשיך לעבוד ללא AI.

---

# Product Provider

AliExpress Official Affiliate API

זהו מקור המוצרים היחיד ב-MVP.

---

# Publishing

Telegram Bot API

זהו ערוץ הפרסום היחיד ב-MVP.

---

# Hosting

**עדכון (12/8)**: ריצת ה-Automation/Cron בפרודקשן היא על **Render** (Scheduled Job שמריץ `npm run cron` → `scripts/run-cron-once.ts`), לא Vercel. קובץ `vercel.json` עם cron יומי היה ניסיון ראשוני על Vercel שהוחלף ע"י Render בפועל — הוסר מהריפו כדי לא להטעות. אירוח קבוע ל-Web UI (Products Page) לא הוגדר עדיין.

---

# Source Control

Git + GitHub

כל שינוי יתבצע באמצעות Branch ייעודי ו-Pull Request.

---

# Package Manager

pnpm

אם אין סיבה מיוחדת, כל הפרויקט ינוהל באמצעות pnpm.

---

# Logging

בשלב הראשון:

Console Logs בלבד.

---

# Authentication

לא יפותח ב-MVP.

---

# Testing

בשלב הראשון יתבצעו בדיקות ידניות.

בדיקות אוטומטיות יתווספו בשלבים מתקדמים יותר.

**עדכון (12/8)**: קיימות כיום סקריפטי בדיקה אוטומטיים תחת `scripts/test-*.ts` (discovery, quality-gate, formatting, e2e, publish-real).

---

# Deployment

Deploy רק לאחר שכל שלב ב-Roadmap הושלם ונבדק.

## UI Components

Shadcn/UI יאומץ בפרויקט, אך לא כ-UI framework מלא.

נשתמש בו בצורה נקודתית בלבד, ונוסיף רק קומפוננטות שנדרשות בפועל.

ב-MVP הראשוני יתווספו רק רכיבים בסיסיים כמו Button, Card ו-Input אם הם נדרשים.

אין להוסיף ספריות UI נוספות ללא אישור.

## Dependency Policy

כל ספרייה חדשה חייבת:

1. לפתור בעיה אמיתית.
2. להיות מתוחזקת.
3. להיות נפוצה בתעשייה.
4. להפחית מורכבות.
5. לא לשכפל יכולת מובנית של Next.js.
6. לקבל אישור לפני התקנה.