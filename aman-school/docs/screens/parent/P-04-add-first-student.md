# P-04 — إضافة ابن (أول مرة)

**English:** Add First Student  
**App:** تطبيق ولي الأمر (Parent App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `parent` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
ربط أول ابن بالحساب بعد أول تسجيل دخول

## UI Components / Elements
- شرح سريع: 'احصل على الكود من مدرسة ابنك'
- حقل إدخال كود الطالب (SCHOOL-2026-XXXXX)
- زر 'مسح QR Code' (يفتح الكاميرا)
- زر 'إضافة'
- معاينة بيانات الطالب قبل التأكيد

## User Flow
1. الحصول على الكود من المدرسة
2. إدخال الكود أو مسح QR
3. عرض بيانات الطالب (اسم + مدرسة + باص)
4. التأكيد
5. ظهور الابن في الرئيسية

## API Endpoints
- `POST /parents/students/link`

## UX Notes / Implementation Notes
QR Code هو الطريقة الأسرع. بعد الإضافة تظهر شاشة 'مرحباً بـ [اسم الطالب]' لتأكيد النجاح. تنسيق الكود SCHOOL-2026-XXXXX (بادئة المدرسة + السنة + رقم تسلسلي)

## Error States
- الكود غير صحيح
- هذا الطالب مرتبط بحساب آخر — تواصل مع المدرسة
- QR Code غير واضح
