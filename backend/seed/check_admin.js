// Check admins in the given MongoDB URI
const mongoose = require('mongoose');
const Admin = require('../src/models/coreModels/Admin');

async function main() {
  const uri = process.env.DATABASE;
  if (!uri) {
    console.error('Please set DATABASE env to the MongoDB URI.');
    process.exit(2);
  }
  await mongoose.connect(uri);
  const admins = await Admin.find({}).lean();
  console.log('Admins:', admins);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
