# S-04 — شاشة بدء الرحلة

**English:** Start Trip Screen  
**App:** تطبيق المشرف (Supervisor App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `supervisor` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
تأكيد بدء الرحلة وتفعيل تتبع GPS

## UI Components / Elements
- تفاصيل الرحلة (من/إلى/التوقيت)
- زر 'بدء الرحلة الآن' (كبير وواضح)
- حالة GPS (نشط/غير نشط)
- حالة الاتصال بالإنترنت

## User Flow
1. الضغط على بدء الرحلة
2. تأكيد مربع الحوار
3. تفعيل GPS Tracking
4. الانتقال لشاشة المسح

## API Endpoints
- `POST /trips/:id/start`
- `PUT /buses/:id/gps-active`

## UX Notes / Implementation Notes
عند الضغط يبدأ إرسال GPS كل 30 ثانية عبر MQTT حتى في الخلفية

## Error States
- GPS غير مفعل — اطلب تفعيله
- تعذر الاتصال بالسيرفر — الرحلة ستُزامن لاحقاً
