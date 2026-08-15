# S-08 — حالة الرحلة الجارية

**English:** Trip Live Status  
**App:** تطبيق المشرف (Supervisor App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `supervisor` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
ملخص الرحلة الجارية مع إمكانية التبديل بين المسح والمتابعة

## UI Components / Elements
- شريط التقدم (المحطات المنجزة)
- عدد الطلاب (صعدوا / لم يصعدوا بعد / الإجمالي)
- المحطة الحالية والقادمة
- قائمة الطلاب مع حالتهم (أيقونات)
- زر SOS الطوارئ (دائماً ظاهر)
- زر العودة للمسح

## User Flow
1. تظهر بين المسح وعند الحاجة
2. مراجعة من لم يصعد بعد
3. متابعة التقدم في المسار
4. الضغط على اسم طالب لتفاصيله

## API Endpoints
- `GET /trips/:id/live-status`

## UX Notes / Implementation Notes
زر SOS يظهر دائماً في الزاوية بلون أحمر مميز. لا يختفي أبداً

## Error States
_No special error states specified._
