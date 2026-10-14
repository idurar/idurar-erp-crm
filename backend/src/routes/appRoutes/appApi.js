const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();

const appControllers = require('@/controllers/appControllers');
const { routesList } = require('@/models/utils');
const mongoose = require('mongoose');

router.get('/inventory/snapshot', catchErrors(async (req, res) => {
  const asOf = req.query.asOf ? new Date(`${req.query.asOf}T23:59:59.999Z`) : new Date();
  if (Number.isNaN(asOf.getTime())) return res.status(400).json({ success: false, message: 'Ungültiger Stichtag' });
  const StockMovement = mongoose.model('StockMovement');
  const Article = mongoose.model('Article');
  const [articles, totals] = await Promise.all([
    Article.find({ removed: false }).populate('category').lean(),
    StockMovement.aggregate([
      { $match: { removed: false, effectiveAt: { $lte: asOf } } },
      { $group: { _id: '$article', stock: { $sum: '$quantity' } } },
    ]),
  ]);
  const byArticle = new Map(totals.map((row) => [String(row._id), row.stock]));
  const result = articles.map((article) => {
    const trackStock = article.category?.trackStock !== false &&
      article.category?.name?.toLocaleLowerCase('de') !== 'dienstleistung';
    return {
      ...article,
      trackStock,
      stock: trackStock ? (byArticle.get(String(article._id)) || 0) : null,
    };
  });
  return res.status(200).json({ success: true, result, asOf });
}));

router.get('/inventory/settings', catchErrors(async (req, res) => {
  const Setting = mongoose.model('Setting');
  const settings = await Setting.find({ settingKey: { $in: ['article_number_prefix', 'last_article_number'] }, removed: false }).lean();
  const values = Object.fromEntries(settings.map((item) => [item.settingKey, item.settingValue]));
  return res.status(200).json({ success: true, result: { prefix: values.article_number_prefix || 'ART-', nextNumber: Number(values.last_article_number || 999) + 1 } });
}));

router.post('/inventory/settings', catchErrors(async (req, res) => {
  const Setting = mongoose.model('Setting');
  const prefix = String(req.body.prefix || 'ART-').trim();
  const nextNumber = Math.max(1, Number(req.body.nextNumber) || 1);
  await Promise.all([
    Setting.findOneAndUpdate({ settingKey: 'article_number_prefix' }, { settingValue: prefix, settingCategory: 'inventory_settings', valueType: 'string', removed: false }, { upsert: true }),
    Setting.findOneAndUpdate({ settingKey: 'last_article_number' }, { settingValue: nextNumber - 1, settingCategory: 'inventory_settings', valueType: 'number', removed: false }, { upsert: true }),
  ]);
  return res.status(200).json({ success: true, result: { prefix, nextNumber }, message: 'Nummernkreis gespeichert' });
}));

const routerApp = (entity, controller) => {
  router.route(`/${entity}/create`).post(catchErrors(controller['create']));
  router.route(`/${entity}/read/:id`).get(catchErrors(controller['read']));
  router.route(`/${entity}/update/:id`).patch(catchErrors(controller['update']));
  router.route(`/${entity}/delete/:id`).delete(catchErrors(controller['delete']));
  router.route(`/${entity}/search`).get(catchErrors(controller['search']));
  router.route(`/${entity}/list`).get(catchErrors(controller['list']));
  router.route(`/${entity}/listAll`).get(catchErrors(controller['listAll']));
  router.route(`/${entity}/filter`).get(catchErrors(controller['filter']));
  router.route(`/${entity}/summary`).get(catchErrors(controller['summary']));

  if (entity === 'invoice' || entity === 'quote' || entity === 'payment') {
    router.route(`/${entity}/mail`).post(catchErrors(controller['mail']));
  }

  if (entity === 'invoice') {
    router.route('/invoice/remind/:id').patch(catchErrors(controller['remind']));
  }

  if (entity === 'quote') {
    router.route(`/${entity}/convert/:id`).get(catchErrors(controller['convert']));
  }
};

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  routerApp(entity, controller);
});

module.exports = router;
