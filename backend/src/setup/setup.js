import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });
import { globSync } from 'glob';
import fs from 'fs';
import { generate as uniqueId } from 'shortid';
import mongoose from 'mongoose';
import Admin from '../models/coreModels/Admin.js';
import AdminPassword from '../models/coreModels/AdminPassword.js';
import Setting from '../models/coreModels/Setting.js';
import Email from '../models/coreModels/Email.js';
mongoose.connect(process.env.DATABASE);

async function setupApp() {
  try {
    const newAdminPassword = new AdminPassword();

    const salt = uniqueId();

    const passwordHash = newAdminPassword.generateHash(salt, 'admin123');

    const demoAdmin = {
      email: 'admin@demo.com',
      name: 'IDURAR',
      surname: 'Admin',
      enabled: true,
      role: 'superadmin',
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

    const settingFiles = [];

    const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');
    console.log('🚀 ~ file: setup.js:30 ~ setupApp ~ settingsFiles:', settingsFiles);

    for (const filePath of settingsFiles) {
      const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      settingFiles.push(...file);
    }

    await Setting.insertMany(settingFiles);

    console.log('👍 Settings created : Done!');

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
