# SCH-08 — متابعة الرحلات المباشرة

**English:** Live Trips Monitoring  
**App:** لوحة مدير المدرسة (School Admin Dashboard)  
**Platform:** React Web (rebuilt here as: responsive module `school` inside the unified Expo app + web build via react-native-web)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
مراقبة جميع رحلات المدرسة في الوقت الفعلي

## UI Components / Elements
- خريطة تفاعلية كاملة لجميع الباصات
- قائمة الرحلات الجارية مع حالتها
- تفاصيل كل رحلة عند الضغط (طلاب صعدوا/لم يصعدوا)
- تنبيهات التأخير التلقائية
- إمكانية إرسال رسالة للمشرف مباشرة

## User Flow
1. مراقبة مستمرة
2. الضغط على باص → تفاصيل الرحلة
3. التواصل مع المشرف عند الحاجة

## API Endpoints
- `WSS /schools/:id/live-tracking`

## UX Notes / Implementation Notes
يعمل على WebSocket — تحديث فوري

## Error States
_No special error states specified._
