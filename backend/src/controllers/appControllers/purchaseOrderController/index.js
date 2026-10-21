const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { buildDeliverySummary } = require('@/services/purchaseOrderDelivery');

const controller = createCRUDController('PurchaseOrder');

const applyDefaultUnitPrices = async (items = []) => {
  const Article = mongoose.model('Article');
  const articleIds = items
    .filter((item) => item.article && (item.unitPrice === undefined || item.unitPrice === null || item.unitPrice === ''))
    .map((item) => item.article?._id || item.article);
  if (!articleIds.length) return items;

  const articles = await Article.find({ _id: { $in: articleIds }, removed: false })
    .select('_id purchasePrice')
    .lean();
  const prices = new Map(articles.map((article) => [String(article._id), Number(article.purchasePrice) || 0]));
  return items.map((item) => {
    if (item.unitPrice !== undefined && item.unitPrice !== null && item.unitPrice !== '') return item;
    return { ...item, unitPrice: prices.get(String(item.article?._id || item.article)) || 0 };
  });
};

controller.create = async (req, res) => {
  const PurchaseOrder = mongoose.model('PurchaseOrder');
  const items = await applyDefaultUnitPrices(req.body.items);
  const document = await new PurchaseOrder({
    ...req.body,
    items,
    removed: false,
    createdBy: req.admin._id,
  }).save();
  return res.status(200).json({ success: true, result: document, message: 'Bestellung wurde angelegt.' });
};
controller.list = async (req, res) => {
  const PurchaseOrder = mongoose.model('PurchaseOrder');
  const GoodsReceipt = mongoose.model('GoodsReceipt');
  const { escapeRegex, isSafeField } = require('@/helpers/search');
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Number.parseInt(req.query.items, 10) || 10);
  const fields = String(req.query.fields || '').split(',').filter(isSafeField);
  const search = fields.length
    ? { $or: fields.map((field) => ({ [field]: { $regex: new RegExp(escapeRegex(req.query.q || ''), 'i') } })) }
    : {};
  const sortBy = isSafeField(req.query.sortBy) ? req.query.sortBy : 'created';
  const sortValue = Number(req.query.sortValue) === 1 ? 1 : -1;
  const query = { removed: false, ...search };

  const [orders, count] = await Promise.all([
    PurchaseOrder.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sortBy]: sortValue })
      .populate()
      .exec(),
    PurchaseOrder.countDocuments(query),
  ]);
  const orderIds = orders.map((order) => order._id);
  const receipts = orderIds.length
    ? await GoodsReceipt.find({ purchaseOrder: { $in: orderIds }, removed: false }).lean()
    : [];
  const receiptsByOrder = new Map();
  for (const receipt of receipts) {
    const key = String(receipt.purchaseOrder?._id || receipt.purchaseOrder);
    if (!receiptsByOrder.has(key)) receiptsByOrder.set(key, []);
    receiptsByOrder.get(key).push(receipt);
  }
  const result = orders.map((order) => {
    const plainOrder = order.toObject();
    return {
      ...plainOrder,
      deliverySummary: buildDeliverySummary(plainOrder, receiptsByOrder.get(String(order._id)) || []),
    };
  });

  return res.status(count > 0 ? 200 : 203).json({
    success: true,
    result,
    pagination: { page, pages: Math.ceil(count / limit), count },
    message: count > 0 ? 'Successfully found all documents' : 'Collection is Empty',
  });
};
controller.receivable = async (req, res) => {
  const PurchaseOrder = mongoose.model('PurchaseOrder');
  const GoodsReceipt = mongoose.model('GoodsReceipt');
  const order = await PurchaseOrder.findOne({ _id: req.params.id, removed: false })
    .populate('items.article')
    .lean();
  if (!order) return res.status(404).json({ success: false, result: null, message: 'Bestellung wurde nicht gefunden.' });
  if (!['draft', 'ordered', 'partially_received'].includes(order.status)) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Bitte markieren Sie die Bestellung zuerst als bestellt.',
    });
  }
  const receipts = await GoodsReceipt.find({ purchaseOrder: order._id, removed: false }).lean();
  const received = new Map();
  for (const receipt of receipts)
    for (const item of receipt.items || [])
      received.set(item.purchaseOrderLineId, (received.get(item.purchaseOrderLineId) || 0) + Number(item.quantity));
  const items = order.items.filter((item) => item.article).map((item) => ({
    purchaseOrderLineId: String(item._id),
    article: item.article,
    project: item.project || order.project,
    description: item.description,
    articleName: item.article?.name || item.description,
    articleNumber: item.article?.number || '',
    unit: item.unit,
    ordered: item.quantity,
    received: received.get(String(item._id)) || 0,
    remaining: Math.max(0, Number(item.quantity) - (received.get(String(item._id)) || 0)),
  }));
  return res.status(200).json({ success: true, result: { ...order, items } });
};
controller.search = async (req, res) => {
  const PurchaseOrder = mongoose.model('PurchaseOrder');
  const { escapeRegex, isSafeField } = require('@/helpers/search');
  const fields = String(req.query.fields || 'number')
    .split(',')
    .filter(isSafeField);
  const queryText = escapeRegex(req.query.q || '');
  const filter = {
    removed: false,
    $or: fields.map((field) => ({ [field]: { $regex: new RegExp(queryText, 'i') } })),
  };
  if (req.query.receivable === 'true') {
    filter.status = { $in: ['draft', 'ordered', 'partially_received'] };
  }
  const result = await PurchaseOrder.find(filter).limit(20).exec();
  return res.status(200).json({
    success: true,
    result,
    message: result.length ? 'Bestellungen gefunden.' : 'Keine offenen Bestellungen gefunden.',
  });
};
controller.update = async (req, res) => {
  const PurchaseOrder = mongoose.model('PurchaseOrder');
  const GoodsReceipt = mongoose.model('GoodsReceipt');
  const document = await PurchaseOrder.findOne({ _id: req.params.id, removed: false });
  if (!document) return res.status(404).json({ success: false, result: null, message: 'Bestellung wurde nicht gefunden.' });
  const changes = { ...req.body };
  delete changes.createdBy;
  delete changes.removed;
  if (Array.isArray(changes.items)) {
    const hasReceipt = await GoodsReceipt.exists({ purchaseOrder: document._id, removed: false });
    if (hasReceipt) {
      const priceChanged = changes.items.some((item, index) => {
        const previous = document.items[index];
        return !previous || Number(item.unitPrice || 0) !== Number(previous.unitPrice || 0);
      });
      if (priceChanged) {
        return res.status(409).json({
          success: false,
          result: document,
          message: 'Der Einkaufspreis kann nach dem ersten Wareneingang nicht mehr geändert werden.',
        });
      }
    }
    changes.items = await applyDefaultUnitPrices(changes.items);
  }
  document.set(changes);
  await document.save();
  return res.status(200).json({ success: true, result: document, message: 'Bestellung wurde aktualisiert.' });
};
controller.mail = async (req, res) => {
  const { sendDocumentEmail } = require('@/services/documentEmail');
  const result = await sendDocumentEmail({ modelName: 'PurchaseOrder', id: req.body.id });
  return res.status(result.status).json({
    success: result.status === 200,
    result: result.document || null,
    message: result.status === 200 ? 'Bestellung wurde per E-Mail versendet.' : result.message,
  });
};
controller.mailMissingDelivery = async (req, res) => {
  const { Resend } = require('resend');
  const { loadSettings } = require('@/middlewares/settings');
  const escapeHtml = require('@/helpers/escapeHtml');
  const PurchaseOrder = mongoose.model('PurchaseOrder');
  const GoodsReceipt = mongoose.model('GoodsReceipt');

  if (!process.env.RESEND_API) {
    return res.status(503).json({
      success: false,
      result: null,
      message: 'Der E-Mail-Versand ist noch nicht eingerichtet. Bitte RESEND_API konfigurieren.',
    });
  }
  const order = await PurchaseOrder.findOne({ _id: req.params.id, removed: false })
    .populate('items.article');
  if (!order) {
    return res.status(404).json({ success: false, result: null, message: 'Bestellung wurde nicht gefunden.' });
  }
  if (!order.supplier?.email) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Beim Lieferanten ist keine E-Mail-Adresse hinterlegt.',
    });
  }

  const receipts = await GoodsReceipt.find({ purchaseOrder: order._id, removed: false }).lean();
  const received = new Map();
  for (const receipt of receipts) {
    for (const item of receipt.items || []) {
      received.set(
        item.purchaseOrderLineId,
        (received.get(item.purchaseOrderLineId) || 0) + Number(item.quantity)
      );
    }
  }
  const missing = order.items
    .map((item) => ({
      number: item.article?.number || '',
      name: item.article?.name || item.description,
      quantity: Math.max(0, Number(item.quantity) - (received.get(String(item._id)) || 0)),
      unit: item.unit || 'Stk.',
    }))
    .filter((item) => item.quantity > 0);
  if (!missing.length) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Für diese Bestellung sind keine offenen Liefermengen vorhanden.',
    });
  }

  const settings = await loadSettings();
  const from = process.env.RESEND_FROM || settings.company_email;
  if (!from) throw new Error('RESEND_FROM oder company_email ist nicht konfiguriert');
  const rows = missing
    .map((item) => `<li>${escapeHtml([item.number, item.name].filter(Boolean).join(' – '))}: ${item.quantity} ${escapeHtml(item.unit)}</li>`)
    .join('');
  const result = await new Resend(process.env.RESEND_API).emails.send({
    from,
    to: order.supplier.email,
    subject: `Fehlende Lieferung zu Bestellung ${order.number}`,
    html: `<p>Guten Tag ${escapeHtml(order.supplier.contactName || order.supplier.name || '')},</p><p>zu unserer Bestellung ${escapeHtml(order.number)} sind folgende Positionen noch offen:</p><ul>${rows}</ul><p>Bitte teilen Sie uns den voraussichtlichen Liefertermin mit.</p><p>Freundliche Grüße<br>${escapeHtml(settings.company_name || 'WIEpilot')}</p>`,
  });
  if (result.error) throw new Error(result.error.message);
  return res.status(200).json({
    success: true,
    result: { missing, emailId: result.data?.id },
    message: 'E-Mail zu den fehlenden Lieferpositionen wurde versendet.',
  });
};
module.exports = controller;
module.exports.applyDefaultUnitPrices = applyDefaultUnitPrices;
