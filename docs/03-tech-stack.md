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

Prisma

כל הגישה למסד הנתונים תתבצע באמצעות Prisma.

אין להשתמש ב-SQL ישיר אלא אם יש צורך מיוחד.

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

Vercel

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

---

# Deployment

Deploy רק לאחר שכל שלב ב-Roadmap הושלם ונבדק.

## UI Components

Shadcn/UI יאומץ בפרויקט, אך לא כ-UI framework מלא.

נשתמש בו בצורה נקודתית בלבד, ונוסיף רק קומפוננטות שנדרשות בפועל.

ב-MVP הראשוני יתווספו רק רכיבים בסיסיים כמו Button, Card ו-Input אם הם נדרשים.

אין להוסיף ספריות UI נוספות ללא אישור.