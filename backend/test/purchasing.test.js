const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const pug = require('pug');
const PurchaseOrder = require('../src/models/appModels/PurchaseOrder');
const GoodsReceipt = require('../src/models/appModels/GoodsReceipt');
const { calculateMovingAverage } = require('../src/services/inventoryValuation');
const { buildDeliverySummary } = require('../src/services/purchaseOrderDelivery');

const money = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const calculateOrder = (items) => {
  const calculated = items.map((item) => {
    const netAmount = money(item.quantity * item.unitPrice);
    const taxAmount = money(netAmount * item.taxRate / 100);
    return { netAmount, taxAmount, grossAmount: money(netAmount + taxAmount) };
  });
  return {
    netTotal: money(calculated.reduce((sum, item) => sum + item.netAmount, 0)),
    taxTotal: money(calculated.reduce((sum, item) => sum + item.taxAmount, 0)),
  };
};

test('purchase order totals use currency rounding per line', () => {
  assert.deepEqual(calculateOrder([
    { quantity: 3, unitPrice: 1.999, taxRate: 20 },
    { quantity: 2, unitPrice: 10, taxRate: 10 },
  ]), { netTotal: 26, taxTotal: 3.2 });
});

test('new purchase orders are immediately available for goods receipt', async () => {
  const order = new PurchaseOrder({
    supplier: new mongoose.Types.ObjectId(),
    createdBy: new mongoose.Types.ObjectId(),
    items: [{ description: 'Rollladenwelle', quantity: 2, unitPrice: 25, taxRate: 20 }],
  });
  await order.validate();

  assert.equal(order.status, 'ordered');
  assert.equal(order.netTotal, 50);
  assert.equal(order.taxTotal, 10);
  assert.equal(order.grossTotal, 60);
});

test('purchase order PDF template compiles', () => {
  assert.doesNotThrow(() => pug.compileFile('src/pdf/PurchaseOrder.pug'));
});

test('goods receipt uses a moving average purchase price', () => {
  assert.equal(calculateMovingAverage({
    currentStock: 10,
    currentUnitCost: 25,
    receivedQuantity: 10,
    receivedUnitCost: 28,
  }), 26.5);
});

test('first priced receipt establishes purchase price', () => {
  assert.equal(calculateMovingAverage({
    currentStock: 0,
    currentUnitCost: 25,
    receivedQuantity: 4,
    receivedUnitCost: 28,
  }), 28);
});

test('receipt without entered price preserves existing valuation', () => {
  assert.equal(calculateMovingAverage({
    currentStock: 10,
    currentUnitCost: 25,
    receivedQuantity: 5,
    receivedUnitCost: 0,
  }), 25);
});

test('goods receipt number is generated when it is left empty', async () => {
  const receipt = new GoodsReceipt({
    number: '',
    purchaseOrder: new mongoose.Types.ObjectId(),
    supplier: new mongoose.Types.ObjectId(),
    createdBy: new mongoose.Types.ObjectId(),
    items: [{
      purchaseOrderLineId: new mongoose.Types.ObjectId().toString(),
      article: new mongoose.Types.ObjectId(),
      description: 'Rollladengetriebe',
      quantity: 1,
    }],
  });
  await receipt.validate();
  assert.match(receipt.number, /^WE-\d{8}-[A-F0-9]{6}$/);
});

test('goods receipt preserves the commission copied from its purchase order', async () => {
  const receipt = new GoodsReceipt({
    purchaseOrder: new mongoose.Types.ObjectId(),
    supplier: new mongoose.Types.ObjectId(),
    createdBy: new mongoose.Types.ObjectId(),
    commission: 'Komm. Ender',
    items: [{
      purchaseOrderLineId: new mongoose.Types.ObjectId().toString(),
      article: new mongoose.Types.ObjectId(),
      description: 'Rollladengetriebe',
      quantity: 1,
    }],
  });

  await receipt.validate();

  assert.equal(receipt.commission, 'Komm. Ender');
});

test('purchase order delivery summary shows received and open quantities per line', () => {
  const firstLine = new mongoose.Types.ObjectId();
  const secondLine = new mongoose.Types.ObjectId();
  const order = {
    items: [
      { _id: firstLine, description: 'Motor', quantity: 5, unit: 'Stk.' },
      { _id: secondLine, description: 'Welle', quantity: 3, unit: 'Stk.' },
    ],
  };
  const summary = buildDeliverySummary(order, [{
    items: [
      { purchaseOrderLineId: String(firstLine), quantity: 2 },
      { purchaseOrderLineId: String(secondLine), quantity: 3 },
    ],
  }]);

  assert.deepEqual(summary.lines.map(({ description, ordered, received, open }) => ({ description, ordered, received, open })), [
    { description: 'Motor', ordered: 5, received: 2, open: 3 },
    { description: 'Welle', ordered: 3, received: 3, open: 0 },
  ]);
  assert.deepEqual({ ordered: summary.ordered, received: summary.received, open: summary.open }, {
    ordered: 8,
    received: 5,
    open: 3,
  });
});
