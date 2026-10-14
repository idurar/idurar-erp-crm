require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { globSync } = require('glob');
const fs = require('fs');
const { generate: uniqueId } = require('shortid');

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

async function setupApp() {
  try {
    const Admin = require('../models/coreModels/Admin');
    const AdminPassword = require('../models/coreModels/AdminPassword');
    const newAdminPassword = new AdminPassword();

    const salt = uniqueId();

    const passwordHash = newAdminPassword.generateHash(salt, 'admin123');

    const demoAdmin = {
      email: 'admin@admin.com',
      name: 'IDURAR',
      surname: 'Admin',
      enabled: true,
      role: 'owner',
    };
    const result = await new Admin(demoAdmin).save();

    const AdminPasswordData = {
      password: passwordHash,
      emailVerified: true,
      salt: salt,
      user: result._id,
    };
    await new AdminPassword(AdminPasswordData).save();

    console.log('👍 Admin created : Done!');

    const Setting = require('../models/coreModels/Setting');

    const settingFiles = [];

    const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');

    for (const filePath of settingsFiles) {
      const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      settingFiles.push(...file);
    }

    await Setting.insertMany(settingFiles);

    console.log('👍 Settings created : Done!');

    const PaymentMode = require('../models/appModels/PaymentMode');
    const Taxes = require('../models/appModels/Taxes');

    await Taxes.insertMany([
      { taxName: '0%', taxValue: 0, isDefault: false },
      { taxName: '10%', taxValue: 10, isDefault: false },
      { taxName: '20%', taxValue: 20, isDefault: true },
    ]);
    console.log('👍 Taxes created : Done!');

    await PaymentMode.insertMany([
      { name: 'Barzahlung', description: 'Zahlung in bar', isDefault: false },
      { name: 'Überweisung', description: 'Zahlung per Banküberweisung', isDefault: true },
      {
        name: 'Anzahlung',
        description: 'Prozentuelle Anzahlung auf den Rechnungsbetrag',
        supportsDeposit: true,
        defaultDepositPercentage: 30,
        isDefault: false,
      },
      {
        name: 'Restzahlung',
        description: 'Offener Rechnungsbetrag abzüglich bereits geleisteter Anzahlungen',
        isDefault: false,
      },
    ]);
    console.log('👍 PaymentMode created : Done!');

    console.log('🥳 Setup completed :Success!');
    process.exit();
  } catch (e) {
    console.log('\n🚫 Error! The Error info is below');
    console.log(e);
    process.exit();
  }
}

setupApp();
