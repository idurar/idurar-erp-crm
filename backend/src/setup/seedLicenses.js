require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
require('module-alias/register');
const mongoose = require('mongoose');
const initialLicenseHashes = require('./initialLicenseHashes');
const { importLicenseHashes } = require('@/services/licenseService');

const run = async () => {
  await mongoose.connect(process.env.DATABASE, { autoIndex: false });
  const imported = await importLicenseHashes(initialLicenseHashes);
  console.log(`License catalog ready (${imported} new key(s)).`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
