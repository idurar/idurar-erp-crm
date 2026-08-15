// Generates one Markdown file per screen (docs/screens/<app>/<ID>-<slug>.md)
// plus per-app and top-level indexes, from the canonical screen spec below.
// Source of truth: aman_school_screens_doc.jsx (APPS_DATA) supplied by the product owner.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "docs", "screens");

const APPS_DATA = {
  supervisor: {
    key: "supervisor",
    name: "تطبيق المشرف",
    nameEn: "Supervisor App",
    icon: "👮",
    platform: "Flutter — iOS + Android (rebuilt here as: Expo/React Native module `supervisor` inside the unified app)",
    desc: "التطبيق الميداني للمشرفين في الباصات — يعمل بالكامل بدون إنترنت",
    screens: [
      { id: "S-01", name: "شاشة الدخول", nameEn: "Login", status: "موثق", mvp: true,
        desc: "دخول المشرف برمز الموظف ورقم PIN سريع",
        elements: ["شعار أمان سكول", "حقل رمز الموظف (Employee ID)", "لوحة أرقام PIN (4-6 خانات)", "زر 'دخول'", "رسالة الخطأ عند الفشل"],
        flow: ["فتح التطبيق", "إدخال رمز الموظف", "إدخال PIN الرقمي", "التحقق (محلي + Server)", "الدخول للرئيسية"],
        apis: ["POST /auth/supervisor/login", "POST /auth/supervisor/pin-verify"],
        notes: "الـ PIN يعمل Offline — يُخزن hash آمن محلياً. بعد أول دخول ناجح يعمل بدون إنترنت",
        errors: ["رمز موظف غير صحيح", "PIN خاطئ — محاولات متبقية: X", "الحساب موقوف — تواصل مع المدرسة"] },
      { id: "S-02", name: "اختيار الرحلة", nameEn: "Select Trip", status: "موثق", mvp: true,
        desc: "اختيار الرحلة قبل بدء العمل (ذهاب/عودة)",
        elements: ["التاريخ والوقت الحالي", "معلومات الباص (رقم + اللوحة)", "الرحلات المجدولة اليوم (ذهاب/عودة)", "زر 'اختر هذه الرحلة'", "حالة الاتصال بالإنترنت"],
        flow: ["بعد الدخول تظهر قائمة الرحلات", "اختيار رحلة الذهاب أو العودة", "مراجعة قائمة الطلاب المتوقعين", "تأكيد الاختيار والانتقال"],
        apis: ["GET /supervisor/trips/today", "POST /trips/:id/assign-supervisor"],
        notes: "تُحمّل بيانات الرحلة والطلاب مسبقاً (Pre-fetch) عند الاتصال لضمان العمل Offline",
        errors: ["لا توجد رحلات مجدولة اليوم", "تعذر تحميل البيانات — العمل من Cache"] },
      { id: "S-03", name: "قائمة الطلاب (قبل الرحلة)", nameEn: "Pre-Trip Student List", status: "موثق", mvp: true,
        desc: "مراجعة قائمة الطلاب المتوقع صعودهم قبل البدء",
        elements: ["عدد الطلاب الإجمالي", "قائمة بأسماء الطلاب + صورهم", "حالة كل طالب (متوقع / غائب مسبقاً)", "حقل بحث بالاسم", "زر 'بدء الرحلة'"],
        flow: ["عرض قائمة مرتبة حسب المحطة", "مراجعة سريعة", "تحديث الغياب المسبق إن وجد", "الضغط على بدء الرحلة"],
        apis: ["GET /trips/:id/students"],
        notes: "تعمل 100% Offline من SQLite المحلي. الصور مُحملة مسبقاً بجودة منخفضة للتوفير",
        errors: [] },
      { id: "S-04", name: "شاشة بدء الرحلة", nameEn: "Start Trip Screen", status: "موثق", mvp: true,
        desc: "تأكيد بدء الرحلة وتفعيل تتبع GPS",
        elements: ["تفاصيل الرحلة (من/إلى/التوقيت)", "زر 'بدء الرحلة الآن' (كبير وواضح)", "حالة GPS (نشط/غير نشط)", "حالة الاتصال بالإنترنت"],
        flow: ["الضغط على بدء الرحلة", "تأكيد مربع الحوار", "تفعيل GPS Tracking", "الانتقال لشاشة المسح"],
        apis: ["POST /trips/:id/start", "PUT /buses/:id/gps-active"],
        notes: "عند الضغط يبدأ إرسال GPS كل 30 ثانية عبر MQTT حتى في الخلفية",
        errors: ["GPS غير مفعل — اطلب تفعيله", "تعذر الاتصال بالسيرفر — الرحلة ستُزامن لاحقاً"] },
      { id: "S-05", name: "شاشة مسح NFC", nameEn: "NFC Scanning", status: "موثق", mvp: true,
        desc: "الشاشة الرئيسية أثناء الرحلة — مسح أساور الطلاب",
        elements: ["منطقة مسح كبيرة (تحتل 60% الشاشة)", "أيقونة NFC نابضة للتوضيح", "اسم الطالب + صورته فور المسح", "صوت/اهتزاز تأكيد (أخضر) أو رفض (أحمر)", "عداد الصاعدين / الإجمالي", "زر 'إدخال يدوي' للطوارئ"],
        flow: ["تقريب السوار من الهاتف", "قراءة الـ UID تلقائياً", "بحث الطالب في SQLite محلياً", "تأكيد الصعود + صوت", "تحديث العداد", "إرسال للسيرفر (أو Queue إن Offline)"],
        apis: ["POST /trips/:id/board", "POST /trips/:id/alight"],
        notes: "الاستجابة يجب < 500ms. في حال Offline تُخزن الأحداث في Queue وتُرسل عند الاتصال. الصوت والاهتزاز يؤكدان للمشرف دون النظر للشاشة",
        errors: ["سوار غير مسجل في النظام", "الطالب مسح مسبقاً في هذه الرحلة", "فشل قراءة NFC — أعد المحاولة"] },
      { id: "S-06", name: "تفاصيل الطالب (بعد المسح)", nameEn: "Student Detail Card", status: "موثق", mvp: true,
        desc: "بطاقة معلومات الطالب تظهر فور المسح الناجح",
        elements: ["صورة الطالب (كبيرة)", "الاسم الكامل والصف", "اسم ولي الأمر + رقمه", "المحطة (نقطة التوقف)", "وقت الصعود المسجل", "زر تراجع (خلال 10 ثواني)"],
        flow: ["تظهر تلقائياً بعد المسح", "مراجعة سريعة 3-5 ثواني", "اختفاء تلقائي أو تراجع", "العودة لشاشة المسح"],
        apis: [],
        notes: "تُغلق تلقائياً بعد 5 ثواني للإسراع. زر التراجع يلغي تسجيل الصعود خلال 10 ثواني فقط",
        errors: [] },
      { id: "S-07", name: "إدخال يدوي (طوارئ)", nameEn: "Manual Entry", status: "قيد التصميم", mvp: false,
        desc: "إضافة طالب يدوياً عند تعطل سواره",
        elements: ["حقل بحث بالاسم أو رقم الطالب", "قائمة نتائج البحث", "زر تأكيد الصعود", "حقل سبب الإدخال اليدوي"],
        flow: ["كتابة اسم الطالب أو ID", "اختيار من النتائج", "كتابة سبب (سوار تعطل/ضاع)", "تأكيد التسجيل"],
        apis: ["GET /students/search", "POST /trips/:id/manual-board"],
        notes: "يُسجل في النظام كـ 'يدوي' مع سبب للمراجعة لاحقاً. يُنبّه المشرف لإبلاغ المدرسة",
        errors: ["الطالب غير موجود في قائمة هذا الباص"] },
      { id: "S-08", name: "حالة الرحلة الجارية", nameEn: "Trip Live Status", status: "موثق", mvp: true,
        desc: "ملخص الرحلة الجارية مع إمكانية التبديل بين المسح والمتابعة",
        elements: ["شريط التقدم (المحطات المنجزة)", "عدد الطلاب (صعدوا / لم يصعدوا بعد / الإجمالي)", "المحطة الحالية والقادمة", "قائمة الطلاب مع حالتهم (أيقونات)", "زر SOS الطوارئ (دائماً ظاهر)", "زر العودة للمسح"],
        flow: ["تظهر بين المسح وعند الحاجة", "مراجعة من لم يصعد بعد", "متابعة التقدم في المسار", "الضغط على اسم طالب لتفاصيله"],
        apis: ["GET /trips/:id/live-status"],
        notes: "زر SOS يظهر دائماً في الزاوية بلون أحمر مميز. لا يختفي أبداً",
        errors: [] },
      { id: "S-09", name: "تسجيل حالة استثنائية", nameEn: "Exception Recording", status: "قيد التصميم", mvp: false,
        desc: "توثيق أي حالة غير طبيعية أثناء الرحلة",
        elements: ["قائمة أنواع الاستثناءات (تأخير/حادث/غياب/أخرى)", "حقل وصف نصي", "رفع صورة (اختياري)", "زر إرسال لغرفة العمليات"],
        flow: ["اختيار نوع الاستثناء", "كتابة التفاصيل", "إضافة صورة إن لزم", "الإرسال الفوري"],
        apis: ["POST /trips/:id/exception"],
        notes: "الاستثناءات تصل فوراً لغرفة العمليات كتنبيه عالي الأولوية",
        errors: [] },
      { id: "S-10", name: "شاشة إنهاء الرحلة", nameEn: "End Trip", status: "موثق", mvp: true,
        desc: "إنهاء الرحلة وتأكيد خروج جميع الطلاب",
        elements: ["تحقق: هل جميع الطلاب نزلوا؟", "قائمة من لم يُسجل نزوله", "ملاحظات ختامية", "زر 'إنهاء الرحلة'", "ملخص سريع للرحلة"],
        flow: ["مسح نزول آخر طالب", "النظام يذكّر بمن لم يُسجل", "التأكيد على خروج الجميع", "الضغط على الإنهاء", "رفع التقرير"],
        apis: ["PUT /trips/:id/end", "POST /trips/:id/report"],
        notes: "تحذير مهم: لا يُسمح بالإنهاء دون التأكيد على جميع الطلاب — يمنع نسيان الأطفال في الباص",
        errors: ["لا يزال X طالب لم يُسجل نزوله — هل أنت متأكد؟"] },
      { id: "S-11", name: "تقرير الرحلة النهائي", nameEn: "Trip Final Report", status: "قيد التصميم", mvp: false,
        desc: "ملخص كامل للرحلة بعد إنهائها",
        elements: ["إجمالي الطلاب الصاعدين/النازلين", "مدة الرحلة", "الاستثناءات المسجلة", "حالة المزامنة مع السيرفر", "زر مشاركة التقرير"],
        flow: ["عرض تلقائي بعد الإنهاء", "مراجعة الأرقام", "رفع للسيرفر إن لم يكن متزامناً"],
        apis: ["GET /trips/:id/report"],
        notes: "يُرفع تلقائياً. في حال Offline يُخزن ويُرسل عند الاتصال",
        errors: [] },
      { id: "S-12", name: "زر الطوارئ SOS", nameEn: "SOS Emergency", status: "موثق", mvp: true,
        desc: "زر طوارئ يرسل تنبيه فوري لغرفة العمليات",
        elements: ["زر SOS أحمر كبير", "تأكيد مزدوج للضغط (لمنع الخطأ)", "حقل وصف الطوارئ (اختياري)", "عرض رقم غرفة العمليات للاتصال"],
        flow: ["ضغط مطول على SOS (3 ثواني)", "تأكيد: 'هل أنت في حالة طوارئ؟'", "إرسال تنبيه فوري مع الموقع", "الاتصال الفوري بغرفة العمليات"],
        apis: ["POST /emergency/sos"],
        notes: "يعمل حتى بدون اتصال عبر SMS كخيار احتياطي. الموقع يُرسل تلقائياً",
        errors: [] },
      { id: "S-13", name: "الإشعارات", nameEn: "Notifications", status: "قيد التصميم", mvp: false,
        desc: "إشعارات من المدرسة وغرفة العمليات",
        elements: ["قائمة الإشعارات مع وقتها", "أيقونة للأولوية (عادي/عاجل)", "إمكانية الرد على بعض الإشعارات"],
        flow: ["عرض الإشعارات الجديدة", "قراءة التفاصيل", "الرد أو التجاهل"],
        apis: ["GET /supervisor/:id/notifications"],
        notes: "", errors: [] },
      { id: "S-14", name: "الإعدادات", nameEn: "Settings", status: "قيد التصميم", mvp: false,
        desc: "إعدادات التطبيق الشخصية للمشرف",
        elements: ["معلومات المشرف", "إعدادات الصوت والاهتزاز", "إعدادات NFC", "تغيير الـ PIN", "مزامنة البيانات الآن", "تسجيل الخروج"],
        flow: [],
        apis: ["PUT /supervisor/:id/settings"],
        notes: "زر المزامنة اليدوية لرفع البيانات المخزنة عند عودة الإنترنت",
        errors: [] },
    ]
  },

  parent: {
    key: "parent",
    name: "تطبيق ولي الأمر",
    nameEn: "Parent App",
    icon: "👨‍👩‍👦",
    platform: "Flutter — iOS + Android (rebuilt here as: Expo/React Native module `parent` inside the unified app)",
    desc: "الواجهة الرئيسية للأسرة — متابعة الأبناء والإشعارات الفورية",
    screens: [
      { id: "P-01", name: "شاشة الترحيب", nameEn: "Welcome / Splash", status: "موثق", mvp: true,
        desc: "نقطة الدخول الأولى للتطبيق — تعريف وتحفيز",
        elements: ["شعار أمان سكول", "صورة حافلة مدرسية ووالد وطفل", "العنوان: 'رحلة أكثر أماناً لأبنائك'", "نص تعريفي مختصر (سطرين)", "زر 'ابدأ الآن'", "رابط 'تسجيل الدخول' إن كان مسجلاً"],
        flow: ["فتح التطبيق لأول مرة", "مشاهدة شاشة الترحيب (3 ثواني)", "الضغط على ابدأ الآن", "الانتقال لتسجيل الدخول"],
        apis: [],
        notes: "بسيطة جداً — لا تتجاوز 3 ثواني. تختفي تلقائياً للمستخدمين المسجلين مسبقاً",
        errors: [] },
      { id: "P-02", name: "تسجيل الدخول", nameEn: "Login (Phone Number)", status: "موثق", mvp: true,
        desc: "دخول برقم الجوال فقط — بدون كلمة مرور",
        elements: ["شعار", "عنوان: 'أدخل رقم جوالك'", "حقل رقم الجوال (مع كود الدولة)", "زر 'متابعة' → يرسل OTP", "رابط 'مساعدة'"],
        flow: ["إدخال رقم الجوال", "الضغط على متابعة", "التحقق من الرقم", "إرسال OTP عبر SMS", "الانتقال لشاشة OTP"],
        apis: ["POST /auth/parent/request-otp"],
        notes: "لا يوجد اسم مستخدم ولا بريد إلكتروني ولا كلمة مرور — الرقم فقط",
        errors: ["رقم الجوال غير صحيح (تنسيق)", "هذا الرقم غير مرتبط بأي حساب", "تجاوزت حد الطلبات — انتظر 5 دقائق"] },
      { id: "P-03", name: "التحقق OTP", nameEn: "OTP Verification", status: "موثق", mvp: true,
        desc: "التأكد من هوية المستخدم عبر رمز SMS",
        elements: ["نص: 'أرسلنا رمزاً إلى XXXX'", "6 خانات OTP منفصلة", "مؤقت عكسي (60 ثانية)", "رابط 'إعادة الإرسال' (يظهر بعد انتهاء المؤقت)", "زر 'تأكيد'"],
        flow: ["استلام SMS", "إدخال الـ 6 أرقام", "التحقق التلقائي عند إكمال الأرقام", "أو الضغط على تأكيد", "الانتقال للرئيسية أو إضافة طالب"],
        apis: ["POST /auth/parent/verify-otp"],
        notes: "يفضل القراءة التلقائية من SMS (Auto-fill OTP) على Android. الرمز صالح 10 دقائق",
        errors: ["رمز خاطئ — X محاولات متبقية", "انتهت صلاحية الرمز — أعد الإرسال", "ضعف في الشبكة"] },
      { id: "P-04", name: "إضافة ابن (أول مرة)", nameEn: "Add First Student", status: "موثق", mvp: true,
        desc: "ربط أول ابن بالحساب بعد أول تسجيل دخول",
        elements: ["شرح سريع: 'احصل على الكود من مدرسة ابنك'", "حقل إدخال كود الطالب (SCHOOL-2026-XXXXX)", "زر 'مسح QR Code' (يفتح الكاميرا)", "زر 'إضافة'", "معاينة بيانات الطالب قبل التأكيد"],
        flow: ["الحصول على الكود من المدرسة", "إدخال الكود أو مسح QR", "عرض بيانات الطالب (اسم + مدرسة + باص)", "التأكيد", "ظهور الابن في الرئيسية"],
        apis: ["POST /parents/students/link"],
        notes: "QR Code هو الطريقة الأسرع. بعد الإضافة تظهر شاشة 'مرحباً بـ [اسم الطالب]' لتأكيد النجاح. تنسيق الكود SCHOOL-2026-XXXXX (بادئة المدرسة + السنة + رقم تسلسلي)",
        errors: ["الكود غير صحيح", "هذا الطالب مرتبط بحساب آخر — تواصل مع المدرسة", "QR Code غير واضح"] },
      { id: "P-05", name: "الرئيسية", nameEn: "Home Dashboard", status: "موثق", mvp: true,
        desc: "الشاشة الرئيسية — نظرة سريعة على حالة جميع الأبناء",
        elements: ["تحية شخصية (صباح الخير، [الاسم])", "بطاقات الأبناء (واحدة لكل ابن) مع: الاسم والمدرسة، الحالة الحالية (في المنزل/في الطريق/في المدرسة)، آخر تحديث، أيقونة تتبع مباشر", "زر '+' لإضافة ابن آخر", "شريط إشعارات سريع أعلاه"],
        flow: ["دخول → الرئيسية مباشرة", "رؤية حالة جميع الأبناء دفعة واحدة", "الضغط على بطاقة ابن → تفاصيله", "الضغط على أيقونة التتبع → خريطة مباشرة"],
        apis: ["GET /parents/:id/children/status"],
        notes: "أهم شاشة في التطبيق — يجب أن تُحمّل في < 1 ثانية. الحالة تتحدث كل دقيقتين أو عند كل حدث. ملاحظة: يمكن لولي الأمر ربط أبناء من مدارس (Tenants) مختلفة في نفس الحساب",
        errors: ["لا يوجد أبناء مضافون — اضغط + لإضافة ابنك"] },
      { id: "P-06", name: "تفاصيل الابن", nameEn: "Child Detail", status: "موثق", mvp: true,
        desc: "صفحة تفاصيل ابن محدد — حالته ورحلته اليوم",
        elements: ["صورة الطالب والاسم", "المدرسة + الصف", "الباص المخصص (رقم + المشرف)", "حالة اليوم (أيقونة بصرية كبيرة)", "آخر 3 أحداث اليوم (صعود/وصول/نزول مع الأوقات)", "زر 'تتبع الباص مباشرة'", "زر 'سجل رحلاته الكاملة'", "معلومات الاتصال (مشرف/مدرسة)"],
        flow: ["من الرئيسية → الضغط على بطاقة الابن", "مراجعة حالته اليومية", "الضغط على تتبع للخريطة"],
        apis: ["GET /students/:id/today-status", "GET /students/:id/details"],
        notes: "", errors: [] },
      { id: "P-07", name: "خريطة التتبع المباشر", nameEn: "Live Tracking Map", status: "موثق", mvp: true,
        desc: "خريطة في الوقت الفعلي لموقع الباص مع ETA",
        elements: ["خريطة Google Maps كاملة الشاشة", "أيقونة الباص المتحركة مع رقمه", "أيقونة موقع المنزل/المدرسة", "بطاقة سفلية تعرض: وقت الوصول المتوقع (ETA)، المسافة المتبقية، عدد المحطات قبلك، اسم المشرف", "زر رفع/خفض البطاقة", "زر الاتصال بالمشرف"],
        flow: ["فتح التتبع → تحميل الخريطة", "رؤية موقع الباص", "متابعة التحرك في الوقت الفعلي", "قراءة ETA"],
        apis: ["WSS /tracking/bus/:busId", "GET /buses/:id/eta"],
        notes: "تحديث WebSocket كل 5 ثوانٍ على الخريطة. ETA يُحسب بذكاء من السرعة والمسافة. في حال فقدان الاتصال تظهر آخر موقع معروف مع وقته (Dead-reckoning fallback)",
        errors: ["الباص متوقف حالياً", "لا يوجد إشارة GPS للباص منذ X دقائق", "الرحلة لم تبدأ بعد"] },
      { id: "P-08", name: "سجل الرحلات", nameEn: "Trip History", status: "موثق", mvp: false,
        desc: "تاريخ كامل لجميع رحلات الابن",
        elements: ["فلتر: الأسبوع / الشهر / مخصص", "قائمة الرحلات مرتبة بالتاريخ", "لكل رحلة: التاريخ + وقت الصعود + وقت الوصول + حالة", "ضغط على رحلة → تفاصيلها على الخريطة (مسار الرحلة)"],
        flow: ["اختيار الفترة الزمنية", "مراجعة الرحلات", "الضغط على رحلة لتفاصيلها"],
        apis: ["GET /students/:id/trips?from=&to="],
        notes: "مفيد جداً لتتبع الانتظام والغياب",
        errors: [] },
      { id: "P-09", name: "الإشعارات", nameEn: "Notifications Center", status: "موثق", mvp: true,
        desc: "مركز الإشعارات والتنبيهات المستلمة",
        elements: ["قائمة الإشعارات مع الأيقونة ووقتها", "أنواع الإشعارات: (صعد الباص / وصل المدرسة / نزل المدرسة / وصل المنزل / تأخير / طوارئ)", "زر 'تحديد الكل كمقروء'", "إعدادات الإشعارات (سريع)"],
        flow: ["استقبال Push Notification", "الضغط → فتح التطبيق على الإشعار", "أو فتح مركز الإشعارات يدوياً"],
        apis: ["GET /parents/:id/notifications", "PUT /notifications/:id/read"],
        notes: "الإشعارات المهمة (طوارئ) تصل بصوت مختلف وتهتز الهاتف حتى لو كان على صامت — يجب تجاوز وضع الصامت (Critical Alert override)",
        errors: [] },
      { id: "P-10", name: "إعدادات الإشعارات", nameEn: "Notification Settings", status: "قيد التصميم", mvp: false,
        desc: "تخصيص أنواع الإشعارات التي يريد وليّ الأمر استلامها",
        elements: ["مفتاح لكل نوع إشعار", "إعداد الهدوء (ساعات لا إشعارات فيها)", "اختيار صوت الإشعار"],
        flow: [], apis: ["PUT /parents/:id/notification-prefs"],
        notes: "", errors: [] },
      { id: "P-11", name: "التواصل / دعم", nameEn: "Contact & Support", status: "قيد التصميم", mvp: false,
        desc: "التواصل مع المدرسة وغرفة العمليات",
        elements: ["أزرار اتصال سريع (المدرسة / غرفة العمليات / المشرف)", "إرسال بلاغ نصي", "زر SOS - طوارئ (أحمر كبير)"],
        flow: [], apis: ["POST /support/contact"],
        notes: "زر الطوارئ يُرسل موقع ولي الأمر + بيانات الابن لغرفة العمليات فوراً",
        errors: [] },
      { id: "P-12", name: "إضافة ابن آخر", nameEn: "Add Another Student", status: "موثق", mvp: false,
        desc: "إضافة ابن آخر (من مدرسة مختلفة أو نفسها)",
        elements: ["نفس شاشة P-04 بإضافات", "تنبيه: 'ستتلقى إشعارات لجميع أبنائك'"],
        flow: [], apis: ["POST /parents/students/link"],
        notes: "يمكن إضافة أبناء من مدارس مختلفة في نفس الحساب",
        errors: [] },
    ]
  },

  school: {
    key: "school",
    name: "لوحة مدير المدرسة",
    nameEn: "School Admin Dashboard",
    icon: "🏫",
    platform: "React Web (rebuilt here as: responsive module `school` inside the unified Expo app + web build via react-native-web)",
    desc: "لوحة إدارة شاملة للمدرسة — تسجيل وإدارة ومتابعة وتقارير",
    screens: [
      { id: "SCH-01", name: "تسجيل الدخول", nameEn: "Login", status: "موثق", mvp: true,
        desc: "دخول آمن لمدير المدرسة",
        elements: ["شعار المدرسة + أمان سكول", "البريد الإلكتروني", "كلمة المرور", "زر 'نسيت كلمة المرور'", "2FA اختياري للمدراء"],
        flow: ["إدخال البريد والكلمة", "التحقق", "إدخال 2FA إن مفعل", "الدخول للرئيسية"],
        apis: ["POST /auth/school-admin/login"],
        notes: "البريد الإلكتروني يُنشأ من قِبل مدير النظام عند تسجيل المدرسة",
        errors: ["بيانات خاطئة", "الحساب موقوف — تواصل مع الدعم"] },
      { id: "SCH-02", name: "لوحة الرئيسية", nameEn: "Main Dashboard", status: "موثق", mvp: true,
        desc: "نظرة عامة على وضع المدرسة اليوم",
        elements: ["إحصائيات اليوم (رحلات نشطة / طلاب في الطريق / طلاب وصلوا / غائبون)", "خريطة مصغرة لجميع باصات المدرسة", "آخر 5 تنبيهات", "الرحلات الجارية الآن مع حالتها", "مؤشرات KPI (معدل الالتزام / متوسط التأخير)", "رابط سريع لكل قسم"],
        flow: ["دخول → رؤية الوضع الكامل دفعة واحدة", "الضغط على باص في الخريطة → تفاصيله", "الضغط على تنبيه → تفاصيله"],
        apis: ["GET /schools/:id/dashboard-summary"],
        notes: "تُحدّث كل دقيقتين أو عند وجود حدث مهم",
        errors: [] },
      { id: "SCH-03", name: "إدارة الطلاب", nameEn: "Students Management", status: "موثق", mvp: true,
        desc: "قاعدة بيانات الطلاب الكاملة مع أدوات الإدارة",
        elements: ["جدول الطلاب (اسم / صف / باص / ولي أمر / حالة)", "فلاتر: الصف / الباص / حالة الاشتراك", "بحث سريع", "زر 'إضافة طالب' أو 'استيراد Excel'", "لكل طالب: تعديل / تعطيل / عرض كود QR / تاريخ رحلاته"],
        flow: ["عرض الجدول", "البحث أو الفلترة", "الضغط على طالب → تفاصيله الكاملة", "أو إضافة طالب جديد"],
        apis: ["GET /schools/:id/students", "POST /schools/:id/students", "PUT /students/:id", "GET /students/:id/qr-code"],
        notes: "استيراد Excel يوفر وقتاً كبيراً عند تسجيل المدرسة. كود QR يُطبع ويُرسل لولي الأمر",
        errors: [] },
      { id: "SCH-04", name: "تفاصيل طالب", nameEn: "Student Detail", status: "قيد التصميم", mvp: false,
        desc: "الملف الكامل لطالب محدد",
        elements: ["بيانات الطالب الشخصية", "بيانات ولي الأمر (مع رقمه ورسالة نصية مباشرة)", "الباص والمشرف المخصصان", "كود QR للطالب (قابل للطباعة)", "سجل رحلاته (آخر 30 يوم)", "إحصائيات (معدل الحضور / التأخيرات)"],
        flow: [], apis: ["GET /students/:id"],
        notes: "", errors: [] },
      { id: "SCH-05", name: "إدارة الباصات", nameEn: "Buses Management", status: "موثق", mvp: true,
        desc: "بيانات الباصات والأجهزة المركبة",
        elements: ["قائمة الباصات (رقم / الطاقة / المسار / المشرف / حالة GPS)", "إضافة باص جديد", "ربط جهاز GPS بباص", "عرض المسار على الخريطة", "سجل صيانة الباص"],
        flow: ["عرض الباصات", "الضغط على باص → تفاصيله", "تعديل بيانات أو ربط مشرف"],
        apis: ["GET /schools/:id/buses", "POST /schools/:id/buses", "PUT /buses/:id/gps-device"],
        notes: "ربط جهاز GPS يتطلب إدخال Device ID المكتوب على الجهاز",
        errors: [] },
      { id: "SCH-06", name: "إدارة المشرفين", nameEn: "Supervisors Management", status: "موثق", mvp: true,
        desc: "بيانات المشرفين وتعيين الباصات",
        elements: ["قائمة المشرفين (اسم / رقم موظف / الباص / إجمالي رحلاته / التقييم)", "إضافة مشرف جديد (يُنشئ حسابه في تطبيق المشرف)", "تعيين/تغيير الباص", "إحصائيات أداء المشرف"],
        flow: ["عرض المشرفين", "إضافة مشرف → إنشاء حساب تلقائي في التطبيق", "تعيين للباص المناسب"],
        apis: ["GET /schools/:id/supervisors", "POST /schools/:id/supervisors"],
        notes: "عند إضافة مشرف يتلقى رسالة SMS بتعليمات تحميل التطبيق وبيانات الدخول",
        errors: [] },
      { id: "SCH-07", name: "إدارة المسارات", nameEn: "Routes Management", status: "قيد التصميم", mvp: false,
        desc: "تعريف المسارات ومحطات التوقف لكل باص",
        elements: ["خريطة تفاعلية لرسم المسار", "قائمة محطات التوقف مرتبة", "ربط الطلاب بمحطاتهم", "تقدير وقت الرحلة"],
        flow: ["رسم المسار على الخريطة", "إضافة المحطات", "ربط كل طالب بمحطته"],
        apis: ["POST /buses/:id/route", "PUT /students/:id/stop"],
        notes: "مهم جداً لدقة حساب ETA",
        errors: [] },
      { id: "SCH-08", name: "متابعة الرحلات المباشرة", nameEn: "Live Trips Monitoring", status: "موثق", mvp: true,
        desc: "مراقبة جميع رحلات المدرسة في الوقت الفعلي",
        elements: ["خريطة تفاعلية كاملة لجميع الباصات", "قائمة الرحلات الجارية مع حالتها", "تفاصيل كل رحلة عند الضغط (طلاب صعدوا/لم يصعدوا)", "تنبيهات التأخير التلقائية", "إمكانية إرسال رسالة للمشرف مباشرة"],
        flow: ["مراقبة مستمرة", "الضغط على باص → تفاصيل الرحلة", "التواصل مع المشرف عند الحاجة"],
        apis: ["WSS /schools/:id/live-tracking"],
        notes: "يعمل على WebSocket — تحديث فوري",
        errors: [] },
      { id: "SCH-09", name: "التقارير والإحصائيات", nameEn: "Reports & Analytics", status: "قيد التصميم", mvp: false,
        desc: "تقارير شاملة لأداء النقل المدرسي",
        elements: ["فلتر الفترة الزمنية", "تقرير الحضور والغياب", "تقرير التأخيرات (باص / مشرف / طريق)", "تقرير الاستثناءات والحوادث", "معدل رضا أولياء الأمور", "تصدير Excel / PDF"],
        flow: ["اختيار نوع التقرير والفترة", "عرض الرسوم البيانية", "تصدير"],
        apis: ["GET /schools/:id/reports"],
        notes: "", errors: [] },
      { id: "SCH-10", name: "التنبيهات والإشعارات", nameEn: "Alerts & Notifications", status: "قيد التصميم", mvp: false,
        desc: "إدارة التنبيهات والتواصل مع أولياء الأمور",
        elements: ["قائمة التنبيهات الواردة والصادرة", "إرسال إشعار جماعي لأولياء الأمور", "إعدادات قواعد التنبيه التلقائي (تأخير > X دقيقة)", "سجل الإشعارات المرسلة"],
        flow: [], apis: ["POST /schools/:id/notifications/broadcast"],
        notes: "", errors: [] },
      { id: "SCH-11", name: "إعدادات المدرسة", nameEn: "School Settings", status: "قيد التصميم", mvp: false,
        desc: "إعدادات عامة للمدرسة في النظام",
        elements: ["بيانات المدرسة (اسم / عنوان / شعار)", "أوقات الدوام الافتراضية", "إعدادات الإشعارات التلقائية", "مستخدمو النظام وصلاحياتهم", "معلومات الاشتراك والباقة"],
        flow: [], apis: ["PUT /schools/:id/settings"],
        notes: "", errors: [] },
    ]
  },

  operations: {
    key: "operations",
    name: "لوحة غرفة العمليات",
    nameEn: "Operations Room Dashboard",
    icon: "🎛️",
    platform: "React Web — شاشة كبيرة 1920×1080+, Dark Mode (rebuilt here as: responsive module `operations` inside the unified app, optimized layout for large/TV displays)",
    desc: "مركز التحكم لمراقبة جميع رحلات المدرسة أو مجموعة المدارس",
    screens: [
      { id: "OPS-01", name: "لوحة المراقبة الرئيسية", nameEn: "Main Control Room", status: "موثق", mvp: true,
        desc: "الشاشة الرئيسية لغرفة العمليات — تعمل 24/7",
        elements: ["خريطة ضخمة (80% الشاشة) لجميع الباصات بألوان تدل على الحالة", "شريط جانبي: قائمة الرحلات الجارية", "شريط علوي: إحصائيات فورية", "بانر التنبيهات (أحمر/أصفر/أخضر)", "ساعة + التاريخ (دائمة الظهور)", "قائمة المدارس (في حال كانت عمليات مشتركة)"],
        flow: ["مراقبة مستمرة لجميع الباصات", "كل باص ملون حسب حالته: أخضر=يسير / أصفر=توقف > 5 دقائق / أحمر=طوارئ", "الضغط على باص → تفاصيل الرحلة", "التنبيهات تظهر في الأعلى فوراً"],
        apis: ["WSS /operations/live-all", "GET /operations/active-trips"],
        notes: "مصممة لشاشة تلفزيون أو شاشة ضخمة. لا تحتاج تفاعلاً يدوياً إلا عند التنبيهات. Dark Mode للتقليل من إجهاد العيون",
        errors: [] },
      { id: "OPS-02", name: "إدارة التنبيهات", nameEn: "Alert Management", status: "موثق", mvp: true,
        desc: "استقبال ومعالجة التنبيهات والحوادث",
        elements: ["قائمة التنبيهات مرتبة بالأولوية (عاجل جداً / عاجل / تنبيه)", "لكل تنبيه: المصدر + الوقت + التفاصيل + الإجراء المقترح", "زر 'تلقيت وأتخذ إجراء' (Acknowledge)", "تعيين التنبيه لموظف معين", "زر إغلاق التنبيه مع السبب"],
        flow: ["وصول تنبيه (صوت + اهتزاز الشاشة)", "مراجعة التفاصيل", "Acknowledge", "اتخاذ الإجراء", "إغلاق مع ملاحظة"],
        apis: ["GET /alerts?status=active", "PUT /alerts/:id/acknowledge", "PUT /alerts/:id/resolve"],
        notes: "التنبيهات العاجلة جداً (SOS/طوارئ) تُصدر صوتاً وتومض الشاشة حتى يتم الـ Acknowledge",
        errors: [] },
      { id: "OPS-03", name: "تفاصيل حادثة", nameEn: "Incident Detail", status: "قيد التصميم", mvp: false,
        desc: "معالجة حادثة أو حالة طوارئ كاملة",
        elements: ["خريطة تُظهر موقع الباص", "بيانات الرحلة والطلاب في الباص", "بيانات المشرف ورقم هاتفه", "زر اتصال مباشر بالمشرف", "سجل الإجراءات المتخذة", "زر إرسال إشعار لأولياء الأمور"],
        flow: ["فتح الحادثة", "التواصل مع المشرف", "اتخاذ الإجراء", "إشعار الأطراف", "تسجيل الإجراءات"],
        apis: ["GET /incidents/:id", "POST /incidents/:id/actions", "POST /incidents/:id/notify-parents"],
        notes: "", errors: [] },
      { id: "OPS-04", name: "التواصل", nameEn: "Communications Hub", status: "قيد التصميم", mvp: false,
        desc: "مركز التواصل مع جميع الأطراف",
        elements: ["قائمة جهات الاتصال (مدارس / مشرفون / طوارئ)", "إرسال إشعار جماعي أو فردي", "سجل المحادثات", "إرسال رسالة نصية SMS"],
        flow: [], apis: ["POST /operations/messages"],
        notes: "", errors: [] },
      { id: "OPS-05", name: "تقرير اليوم", nameEn: "Daily Report", status: "قيد التصميم", mvp: false,
        desc: "ملخص يومي شامل لجميع العمليات",
        elements: ["إجمالي الرحلات (مكتملة/جارية/ملغاة)", "إجمالي الطلاب المنقولين", "التنبيهات والحوادث", "مؤشرات الأداء", "تصدير PDF للإدارة"],
        flow: [], apis: ["GET /operations/daily-report"],
        notes: "", errors: [] },
    ]
  },

  owner: {
    key: "owner",
    name: "لوحة مالك النظام",
    nameEn: "Platform Owner Dashboard",
    icon: "👑",
    platform: "React Web — للمالك فقط (rebuilt here as: responsive module `owner` inside the unified app)",
    desc: "أعلى مستوى في التسلسل الهرمي — إدارة المنصة SaaS بالكامل عبر جميع المدارس والشركاء",
    screens: [
      { id: "OWN-01", name: "لوحة المالك الرئيسية", nameEn: "Owner Dashboard", status: "قيد التصميم", mvp: false,
        desc: "نظرة شاملة على المنصة بأكملها — الأرقام والإيرادات والنمو",
        elements: ["بطاقات KPI الرئيسية: (إجمالي المدارس / الطلاب النشطين / الإيراد الشهري / معدل النمو)", "رسم بياني: نمو المشتركين (6 أشهر)", "رسم بياني: الإيرادات الشهرية", "خريطة: توزيع المدارس جغرافياً", "أحدث المدارس المشتركة", "تنبيهات النظام"],
        flow: ["دخول المالك → رؤية كاملة للمنصة", "تحليل الأرقام والنمو", "الوصول السريع لأي قسم"],
        apis: ["GET /owner/platform-summary"],
        notes: "هذه الشاشة تعطي المالك صورة كاملة عن صحة المنصة والنمو التجاري في ثوانٍ",
        errors: [] },
      { id: "OWN-02", name: "إدارة المدارس", nameEn: "Schools Management", status: "قيد التصميم", mvp: true,
        desc: "تسجيل وإدارة جميع المدارس في المنصة",
        elements: ["جدول المدارس (الاسم / الموقع / الباقة / الطلاب / حالة الاشتراك)", "زر 'تسجيل مدرسة جديدة'", "تصفية حسب: الباقة / الحالة / الشريك / المنطقة", "بحث بالاسم", "لكل مدرسة: عرض / تعديل / إيقاف / حذف"],
        flow: ["تسجيل مدرسة → إدخال البيانات → إنشاء حساب مدير → إرسال بيانات الوصول"],
        apis: ["GET /owner/schools", "POST /owner/schools/register", "PUT /schools/:id/status"],
        notes: "تسجيل مدرسة جديدة يُنشئ تلقائياً: حساب المدير، schema منفصل في DB، مساحة تخزين",
        errors: [] },
      { id: "OWN-03", name: "تفاصيل مدرسة", nameEn: "School Detail (Owner View)", status: "قيد التصميم", mvp: false,
        desc: "نظرة المالك التفصيلية على مدرسة محددة",
        elements: ["بيانات المدرسة الكاملة", "إحصائيات الاستخدام (طلاب / باصات / رحلات)", "تاريخ الدفع والفواتير", "حالة الاشتراك (نشط/مُعلّق/منتهي)", "بيانات الشريك (إن وجد)", "إمكانية الدخول لحساب المدرسة (Impersonate)"],
        flow: [], apis: ["GET /owner/schools/:id/detail"],
        notes: "ميزة Impersonate تتيح للمالك رؤية النظام بعين مدير المدرسة للدعم الفني",
        errors: [] },
      { id: "OWN-04", name: "إدارة الشركاء", nameEn: "Partners Management", status: "قيد التصميم", mvp: false,
        desc: "إدارة شبكة الشركاء الموزعين للمنصة",
        elements: ["جدول الشركاء (الاسم / المنطقة / عدد مدارسه / إجمالي عمولته)", "تسجيل شريك جديد", "تعيين مدارس لشريك", "إعداد نسبة العمولة", "سجل مدفوعات الشركاء"],
        flow: ["تسجيل شريك → تحديد منطقته ونسبة عمولته → مدارسه تُحسب في إيراداته"],
        apis: ["GET /owner/partners", "POST /owner/partners/register", "PUT /owner/partners/:id"],
        notes: "الشريك يحصل على لوحة تحكم خاصة به (OWN-09) يرى فيها مدارسه فقط وعمولته",
        errors: [] },
      { id: "OWN-05", name: "إدارة الاشتراكات والباقات", nameEn: "Subscriptions & Packages", status: "قيد التصميم", mvp: false,
        desc: "إدارة الباقات والأسعار والاشتراكات",
        elements: ["عرض الباقات الحالية (أساسي/متقدم/شامل)", "تعديل الأسعار", "عروض وخصومات", "جدول المشتركين حسب الباقة", "مدارس على وشك انتهاء اشتراكها (تنبيه)"],
        flow: [], apis: ["GET /owner/packages", "PUT /owner/packages/:id", "GET /owner/subscriptions"],
        notes: "", errors: [] },
      { id: "OWN-06", name: "الإيرادات والفوترة", nameEn: "Revenue & Billing", status: "قيد التصميم", mvp: false,
        desc: "لوحة الإيرادات الكاملة والفواتير",
        elements: ["إجمالي الإيراد الشهري / السنوي", "رسم بياني للإيرادات", "قائمة الفواتير المصدرة", "الفواتير غير المدفوعة (مع التنبيه)", "إصدار فاتورة يدوياً", "تقرير للمحاسبة (Excel)"],
        flow: [], apis: ["GET /owner/revenue/summary", "GET /owner/invoices"],
        notes: "", errors: [] },
      { id: "OWN-07", name: "تحليلات المنصة", nameEn: "Platform Analytics", status: "مفهوم أولي", mvp: false,
        desc: "تحليلات متعمقة لأداء المنصة ونموها",
        elements: ["معدل الاحتفاظ بالمدارس (Retention)", "معدل التوسع (MoM Growth)", "أكثر الميزات استخداماً", "باقة الأعلى مبيعاً", "توزيع المدارس جغرافياً", "مقارنة الأداء بين الشركاء"],
        flow: [], apis: ["GET /owner/analytics"],
        notes: "", errors: [] },
      { id: "OWN-08", name: "إعدادات النظام", nameEn: "Platform Settings", status: "قيد التصميم", mvp: false,
        desc: "إعدادات المنصة العالمية والتقنية",
        elements: ["إعدادات FCM / MQTT / SMS provider", "حدود الاستخدام لكل باقة", "Feature Flags (تفعيل/تعطيل ميزات لمدارس محددة)", "Maintenance Mode", "إعدادات الأمان والامتثال", "سجل النشاط (Audit Log)"],
        flow: [], apis: ["GET/PUT /owner/platform-settings"],
        notes: "Feature Flags تتيح تجربة ميزات جديدة مع مدارس محددة قبل الإطلاق العام",
        errors: [] },
      { id: "OWN-09", name: "لوحة الشريك (Partner View)", nameEn: "Partner Dashboard", status: "مفهوم أولي", mvp: false,
        desc: "لوحة التحكم الخاصة بكل شريك — يرى فيها مدارسه وعمولته",
        elements: ["مدارسه التي يديرها (مع حالة كل منها)", "عمولته الشهرية المحسوبة", "مدارس على وشك انتهاء اشتراكها", "طلب تسجيل مدرسة جديدة", "دعم المدارس من خلاله", "تقارير الأداء"],
        flow: ["الشريك يدخل للوحته → يرى مدارسه فقط", "يمكنه تسجيل مدرسة جديدة → يحتاج موافقة المالك"],
        apis: ["GET /partners/:id/dashboard"],
        notes: "الشريك لا يرى مدارس الشركاء الآخرين. عمولته تُحسب تلقائياً من الاشتراكات",
        errors: [] },
    ]
  },
};

function slugify(nameEn) {
  return nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function screenMd(app, s) {
  const lines = [];
  lines.push(`# ${s.id} — ${s.name}`);
  lines.push("");
  lines.push(`**English:** ${s.nameEn}  `);
  lines.push(`**App:** ${app.name} (${app.nameEn})  `);
  lines.push(`**Platform:** ${app.platform}  `);
  lines.push(`**Status:** ${s.status}  `);
  lines.push(`**MVP:** ${s.mvp ? "✅ Yes — required for first launch" : "⛔️ No — post-MVP"}`);
  lines.push("");
  lines.push("## Description");
  lines.push(s.desc);
  lines.push("");
  lines.push("## UI Components / Elements");
  if (s.elements.length) s.elements.forEach(e => lines.push(`- ${e}`));
  else lines.push("_None specified._");
  lines.push("");
  lines.push("## User Flow");
  if (s.flow.length) s.flow.forEach((f, i) => lines.push(`${i + 1}. ${f}`));
  else lines.push("_Single-step / no multi-step flow specified._");
  lines.push("");
  lines.push("## API Endpoints");
  if (s.apis.length) s.apis.forEach(a => lines.push(`- \`${a}\``));
  else lines.push("_No direct API calls — client-side only screen._");
  lines.push("");
  if (s.notes) {
    lines.push("## UX Notes / Implementation Notes");
    lines.push(s.notes);
    lines.push("");
  }
  lines.push("## Error States");
  if (s.errors.length) s.errors.forEach(e => lines.push(`- ${e}`));
  else lines.push("_No special error states specified._");
  lines.push("");
  return lines.join("\n");
}

function appIndexMd(app) {
  const lines = [];
  lines.push(`# ${app.icon} ${app.name} (${app.nameEn})`);
  lines.push("");
  lines.push(`**Platform:** ${app.platform}  `);
  lines.push(`**Description:** ${app.desc}`);
  lines.push("");
  lines.push("| ID | Screen | Status | MVP |");
  lines.push("|---|---|---|---|");
  app.screens.forEach(s => {
    lines.push(`| [${s.id}](./${s.id}-${slugify(s.nameEn)}.md) | ${s.name} (${s.nameEn}) | ${s.status} | ${s.mvp ? "✅" : "—"} |`);
  });
  lines.push("");
  return lines.join("\n");
}

mkdirSync(OUT, { recursive: true });

const topIndex = [];
topIndex.push("# Aman School — Screen Documentation Index");
topIndex.push("");
topIndex.push("One Markdown file per screen, generated from the canonical product spec. Total screens: " +
  Object.values(APPS_DATA).reduce((n, a) => n + a.screens.length, 0));
topIndex.push("");

for (const app of Object.values(APPS_DATA)) {
  const dir = join(OUT, app.key);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "README.md"), appIndexMd(app), "utf8");
  for (const s of app.screens) {
    writeFileSync(join(dir, `${s.id}-${slugify(s.nameEn)}.md`), screenMd(app, s), "utf8");
  }
  const mvpCount = app.screens.filter(s => s.mvp).length;
  const docCount = app.screens.filter(s => s.status === "موثق").length;
  topIndex.push(`## ${app.icon} [${app.name} — ${app.nameEn}](./${app.key}/README.md)`);
  topIndex.push(`${app.screens.length} screens total · ${mvpCount} MVP · ${docCount} fully documented`);
  topIndex.push("");
}

writeFileSync(join(OUT, "README.md"), topIndex.join("\n"), "utf8");

console.log("Generated screen docs for", Object.values(APPS_DATA).reduce((n, a) => n + a.screens.length, 0), "screens across", Object.keys(APPS_DATA).length, "apps.");

export { APPS_DATA };
