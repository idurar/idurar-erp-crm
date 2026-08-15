# P-05 — الرئيسية

**English:** Home Dashboard  
**App:** تطبيق ولي الأمر (Parent App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `parent` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
الشاشة الرئيسية — نظرة سريعة على حالة جميع الأبناء

## UI Components / Elements
- تحية شخصية (صباح الخير، [الاسم])
- بطاقات الأبناء (واحدة لكل ابن) مع: الاسم والمدرسة، الحالة الحالية (في المنزل/في الطريق/في المدرسة)، آخر تحديث، أيقونة تتبع مباشر
- زر '+' لإضافة ابن آخر
- شريط إشعارات سريع أعلاه

## User Flow
1. دخول → الرئيسية مباشرة
2. رؤية حالة جميع الأبناء دفعة واحدة
3. الضغط على بطاقة ابن → تفاصيله
4. الضغط على أيقونة التتبع → خريطة مباشرة

## API Endpoints
- `GET /parents/:id/children/status`

## UX Notes / Implementation Notes
أهم شاشة في التطبيق — يجب أن تُحمّل في < 1 ثانية. الحالة تتحدث كل دقيقتين أو عند كل حدث. ملاحظة: يمكن لولي الأمر ربط أبناء من مدارس (Tenants) مختلفة في نفس الحساب

## Error States
- لا يوجد أبناء مضافون — اضغط + لإضافة ابنك
