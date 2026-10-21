require('module-alias/register');
const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

require('../src/models/appModels/Invoice');
require('../src/models/appModels/Payment');

const Invoice = mongoose.model('Invoice');
const Payment = mongoose.model('Payment');

const hasUniqueIndex = (model, expectedFields) =>
  model.schema.indexes().some(([fields, options]) =>
    options.unique &&
    Object.entries(expectedFields).every(([key, value]) => fields[key] === value)
  );

const findIndex = (model, expectedFields) =>
  model.schema.indexes().find(([fields]) =>
    Object.entries(expectedFields).every(([key, value]) => fields[key] === value)
  );

test('prevents duplicate credit notes for the same invoice', () => {
  assert.equal(hasUniqueIndex(Invoice, { originalInvoice: 1, documentType: 1 }), true);
});

test('prevents converting the same quote more than once', () => {
  assert.equal(hasUniqueIndex(Invoice, { 'converted.quote': 1 }), true);
});

test('prevents duplicate payment numbers within a year', () => {
  assert.equal(hasUniqueIndex(Payment, { number: 1, year: 1 }), true);
});

test('prevents duplicate recurring invoice occurrences', () => {
  assert.equal(
    hasUniqueIndex(Invoice, { recurringSource: 1, recurringOccurrenceDate: 1 }),
    true
  );
});

test('invoice numbers are unique only after a number has been assigned', () => {
  const [, options] = findIndex(Invoice, { number: 1, year: 1 });
  assert.equal(options.unique, true);
  assert.deepEqual(options.partialFilterExpression, {
    removed: false,
    number: { $type: 'number' },
  });
});
