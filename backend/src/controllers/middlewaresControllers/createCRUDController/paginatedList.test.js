const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const paginatedList = require('./paginatedList');

function createMockRes() {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

function createChainableQuery(result = []) {
  const query = {
    skip() {
      return this;
    },
    limit() {
      return this;
    },
    sort() {
      return this;
    },
    populate() {
      return this;
    },
    exec: async () => result,
  };
  return query;
}

function createMockModel({ findResult = [{ _id: '1' }], count = 1 } = {}) {
  let lastFindQuery = null;
  let lastCountQuery = null;

  const Model = {
    find(query) {
      lastFindQuery = query;
      return createChainableQuery(findResult);
    },
    countDocuments: async (query) => {
      lastCountQuery = query;
      return count;
    },
    getLastFindQuery: () => lastFindQuery,
    getLastCountQuery: () => lastCountQuery,
  };

  return Model;
}

describe('paginatedList date range filtering', () => {
  it('does not apply createdAt filter when dateFrom and dateTo are omitted', async () => {
    const Model = createMockModel();
    const req = { query: { page: 1, items: 10 } };
    const res = createMockRes();

    await paginatedList(Model, req, res);

    const findQuery = Model.getLastFindQuery();
    const countQuery = Model.getLastCountQuery();

    assert.equal(findQuery.removed, false);
    assert.equal(findQuery.createdAt, undefined);
    assert.equal(countQuery.createdAt, undefined);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
  });

  it('filters by createdAt $gte when only dateFrom is provided', async () => {
    const Model = createMockModel();
    const dateFrom = '2024-01-01';
    const req = { query: { page: 1, items: 10, dateFrom } };
    const res = createMockRes();

    await paginatedList(Model, req, res);

    const findQuery = Model.getLastFindQuery();
    const countQuery = Model.getLastCountQuery();

    assert.ok(findQuery.createdAt);
    assert.deepEqual(findQuery.createdAt.$gte, new Date(dateFrom));
    assert.equal(findQuery.createdAt.$lte, undefined);
    assert.deepEqual(countQuery.createdAt.$gte, new Date(dateFrom));
    assert.equal(res.statusCode, 200);
  });

  it('filters by createdAt $lte when only dateTo is provided', async () => {
    const Model = createMockModel();
    const dateTo = '2024-12-31';
    const req = { query: { page: 1, items: 10, dateTo } };
    const res = createMockRes();

    await paginatedList(Model, req, res);

    const findQuery = Model.getLastFindQuery();
    const countQuery = Model.getLastCountQuery();

    assert.ok(findQuery.createdAt);
    assert.deepEqual(findQuery.createdAt.$lte, new Date(dateTo));
    assert.equal(findQuery.createdAt.$gte, undefined);
    assert.deepEqual(countQuery.createdAt.$lte, new Date(dateTo));
    assert.equal(res.statusCode, 200);
  });

  it('filters by createdAt range when both dateFrom and dateTo are provided', async () => {
    const Model = createMockModel();
    const dateFrom = '2024-06-01';
    const dateTo = '2024-06-30';
    const req = { query: { page: 1, items: 10, dateFrom, dateTo } };
    const res = createMockRes();

    await paginatedList(Model, req, res);

    const findQuery = Model.getLastFindQuery();
    const countQuery = Model.getLastCountQuery();

    assert.deepEqual(findQuery.createdAt, {
      $gte: new Date(dateFrom),
      $lte: new Date(dateTo),
    });
    assert.deepEqual(countQuery.createdAt, {
      $gte: new Date(dateFrom),
      $lte: new Date(dateTo),
    });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
  });

  it('combines date range with existing filter and equal params', async () => {
    const Model = createMockModel();
    const dateFrom = '2024-01-01';
    const dateTo = '2024-12-31';
    const req = {
      query: {
        page: 1,
        items: 10,
        filter: 'status',
        equal: 'draft',
        dateFrom,
        dateTo,
      },
    };
    const res = createMockRes();

    await paginatedList(Model, req, res);

    const findQuery = Model.getLastFindQuery();

    assert.equal(findQuery.removed, false);
    assert.equal(findQuery.status, 'draft');
    assert.deepEqual(findQuery.createdAt, {
      $gte: new Date(dateFrom),
      $lte: new Date(dateTo),
    });
  });
});
