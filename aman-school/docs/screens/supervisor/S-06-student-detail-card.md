# S-06 — تفاصيل الطالب (بعد المسح)

**English:** Student Detail Card  
**App:** تطبيق المشرف (Supervisor App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `supervisor` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
بطاقة معلومات الطالب تظهر فور المسح الناجح

## UI Components / Elements
- صورة الطالب (كبيرة)
- الاسم الكامل والصف
- اسم ولي الأمر + رقمه
- المحطة (نقطة التوقف)
- وقت الصعود المسجل
- زر تراجع (خلال 10 ثواني)

## User Flow
1. تظهر تلقائياً بعد المسح
2. مراجعة سريعة 3-5 ثواني
3. اختفاء تلقائي أو تراجع
4. العودة لشاشة المسح

## API Endpoints
_No direct API calls — client-side only screen._

## UX Notes / Implementation Notes
تُغلق تلقائياً بعد 5 ثواني للإسراع. زر التراجع يلغي تسجيل الصعود خلال 10 ثواني فقط

## Error States
_No special error states specified._
