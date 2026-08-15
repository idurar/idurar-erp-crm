# S-09 — تسجيل حالة استثنائية

**English:** Exception Recording  
**App:** تطبيق المشرف (Supervisor App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `supervisor` inside the unified app)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
توثيق أي حالة غير طبيعية أثناء الرحلة

## UI Components / Elements
- قائمة أنواع الاستثناءات (تأخير/حادث/غياب/أخرى)
- حقل وصف نصي
- رفع صورة (اختياري)
- زر إرسال لغرفة العمليات

## User Flow
1. اختيار نوع الاستثناء
2. كتابة التفاصيل
3. إضافة صورة إن لزم
4. الإرسال الفوري

## API Endpoints
- `POST /trips/:id/exception`

## UX Notes / Implementation Notes
الاستثناءات تصل فوراً لغرفة العمليات كتنبيه عالي الأولوية

## Error States
_No special error states specified._
