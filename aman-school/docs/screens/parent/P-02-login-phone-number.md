# P-02 — تسجيل الدخول

**English:** Login (Phone Number)  
**App:** تطبيق ولي الأمر (Parent App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `parent` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
دخول برقم الجوال فقط — بدون كلمة مرور

## UI Components / Elements
- شعار
- عنوان: 'أدخل رقم جوالك'
- حقل رقم الجوال (مع كود الدولة)
- زر 'متابعة' → يرسل OTP
- رابط 'مساعدة'

## User Flow
1. إدخال رقم الجوال
2. الضغط على متابعة
3. التحقق من الرقم
4. إرسال OTP عبر SMS
5. الانتقال لشاشة OTP

## API Endpoints
- `POST /auth/parent/request-otp`

## UX Notes / Implementation Notes
لا يوجد اسم مستخدم ولا بريد إلكتروني ولا كلمة مرور — الرقم فقط

## Error States
- رقم الجوال غير صحيح (تنسيق)
- هذا الرقم غير مرتبط بأي حساب
- تجاوزت حد الطلبات — انتظر 5 دقائق
