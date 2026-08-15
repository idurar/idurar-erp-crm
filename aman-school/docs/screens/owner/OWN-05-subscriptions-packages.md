# OWN-05 — إدارة الاشتراكات والباقات

**English:** Subscriptions & Packages  
**App:** لوحة مالك النظام (Platform Owner Dashboard)  
**Platform:** React Web — للمالك فقط (rebuilt here as: responsive module `owner` inside the unified app)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
إدارة الباقات والأسعار والاشتراكات

## UI Components / Elements
- عرض الباقات الحالية (أساسي/متقدم/شامل)
- تعديل الأسعار
- عروض وخصومات
- جدول المشتركين حسب الباقة
- مدارس على وشك انتهاء اشتراكها (تنبيه)

## User Flow
_Single-step / no multi-step flow specified._

## API Endpoints
- `GET /owner/packages`
- `PUT /owner/packages/:id`
- `GET /owner/subscriptions`

## Error States
_No special error states specified._
