const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();

const appControllers = require('@/controllers/appControllers');
const { routesList } = require('@/models/utils');
const mongoose = require('mongoose');

router.get(
  '/inventory/snapshot',
  catchErrors(async (req, res) => {
    const asOf = req.query.asOf ? new Date(`${req.query.asOf}T23:59:59.999Z`) : new Date();
    if (Number.isNaN(asOf.getTime()))
      return res.status(400).json({ success: false, message: 'Ungültiger Stichtag' });
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
      const trackStock =
        article.category?.trackStock !== false &&
        article.category?.name?.toLocaleLowerCase('de') !== 'dienstleistung';
      return {
        ...article,
        trackStock,
        stock: trackStock ? byArticle.get(String(article._id)) || 0 : null,
      };
    });
    return res.status(200).json({ success: true, result, asOf });
  })
);

router.get(
  '/inventory/settings',
  catchErrors(async (req, res) => {
    const Setting = mongoose.model('Setting');
    const settings = await Setting.find({
      settingKey: { $in: ['article_number_prefix', 'last_article_number'] },
      removed: false,
    }).lean();
    const values = Object.fromEntries(settings.map((item) => [item.settingKey, item.settingValue]));
    return res
      .status(200)
      .json({
        success: true,
        result: {
          prefix: values.article_number_prefix || 'ART-',
          nextNumber: Number(values.last_article_number || 999) + 1,
        },
      });
  })
);

router.post(
  '/inventory/settings',
  catchErrors(async (req, res) => {
    const Setting = mongoose.model('Setting');
    const prefix = String(req.body.prefix || '').trim();
    const nextNumber = Number(req.body.nextNumber);
    if (!/^[A-Za-z0-9._/-]{1,20}$/.test(prefix)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Das Präfix muss 1 bis 20 Zeichen lang sein und darf nur Buchstaben, Zahlen, Punkt, Bindestrich, Unterstrich oder Schrägstrich enthalten.',
      });
    }
    if (!Number.isSafeInteger(nextNumber) || nextNumber < 1) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Die nächste Artikelnummer muss eine positive ganze Zahl sein.',
      });
    }
    await Promise.all([
      Setting.findOneAndUpdate(
        { settingKey: 'article_number_prefix' },
        {
          settingValue: prefix,
          settingCategory: 'inventory_settings',
          valueType: 'string',
          removed: false,
        },
        { upsert: true }
      ),
      Setting.findOneAndUpdate(
        { settingKey: 'last_article_number' },
        {
          settingValue: nextNumber - 1,
          settingCategory: 'inventory_settings',
          valueType: 'number',
          removed: false,
        },
        { upsert: true }
      ),
    ]);
    return res
      .status(200)
      .json({ success: true, result: { prefix, nextNumber }, message: 'Nummernkreis gespeichert' });
  })
);

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

  if (entity === 'invoice' || entity === 'quote' || entity === 'payment' || entity === 'purchaseorder') {
    router.route(`/${entity}/mail`).post(catchErrors(controller['mail']));
  }

  if (entity === 'invoice') {
    router.route('/invoice/remind/:id').patch(catchErrors(controller['remind']));
    router.route('/invoice/cancel/:id').patch(catchErrors(controller['cancel']));
    router.route('/invoice/issue/:id').patch(catchErrors(controller['issue']));
    router.route('/invoice/credit-note/:id').post(catchErrors(controller['creditNote']));
    router.route('/invoice/recurrence/:id').patch(catchErrors(controller['recurrence']));
  }

  if (entity === 'quote') {
    router.route(`/${entity}/convert/:id`).get(catchErrors(controller['convert']));
  }

  if (entity === 'purchaseorder') {
    router.route('/purchaseorder/receivable/:id').get(catchErrors(controller['receivable']));
    router.route('/purchaseorder/missing-delivery/:id').post(catchErrors(controller['mailMissingDelivery']));
  }

  if (entity === 'timeentry') {
    router.route('/timeentry/summary-control').get(catchErrors(controller['summaryControl']));
    router.route('/timeentry/backup/:employeeId').get(catchErrors(controller['backupEmployee']));
    router.route('/timeentry/reset/:employeeId').post(catchErrors(controller['resetEmployee']));
  }

  if (entity === 'orderconfirmation') {
    router.route('/orderconfirmation/from-quote/:id').post(catchErrors(controller['fromQuote']));
  }
};

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  routerApp(entity, controller);
});

module.exports = router;
