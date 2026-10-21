require('module-alias/register');
const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const OrderConfirmation = require('../src/models/appModels/OrderConfirmation');

const baseDocument = () => ({
  client: new mongoose.Types.ObjectId(),
  createdBy: new mongoose.Types.ObjectId(),
  items: [
    { itemName: 'Rollladen', quantity: 2, price: 100, discount: 10, unit: 'Stk.' },
  ],
  taxRate: 20,
  paymentSchedule: [
    { label: 'Anzahlung', percentage: 40, dueTrigger: 'confirmation' },
    { label: 'Restzahlung', percentage: 60, dueTrigger: 'completion' },
  ],
});

test('order confirmation calculates totals and payment stages from percentages', async () => {
  const document = new OrderConfirmation(baseDocument());
  await document.validate();

  assert.equal(document.subTotal, 180);
  assert.equal(document.taxTotal, 36);
  assert.equal(document.total, 216);
  assert.equal(document.paymentSchedule[0].amount, 86.4);
  assert.equal(document.paymentSchedule[1].amount, 129.6);
  assert.match(document.number, /^AB-\d{8}-[A-F0-9]{6}$/);
});

test('order confirmation rejects payment schedules that do not total 100 percent', async () => {
  const values = baseDocument();
  values.paymentSchedule[1].percentage = 50;
  const document = new OrderConfirmation(values);

  await assert.rejects(document.validate(), /genau 100 %/);
});

test('only one active order confirmation can originate from a quote', () => {
  const index = OrderConfirmation.schema.indexes().find(([fields]) => fields.sourceQuote === 1);
  assert.ok(index);
  assert.equal(index[1].unique, true);
  assert.deepEqual(index[1].partialFilterExpression, {
    removed: false,
    sourceQuote: { $type: 'objectId' },
  });
});
