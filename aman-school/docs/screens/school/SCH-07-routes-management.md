# SCH-07 — إدارة المسارات

**English:** Routes Management  
**App:** لوحة مدير المدرسة (School Admin Dashboard)  
**Platform:** React Web (rebuilt here as: responsive module `school` inside the unified Expo app + web build via react-native-web)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
تعريف المسارات ومحطات التوقف لكل باص

## UI Components / Elements
- خريطة تفاعلية لرسم المسار
- قائمة محطات التوقف مرتبة
- ربط الطلاب بمحطاتهم
- تقدير وقت الرحلة

## User Flow
1. رسم المسار على الخريطة
2. إضافة المحطات
3. ربط كل طالب بمحطته

## API Endpoints
- `POST /buses/:id/route`
- `PUT /students/:id/stop`

## UX Notes / Implementation Notes
مهم جداً لدقة حساب ETA

## Error States
_No special error states specified._
