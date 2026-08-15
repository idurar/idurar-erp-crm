# OWN-02 — إدارة المدارس

**English:** Schools Management  
**App:** لوحة مالك النظام (Platform Owner Dashboard)  
**Platform:** React Web — للمالك فقط (rebuilt here as: responsive module `owner` inside the unified app)  
**Status:** قيد التصميم  
**MVP:** ✅ Yes — required for first launch

## Description
تسجيل وإدارة جميع المدارس في المنصة

## UI Components / Elements
- جدول المدارس (الاسم / الموقع / الباقة / الطلاب / حالة الاشتراك)
- زر 'تسجيل مدرسة جديدة'
- تصفية حسب: الباقة / الحالة / الشريك / المنطقة
- بحث بالاسم
- لكل مدرسة: عرض / تعديل / إيقاف / حذف

## User Flow
1. تسجيل مدرسة → إدخال البيانات → إنشاء حساب مدير → إرسال بيانات الوصول

## API Endpoints
- `GET /owner/schools`
- `POST /owner/schools/register`
- `PUT /schools/:id/status`

## UX Notes / Implementation Notes
تسجيل مدرسة جديدة يُنشئ تلقائياً: حساب المدير، schema منفصل في DB، مساحة تخزين

## Error States
_No special error states specified._
