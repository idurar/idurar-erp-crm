# OWN-01 — لوحة المالك الرئيسية

**English:** Owner Dashboard  
**App:** لوحة مالك النظام (Platform Owner Dashboard)  
**Platform:** React Web — للمالك فقط (rebuilt here as: responsive module `owner` inside the unified app)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
نظرة شاملة على المنصة بأكملها — الأرقام والإيرادات والنمو

## UI Components / Elements
- بطاقات KPI الرئيسية: (إجمالي المدارس / الطلاب النشطين / الإيراد الشهري / معدل النمو)
- رسم بياني: نمو المشتركين (6 أشهر)
- رسم بياني: الإيرادات الشهرية
- خريطة: توزيع المدارس جغرافياً
- أحدث المدارس المشتركة
- تنبيهات النظام

## User Flow
1. دخول المالك → رؤية كاملة للمنصة
2. تحليل الأرقام والنمو
3. الوصول السريع لأي قسم

## API Endpoints
- `GET /owner/platform-summary`

## UX Notes / Implementation Notes
هذه الشاشة تعطي المالك صورة كاملة عن صحة المنصة والنمو التجاري في ثوانٍ

## Error States
_No special error states specified._
