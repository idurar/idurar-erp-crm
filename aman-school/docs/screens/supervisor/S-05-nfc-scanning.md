# S-05 — شاشة مسح NFC

**English:** NFC Scanning  
**App:** تطبيق المشرف (Supervisor App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `supervisor` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
الشاشة الرئيسية أثناء الرحلة — مسح أساور الطلاب

## UI Components / Elements
- منطقة مسح كبيرة (تحتل 60% الشاشة)
- أيقونة NFC نابضة للتوضيح
- اسم الطالب + صورته فور المسح
- صوت/اهتزاز تأكيد (أخضر) أو رفض (أحمر)
- عداد الصاعدين / الإجمالي
- زر 'إدخال يدوي' للطوارئ

## User Flow
1. تقريب السوار من الهاتف
2. قراءة الـ UID تلقائياً
3. بحث الطالب في SQLite محلياً
4. تأكيد الصعود + صوت
5. تحديث العداد
6. إرسال للسيرفر (أو Queue إن Offline)

## API Endpoints
- `POST /trips/:id/board`
- `POST /trips/:id/alight`

## UX Notes / Implementation Notes
الاستجابة يجب < 500ms. في حال Offline تُخزن الأحداث في Queue وتُرسل عند الاتصال. الصوت والاهتزاز يؤكدان للمشرف دون النظر للشاشة

## Error States
- سوار غير مسجل في النظام
- الطالب مسح مسبقاً في هذه الرحلة
- فشل قراءة NFC — أعد المحاولة
