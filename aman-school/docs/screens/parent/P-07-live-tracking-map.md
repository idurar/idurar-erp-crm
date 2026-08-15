# P-07 — خريطة التتبع المباشر

**English:** Live Tracking Map  
**App:** تطبيق ولي الأمر (Parent App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `parent` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
خريطة في الوقت الفعلي لموقع الباص مع ETA

## UI Components / Elements
- خريطة Google Maps كاملة الشاشة
- أيقونة الباص المتحركة مع رقمه
- أيقونة موقع المنزل/المدرسة
- بطاقة سفلية تعرض: وقت الوصول المتوقع (ETA)، المسافة المتبقية، عدد المحطات قبلك، اسم المشرف
- زر رفع/خفض البطاقة
- زر الاتصال بالمشرف

## User Flow
1. فتح التتبع → تحميل الخريطة
2. رؤية موقع الباص
3. متابعة التحرك في الوقت الفعلي
4. قراءة ETA

## API Endpoints
- `WSS /tracking/bus/:busId`
- `GET /buses/:id/eta`

## UX Notes / Implementation Notes
تحديث WebSocket كل 5 ثوانٍ على الخريطة. ETA يُحسب بذكاء من السرعة والمسافة. في حال فقدان الاتصال تظهر آخر موقع معروف مع وقته (Dead-reckoning fallback)

## Error States
- الباص متوقف حالياً
- لا يوجد إشارة GPS للباص منذ X دقائق
- الرحلة لم تبدأ بعد
