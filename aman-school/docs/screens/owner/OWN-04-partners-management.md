# OWN-04 — إدارة الشركاء

**English:** Partners Management  
**App:** لوحة مالك النظام (Platform Owner Dashboard)  
**Platform:** React Web — للمالك فقط (rebuilt here as: responsive module `owner` inside the unified app)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
إدارة شبكة الشركاء الموزعين للمنصة

## UI Components / Elements
- جدول الشركاء (الاسم / المنطقة / عدد مدارسه / إجمالي عمولته)
- تسجيل شريك جديد
- تعيين مدارس لشريك
- إعداد نسبة العمولة
- سجل مدفوعات الشركاء

## User Flow
1. تسجيل شريك → تحديد منطقته ونسبة عمولته → مدارسه تُحسب في إيراداته

## API Endpoints
- `GET /owner/partners`
- `POST /owner/partners/register`
- `PUT /owner/partners/:id`

## UX Notes / Implementation Notes
الشريك يحصل على لوحة تحكم خاصة به (OWN-09) يرى فيها مدارسه فقط وعمولته

## Error States
_No special error states specified._
