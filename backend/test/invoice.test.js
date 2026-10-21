require('module-alias/register');
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateInvoice,
  deriveInvoiceStatus,
  derivePaymentStatus,
} = require('../src/helpers/invoice');
const invoiceSchema = require('../src/controllers/appControllers/invoiceController/schemaValidate');
const { nextDateFor, buildRecurringDraft } = require('../src/services/recurringInvoiceService');
const sanitizeRichText = require('../src/helpers/sanitizeRichText');
const escapeHtml = require('../src/helpers/escapeHtml');
const {
  LICENSE_PATTERN,
  hashLicenseKey,
  normalizeLicenseKey,
} = require('../src/services/licenseService');

const validInvoice = {
  client: '507f1f77bcf86cd799439011',
  number: 1,
  year: 2026,
  date: '2026-10-16',
  serviceDate: '2026-10-16',
  expiredDate: '2026-10-30',
  items: [{ itemName: 'Design', quantity: 1, price: 100, total: 100 }],
  taxRate: 20,
};

test('calculates net, discount, tax and gross totals', () => {
  const result = calculateInvoice({
    items: [{ itemName: 'Design', quantity: 2, price: 100, discount: 10 }],
    taxRate: 20,
  });
  assert.equal(result.subTotal, 180);
  assert.equal(result.taxTotal, 36);
  assert.equal(result.total, 216);
  assert.equal(result.items[0].total, 180);
});

test('uses the displayed two-decimal unit price for invoice totals', () => {
  const result = calculateInvoice({
    items: [{ itemName: 'Schraube', quantity: 20, price: 0.249, discount: 0 }],
    taxRate: 20,
  });
  assert.equal(result.items[0].price, 0.25);
  assert.equal(result.items[0].total, 5);
  assert.equal(result.subTotal, 5);
  assert.equal(result.total, 6);
});

test('derives protected and financial invoice states', () => {
  assert.equal(deriveInvoiceStatus({ status: 'sent', paymentStatus: 'paid' }), 'paid');
  assert.equal(deriveInvoiceStatus({ status: 'issued', paymentStatus: 'unpaid' }), 'issued');
  assert.equal(
    deriveInvoiceStatus({ status: 'draft', paymentStatus: 'unpaid', expiredDate: '2000-01-01' }),
    'draft'
  );
  assert.equal(deriveInvoiceStatus({ status: 'cancelled', paymentStatus: 'unpaid' }), 'cancelled');
  assert.equal(
    deriveInvoiceStatus({ status: 'sent', paymentStatus: 'unpaid', expiredDate: '2000-01-01' }),
    'overdue'
  );
});

test('derives payment status with discounts, fees and currency rounding', () => {
  assert.equal(
    derivePaymentStatus({ total: 100, discount: 10, dunningFees: 5, credit: 95 }),
    'paid'
  );
  assert.equal(derivePaymentStatus({ total: 0.3, credit: 0.1 + 0.2 }), 'paid');
  assert.equal(derivePaymentStatus({ total: 100, credit: 25 }), 'partially');
  assert.equal(derivePaymentStatus({ total: 100, credit: 0 }), 'unpaid');
});

test('new and editable invoices can only be saved as drafts', () => {
  const { number, year, ...unnumberedInvoice } = validInvoice;
  assert.equal(number, 1);
  assert.equal(year, 2026);
  const draft = invoiceSchema.validate(unnumberedInvoice);
  assert.equal(draft.error, undefined);
  assert.equal(draft.value.status, 'draft');
  assert.equal(draft.value.number, undefined);

  const published = invoiceSchema.validate({ ...validInvoice, status: 'sent' });
  assert.match(published.error?.message || '', /status/);

  const invalidDueDate = invoiceSchema.validate({
    ...unnumberedInvoice,
    expiredDate: '2026-10-15',
  });
  assert.match(invalidDueDate.error?.message || '', /expiredDate/);
});

test('calculates recurring invoice dates for supported intervals', () => {
  const start = new Date('2026-01-15T00:00:00.000Z');
  assert.equal(nextDateFor(start, 'weekly').toISOString(), '2026-01-22T00:00:00.000Z');
  assert.equal(nextDateFor(start, 'monthly').toISOString(), '2026-02-15T00:00:00.000Z');
  assert.equal(nextDateFor(start, 'quarterly').toISOString(), '2026-04-15T00:00:00.000Z');
  assert.equal(nextDateFor(start, 'annually').toISOString(), '2027-01-15T00:00:00.000Z');
  const anchor = new Date('2026-01-31T00:00:00.000Z');
  const february = nextDateFor(anchor, 'monthly', anchor);
  assert.equal(february.toISOString(), '2026-02-28T00:00:00.000Z');
  assert.equal(nextDateFor(february, 'monthly', anchor).toISOString(), '2026-03-31T00:00:00.000Z');
});

test('recurring occurrences are fresh drafts and preserve payment terms', () => {
  const source = {
    _id: 'source-id',
    client: 'client-id',
    createdBy: 'admin-id',
    date: new Date('2026-01-01T00:00:00.000Z'),
    expiredDate: new Date('2026-01-15T00:00:00.000Z'),
    items: [{ _id: 'old-line', itemName: 'Abo', quantity: 1, price: 50, total: 50 }],
    taxRate: 20,
    subTotal: 50,
    taxTotal: 10,
    total: 60,
    currency: 'EUR',
    credit: 60,
    paymentStatus: 'paid',
    status: 'sent',
  };
  const occurrence = new Date('2026-02-01T00:00:00.000Z');
  const draft = buildRecurringDraft(source, occurrence);

  assert.equal(draft.number, undefined);
  assert.equal(draft.year, 2026);
  assert.equal(draft.status, 'draft');
  assert.equal(draft.paymentStatus, 'unpaid');
  assert.equal(draft.credit, 0);
  assert.equal(draft.recurringActive, false);
  assert.equal(draft.items[0]._id, undefined);
  assert.equal(draft.expiredDate.toISOString(), '2026-02-15T00:00:00.000Z');
});

test('PDF rich text keeps basic formatting but removes executable markup', () => {
  const sanitized = sanitizeRichText(
    '<p onclick="alert(1)">Text <strong>fett</strong><img src="http://internal/"><script>alert(1)</script></p>'
  );
  assert.equal(sanitized.includes('<strong>fett</strong>'), true);
  assert.equal(sanitized.includes('<p'), false);
  assert.equal(sanitized.includes('<img'), false);
  assert.equal(sanitized.includes('<script'), false);
  assert.equal(sanitized.includes('http://internal/'), true);
});

test('email fields are escaped before interpolation into HTML', () => {
  assert.equal(escapeHtml('<WIE & "Partner">'), '&lt;WIE &amp; &quot;Partner&quot;&gt;');
});

test('license keys are normalized, validated and stored only as hashes', () => {
  const key = 'wiepilot-aaaaaaaa-bbbbbbbb-cccccccc-dddddddd-eeeeeeee-ffffffff';
  const normalized = normalizeLicenseKey(`  ${key}  `);
  assert.equal(LICENSE_PATTERN.test(normalized), true);
  assert.equal(hashLicenseKey(normalized).length, 64);
  assert.equal(hashLicenseKey(normalized).includes('WIEPILOT'), false);
});
