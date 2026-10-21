require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { EJSON } = require('bson');

const backupDir = path.resolve(__dirname, '../../backups');
fs.mkdirSync(backupDir, { recursive: true });
const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const archiveTarget = path.join(backupDir, `mongodb-${stamp}.archive.gz`);
const result = spawnSync(
  'mongodump',
  [`--uri=${process.env.DATABASE}`, `--archive=${archiveTarget}`, '--gzip'],
  {
    stdio: 'inherit',
  }
);

async function fallbackBackup() {
  await mongoose.connect(process.env.DATABASE);
  const collections = await mongoose.connection.db.listCollections().toArray();
  const data = {};
  for (const collection of collections) {
    data[collection.name] = await mongoose.connection.db
      .collection(collection.name)
      .find({})
      .toArray();
  }
  const jsonTarget = path.join(backupDir, `mongodb-${stamp}.ejson`);
  fs.writeFileSync(jsonTarget, EJSON.stringify(data, { relaxed: false }));
  await mongoose.disconnect();
  console.log(`Portables EJSON-Backup erstellt: ${jsonTarget}`);
}

if (!result.error && result.status === 0) {
  console.log(`Backup erstellt: ${archiveTarget}`);
} else {
  console.warn('mongodump nicht verfügbar; verwende portables EJSON-Backup.');
  fallbackBackup().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  });
}
