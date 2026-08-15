# S-12 — زر الطوارئ SOS

**English:** SOS Emergency  
**App:** تطبيق المشرف (Supervisor App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `supervisor` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
زر طوارئ يرسل تنبيه فوري لغرفة العمليات

## UI Components / Elements
- زر SOS أحمر كبير
- تأكيد مزدوج للضغط (لمنع الخطأ)
- حقل وصف الطوارئ (اختياري)
- عرض رقم غرفة العمليات للاتصال

## User Flow
1. ضغط مطول على SOS (3 ثواني)
2. تأكيد: 'هل أنت في حالة طوارئ؟'
3. إرسال تنبيه فوري مع الموقع
4. الاتصال الفوري بغرفة العمليات

## API Endpoints
- `POST /emergency/sos`

## UX Notes / Implementation Notes
يعمل حتى بدون اتصال عبر SMS كخيار احتياطي. الموقع يُرسل تلقائياً

## Error States
_No special error states specified._
