const mongoose = require('mongoose');

const tracksStock = (article) =>
  article?.category?.trackStock !== false &&
  article?.category?.name?.toLocaleLowerCase('de') !== 'dienstleistung';

async function getInsufficientStock(invoice, { session = null } = {}) {
  const Article = mongoose.model('Article');
  const requestedByArticle = new Map();
  for (const item of invoice.items || []) {
    if (!item.article) continue;
    const articleId = String(item.article?._id || item.article);
    requestedByArticle.set(
      articleId,
      (requestedByArticle.get(articleId) || 0) + Number(item.quantity || 0)
    );
  }
  if (!requestedByArticle.size) return [];

  const articles = await Article.find({
    _id: { $in: [...requestedByArticle.keys()] },
    removed: false,
  }).populate('category').session(session).lean();

  return articles
    .filter(tracksStock)
    .map((article) => ({
      articleId: article._id,
      number: article.number,
      name: article.name,
      available: Number(article.stock || 0),
      requested: requestedByArticle.get(String(article._id)) || 0,
    }))
    .filter((item) => item.requested > item.available);
}

const insufficientStockError = (items) => {
  const error = new Error('Der Lagerbestand reicht für mindestens einen Artikel nicht aus.');
  error.code = 'INSUFFICIENT_STOCK';
  error.items = items;
  return error;
};

async function bookInvoice(invoice, createdBy, { reverse = false, effectiveAt, session = null } = {}) {
  const Article = mongoose.model('Article');
  const StockMovement = mongoose.model('StockMovement');
  const isCredit = reverse || invoice.status === 'refunded';
  if (!isCredit) {
    const insufficient = await getInsufficientStock(invoice, { session });
    if (insufficient.length) throw insufficientStockError(insufficient);
  }

  const completed = [];
  try {
    for (const item of invoice.items || []) {
      if (!item.article) continue;
      const article = await Article.findById(item.article).populate('category').session(session).lean();
      if (!article || !tracksStock(article)) continue;
      const sourceLineId = String(item._id);
      const movement = {
        article: item.article,
        quantity: (isCredit ? 1 : -1) * Number(item.quantity),
        type: isCredit ? 'credit_note' : 'invoice',
        sourceModel: 'Invoice',
        sourceId: invoice._id,
        sourceLineId,
        effectiveAt: effectiveAt || (reverse ? new Date() : invoice.date || new Date()),
        createdBy,
      };
      let createdMovement;
      try {
        const existingMovement = await StockMovement.findOne({
          sourceModel: movement.sourceModel,
          sourceId: movement.sourceId,
          sourceLineId: movement.sourceLineId,
          type: movement.type,
        }).session(session).lean();
        if (existingMovement) continue;
        if (session) {
          [createdMovement] = await StockMovement.create([movement], { session });
        } else {
          createdMovement = await StockMovement.create(movement);
        }
        const updateResult = await Article.updateOne(
          {
            _id: item.article,
            removed: false,
            ...(!isCredit && { stock: { $gte: Number(item.quantity) } }),
          },
          { $inc: { stock: movement.quantity } },
          { session }
        );
        if (updateResult.matchedCount !== 1) {
          throw insufficientStockError([{
            articleId: article._id,
            number: article.number,
            name: article.name,
            available: Number(article.stock || 0),
            requested: Number(item.quantity),
          }]);
        }
        completed.push({ movementId: createdMovement._id, articleId: item.article, quantity: movement.quantity });
      } catch (error) {
        if (createdMovement && !session) await StockMovement.deleteOne({ _id: createdMovement._id });
        if (error.code !== 11000) throw error;
      }
    }
  } catch (error) {
    if (!session) await rollbackBooking(completed, { Article, StockMovement });
    throw error;
  }
  return completed;
}

async function rollbackBooking(completed, models = {}) {
  const Article = models.Article || mongoose.model('Article');
  const StockMovement = models.StockMovement || mongoose.model('StockMovement');

  for (const entry of [...completed].reverse()) {
    const deleted = await StockMovement.deleteOne({ _id: entry.movementId });
    if (deleted.deletedCount === 1) {
      await Article.updateOne(
        { _id: entry.articleId, removed: false },
        { $inc: { stock: -entry.quantity } }
      );
    }
  }
}

module.exports = { bookInvoice, getInsufficientStock, rollbackBooking };
