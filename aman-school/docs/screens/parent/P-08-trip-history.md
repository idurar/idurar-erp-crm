# P-08 — سجل الرحلات

**English:** Trip History  
**App:** تطبيق ولي الأمر (Parent App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `parent` inside the unified app)  
**Status:** موثق  
**MVP:** ⛔️ No — post-MVP

## Description
تاريخ كامل لجميع رحلات الابن

## UI Components / Elements
- فلتر: الأسبوع / الشهر / مخصص
- قائمة الرحلات مرتبة بالتاريخ
- لكل رحلة: التاريخ + وقت الصعود + وقت الوصول + حالة
- ضغط على رحلة → تفاصيلها على الخريطة (مسار الرحلة)

## User Flow
1. اختيار الفترة الزمنية
2. مراجعة الرحلات
3. الضغط على رحلة لتفاصيلها

## API Endpoints
- `GET /students/:id/trips?from=&to=`

## UX Notes / Implementation Notes
مفيد جداً لتتبع الانتظام والغياب

## Error States
_No special error states specified._
