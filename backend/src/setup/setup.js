require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { globSync } = require('glob');
const fs = require('fs');

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

async function setupApp() {
  try {
    const Admin = require('../models/coreModels/Admin');
    var newAdmin = new Admin();
    const passwordHash = newAdmin.generateHash('admin123');

    await new Admin({
      email: 'admin@demo.com',
      password: passwordHash,
      name: 'Salah Eddine',
      surname: 'Lalami',
      role: 'admin',
    }).save();

    console.log('👍 Admin created : Done!');

    const Setting = require('../models/coreModels/Setting');

    const settingFiles = [];

    const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');
    console.log('🚀 ~ file: setup.js:30 ~ setupApp ~ settingsFiles:', settingsFiles);

    for (const filePath of settingsFiles) {
      const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      settingFiles.push(...file);
    }

    await Setting.insertMany(settingFiles);

    console.log('👍 Settings created : Done!');

    const Email = require('../models/coreModels/Email');
    const emailTemplate = JSON.parse(
      fs.readFileSync(__dirname + '/emailTemplate/index.json', 'utf-8')
    );

    await Email.insertMany([...emailTemplate]);
    console.log('👍 Email Templates Created : Done !');
    console.log('🥳 Setup completed :Success!');
    process.exit();
  } catch (e) {
    console.log('\n🚫 Error! The Error info is below');
    console.log(e);
    process.exit();
  }
}

setupApp();
