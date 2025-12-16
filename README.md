# VirusTotal URL Checker

مشروع كامل لفحص الروابط باستخدام VirusTotal API v3، مبني بـ Next.js.

## المميزات

- فحص الروابط باستخدام VirusTotal API v3
- عرض نتائج واضحة (Safe / Suspicious / Malicious)
- إحصائيات مفصلة (harmless, suspicious, malicious, undetected)
- ألوان مميزة حسب النتيجة
- Next.js API Routes آمنة
- تصميم عربي RTL
- React + TypeScript + Next.js

## التشغيل السريع

### 1. إضافة API Key

في v0: اذهب إلى قسم **Vars** في الشريط الجانبي وأضف:
- Variable Name: `VIRUSTOTAL_API_KEY`
- Value: API Key الخاص بك

احصل على API Key من: https://www.virustotal.com/gui/my-apikey

### 2. التشغيل

المشروع جاهز للاستخدام مباشرة! فقط أدخل رابط وابدأ الفحص.

## البناء والنشر

### تشغيل محلي
```bash
npm install
npm run dev
```

### البناء للإنتاج
```bash
npm run build
npm start
```

### النشر على Vercel
انقر على زر "Publish" في الأعلى لنشر المشروع مباشرة على Vercel.

## البنية

```
virustotal-checker/
├── app/
│   ├── api/scan/route.ts   # Next.js API Route
│   ├── page.tsx            # الواجهة الرئيسية
│   ├── layout.tsx          # Layout
│   └── globals.css         # Styles
├── components/             # UI Components
└── public/                # Assets
```

## API Endpoint

### POST /api/scan
فحص رابط جديد

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "status": "safe",
  "stats": {
    "harmless": 75,
    "suspicious": 0,
    "malicious": 0,
    "undetected": 10
  },
  "permalink": "https://www.virustotal.com/gui/url/..."
}
```

## التقنيات المستخدمة

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **API**: VirusTotal API v3
- **Icons**: Lucide React
- **UI Components**: shadcn/ui

## الأمان

- API Key محفوظ في Server-side فقط
- عدم الاتصال المباشر بـ VirusTotal من Client
- معالجة شاملة للأخطاء
- Environment Variables آمنة

---

تم البناء باستخدام React + TypeScript + Next.js
