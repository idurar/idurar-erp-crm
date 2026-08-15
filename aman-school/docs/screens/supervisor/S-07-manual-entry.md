# S-07 — إدخال يدوي (طوارئ)

**English:** Manual Entry  
**App:** تطبيق المشرف (Supervisor App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `supervisor` inside the unified app)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
إضافة طالب يدوياً عند تعطل سواره

## UI Components / Elements
- حقل بحث بالاسم أو رقم الطالب
- قائمة نتائج البحث
- زر تأكيد الصعود
- حقل سبب الإدخال اليدوي

## User Flow
1. كتابة اسم الطالب أو ID
2. اختيار من النتائج
3. كتابة سبب (سوار تعطل/ضاع)
4. تأكيد التسجيل

## API Endpoints
- `GET /students/search`
- `POST /trips/:id/manual-board`

## UX Notes / Implementation Notes
يُسجل في النظام كـ 'يدوي' مع سبب للمراجعة لاحقاً. يُنبّه المشرف لإبلاغ المدرسة

## Error States
- الطالب غير موجود في قائمة هذا الباص
