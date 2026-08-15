# P-03 — التحقق OTP

**English:** OTP Verification  
**App:** تطبيق ولي الأمر (Parent App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `parent` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
التأكد من هوية المستخدم عبر رمز SMS

## UI Components / Elements
- نص: 'أرسلنا رمزاً إلى XXXX'
- 6 خانات OTP منفصلة
- مؤقت عكسي (60 ثانية)
- رابط 'إعادة الإرسال' (يظهر بعد انتهاء المؤقت)
- زر 'تأكيد'

## User Flow
1. استلام SMS
2. إدخال الـ 6 أرقام
3. التحقق التلقائي عند إكمال الأرقام
4. أو الضغط على تأكيد
5. الانتقال للرئيسية أو إضافة طالب

## API Endpoints
- `POST /auth/parent/verify-otp`

## UX Notes / Implementation Notes
يفضل القراءة التلقائية من SMS (Auto-fill OTP) على Android. الرمز صالح 10 دقائق

## Error States
- رمز خاطئ — X محاولات متبقية
- انتهت صلاحية الرمز — أعد الإرسال
- ضعف في الشبكة
