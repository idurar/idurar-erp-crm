const mongoose = require('mongoose');

async function bookInvoice(invoice, createdBy) {
  const Article = mongoose.model('Article');
  const StockMovement = mongoose.model('StockMovement');
  const isCredit = invoice.status === 'refunded';
  for (const item of invoice.items || []) {
    if (!item.article) continue;
    const article = await Article.findById(item.article).populate('category').lean();
    const tracksStock = article?.category?.trackStock !== false &&
      article?.category?.name?.toLocaleLowerCase('de') !== 'dienstleistung';
    if (!article || !tracksStock) continue;
    const sourceLineId = String(item._id);
    const movement = {
      article: item.article,
      quantity: (isCredit ? 1 : -1) * Number(item.quantity),
      type: isCredit ? 'credit_note' : 'invoice',
      sourceModel: 'Invoice', sourceId: invoice._id, sourceLineId,
      effectiveAt: invoice.date || new Date(), createdBy,
    };
    try {
      await StockMovement.create(movement);
      await Article.updateOne({ _id: item.article }, { $inc: { stock: movement.quantity } });
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
  }
}

module.exports = { bookInvoice };
