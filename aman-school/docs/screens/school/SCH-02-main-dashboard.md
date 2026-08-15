# SCH-02 — لوحة الرئيسية

**English:** Main Dashboard  
**App:** لوحة مدير المدرسة (School Admin Dashboard)  
**Platform:** React Web (rebuilt here as: responsive module `school` inside the unified Expo app + web build via react-native-web)  
**Status:** موثق  
**MVP:** ✅ Yes — required for first launch

## Description
نظرة عامة على وضع المدرسة اليوم

## UI Components / Elements
- إحصائيات اليوم (رحلات نشطة / طلاب في الطريق / طلاب وصلوا / غائبون)
- خريطة مصغرة لجميع باصات المدرسة
- آخر 5 تنبيهات
- الرحلات الجارية الآن مع حالتها
- مؤشرات KPI (معدل الالتزام / متوسط التأخير)
- رابط سريع لكل قسم

## User Flow
1. دخول → رؤية الوضع الكامل دفعة واحدة
2. الضغط على باص في الخريطة → تفاصيله
3. الضغط على تنبيه → تفاصيله

## API Endpoints
- `GET /schools/:id/dashboard-summary`

## UX Notes / Implementation Notes
تُحدّث كل دقيقتين أو عند وجود حدث مهم

## Error States
_No special error states specified._
