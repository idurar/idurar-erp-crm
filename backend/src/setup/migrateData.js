require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
require('module-alias/register');
const mongoose = require('mongoose');
const Invoice = require('../models/appModels/Invoice');
const Setting = require('../models/coreModels/Setting');

async function migrateData() {
  await mongoose.connect(process.env.DATABASE, { autoIndex: false });
  const invoices = await Invoice.find({
    $or: [{ serviceDate: { $exists: false } }, { serviceDate: null }],
  }).select('_id date');
  if (invoices.length) {
    await Invoice.bulkWrite(
      invoices.map((invoice) => ({
        updateOne: {
          filter: { _id: invoice._id },
          update: { $set: { serviceDate: invoice.date } },
        },
      }))
    );
  }
  console.log(`Migrated serviceDate for ${invoices.length} invoice(s).`);
  const [renamedQuarter, initializedRecurring, initializedRecurringActive, initializedAnchor] =
    await Promise.all([
    Invoice.updateMany({ recurring: 'quarter' }, { $set: { recurring: 'quarterly' } }),
    Invoice.updateMany({ recurring: { $exists: false } }, { $set: { recurring: 'none' } }),
    Invoice.updateMany(
      { recurringActive: { $exists: false } },
      { $set: { recurringActive: false } }
    ),
    Invoice.updateMany(
      {
        recurring: { $ne: 'none' },
        nextRecurringDate: { $type: 'date' },
        recurringAnchorDate: { $exists: false },
      },
      [{ $set: { recurringAnchorDate: '$nextRecurringDate' } }]
    ),
  ]);
  console.log(
    `Migrated recurring invoices: ${renamedQuarter.modifiedCount} interval(s), ` +
      `${initializedRecurring.modifiedCount} default interval(s), ` +
      `${initializedRecurringActive.modifiedCount} active flag(s), ` +
      `${initializedAnchor.modifiedCount} anchor date(s).`
  );
  const highestNumberedInvoice = await Invoice.findOne({
    removed: false,
    number: { $type: 'number' },
  })
    .sort({ number: -1 })
    .select('number')
    .lean();
  if (highestNumberedInvoice) {
    const numberSetting = await Setting.findOne({
      settingKey: 'last_invoice_number',
      removed: false,
    });
    if (numberSetting && Number(numberSetting.settingValue) < highestNumberedInvoice.number) {
      numberSetting.settingValue = highestNumberedInvoice.number;
      await numberSetting.save();
      console.log(`Advanced invoice number setting to ${highestNumberedInvoice.number}.`);
    }
  }
  const indexes = await Invoice.collection.indexes();
  const numberIndex = indexes.find(
    (index) => index.key?.number === 1 && index.key?.year === 1
  );
  const hasDraftSafeNumberIndex =
    numberIndex?.unique === true &&
    numberIndex?.partialFilterExpression?.removed === false &&
    numberIndex?.partialFilterExpression?.number?.$type === 'number';
  if (!hasDraftSafeNumberIndex) {
    if (numberIndex) await Invoice.collection.dropIndex(numberIndex.name);
    await Invoice.collection.createIndex(
      { number: 1, year: 1 },
      {
        name: 'number_1_year_1',
        unique: true,
        partialFilterExpression: { removed: false, number: { $type: 'number' } },
      }
    );
    console.log('Migrated invoice number index for unnumbered drafts.');
  }
  await mongoose.disconnect();
}

migrateData().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
