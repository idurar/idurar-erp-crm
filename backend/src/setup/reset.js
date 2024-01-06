import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
mongoose.connect(process.env.DATABASE);

const deleteData = async () => {
  const Admin = require('../models/coreModels/Admin');
  const AdminPassword = require('../models/coreModels/AdminPassword');
  const Setting = require('../models/coreModels/Setting');
  const Email = require('../models/coreModels/Email');

  await Admin.deleteMany();
  await AdminPassword.deleteMany();
  console.log('👍 Admin Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
  await Setting.deleteMany();
  console.log('👍 Setting Deleted. To setup Setting data, run\n\n\t npm run setup\n\n');
  await Email.deleteMany();
  console.log('👍 Email Deleted. To setup Email data, run\n\n\t npm run setup\n\n');
  process.exit();
};

deleteData();
