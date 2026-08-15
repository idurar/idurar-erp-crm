# P-09 — الإشعارات

**English:** Notifications Center  
**App:** تطبيق ولي الأمر (Parent App)  
**Platform:** Flutter — iOS + Android (rebuilt here as: Expo/React Native module `parent` inside the unified app)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
مركز الإشعارات والتنبيهات المستلمة

## UI Components / Elements
- قائمة الإشعارات مع الأيقونة ووقتها
- أنواع الإشعارات: (صعد الباص / وصل المدرسة / نزل المدرسة / وصل المنزل / تأخير / طوارئ)
- زر 'تحديد الكل كمقروء'
- إعدادات الإشعارات (سريع)

## User Flow
1. استقبال Push Notification
2. الضغط → فتح التطبيق على الإشعار
3. أو فتح مركز الإشعارات يدوياً

## API Endpoints
- `GET /parents/:id/notifications`
- `PUT /notifications/:id/read`

## UX Notes / Implementation Notes
الإشعارات المهمة (طوارئ) تصل بصوت مختلف وتهتز الهاتف حتى لو كان على صامت — يجب تجاوز وضع الصامت (Critical Alert override)

## Error States
_No special error states specified._
