require('module-alias/register');
const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const { rollbackBooking } = require('../src/services/inventoryService');
const { getCategoryUsage } = require('../src/services/articleCategoryService');
const { runAtomic, transactionUnsupported } = require('../src/services/transactionService');

test('inventory rollback reverses only movements that were actually deleted', async () => {
  const stockUpdates = [];
  const deletedMovements = [];
  const Article = {
    updateOne: async (filter, update) => stockUpdates.push({ filter, update }),
  };
  const StockMovement = {
    deleteOne: async ({ _id }) => {
      deletedMovements.push(_id);
      return { deletedCount: _id === 'new-movement' ? 1 : 0 };
    },
  };

  await rollbackBooking([
    { movementId: 'already-removed', articleId: 'article-1', quantity: -2 },
    { movementId: 'new-movement', articleId: 'article-2', quantity: -3 },
  ], { Article, StockMovement });

  assert.deepEqual(deletedMovements, ['new-movement', 'already-removed']);
  assert.deepEqual(stockUpdates, [{
    filter: { _id: 'article-2', removed: false },
    update: { $inc: { stock: 3 } },
  }]);
});

test('category usage reports assigned articles and direct child categories', async () => {
  const calls = [];
  const usage = await getCategoryUsage('category-1', {
    Article: {
      countDocuments: async (filter) => { calls.push(filter); return 4; },
    },
    ArticleCategory: {
      countDocuments: async (filter) => { calls.push(filter); return 2; },
    },
  });

  assert.deepEqual(usage, { articleCount: 4, childCount: 2 });
  assert.deepEqual(calls, [
    { category: 'category-1', removed: false },
    { parent: 'category-1', removed: false },
  ]);
});

test('detects standalone MongoDB transaction errors without hiding unrelated failures', () => {
  assert.equal(transactionUnsupported({ code: 20 }), true);
  assert.equal(
    transactionUnsupported({ message: 'Transaction numbers are only allowed on a replica set member or mongos' }),
    true
  );
  assert.equal(transactionUnsupported(new Error('network timeout')), false);
});

test('atomic work uses one transaction session and always closes it', async (t) => {
  let ended = false;
  const session = {
    withTransaction: async (callback) => callback(),
    endSession: async () => { ended = true; },
  };
  t.mock.method(mongoose, 'startSession', async () => session);

  const result = await runAtomic(async (activeSession) => {
    assert.equal(activeSession, session);
    return 'committed';
  });

  assert.equal(result, 'committed');
  assert.equal(ended, true);
});

test('standalone MongoDB fallback is limited to development', async (t) => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';
  t.after(() => { process.env.NODE_ENV = previousNodeEnv; });

  let ended = false;
  const session = {
    withTransaction: async () => { throw Object.assign(new Error('unsupported'), { code: 20 }); },
    endSession: async () => { ended = true; },
  };
  t.mock.method(mongoose, 'startSession', async () => session);

  const result = await runAtomic(async (activeSession) => {
    assert.equal(activeSession, null);
    return 'development-fallback';
  });

  assert.equal(result, 'development-fallback');
  assert.equal(ended, true);
});
