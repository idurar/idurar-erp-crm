require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
require('module-alias/register');
const fs = require('fs');
const mongoose = require('mongoose');
const {
  LICENSE_PATTERN,
  hashLicenseKey,
  importLicenseHashes,
  normalizeLicenseKey,
} = require('@/services/licenseService');

const run = async () => {
  const filePath = process.argv[2];
  if (!filePath) throw new Error('Usage: npm run license:import -- <path-to-license-file>');
  const keys = fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map(normalizeLicenseKey)
    .filter(Boolean);
  const invalidCount = keys.filter((key) => !LICENSE_PATTERN.test(key)).length;
  if (invalidCount) throw new Error(`${invalidCount} invalid license key(s) in import file.`);
  await mongoose.connect(process.env.DATABASE, { autoIndex: false });
  const imported = await importLicenseHashes([...new Set(keys.map(hashLicenseKey))]);
  console.log(`License import complete (${imported} new key(s), ${keys.length} checked).`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
