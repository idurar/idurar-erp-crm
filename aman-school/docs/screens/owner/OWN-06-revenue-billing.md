# OWN-06 — الإيرادات والفوترة

**English:** Revenue & Billing  
**App:** لوحة مالك النظام (Platform Owner Dashboard)  
**Platform:** React Web — للمالك فقط (rebuilt here as: responsive module `owner` inside the unified app)  
**Status:** قيد التصميم  
**MVP:** ⛔️ No — post-MVP

## Description
لوحة الإيرادات الكاملة والفواتير

## UI Components / Elements
- إجمالي الإيراد الشهري / السنوي
- رسم بياني للإيرادات
- قائمة الفواتير المصدرة
- الفواتير غير المدفوعة (مع التنبيه)
- إصدار فاتورة يدوياً
- تقرير للمحاسبة (Excel)

## User Flow
_Single-step / no multi-step flow specified._

## API Endpoints
- `GET /owner/revenue/summary`
- `GET /owner/invoices`

## Error States
_No special error states specified._
