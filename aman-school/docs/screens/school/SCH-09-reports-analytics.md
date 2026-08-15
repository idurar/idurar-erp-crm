# SCH-09 — التقارير والإحصائيات

**English:** Reports & Analytics  
**App:** لوحة مدير المدرسة (School Admin Dashboard)  
**Platform:** React Web (rebuilt here as: responsive module `school` inside the unified Expo app + web build via react-native-web)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
تقارير شاملة لأداء النقل المدرسي

## UI Components / Elements
- فلتر الفترة الزمنية
- تقرير الحضور والغياب
- تقرير التأخيرات (باص / مشرف / طريق)
- تقرير الاستثناءات والحوادث
- معدل رضا أولياء الأمور
- تصدير Excel / PDF

## User Flow
1. اختيار نوع التقرير والفترة
2. عرض الرسوم البيانية
3. تصدير

## API Endpoints
- `GET /schools/:id/reports`

## Error States
_No special error states specified._
