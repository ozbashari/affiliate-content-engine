# 01-development-rules.md

# Development Rules

## מטרת הקובץ

קובץ זה מגדיר את כללי הפיתוח של Affiliate Content Engine.

כל כלי AI, מפתח או עורך קוד שעובד על הפרויקט חייב לקרוא את הקובץ הזה לפני ביצוע שינויים.

המטרה היא למנוע בנייה לא מבוקרת, פיצ׳רים מיותרים, שבירת קוד קיים, ושינויים לא מתוכננים בארכיטקטורה.

---

## כלל עליון

בכל משימה בונים רק את מה שהתבקש.

אין להוסיף פיצ׳רים, מסכים, טבלאות, endpoints או לוגיקה שלא הוגדרו במפורש במשימה הנוכחית.

---

## איך עובדים עם AI

כאשר עובדים עם Claude Code, Cursor או כל כלי AI אחר:

1. יש להפנות את הכלי לקרוא את כל קבצי `docs`.
2. יש לתת לו משימה אחת בלבד בכל פעם.
3. יש לציין במפורש לא לעבור למשימה הבאה.
4. יש לבדוק את הקוד לפני המשך.
5. אין לבקש מה-AI “לבנות את כל הפרויקט”.

---

## אסור

אסור לבצע את הפעולות הבאות ללא אישור מפורש:

* להוסיף פיצ׳רים חדשים.
* לשנות את הארכיטקטורה.
* לשנות את מבנה ה-Database.
* למחוק קבצים.
* לשנות שמות של קבצים קיימים.
* לשנות שמות של משתנים מרכזיים ללא סיבה.
* להוסיף ספריות חדשות.
* להוסיף authentication.
* להוסיף users / roles.
* להוסיף Dashboard מתקדם.
* להוסיף Cron.
* להוסיף Multi-channel.
* להוסיף Redirect tracking.
* להוסיף Analytics.
* להוסיף Mock data אלא אם התבקש במפורש.
* להכניס API keys לקוד.
* להשתמש במשתנים שמתחילים ב-`NEXT_PUBLIC_` עבור סודות.
* לחשוף tokens או secrets בצד ה-client.

---

## חובה

בכל קוד שנכתב חובה להקפיד על:

* TypeScript.
* קוד קריא ופשוט.
* שמות ברורים לפונקציות ומשתנים.
* Error handling בסיסי.
* החזרת responses מסודרים ב-API.
* שימוש ב-Prisma לגישה ל-Database.
* שמירת secrets רק ב-`.env.local`.
* הפרדה בין לוגיקה עסקית לבין UI.
* לוגים ברורים בפיתוח.
* לא לשכפל קוד אם אפשר לכתוב פונקציה משותפת.
* לא להסתיר שגיאות.
* לא להמשיך לשלב הבא אם יש שגיאה פתוחה.

---

## מבנה Response אחיד ל-API

כל API route צריך להחזיר מבנה ברור.

במקרה הצלחה:

```json
{
  "success": true,
  "data": {}
}
```

במקרה כישלון:

```json
{
  "success": false,
  "error": "Readable error message"
}
```

אסור להחזיר `undefined` כשגיאה.

---

## שימוש ב-Environment Variables

כל מפתח או סוד חייב להישמר ב-`.env.local`.

דוגמאות:

```env
ALIEXPRESS_APP_KEY=
ALIEXPRESS_APP_SECRET=
ALIEXPRESS_TRACKING_ID=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
GEMINI_API_KEY=
DATABASE_URL=
DIRECT_URL=
```

אסור להכניס ערכים אמיתיים לקוד.

אסור להעלות `.env.local` ל-GitHub.

---

## עבודה מול Database

* כל שינוי ב-Database חייב להיות מוגדר קודם במסמך `05-database.md`.
* אין להוסיף טבלאות בלי אישור.
* אין למחוק עמודות בלי אישור.
* אין לשנות שמות עמודות בלי אישור.
* יש להשתמש ב-Prisma בלבד.
* אין לכתוב SQL ישיר אלא אם יש סיבה מיוחדת ואישור.

---

## עבודה מול AliExpress

ב-MVP משתמשים רק ב-AliExpress Official Affiliate API.

אין להוסיף scraping.

אין להוסיף API חיצוני חלופי.

אין להחליף את AliExpress ב-Admitad, CJ או ספק אחר בשלב ה-MVP.

---

## עבודה מול Telegram

ב-MVP מפרסמים לערוץ טלגרם אחד בלבד.

אין להוסיף multi-channel בשלב הראשון.

הפרסום הראשוני צריך לעבוד גם ללא AI.

כל הודעה לטלגרם חייבת לכלול:

* תמונת מוצר אם קיימת.
* כותרת מוצר.
* מחיר.
* כפתור רכישה עם קישור Affiliate תקין.

---

## עבודה מול Gemini

Gemini הוא אופציונלי ב-MVP.

אסור לגרום לכך שהמערכת לא תוכל לפרסם מוצר רק בגלל שאין Gemini API Key.

אם Gemini לא מוגדר, המערכת צריכה לאפשר Basic Publish לטלגרם.

---

## UI Rules

הממשק צריך להיות פשוט.

ב-MVP נדרשים רק:

* עמוד Products.
* כפתור Scan.
* כפתור Publish Basic.
* כפתור Generate AI Content, אם Gemini מוגדר.
* כפתור Publish AI Version, אם נוצר תוכן AI.

אין לבנות Dashboard מתקדם בשלב הראשון.

---

## בדיקות לפני סיום כל משימה

לפני שמסמנים משימה כבוצעה, חובה לבדוק:

1. שהפרויקט עולה לוקאלית.
2. שאין שגיאות TypeScript.
3. שאין שגיאות build.
4. שה-API route הרלוונטי עובד.
5. שהשינוי לא שבר functionality קודם.
6. שאין secrets בקוד.

---

## Definition of Done

משימה נחשבת גמורה רק אם:

* היא עושה בדיוק את מה שהוגדר.
* אין שגיאות TypeScript.
* אין שגיאות build.
* הקוד קריא.
* אין פיצ׳רים לא קשורים.
* המשתמש אישר שהשלב עובד.

---

## הנחיה ל-AI לפני כל משימה

בכל תחילת משימה יש להשתמש בנוסח הבא:

```text
Read all files inside /docs before making changes.

Follow 01-development-rules.md strictly.

Implement only the current task.

Do not add future features.

Do not change the database schema unless the current task explicitly requires it.

Do not continue to the next roadmap step.

After implementation, explain exactly what changed and how to test it.
```
