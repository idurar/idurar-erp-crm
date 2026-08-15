# S-11 — تقرير الرحلة النهائي

**English:** Trip Final Report  
**App:** تطبيق المشرف (Supervisor App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `supervisor` inside the unified app)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
ملخص كامل للرحلة بعد إنهائها

## UI Components / Elements
- إجمالي الطلاب الصاعدين/النازلين
- مدة الرحلة
- الاستثناءات المسجلة
- حالة المزامنة مع السيرفر
- زر مشاركة التقرير

## User Flow
1. عرض تلقائي بعد الإنهاء
2. مراجعة الأرقام
3. رفع للسيرفر إن لم يكن متزامناً

## API Endpoints
- `GET /trips/:id/report`

## UX Notes / Implementation Notes
يُرفع تلقائياً. في حال Offline يُخزن ويُرسل عند الاتصال

## Error States
_No special error states specified._
