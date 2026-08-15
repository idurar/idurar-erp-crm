# OWN-08 — إعدادات النظام

**English:** Platform Settings  
**App:** لوحة مالك النظام (Platform Owner Dashboard)  
**Platform:** React Web — للمالك فقط (rebuilt here as: responsive module `owner` inside the unified app)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
إعدادات المنصة العالمية والتقنية

## UI Components / Elements
- إعدادات FCM / MQTT / SMS provider
- حدود الاستخدام لكل باقة
- Feature Flags (تفعيل/تعطيل ميزات لمدارس محددة)
- Maintenance Mode
- إعدادات الأمان والامتثال
- سجل النشاط (Audit Log)

## User Flow
_Single-step / no multi-step flow specified._

## API Endpoints
- `GET/PUT /owner/platform-settings`

## UX Notes / Implementation Notes
Feature Flags تتيح تجربة ميزات جديدة مع مدارس محددة قبل الإطلاق العام

## Error States
_No special error states specified._
