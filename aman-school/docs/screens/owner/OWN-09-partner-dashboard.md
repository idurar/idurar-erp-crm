# OWN-09 — لوحة الشريك (Partner View)

**English:** Partner Dashboard  
**App:** لوحة مالك النظام (Platform Owner Dashboard)  
**Platform:** React Web — للمالك فقط (rebuilt here as: responsive module `owner` inside the unified app)  
**Status:** مفهوم أولي  
**MVP:** ⛔️ No — post-MVP

## Description
لوحة التحكم الخاصة بكل شريك — يرى فيها مدارسه وعمولته

## UI Components / Elements
- مدارسه التي يديرها (مع حالة كل منها)
- عمولته الشهرية المحسوبة
- مدارس على وشك انتهاء اشتراكها
- طلب تسجيل مدرسة جديدة
- دعم المدارس من خلاله
- تقارير الأداء

## User Flow
1. الشريك يدخل للوحته → يرى مدارسه فقط
2. يمكنه تسجيل مدرسة جديدة → يحتاج موافقة المالك

## API Endpoints
- `GET /partners/:id/dashboard`

## UX Notes / Implementation Notes
الشريك لا يرى مدارس الشركاء الآخرين. عمولته تُحسب تلقائياً من الاشتراكات

## Error States
_No special error states specified._
