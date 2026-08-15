# OPS-01 — لوحة المراقبة الرئيسية

**English:** Main Control Room  
**App:** لوحة غرفة العمليات (Operations Room Dashboard)  
**Platform:** React Web — شاشة كبيرة 1920×1080+, Dark Mode (rebuilt here as: responsive module `operations` inside the unified app, optimized layout for large/TV displays)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
الشاشة الرئيسية لغرفة العمليات — تعمل 24/7

## UI Components / Elements
- خريطة ضخمة (80% الشاشة) لجميع الباصات بألوان تدل على الحالة
- شريط جانبي: قائمة الرحلات الجارية
- شريط علوي: إحصائيات فورية
- بانر التنبيهات (أحمر/أصفر/أخضر)
- ساعة + التاريخ (دائمة الظهور)
- قائمة المدارس (في حال كانت عمليات مشتركة)

## User Flow
1. مراقبة مستمرة لجميع الباصات
2. كل باص ملون حسب حالته: أخضر=يسير / أصفر=توقف > 5 دقائق / أحمر=طوارئ
3. الضغط على باص → تفاصيل الرحلة
4. التنبيهات تظهر في الأعلى فوراً

## API Endpoints
- `WSS /operations/live-all`
- `GET /operations/active-trips`

## UX Notes / Implementation Notes
مصممة لشاشة تلفزيون أو شاشة ضخمة. لا تحتاج تفاعلاً يدوياً إلا عند التنبيهات. Dark Mode للتقليل من إجهاد العيون

## Error States
_No special error states specified._
