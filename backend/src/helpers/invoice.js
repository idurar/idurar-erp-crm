const { calculate } = require('@/helpers');

const calculateInvoice = ({ items = [], taxRate = 0 }) => {
  let subTotal = 0;
  const calculatedItems = items.map((item) => {
    const price = Math.round((Number(item.price) + Number.EPSILON) * 100) / 100;
    const lineAmount = calculate.multiply(Number(item.quantity), price);
    const total = calculate.multiply(lineAmount, 1 - (Number(item.discount) || 0) / 100);
    subTotal = calculate.add(subTotal, total);
    return { ...item, price, total };
  });
  const taxTotal = calculate.multiply(subTotal, Number(taxRate) / 100);
  return { items: calculatedItems, subTotal, taxTotal, total: calculate.add(subTotal, taxTotal) };
};

const deriveInvoiceStatus = ({ status, paymentStatus, expiredDate }) => {
  if (['cancelled', 'refunded'].includes(status)) return status;
  if (paymentStatus === 'paid') return 'paid';
  if (status === 'draft') return 'draft';
  if (expiredDate && new Date(expiredDate) < new Date()) return 'overdue';
  return status;
};

const derivePaymentStatus = ({ total = 0, discount = 0, credit = 0, dunningFees = 0 }) => {
  const amountDue = calculate.sub(calculate.add(total, dunningFees), discount);
  if (calculate.sub(amountDue, credit) <= 0) return 'paid';
  return credit > 0 ? 'partially' : 'unpaid';
};

module.exports = { calculateInvoice, deriveInvoiceStatus, derivePaymentStatus };
