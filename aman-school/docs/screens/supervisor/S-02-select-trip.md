# S-02 — اختيار الرحلة

**English:** Select Trip  
**App:** تطبيق المشرف (Supervisor App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `supervisor` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
اختيار الرحلة قبل بدء العمل (ذهاب/عودة)

## UI Components / Elements
- التاريخ والوقت الحالي
- معلومات الباص (رقم + اللوحة)
- الرحلات المجدولة اليوم (ذهاب/عودة)
- زر 'اختر هذه الرحلة'
- حالة الاتصال بالإنترنت

## User Flow
1. بعد الدخول تظهر قائمة الرحلات
2. اختيار رحلة الذهاب أو العودة
3. مراجعة قائمة الطلاب المتوقعين
4. تأكيد الاختيار والانتقال

## API Endpoints
- `GET /supervisor/trips/today`
- `POST /trips/:id/assign-supervisor`

## UX Notes / Implementation Notes
تُحمّل بيانات الرحلة والطلاب مسبقاً (Pre-fetch) عند الاتصال لضمان العمل Offline

## Error States
- لا توجد رحلات مجدولة اليوم
- تعذر تحميل البيانات — العمل من Cache
