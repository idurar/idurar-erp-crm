const bcrypt = require('bcryptjs');
const Joi = require('joi');
const mongoose = require('mongoose');
const { generate: uniqueId } = require('shortid');

const roles = ['owner', 'admin', 'accounting', 'sales', 'warehouse', 'technician', 'viewer'];

const publicFields = '_id email name surname role enabled created employmentType weeklyTargetHours workDaysPerWeek vacationModel annualVacationDays employmentStart timeAccountStart initialTimeBalance vacationCarryover';

const employmentValidation = {
  employmentType: Joi.string().valid('full_time', 'part_time', 'marginal', 'custom'),
  weeklyTargetHours: Joi.number().min(0).max(168),
  workDaysPerWeek: Joi.number().integer().min(1).max(7),
  vacationModel: Joi.string().valid('five_weeks', 'six_weeks', 'custom'),
  annualVacationDays: Joi.number().min(0).max(366),
  employmentStart: Joi.date().allow(null, ''),
  initialTimeBalance: Joi.number(),
  vacationCarryover: Joi.number(),
};

const list = async (_req, res) => {
  const Admin = mongoose.model('Admin');
  const result = await Admin.find({ removed: false }).select(publicFields).sort({ name: 1 }).lean();
  return res.status(200).json({ success: true, result });
};

const create = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().trim().min(1).max(80).required(),
    surname: Joi.string().trim().max(80).allow('', null),
    password: Joi.string().min(12).max(200).required(),
    role: Joi.string().valid(...roles).required(),
    ...employmentValidation,
  });
  const { error, value } = schema.validate(req.body, { stripUnknown: true });
  if (error)
    return res.status(400).json({ success: false, result: null, message: error.message });
  if (value.role === 'owner' && req.admin.role !== 'owner')
    return res.status(403).json({ success: false, result: null, message: 'Nur Eigentümer dürfen weitere Eigentümer anlegen.' });

  const Admin = mongoose.model('Admin');
  const AdminPassword = mongoose.model('AdminPassword');
  if (await Admin.exists({ email: value.email.toLowerCase(), removed: false }))
    return res.status(409).json({ success: false, result: null, message: 'Diese E-Mail-Adresse wird bereits verwendet.' });

  const timeAccountStart = new Date();
  timeAccountStart.setUTCHours(0, 0, 0, 0);
  timeAccountStart.setUTCDate(timeAccountStart.getUTCDate() + 1);
  const admin = await Admin.create({
    email: value.email,
    name: value.name,
    surname: value.surname,
    role: value.role,
    employmentType: value.employmentType,
    weeklyTargetHours: value.weeklyTargetHours,
    workDaysPerWeek: value.workDaysPerWeek,
    vacationModel: value.vacationModel,
    annualVacationDays: value.annualVacationDays,
    employmentStart: value.employmentStart || undefined,
    timeAccountStart,
    initialTimeBalance: value.initialTimeBalance,
    vacationCarryover: value.vacationCarryover,
    enabled: true,
  });
  try {
    const salt = uniqueId();
    await AdminPassword.create({
      user: admin._id,
      salt,
      password: bcrypt.hashSync(salt + value.password),
      emailVerified: true,
    });
  } catch (passwordError) {
    await Admin.deleteOne({ _id: admin._id });
    throw passwordError;
  }

  return res.status(201).json({
    success: true,
    result: await Admin.findById(admin._id).select(publicFields).lean(),
    message: 'Benutzer wurde angelegt.',
  });
};

const update = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(1).max(80),
    surname: Joi.string().trim().max(80).allow('', null),
    role: Joi.string().valid(...roles),
    enabled: Joi.boolean(),
    ...employmentValidation,
  }).min(1);
  const { error, value } = schema.validate(req.body, { stripUnknown: true });
  if (error)
    return res.status(400).json({ success: false, result: null, message: error.message });

  const Admin = mongoose.model('Admin');
  const target = await Admin.findOne({ _id: req.params.id, removed: false });
  if (!target)
    return res.status(404).json({ success: false, result: null, message: 'Benutzer wurde nicht gefunden.' });
  if (String(target._id) === String(req.admin._id) && value.enabled === false)
    return res.status(409).json({ success: false, result: null, message: 'Das eigene Konto kann nicht deaktiviert werden.' });
  if ((target.role === 'owner' || value.role === 'owner') && req.admin.role !== 'owner')
    return res.status(403).json({ success: false, result: null, message: 'Eigentümer dürfen nur durch einen Eigentümer geändert werden.' });
  if (target.role === 'owner' && (value.role !== undefined && value.role !== 'owner' || value.enabled === false)) {
    const activeOwners = await Admin.countDocuments({ role: 'owner', enabled: true, removed: false });
    if (activeOwners <= 1)
      return res.status(409).json({ success: false, result: null, message: 'Der letzte aktive Eigentümer kann nicht entfernt werden.' });
  }

  Object.assign(target, value);
  await target.save();
  return res.status(200).json({
    success: true,
    result: await Admin.findById(target._id).select(publicFields).lean(),
    message: 'Benutzer wurde aktualisiert.',
  });
};

module.exports = { list, create, update, roles };
