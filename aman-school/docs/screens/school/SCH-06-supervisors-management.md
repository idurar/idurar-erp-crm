# SCH-06 — إدارة المشرفين

**English:** Supervisors Management  
**App:** لوحة مدير المدرسة (School Admin Dashboard)  
**Platform:** React Web (rebuilt here as: responsive module `school` inside the unified Expo app + web build via react-native-web)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
بيانات المشرفين وتعيين الباصات

## UI Components / Elements
- قائمة المشرفين (اسم / رقم موظف / الباص / إجمالي رحلاته / التقييم)
- إضافة مشرف جديد (يُنشئ حسابه في تطبيق المشرف)
- تعيين/تغيير الباص
- إحصائيات أداء المشرف

## User Flow
1. عرض المشرفين
2. إضافة مشرف → إنشاء حساب تلقائي في التطبيق
3. تعيين للباص المناسب

## API Endpoints
- `GET /schools/:id/supervisors`
- `POST /schools/:id/supervisors`

## UX Notes / Implementation Notes
عند إضافة مشرف يتلقى رسالة SMS بتعليمات تحميل التطبيق وبيانات الدخول

## Error States
_No special error states specified._
