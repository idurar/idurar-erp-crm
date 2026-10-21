const mongoose = require('mongoose');

const INDEX_KEYS = { sourceModel: 1, sourceId: 1, sourceLineId: 1, type: 1 };
const LEGACY_INDEX_NAME = 'sourceModel_1_sourceId_1_sourceLineId_1_type_1';
const INDEX_NAME = 'stock_movement_source_unique';
const INDEX_OPTIONS = {
  name: INDEX_NAME,
  unique: true,
  partialFilterExpression: {
    sourceModel: { $type: 'string' },
    sourceId: { $type: 'objectId' },
    sourceLineId: { $type: 'string' },
  },
};

async function ensureStockMovementIndexes() {
  const StockMovement = mongoose.model('StockMovement');
  await StockMovement.createCollection();
  const indexes = await StockMovement.collection.indexes();
  const legacyIndex = indexes.find((index) => index.name === LEGACY_INDEX_NAME);

  if (legacyIndex) {
    await StockMovement.collection.dropIndex(LEGACY_INDEX_NAME);
  }

  const currentIndex = indexes.find((index) => index.name === INDEX_NAME);
  const expectedFilter = JSON.stringify(INDEX_OPTIONS.partialFilterExpression);
  if (
    currentIndex &&
    JSON.stringify(currentIndex.partialFilterExpression || {}) !== expectedFilter
  ) {
    await StockMovement.collection.dropIndex(INDEX_NAME);
  }

  await StockMovement.collection.createIndex(INDEX_KEYS, INDEX_OPTIONS);
}

module.exports = ensureStockMovementIndexes;
