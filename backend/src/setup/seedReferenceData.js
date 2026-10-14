require('module-alias/register');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
const Taxes = require('../models/appModels/Taxes');
const PaymentMode = require('../models/appModels/PaymentMode');
const Setting = require('../models/coreModels/Setting');

const taxes = [
  { taxName: '0%', taxValue: 0, isDefault: false },
  { taxName: '10%', taxValue: 10, isDefault: false },
  { taxName: '20%', taxValue: 20, isDefault: true },
];

const paymentModes = [
  { name: 'Barzahlung', enabled: true },
  { name: 'Überweisung', enabled: true },
  { name: 'PayPal', enabled: true },
  { name: 'Stripe', enabled: true },
];

const bankSettings = [
  { settingKey: 'company_account_holder', settingValue: '' },
  { settingKey: 'company_bank_name', settingValue: '' },
  { settingKey: 'company_iban', settingValue: '' },
  { settingKey: 'company_bic', settingValue: '' },
];

const seed = async () => {
  if (!process.env.DATABASE) throw new Error('DATABASE is required');
  await mongoose.connect(process.env.DATABASE);

  for (const tax of taxes) {
    await Taxes.findOneAndUpdate({ taxValue: tax.taxValue }, tax, { upsert: true });
  }
  for (const paymentMode of paymentModes) {
    await PaymentMode.findOneAndUpdate(
      { name: paymentMode.name },
      { ...paymentMode, description: '', supportsDeposit: false, defaultDepositPercentage: 0, isDefault: false },
      { upsert: true, new: true }
    );
  }
  await PaymentMode.updateMany(
    { name: { $nin: paymentModes.map(({ name }) => name) } },
    { $set: { enabled: false } }
  );

  for (const setting of bankSettings) {
    await Setting.updateOne(
      { settingKey: setting.settingKey },
      {
        $setOnInsert: {
          settingCategory: 'company_settings',
          settingKey: setting.settingKey,
          settingValue: setting.settingValue,
          valueType: 'string',
          enabled: true,
        },
      },
      { upsert: true }
    );
  }

  console.log('Taxes, payment modes, and company bank settings are up to date.');
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
