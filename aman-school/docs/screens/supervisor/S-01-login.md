# S-01 — شاشة الدخول

**English:** Login  
**App:** تطبيق المشرف (Supervisor App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `supervisor` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
دخول المشرف برمز الموظف ورقم PIN سريع

## UI Components / Elements
- شعار أمان سكول
- حقل رمز الموظف (Employee ID)
- لوحة أرقام PIN (4-6 خانات)
- زر 'دخول'
- رسالة الخطأ عند الفشل

## User Flow
1. فتح التطبيق
2. إدخال رمز الموظف
3. إدخال PIN الرقمي
4. التحقق (محلي + Server)
5. الدخول للرئيسية

## API Endpoints
- `POST /auth/supervisor/login`
- `POST /auth/supervisor/pin-verify`

## UX Notes / Implementation Notes
الـ PIN يعمل Offline — يُخزن hash آمن محلياً. بعد أول دخول ناجح يعمل بدون إنترنت

## Error States
- رمز موظف غير صحيح
- PIN خاطئ — محاولات متبقية: X
- الحساب موقوف — تواصل مع المدرسة
