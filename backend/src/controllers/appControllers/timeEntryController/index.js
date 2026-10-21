const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { calculateTimeAccount, capPeriodAtToday, calculateWorkedHours } = require('@/services/timeAccountService');
const { runAtomic } = require('@/services/transactionService');

const controller = createCRUDController('TimeEntry');
const managementRoles = new Set(['owner', 'admin']);

const canManageAll = (admin) => managementRoles.has(admin?.role);
const ownEntryFilter = (req) => canManageAll(req.admin) ? {} : { employee: req.admin._id };
const csvCell = (value) => {
  let text = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

controller.backupEmployee = async (req, res) => {
  if (!canManageAll(req.admin)) {
    return res.status(403).json({ success: false, result: null, message: 'Nur Administratoren dürfen Zeitkonten sichern.' });
  }
  const Admin = mongoose.model('Admin');
  const TimeEntry = mongoose.model('TimeEntry');
  if (!mongoose.isValidObjectId(req.params.employeeId)) {
    return res.status(400).json({ success: false, result: null, message: 'Ungültiger Mitarbeiter.' });
  }
  const employee = await Admin.findOne({ _id: req.params.employeeId, removed: false }).lean();
  if (!employee) return res.status(404).json({ success: false, result: null, message: 'Mitarbeiter wurde nicht gefunden.' });
  const entries = await TimeEntry.find({ employee: employee._id, removed: false })
    .populate('project', 'number name')
    .sort({ workDate: 1, created: 1 })
    .lean();
  const rows = [
    ['Mitarbeiter', `${employee.name || ''} ${employee.surname || ''}`.trim()],
    ['E-Mail', employee.email],
    ['Exportiert am', new Date().toISOString()],
    ['Wochenstunden', Number(employee.weeklyTargetHours || 0).toLocaleString('de-AT')],
    [],
    ['Datum', 'Zeitart', 'Kommt', 'Pause (Min.)', 'Geht', 'Arbeitszeit', 'Projekt', 'Tätigkeit / Notiz', 'Abrechenbar', 'Erstellt am'],
    ...entries.map((entry) => [
      new Date(entry.workDate).toISOString().slice(0, 10),
      entry.entryType,
      entry.startTime || '',
      Number(entry.breakMinutes || 0).toLocaleString('de-AT'),
      entry.endTime || '',
      Number(entry.hours || 0).toLocaleString('de-AT'),
      entry.project ? `${entry.project.number || ''} ${entry.project.name || ''}`.trim() : '',
      entry.description,
      entry.billable ? 'Ja' : 'Nein',
      entry.created ? new Date(entry.created).toISOString() : '',
    ]),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(';')).join('\r\n')}`;
  const safeName = `${employee.name || 'mitarbeiter'}-${employee.surname || ''}`
    .normalize('NFKD').replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="zeitbackup-${safeName || 'mitarbeiter'}.csv"`);
  return res.status(200).send(csv);
};

controller.resetEmployee = async (req, res) => {
  if (!canManageAll(req.admin)) {
    return res.status(403).json({ success: false, result: null, message: 'Nur Administratoren dürfen Zeitkonten zurücksetzen.' });
  }
  const resetDateText = String(req.body.resetDate || '');
  const resetDate = new Date(`${resetDateText}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(resetDateText) || !mongoose.isValidObjectId(req.params.employeeId) || Number.isNaN(resetDate.getTime())) {
    return res.status(400).json({ success: false, result: null, message: 'Mitarbeiter oder Neustartdatum ist ungültig.' });
  }
  const Admin = mongoose.model('Admin');
  const TimeEntry = mongoose.model('TimeEntry');
  const employee = await Admin.findOne({ _id: req.params.employeeId, removed: false });
  if (!employee) return res.status(404).json({ success: false, result: null, message: 'Mitarbeiter wurde nicht gefunden.' });
  if (req.body.confirmation !== employee.email) {
    return res.status(409).json({ success: false, result: null, message: 'Die Sicherheitsbestätigung stimmt nicht überein.' });
  }
  const resetResult = await runAtomic(async (session) => {
    const entries = await TimeEntry.updateMany(
      { employee: employee._id, removed: false },
      { $set: { removed: true, updated: new Date() } },
      { session }
    );
    await Admin.updateOne(
      { _id: employee._id, removed: false },
      { $set: { timeAccountStart: resetDate, initialTimeBalance: 0, vacationCarryover: 0 } },
      { session }
    );
    return entries.modifiedCount;
  });
  return res.status(200).json({
    success: true,
    result: { removedEntries: resetResult, employmentStart: resetDate },
    message: `Zeitkonto wurde zurückgesetzt. ${resetResult} Zeiteinträge wurden archiviert.`,
  });
};

controller.create = async (req, res) => {
  const Admin = mongoose.model('Admin');
  const TimeEntry = mongoose.model('TimeEntry');
  const employee = canManageAll(req.admin) && req.body.employee ? req.body.employee : req.admin._id;
  if (!mongoose.isValidObjectId(employee) || !await Admin.exists({ _id: employee, removed: false, enabled: true })) {
    return res.status(400).json({ success: false, result: null, message: 'Bitte einen gültigen aktiven Mitarbeiter auswählen.' });
  }
  const workedTime = calculateWorkedHours(req.body);
  if (!workedTime.valid) {
    return res.status(400).json({ success: false, result: null, message: workedTime.message });
  }
  const entryData = { ...req.body };
  delete entryData.hourlyRate;
  const result = await TimeEntry.create({
    ...entryData,
    hours: workedTime.hours,
    breakMinutes: workedTime.breakMinutes,
    employee,
    createdBy: req.admin._id,
    removed: false,
  });
  return res.status(200).json({ success: true, result, message: 'Zeiteintrag wurde angelegt.' });
};

controller.list = async (req, res) => {
  const TimeEntry = mongoose.model('TimeEntry');
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, Number.parseInt(req.query.items, 10) || 10));
  const query = { removed: false, ...ownEntryFilter(req) };
  if (req.query.q) query.description = { $regex: String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  const [result, count] = await Promise.all([
    TimeEntry.find(query).sort({ workDate: -1, created: -1 }).skip((page - 1) * limit).limit(limit).exec(),
    TimeEntry.countDocuments(query),
  ]);
  return res.status(200).json({
    success: true,
    result,
    pagination: { page, pages: Math.ceil(count / limit), count },
    message: count ? 'Zeiteinträge wurden geladen.' : 'Keine Zeiteinträge vorhanden.',
  });
};

controller.listAll = async (req, res) => {
  const TimeEntry = mongoose.model('TimeEntry');
  const result = await TimeEntry.find({ removed: false, ...ownEntryFilter(req) })
    .sort({ workDate: -1, created: -1 });
  return res.status(200).json({ success: true, result });
};

controller.search = async (req, res) => {
  const TimeEntry = mongoose.model('TimeEntry');
  const text = String(req.query.q || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const result = await TimeEntry.find({
    removed: false,
    ...ownEntryFilter(req),
    ...(text ? { description: { $regex: text, $options: 'i' } } : {}),
  }).sort({ workDate: -1 }).limit(20);
  return res.status(200).json({ success: true, result });
};

controller.filter = controller.listAll;

controller.read = async (req, res) => {
  const TimeEntry = mongoose.model('TimeEntry');
  const result = await TimeEntry.findOne({ _id: req.params.id, removed: false, ...ownEntryFilter(req) });
  if (!result) return res.status(404).json({ success: false, result: null, message: 'Zeiteintrag wurde nicht gefunden.' });
  return res.status(200).json({ success: true, result });
};

controller.update = async (req, res) => {
  if (!canManageAll(req.admin)) {
    return res.status(403).json({ success: false, result: null, message: 'Nur Administratoren dürfen Zeiteinträge bearbeiten.' });
  }
  const TimeEntry = mongoose.model('TimeEntry');
  const updates = { ...req.body, updated: new Date() };
  delete updates._id;
  delete updates.createdBy;
  delete updates.removed;
  delete updates.hourlyRate;
  const workedTime = calculateWorkedHours(updates);
  if (!workedTime.valid) {
    return res.status(400).json({ success: false, result: null, message: workedTime.message });
  }
  updates.hours = workedTime.hours;
  updates.breakMinutes = workedTime.breakMinutes;
  if (updates.employee) {
    const Admin = mongoose.model('Admin');
    if (!mongoose.isValidObjectId(updates.employee) || !await Admin.exists({ _id: updates.employee, removed: false, enabled: true })) {
      return res.status(400).json({ success: false, result: null, message: 'Bitte einen gültigen aktiven Mitarbeiter auswählen.' });
    }
  }
  const result = await TimeEntry.findOneAndUpdate(
    { _id: req.params.id, removed: false }, updates, { new: true, runValidators: true }
  );
  if (!result) return res.status(404).json({ success: false, result: null, message: 'Zeiteintrag wurde nicht gefunden.' });
  return res.status(200).json({ success: true, result, message: 'Zeiteintrag wurde aktualisiert.' });
};

controller.delete = async (req, res) => {
  if (!canManageAll(req.admin)) {
    return res.status(403).json({ success: false, result: null, message: 'Nur Administratoren dürfen Zeiteinträge löschen.' });
  }
  const TimeEntry = mongoose.model('TimeEntry');
  const result = await TimeEntry.findOneAndUpdate(
    { _id: req.params.id, removed: false },
    { removed: true, updated: new Date() },
    { new: true }
  );
  if (!result) return res.status(404).json({ success: false, result: null, message: 'Zeiteintrag wurde nicht gefunden.' });
  return res.status(200).json({ success: true, result, message: 'Zeiteintrag wurde gelöscht.' });
};

controller.summaryControl = async (req, res) => {
  const Admin = mongoose.model('Admin');
  const TimeEntry = mongoose.model('TimeEntry');
  const year = Math.max(2000, Math.min(2200, Number(req.query.year) || new Date().getFullYear()));
  const requestedMonth = req.query.month === undefined ? new Date().getMonth() + 1 : Number(req.query.month);
  const month = Number.isInteger(requestedMonth) && requestedMonth >= 1 && requestedMonth <= 12
    ? requestedMonth
    : new Date().getMonth() + 1;
  const periodStart = new Date(Date.UTC(year, month - 1, 1));
  const periodEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  const calculationEnd = capPeriodAtToday(periodStart, periodEnd);
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const yearEnd = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
  const employeeFilter = canManageAll(req.admin)
    ? { removed: false, enabled: true }
    : { _id: req.admin._id, removed: false };
  const employees = await Admin.find(employeeFilter).sort({ name: 1, surname: 1 }).lean();
  const yearEntries = await TimeEntry.find({
    removed: false,
    employee: { $in: employees.map((employee) => employee._id) },
    workDate: { $gte: yearStart, $lte: yearEnd },
  }).select('employee workDate hours entryType').setOptions({ autopopulate: false }).lean();
  const result = employees.map((employee) => {
    const employeeYearEntries = yearEntries.filter((entry) => String(entry.employee) === String(employee._id));
    const periodEntries = employeeYearEntries.filter((entry) => entry.workDate >= periodStart && entry.workDate <= calculationEnd);
    const periodAccount = calculateTimeAccount({ employee, entries: periodEntries, periodStart, periodEnd: calculationEnd, yearEntries: employeeYearEntries });
    return {
      employee,
      ...periodAccount,
    };
  });
  return res.status(200).json({ success: true, result, message: 'Zeitkonten wurden berechnet.' });
};

module.exports = controller;
