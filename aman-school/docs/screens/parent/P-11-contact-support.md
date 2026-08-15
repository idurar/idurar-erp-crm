# P-11 — التواصل / دعم

**English:** Contact & Support  
**App:** تطبيق ولي الأمر (Parent App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `parent` inside the unified app)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
التواصل مع المدرسة وغرفة العمليات

## UI Components / Elements
- أزرار اتصال سريع (المدرسة / غرفة العمليات / المشرف)
- إرسال بلاغ نصي
- زر SOS - طوارئ (أحمر كبير)

## User Flow
_Single-step / no multi-step flow specified._

## API Endpoints
- `POST /support/contact`

## UX Notes / Implementation Notes
زر الطوارئ يُرسل موقع ولي الأمر + بيانات الابن لغرفة العمليات فوراً

## Error States
_No special error states specified._
