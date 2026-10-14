const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const Article = mongoose.model('Article');
const Setting = mongoose.model('Setting');
const StockMovement = mongoose.model('StockMovement');

const base = createCRUDController('Article');
const numeric = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
const pricing = (body, previous = {}) => {
  const packageQuantity = Math.max(
    numeric(body.packageQuantity === undefined ? previous.packageQuantity || 1 : body.packageQuantity),
    0.01
  );
  const purchasePackPrice = numeric(
    body.purchasePackPrice === undefined
      ? body.purchasePrice !== undefined
        ? numeric(body.purchasePrice) * packageQuantity
        : previous.purchasePackPrice ?? numeric(previous.purchasePrice) * packageQuantity
      : body.purchasePackPrice
  );
  const salesPackPrice = numeric(
    body.salesPackPrice === undefined
      ? body.salesPrice !== undefined
        ? numeric(body.salesPrice) * packageQuantity
        : previous.salesPackPrice ?? numeric(previous.salesPrice) * packageQuantity
      : body.salesPackPrice
  );
  const purchasePrice = purchasePackPrice / packageQuantity;
  const salesPrice = salesPackPrice / packageQuantity;
  return {
    packageQuantity,
    purchasePackPrice,
    salesPackPrice,
    purchasePrice,
    salesPrice,
    margin: salesPrice > 0 ? ((salesPrice - purchasePrice) / salesPrice) * 100 : 0,
  };
};

const categoryTracksStock = async (categoryId) => {
  if (!categoryId) return true;
  const category = await mongoose.model('ArticleCategory').findById(categoryId).lean();
  return category?.trackStock !== false && category?.name?.toLocaleLowerCase('de') !== 'dienstleistung';
};

const create = async (req, res) => {
  await Setting.updateOne(
    { settingKey: 'last_article_number' },
    { $setOnInsert: { settingValue: 999, settingCategory: 'inventory_settings', valueType: 'number', removed: false } },
    { upsert: true }
  );
  const counter = await Setting.findOneAndUpdate(
    { settingKey: 'last_article_number', removed: false },
    { $inc: { settingValue: 1 } },
    { new: true }
  );
  const prefix = await Setting.findOne({ settingKey: 'article_number_prefix', removed: false });
  const trackStock = await categoryTracksStock(req.body.category);
  const stock = trackStock ? numeric(req.body.stock) : 0;
  const priceData = pricing(req.body);
  const article = await new Article({
    ...req.body,
    ...priceData,
    number: req.body.number || `${prefix?.settingValue || 'ART-'}${counter.settingValue}`,
    stock,
  }).save();
  if (stock !== 0) await StockMovement.create({ article: article._id, quantity: stock, type: 'opening', effectiveAt: req.body.stockDate || new Date(), createdBy: req.admin._id });
  return res.status(200).json({ success: true, result: article, message: 'Artikel wurde angelegt' });
};

const update = async (req, res) => {
  const previous = await Article.findOne({ _id: req.params.id, removed: false });
  if (!previous) return res.status(404).json({ success: false, result: null, message: 'Artikel nicht gefunden' });
  const categoryId = req.body.category === undefined ? previous.category : req.body.category;
  const trackStock = await categoryTracksStock(categoryId);
  const desiredStock = trackStock
    ? (req.body.stock === undefined ? previous.stock : numeric(req.body.stock))
    : 0;
  const delta = desiredStock - previous.stock;
  const body = {
    ...req.body,
    ...pricing(req.body, previous),
    stock: desiredStock,
    updated: new Date(),
  };
  const article = await Article.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
  if (trackStock && delta !== 0) await StockMovement.create({ article: article._id, quantity: delta, type: 'adjustment', note: req.body.stockNote || 'Manuelle Bestandskorrektur', effectiveAt: req.body.stockDate || new Date(), createdBy: req.admin._id });
  return res.status(200).json({ success: true, result: article, message: 'Artikel wurde aktualisiert' });
};

module.exports = { ...base, create, update };
