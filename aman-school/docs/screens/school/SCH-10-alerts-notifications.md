# SCH-10 — التنبيهات والإشعارات

**English:** Alerts & Notifications  
**App:** لوحة مدير المدرسة (School Admin Dashboard)  
**Platform:** React Web (rebuilt here as: responsive module `school` inside the unified Expo app + web build via react-native-web)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
إدارة التنبيهات والتواصل مع أولياء الأمور

## UI Components / Elements
- قائمة التنبيهات الواردة والصادرة
- إرسال إشعار جماعي لأولياء الأمور
- إعدادات قواعد التنبيه التلقائي (تأخير > X دقيقة)
- سجل الإشعارات المرسلة

## User Flow
_Single-step / no multi-step flow specified._

## API Endpoints
- `POST /schools/:id/notifications/broadcast`

## Error States
_No special error states specified._
