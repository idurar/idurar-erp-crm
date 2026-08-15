# S-10 — شاشة إنهاء الرحلة

**English:** End Trip  
**App:** تطبيق المشرف (Supervisor App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `supervisor` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
إنهاء الرحلة وتأكيد خروج جميع الطلاب

## UI Components / Elements
- تحقق: هل جميع الطلاب نزلوا؟
- قائمة من لم يُسجل نزوله
- ملاحظات ختامية
- زر 'إنهاء الرحلة'
- ملخص سريع للرحلة

## User Flow
1. مسح نزول آخر طالب
2. النظام يذكّر بمن لم يُسجل
3. التأكيد على خروج الجميع
4. الضغط على الإنهاء
5. رفع التقرير

## API Endpoints
- `PUT /trips/:id/end`
- `POST /trips/:id/report`

## UX Notes / Implementation Notes
تحذير مهم: لا يُسمح بالإنهاء دون التأكيد على جميع الطلاب — يمنع نسيان الأطفال في الباص

## Error States
- لا يزال X طالب لم يُسجل نزوله — هل أنت متأكد؟
