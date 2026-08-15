# S-03 — قائمة الطلاب (قبل الرحلة)

**English:** Pre-Trip Student List  
**App:** تطبيق المشرف (Supervisor App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `supervisor` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
مراجعة قائمة الطلاب المتوقع صعودهم قبل البدء

## UI Components / Elements
- عدد الطلاب الإجمالي
- قائمة بأسماء الطلاب + صورهم
- حالة كل طالب (متوقع / غائب مسبقاً)
- حقل بحث بالاسم
- زر 'بدء الرحلة'

## User Flow
1. عرض قائمة مرتبة حسب المحطة
2. مراجعة سريعة
3. تحديث الغياب المسبق إن وجد
4. الضغط على بدء الرحلة

## API Endpoints
- `GET /trips/:id/students`

## UX Notes / Implementation Notes
تعمل 100% Offline من SQLite المحلي. الصور مُحملة مسبقاً بجودة منخفضة للتوفير

## Error States
_No special error states specified._
