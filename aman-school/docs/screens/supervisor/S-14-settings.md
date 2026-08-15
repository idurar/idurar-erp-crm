# S-14 — الإعدادات

**English:** Settings  
**App:** تطبيق المشرف (Supervisor App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `supervisor` inside the unified app)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
إعدادات التطبيق الشخصية للمشرف

## UI Components / Elements
- معلومات المشرف
- إعدادات الصوت والاهتزاز
- إعدادات NFC
- تغيير الـ PIN
- مزامنة البيانات الآن
- تسجيل الخروج

## User Flow
_Single-step / no multi-step flow specified._

## API Endpoints
- `PUT /supervisor/:id/settings`

## UX Notes / Implementation Notes
زر المزامنة اليدوية لرفع البيانات المخزنة عند عودة الإنترنت

## Error States
_No special error states specified._
