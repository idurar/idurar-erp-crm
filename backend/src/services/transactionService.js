const mongoose = require('mongoose');

const transactionUnsupported = (error) =>
  error?.code === 20 ||
  /Transaction numbers are only allowed|replica set member or mongos/i.test(error?.message || '');

const supportsTransactions = () => {
  const topologyType = mongoose.connection.client?.topology?.description?.type;
  return ['ReplicaSetWithPrimary', 'ReplicaSetNoPrimary', 'Sharded'].includes(topologyType);
};

async function runAtomic(work, { allowDevelopmentFallback = true } = {}) {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await work(session);
    });
    return result;
  } catch (error) {
    const mayFallback =
      allowDevelopmentFallback &&
      process.env.NODE_ENV !== 'production' &&
      transactionUnsupported(error);
    if (mayFallback) return work(null);
    throw error;
  } finally {
    await session.endSession();
  }
}

module.exports = { runAtomic, supportsTransactions, transactionUnsupported };
