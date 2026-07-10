const { calculate } = require('@/helpers');

/**
 * Calculate item line totals, subtotal, tax total, and grand total for an invoice.
 * Mutates each item to set item.total (same behavior as the previous inline logic).
 *
 * @param {Array} items - Invoice line items with quantity and price
 * @param {number} taxRate - Tax rate as a percentage (e.g. 10 for 10%)
 * @returns {{ subTotal: number, taxTotal: number, total: number, items: Array }}
 */
const calculateTotals = (items = [], taxRate = 0) => {
  let subTotal = 0;

  items.map((item) => {
    let total = calculate.multiply(item['quantity'], item['price']);
    // sub total
    subTotal = calculate.add(subTotal, total);
    // item total
    item['total'] = total;
  });

  const taxTotal = calculate.multiply(subTotal, taxRate / 100);
  const total = calculate.add(subTotal, taxTotal);

  return { subTotal, taxTotal, total, items };
};

module.exports = calculateTotals;
