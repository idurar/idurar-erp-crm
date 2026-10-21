require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

async function createIndexes() {
  await mongoose.connect(process.env.DATABASE);
  for (const filePath of globSync('./src/models/**/*.js')) require(path.resolve(filePath));
  const ensureStockMovementIndexes = require('./ensureStockMovementIndexes');
  await ensureStockMovementIndexes();
  for (const model of Object.values(mongoose.models)) await model.createIndexes();
  console.log(`Indexes verified for ${Object.keys(mongoose.models).length} models.`);
  await mongoose.disconnect();
}

createIndexes().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
