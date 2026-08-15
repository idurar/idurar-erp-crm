# OPS-03 — تفاصيل حادثة

**English:** Incident Detail  
**App:** لوحة غرفة العمليات (Operations Room Dashboard)  
**Platform:** React Web — شاشة كبيرة 1920×1080+, Dark Mode (rebuilt here as: responsive module `operations` inside the unified app, optimized layout for large/TV displays)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
معالجة حادثة أو حالة طوارئ كاملة

## UI Components / Elements
- خريطة تُظهر موقع الباص
- بيانات الرحلة والطلاب في الباص
- بيانات المشرف ورقم هاتفه
- زر اتصال مباشر بالمشرف
- سجل الإجراءات المتخذة
- زر إرسال إشعار لأولياء الأمور

## User Flow
1. فتح الحادثة
2. التواصل مع المشرف
3. اتخاذ الإجراء
4. إشعار الأطراف
5. تسجيل الإجراءات

## API Endpoints
- `GET /incidents/:id`
- `POST /incidents/:id/actions`
- `POST /incidents/:id/notify-parents`

## Error States
_No special error states specified._
