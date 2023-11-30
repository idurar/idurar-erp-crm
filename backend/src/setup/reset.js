require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

async function deleteData() {
  const Admin = require('../models/coreModels/Admin');
  const AdminPassword = require('../models/coreModels/AdminPassword');
  const Setting = require('../models/coreModels/Setting');
  const Email = require('../models/coreModels/Email');
  const Client = require('../models/appModels/Client');
  const Invoice = require('../models/appModels/Invoice');
  await Invoice.deleteMany();
  console.log('👍 Invoice Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
  await Client.deleteMany();
  console.log('👍 Client Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
  await Admin.deleteMany();
  await AdminPassword.deleteMany();
  console.log('👍 Admin Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
  await Setting.deleteMany();
  console.log('👍 Setting Deleted. To setup Setting data, run\n\n\t npm run setup\n\n');
  await Email.deleteMany();
  console.log('👍 Email Deleted. To setup Email data, run\n\n\t npm run setup\n\n');
  process.exit();
}

deleteData();
