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

    const demoAdmin = {
      email: (process.env.SETUP_ADMIN_EMAIL || 'admin@admin.com').trim().toLowerCase(),
      name: process.env.SETUP_ADMIN_NAME || 'Administrator',
      surname: process.env.SETUP_ADMIN_SURNAME || 'Admin',
      enabled: true,
      role: 'owner',
    };
    let result = await Admin.findOne({ email: demoAdmin.email, removed: false });
    if (!result) {
      const setupPassword = process.env.SETUP_ADMIN_PASSWORD;
      if (!setupPassword || setupPassword.length < 12) {
        throw new Error(
          'For the first setup, SETUP_ADMIN_PASSWORD must contain at least 12 characters.'
        );
      }
      const salt = uniqueId();
      const passwordHash = newAdminPassword.generateHash(salt, setupPassword);
      result = await new Admin(demoAdmin).save();
      const AdminPasswordData = {
        password: passwordHash,
        emailVerified: true,
        salt: salt,
        user: result._id,
      };
      await new AdminPassword(AdminPasswordData).save();
    }

    console.log('👍 Admin checked : Done!');

    const Setting = require('../models/coreModels/Setting');

    const settingFiles = [];

    const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');

    for (const filePath of settingsFiles) {
      const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      settingFiles.push(...file);
    }

    await Setting.bulkWrite(
      settingFiles.map((setting) => ({
        updateOne: {
          filter: { settingKey: setting.settingKey, removed: false },
          update: { $setOnInsert: setting },
          upsert: true,
        },
      }))
    );

    console.log('👍 Settings created : Done!');

    const { importLicenseHashes } = require('../services/licenseService');
    const initialLicenseHashes = require('./initialLicenseHashes');
    await importLicenseHashes(initialLicenseHashes);
    console.log('👍 License catalog checked : Done!');

    const PaymentMode = require('../models/appModels/PaymentMode');
    const Taxes = require('../models/appModels/Taxes');

    const defaultTaxes = [
      { taxName: '0%', taxValue: 0, isDefault: false },
      { taxName: '10%', taxValue: 10, isDefault: false },
      { taxName: '20%', taxValue: 20, isDefault: true },
    ];
    await Taxes.bulkWrite(
      defaultTaxes.map((tax) => ({
        updateOne: {
          filter: { taxName: tax.taxName, removed: false },
          update: { $setOnInsert: tax },
          upsert: true,
        },
      }))
    );
    console.log('👍 Taxes created : Done!');

    const defaultPaymentModes = [
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
    ];
    await PaymentMode.bulkWrite(
      defaultPaymentModes.map((mode) => ({
        updateOne: {
          filter: { name: mode.name, removed: false },
          update: { $setOnInsert: mode },
          upsert: true,
        },
      }))
    );
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
