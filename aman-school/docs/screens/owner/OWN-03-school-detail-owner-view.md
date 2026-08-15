# OWN-03 — تفاصيل مدرسة

**English:** School Detail (Owner View)  
**App:** لوحة مالك النظام (Platform Owner Dashboard)  
**Platform:** React Web — للمالك فقط (rebuilt here as: responsive module `owner` inside the unified app)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
نظرة المالك التفصيلية على مدرسة محددة

## UI Components / Elements
- بيانات المدرسة الكاملة
- إحصائيات الاستخدام (طلاب / باصات / رحلات)
- تاريخ الدفع والفواتير
- حالة الاشتراك (نشط/مُعلّق/منتهي)
- بيانات الشريك (إن وجد)
- إمكانية الدخول لحساب المدرسة (Impersonate)

## User Flow
_Single-step / no multi-step flow specified._

## API Endpoints
- `GET /owner/schools/:id/detail`

## UX Notes / Implementation Notes
ميزة Impersonate تتيح للمالك رؤية النظام بعين مدير المدرسة للدعم الفني

## Error States
_No special error states specified._
