# P-06 — تفاصيل الابن

**English:** Child Detail  
**App:** تطبيق ولي الأمر (Parent App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `parent` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
صفحة تفاصيل ابن محدد — حالته ورحلته اليوم

## UI Components / Elements
- صورة الطالب والاسم
- المدرسة + الصف
- الباص المخصص (رقم + المشرف)
- حالة اليوم (أيقونة بصرية كبيرة)
- آخر 3 أحداث اليوم (صعود/وصول/نزول مع الأوقات)
- زر 'تتبع الباص مباشرة'
- زر 'سجل رحلاته الكاملة'
- معلومات الاتصال (مشرف/مدرسة)

## User Flow
1. من الرئيسية → الضغط على بطاقة الابن
2. مراجعة حالته اليومية
3. الضغط على تتبع للخريطة

## API Endpoints
- `GET /students/:id/today-status`
- `GET /students/:id/details`

## Error States
_No special error states specified._
