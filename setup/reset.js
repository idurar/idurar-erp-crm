require('dotenv').config({ path: __dirname + '/../.variables.env' });

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

async function deleteData() {
  const Admin = require('../models/erpModels/Admin');
  await Admin.remove();
  console.log(
    '👍👍👍👍👍👍👍👍 admin Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n'
  );
  process.exit();
}

deleteData();
