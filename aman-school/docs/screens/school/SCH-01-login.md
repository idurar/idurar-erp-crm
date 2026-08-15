# SCH-01 — تسجيل الدخول

**English:** Login  
**App:** لوحة مدير المدرسة (School Admin Dashboard)  
**Platform:** React Web (rebuilt here as: responsive module `school` inside the unified Expo app + web build via react-native-web)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
دخول آمن لمدير المدرسة

## UI Components / Elements
- شعار المدرسة + أمان سكول
- البريد الإلكتروني
- كلمة المرور
- زر 'نسيت كلمة المرور'
- 2FA اختياري للمدراء

## User Flow
1. إدخال البريد والكلمة
2. التحقق
3. إدخال 2FA إن مفعل
4. الدخول للرئيسية

## API Endpoints
- `POST /auth/school-admin/login`

## UX Notes / Implementation Notes
البريد الإلكتروني يُنشأ من قِبل مدير النظام عند تسجيل المدرسة

## Error States
- بيانات خاطئة
- الحساب موقوف — تواصل مع الدعم
