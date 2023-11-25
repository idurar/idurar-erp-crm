require('dotenv').config({ path: __dirname + '/../.env' });
require('dotenv').config({ path: __dirname + '/../.env.local' });

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

async function deleteData() {
  const Admin = require('../models/coreModels/Admin');
  const Setting = require('../models/coreModels/Setting');
  const Email = require('../models/coreModels/Email');
  await Admin.deleteMany();
  console.log('👍 admin Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
  await Setting.deleteMany();
  console.log('👍 Setting Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
  await Email.deleteMany();
  console.log('👍 Email Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
  process.exit();
}

deleteData();
