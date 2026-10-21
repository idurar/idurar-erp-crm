require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { EJSON } = require('bson');

const input = process.argv.find((argument) => argument.endsWith('.ejson'));
if (!process.argv.includes('--apply') || !input) {
  console.error('Abbruch. Verwendung: npm run db:restore -- PFAD.ejson --apply');
  process.exit(1);
}
const source = path.resolve(input);
if (!fs.existsSync(source)) {
  console.error(`Backup nicht gefunden: ${source}`);
  process.exit(1);
}

const allowedCollections = new Set([
  'admins',
  'adminpasswords',
  'articles',
  'articlecategories',
  'clients',
  'invoices',
  'payments',
  'paymentmodes',
  'quotes',
  'settings',
  'stockmovements',
  'taxes',
  'uploads',
]);

async function restore() {
  const data = EJSON.parse(fs.readFileSync(source, 'utf8'));
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Ungültiges Backupformat');
  }
  for (const [name, documents] of Object.entries(data)) {
    if (!allowedCollections.has(name) || !Array.isArray(documents)) {
      throw new Error(`Nicht erlaubte oder ungültige Collection im Backup: ${name}`);
    }
  }
  await mongoose.connect(process.env.DATABASE);

  // Always create a recoverable snapshot before modifying any collection.
  const backupDir = path.resolve(__dirname, '../../backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
  const safetyCopy = {};
  const existingCollections = await mongoose.connection.db.listCollections().toArray();
  for (const { name } of existingCollections) {
    if (allowedCollections.has(name)) {
      safetyCopy[name] = await mongoose.connection.db.collection(name).find({}).toArray();
    }
  }
  const safetyTarget = path.join(backupDir, `pre-restore-${stamp}.ejson`);
  fs.writeFileSync(safetyTarget, EJSON.stringify(safetyCopy, { relaxed: false }));
  console.log(`Sicherheitskopie vor Restore: ${safetyTarget}`);

  for (const [name, documents] of Object.entries(data)) {
    const collection = mongoose.connection.db.collection(name);
    await collection.deleteMany({});
    if (documents.length) await collection.insertMany(documents, { ordered: true });
  }
  await mongoose.disconnect();
  console.log(`Backup wiederhergestellt: ${source}`);
}

restore().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
