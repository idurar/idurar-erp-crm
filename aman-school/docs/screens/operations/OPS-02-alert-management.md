# OPS-02 — إدارة التنبيهات

**English:** Alert Management  
**App:** لوحة غرفة العمليات (Operations Room Dashboard)  
**Platform:** React Web — شاشة كبيرة 1920×1080+, Dark Mode (rebuilt here as: responsive module `operations` inside the unified app, optimized layout for large/TV displays)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
استقبال ومعالجة التنبيهات والحوادث

## UI Components / Elements
- قائمة التنبيهات مرتبة بالأولوية (عاجل جداً / عاجل / تنبيه)
- لكل تنبيه: المصدر + الوقت + التفاصيل + الإجراء المقترح
- زر 'تلقيت وأتخذ إجراء' (Acknowledge)
- تعيين التنبيه لموظف معين
- زر إغلاق التنبيه مع السبب

## User Flow
1. وصول تنبيه (صوت + اهتزاز الشاشة)
2. مراجعة التفاصيل
3. Acknowledge
4. اتخاذ الإجراء
5. إغلاق مع ملاحظة

## API Endpoints
- `GET /alerts?status=active`
- `PUT /alerts/:id/acknowledge`
- `PUT /alerts/:id/resolve`

## UX Notes / Implementation Notes
التنبيهات العاجلة جداً (SOS/طوارئ) تُصدر صوتاً وتومض الشاشة حتى يتم الـ Acknowledge

## Error States
_No special error states specified._
