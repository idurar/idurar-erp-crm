# SCH-03 — إدارة الطلاب

**English:** Students Management  
**App:** لوحة مدير المدرسة (School Admin Dashboard)  
**Platform:** React Web (rebuilt here as: responsive module `school` inside the unified Expo app + web build via react-native-web)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
قاعدة بيانات الطلاب الكاملة مع أدوات الإدارة

## UI Components / Elements
- جدول الطلاب (اسم / صف / باص / ولي أمر / حالة)
- فلاتر: الصف / الباص / حالة الاشتراك
- بحث سريع
- زر 'إضافة طالب' أو 'استيراد Excel'
- لكل طالب: تعديل / تعطيل / عرض كود QR / تاريخ رحلاته

## User Flow
1. عرض الجدول
2. البحث أو الفلترة
3. الضغط على طالب → تفاصيله الكاملة
4. أو إضافة طالب جديد

## API Endpoints
- `GET /schools/:id/students`
- `POST /schools/:id/students`
- `PUT /students/:id`
- `GET /students/:id/qr-code`

## UX Notes / Implementation Notes
استيراد Excel يوفر وقتاً كبيراً عند تسجيل المدرسة. كود QR يُطبع ويُرسل لولي الأمر

## Error States
_No special error states specified._
