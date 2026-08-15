# SCH-11 — إعدادات المدرسة

**English:** School Settings  
**App:** لوحة مدير المدرسة (School Admin Dashboard)  
**Platform:** React Web (rebuilt here as: responsive module `school` inside the unified Expo app + web build via react-native-web)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
إعدادات عامة للمدرسة في النظام

## UI Components / Elements
- بيانات المدرسة (اسم / عنوان / شعار)
- أوقات الدوام الافتراضية
- إعدادات الإشعارات التلقائية
- مستخدمو النظام وصلاحياتهم
- معلومات الاشتراك والباقة

## User Flow
_Single-step / no multi-step flow specified._

## API Endpoints
- `PUT /schools/:id/settings`

## Error States
_No special error states specified._
