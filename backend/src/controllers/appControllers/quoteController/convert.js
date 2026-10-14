const mongoose = require('mongoose');
const { increaseBySettingKey } = require('@/middlewares/settings');

const Quote = mongoose.model('Quote');
const Invoice = mongoose.model('Invoice');
const Setting = mongoose.model('Setting');

const convert = async (req, res) => {
  const quote = await Quote.findOne({ _id: req.params.id, removed: false });
  if (!quote) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No quote found',
    });
  }

  if (quote.converted?.invoice) {
    return res.status(200).json({
      success: true,
      result: quote.converted.invoice,
      message: 'Quote has already been converted',
    });
  }

  const invoiceNumberSetting = await Setting.findOne({ settingKey: 'last_invoice_number' });
  if (!invoiceNumberSetting) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'The last_invoice_number setting is not configured',
    });
  }

  const invoiceId = new mongoose.Types.ObjectId();
  const invoice = await new Invoice({
    _id: invoiceId,
    createdBy: quote.createdBy,
    number: Number(invoiceNumberSetting.settingValue) + 1,
    year: new Date().getFullYear(),
    date: quote.date,
    expiredDate: quote.expiredDate,
    client: quote.client?._id || quote.client,
    items: quote.items.map((item) => ({
      article: item.article,
      itemName: item.itemName,
      description: item.description,
      unit: item.unit,
      discount: item.discount,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    })),
    taxRate: quote.taxRate,
    subTotal: quote.subTotal,
    taxTotal: quote.taxTotal,
    total: quote.total,
    currency: quote.currency,
    notes: quote.notes,
    status: 'draft',
    converted: { from: 'quote', quote: quote._id },
    pdf: `invoice-${invoiceId}.pdf`,
  }).save();

  quote.converted = { invoice: invoice._id };
  quote.status = 'accepted';
  await quote.save();
  await increaseBySettingKey({ settingKey: 'last_invoice_number' });

  return res.status(200).json({
    success: true,
    result: invoice,
    message: 'Quote converted to invoice successfully',
  });
};

module.exports = convert;
