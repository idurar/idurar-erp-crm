# P-01 — شاشة الترحيب

**English:** Welcome / Splash  
**App:** تطبيق ولي الأمر (Parent App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `parent` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
نقطة الدخول الأولى للتطبيق — تعريف وتحفيز

## UI Components / Elements
- شعار أمان سكول
- صورة حافلة مدرسية ووالد وطفل
- العنوان: 'رحلة أكثر أماناً لأبنائك'
- نص تعريفي مختصر (سطرين)
- زر 'ابدأ الآن'
- رابط 'تسجيل الدخول' إن كان مسجلاً

## User Flow
1. فتح التطبيق لأول مرة
2. مشاهدة شاشة الترحيب (3 ثواني)
3. الضغط على ابدأ الآن
4. الانتقال لتسجيل الدخول

## API Endpoints
_No direct API calls — client-side only screen._

## UX Notes / Implementation Notes
بسيطة جداً — لا تتجاوز 3 ثواني. تختفي تلقائياً للمستخدمين المسجلين مسبقاً

## Error States
_No special error states specified._
