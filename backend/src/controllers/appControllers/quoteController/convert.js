const mongoose = require('mongoose');

const Quote = mongoose.model('Quote');
const Invoice = mongoose.model('Invoice');
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

  const existingInvoice = await Invoice.findOne({
    'converted.from': 'quote',
    'converted.quote': quote._id,
    removed: false,
  });
  if (existingInvoice) {
    quote.set('converted.invoice', existingInvoice._id);
    quote.status = 'accepted';
    await quote.save();
    return res.status(200).json({
      success: true,
      result: existingInvoice,
      message: 'Quote has already been converted',
    });
  }

  const invoiceId = new mongoose.Types.ObjectId();
  let invoice;
  try {
    invoice = await new Invoice({
      _id: invoiceId,
      createdBy: quote.createdBy,
      year: new Date().getFullYear(),
      date: quote.date,
      serviceDate: quote.date,
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
  } catch (error) {
    if (error?.code !== 11000) throw error;
    invoice = await Invoice.findOne({
      'converted.from': 'quote',
      'converted.quote': quote._id,
      removed: false,
    });
    if (!invoice) throw error;
  }

  quote.set('converted.invoice', invoice._id);
  quote.status = 'accepted';
  await quote.save();
  return res.status(200).json({
    success: true,
    result: invoice,
    message: 'Quote converted to invoice successfully',
  });
};

module.exports = convert;
