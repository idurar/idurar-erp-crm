# SCH-05 — إدارة الباصات

**English:** Buses Management  
**App:** لوحة مدير المدرسة (School Admin Dashboard)  
**Platform:** React Web (rebuilt here as: responsive module `school` inside the unified Expo app + web build via react-native-web)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
بيانات الباصات والأجهزة المركبة

## UI Components / Elements
- قائمة الباصات (رقم / الطاقة / المسار / المشرف / حالة GPS)
- إضافة باص جديد
- ربط جهاز GPS بباص
- عرض المسار على الخريطة
- سجل صيانة الباص

## User Flow
1. عرض الباصات
2. الضغط على باص → تفاصيله
3. تعديل بيانات أو ربط مشرف

## API Endpoints
- `GET /schools/:id/buses`
- `POST /schools/:id/buses`
- `PUT /buses/:id/gps-device`

## UX Notes / Implementation Notes
ربط جهاز GPS يتطلب إدخال Device ID المكتوب على الجهاز

## Error States
_No special error states specified._
