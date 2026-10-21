const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { runAtomic } = require('@/services/transactionService');

const Article = mongoose.model('Article');
const Setting = mongoose.model('Setting');
const StockMovement = mongoose.model('StockMovement');
const ArticleCategory = mongoose.model('ArticleCategory');

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

const categoryTracksStock = async (categoryId, session = null) => {
  if (!categoryId) return true;
  const category = await ArticleCategory.findById(categoryId._id || categoryId)
    .session(session)
    .lean();
  return category?.trackStock !== false && category?.name?.toLocaleLowerCase('de') !== 'dienstleistung';
};

const create = async (req, res) => {
  const article = await runAtomic(async (session) => {
    await Setting.updateOne(
      { settingKey: 'last_article_number' },
      { $setOnInsert: { settingValue: 999, settingCategory: 'inventory_settings', valueType: 'number', removed: false } },
      { upsert: true, session }
    );
    const counter = await Setting.findOneAndUpdate(
      { settingKey: 'last_article_number', removed: false },
      { $inc: { settingValue: 1 } },
      { new: true, session }
    );
    const prefix = await Setting.findOne({
      settingKey: 'article_number_prefix',
      removed: false,
    }).session(session);
    const trackStock = await categoryTracksStock(req.body.category, session);
    const stock = trackStock ? numeric(req.body.stock) : 0;
    const created = new Article({
      ...req.body,
      ...pricing(req.body),
      number: req.body.number || `${prefix?.settingValue || 'ART-'}${counter.settingValue}`,
      stock,
    });
    await created.save({ session });

    if (stock !== 0) {
      try {
        const movement = {
          article: created._id,
          quantity: stock,
          type: 'opening',
          effectiveAt: req.body.stockDate || new Date(),
          createdBy: req.admin._id,
        };
        if (session) await StockMovement.create([movement], { session });
        else await StockMovement.create(movement);
      } catch (error) {
        if (!session) await Article.deleteOne({ _id: created._id });
        throw error;
      }
    }
    return created;
  });

  return res.status(200).json({ success: true, result: article, message: 'Artikel wurde angelegt' });
};

const update = async (req, res) => {
  try {
    const article = await runAtomic(async (session) => {
      const previous = await Article.findOne({ _id: req.params.id, removed: false }).session(session);
      if (!previous) return null;
      const categoryId = req.body.category === undefined ? previous.category : req.body.category;
      const [previouslyTracked, trackStock] = await Promise.all([
        categoryTracksStock(previous.category, session),
        categoryTracksStock(categoryId, session),
      ]);
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

      let movement;
      if ((previouslyTracked || trackStock) && delta !== 0) {
        const movementData = {
          article: previous._id,
          quantity: delta,
          type: 'adjustment',
          note: req.body.stockNote || (trackStock
            ? 'Manuelle Bestandskorrektur'
            : 'Lagerführung für Artikel deaktiviert'),
          effectiveAt: req.body.stockDate || new Date(),
          createdBy: req.admin._id,
        };
        if (session) [movement] = await StockMovement.create([movementData], { session });
        else movement = await StockMovement.create(movementData);
      }

      let updated;
      try {
        updated = await Article.findOneAndUpdate(
          { _id: req.params.id, removed: false, stock: previous.stock },
          body,
          { new: true, runValidators: true, session }
        );
      } catch (error) {
        if (movement && !session) await StockMovement.deleteOne({ _id: movement._id });
        throw error;
      }
      if (!updated && movement && !session) {
        await StockMovement.deleteOne({ _id: movement._id });
      }
      return updated;
    });

    if (!article) {
      return res.status(409).json({
        success: false,
        result: null,
        message: 'Der Artikel wurde nicht gefunden oder der Lagerstand wurde zwischenzeitlich geändert. Bitte neu laden.',
      });
    }
    return res.status(200).json({ success: true, result: article, message: 'Artikel wurde aktualisiert' });
  } catch (error) {
    throw error;
  }
};

module.exports = { ...base, create, update };
