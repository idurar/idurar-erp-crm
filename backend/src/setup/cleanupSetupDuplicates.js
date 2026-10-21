require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const Admin = require('../models/coreModels/Admin');
const AdminPassword = require('../models/coreModels/AdminPassword');
const Setting = require('../models/coreModels/Setting');
const Taxes = require('../models/appModels/Taxes');
const PaymentMode = require('../models/appModels/PaymentMode');
const Payment = require('../models/appModels/Payment');

const applyChanges = process.argv.includes('--apply');

const groupBy = (rows, key) =>
  Object.values(
    rows.reduce((groups, row) => {
      const value = String(row[key]);
      if (!groups[value]) groups[value] = [];
      groups[value].push(row);
      return groups;
    }, {})
  ).filter((group) => group.length > 1);

const sortById = (rows) => [...rows].sort((a, b) => String(a._id).localeCompare(String(b._id)));

async function cleanup() {
  await mongoose.connect(process.env.DATABASE);

  const [admins, settings, taxes, paymentModes] = await Promise.all([
    Admin.find({ removed: false }).lean(),
    Setting.find({ removed: false }).lean(),
    Taxes.find({ removed: false }).lean(),
    PaymentMode.find({ removed: false }).lean(),
  ]);

  const adminGroups = groupBy(admins, 'email');
  const settingGroups = groupBy(settings, 'settingKey');
  const taxGroups = groupBy(taxes, 'taxName');
  const paymentModeGroups = groupBy(paymentModes, 'name');

  const backup = {
    createdAt: new Date().toISOString(),
    admins: adminGroups.flat(),
    adminPasswords: await AdminPassword.find({
      user: { $in: adminGroups.flat().map((admin) => admin._id) },
    }).lean(),
    settings: settingGroups.flat(),
    taxes: taxGroups.flat(),
    paymentModes: paymentModeGroups.flat(),
  };

  const plan = {
    adminsToDelete: adminGroups.reduce((count, group) => count + group.length - 1, 0),
    settingsToDelete: settingGroups.reduce((count, group) => count + group.length - 1, 0),
    taxesToDelete: taxGroups.reduce((count, group) => count + group.length - 1, 0),
    paymentModesToDelete: paymentModeGroups.reduce((count, group) => count + group.length - 1, 0),
  };

  console.log(`${applyChanges ? 'Applying' : 'Dry run'}: ${JSON.stringify(plan)}`);
  if (!applyChanges) {
    await mongoose.disconnect();
    return;
  }

  const backupDirectory = path.resolve(__dirname, '../../backups');
  fs.mkdirSync(backupDirectory, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDirectory, `setup-cleanup-${timestamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2), 'utf8');

  for (const group of adminGroups) {
    const passwords = await AdminPassword.find({ user: { $in: group.map((admin) => admin._id) } }).lean();
    const keeper = sortById(group).sort((a, b) => {
      const aSessions = passwords.find((item) => String(item.user) === String(a._id))?.loggedSessions?.length || 0;
      const bSessions = passwords.find((item) => String(item.user) === String(b._id))?.loggedSessions?.length || 0;
      return bSessions - aSessions || String(a._id).localeCompare(String(b._id));
    })[0];
    const duplicateIds = group.filter((admin) => String(admin._id) !== String(keeper._id)).map((admin) => admin._id);

    for (const collection of await mongoose.connection.db.listCollections().toArray()) {
      const target = mongoose.connection.db.collection(collection.name);
      await target.updateMany({ createdBy: { $in: duplicateIds } }, { $set: { createdBy: keeper._id } });
      await target.updateMany({ assigned: { $in: duplicateIds } }, { $set: { assigned: keeper._id } });
    }

    await AdminPassword.deleteMany({ user: { $in: duplicateIds } });
    await Admin.deleteMany({ _id: { $in: duplicateIds } });
  }

  for (const group of settingGroups) {
    const [, ...duplicates] = sortById(group);
    await Setting.deleteMany({ _id: { $in: duplicates.map((item) => item._id) } });
  }

  for (const group of taxGroups) {
    const [, ...duplicates] = sortById(group);
    await Taxes.deleteMany({ _id: { $in: duplicates.map((item) => item._id) } });
  }

  for (const group of paymentModeGroups) {
    const [keeper, ...duplicates] = sortById(group);
    const duplicateIds = duplicates.map((item) => item._id);
    await Payment.updateMany({ paymentMode: { $in: duplicateIds } }, { $set: { paymentMode: keeper._id } });
    await PaymentMode.deleteMany({ _id: { $in: duplicateIds } });
  }

  console.log(`Cleanup complete. Backup: ${backupPath}`);
  await mongoose.disconnect();
}

cleanup().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
