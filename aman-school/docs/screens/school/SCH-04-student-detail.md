# SCH-04 — تفاصيل طالب

**English:** Student Detail  
**App:** لوحة مدير المدرسة (School Admin Dashboard)  
**Platform:** React Web (rebuilt here as: responsive module `school` inside the unified Expo app + web build via react-native-web)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
الملف الكامل لطالب محدد

## UI Components / Elements
- بيانات الطالب الشخصية
- بيانات ولي الأمر (مع رقمه ورسالة نصية مباشرة)
- الباص والمشرف المخصصان
- كود QR للطالب (قابل للطباعة)
- سجل رحلاته (آخر 30 يوم)
- إحصائيات (معدل الحضور / التأخيرات)

## User Flow
_Single-step / no multi-step flow specified._

## API Endpoints
- `GET /students/:id`

## Error States
_No special error states specified._
