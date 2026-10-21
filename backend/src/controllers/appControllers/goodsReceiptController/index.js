const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { calculateMovingAverage, roundPrice } = require('@/services/inventoryValuation');

const controller = createCRUDController('GoodsReceipt');

controller.create = async (req, res) => {
  const GoodsReceipt = mongoose.model('GoodsReceipt');
  const PurchaseOrder = mongoose.model('PurchaseOrder');
  const StockMovement = mongoose.model('StockMovement');
  const Article = mongoose.model('Article');

  const order = await PurchaseOrder.findOne({ _id: req.body.purchaseOrder, removed: false });
  if (!order) return res.status(404).json({ success: false, result: null, message: 'Bestellung wurde nicht gefunden.' });
  if (['cancelled', 'received'].includes(order.status))
    return res.status(409).json({ success: false, result: order, message: 'Wareneingänge sind nur für versendete Bestellungen möglich.' });

  const previous = await GoodsReceipt.find({ purchaseOrder: order._id, removed: false }).lean();
  const receivedByLine = new Map();
  for (const receipt of previous)
    for (const item of receipt.items || [])
      receivedByLine.set(item.purchaseOrderLineId, (receivedByLine.get(item.purchaseOrderLineId) || 0) + Number(item.quantity));

  const requestedItems = Array.isArray(req.body.items) ? req.body.items : [];
  const items = [];
  for (const requested of requestedItems) {
    const line = order.items.id(requested.purchaseOrderLineId);
    const quantity = Number(requested.quantity);
    if (!line || !line.article || !Number.isFinite(quantity) || quantity <= 0)
      return res.status(400).json({ success: false, result: null, message: 'Eine Lieferposition ist ungültig oder besitzt keinen Lagerartikel.' });
    const alreadyReceived = receivedByLine.get(String(line._id)) || 0;
    if (alreadyReceived + quantity > Number(line.quantity) + 1e-9)
      return res.status(409).json({ success: false, result: null, message: `Die Liefermenge für „${line.description}“ überschreitet die offene Bestellmenge.` });
    items.push({
      purchaseOrderLineId: String(line._id),
      article: line.article,
      project: line.project?._id || line.project || order.project?._id || order.project,
      description: line.description,
      quantity,
      unit: line.unit,
      unitPrice: Number(line.unitPrice) || 0,
    });
  }
  if (!items.length)
    return res.status(400).json({ success: false, result: null, message: 'Mindestens eine positive Liefermenge ist erforderlich.' });

  const receipt = await GoodsReceipt.create({
    number: req.body.number,
    purchaseOrder: order._id,
    supplier: order.supplier?._id || order.supplier,
    project: order.project?._id || order.project,
    commission: order.commission,
    receivedAt: req.body.receivedAt || new Date(),
    deliveryNoteNumber: req.body.deliveryNoteNumber,
    notes: req.body.notes,
    items,
    createdBy: req.admin._id,
  });

  const booked = [];
  try {
    for (const item of receipt.items) {
      const article = await Article.findOne({ _id: item.article, removed: false });
      if (!article) throw new Error('Der Lagerartikel der Lieferposition wurde nicht gefunden.');
      const previousArticle = {
        stock: Number(article.stock) || 0,
        purchasePrice: Number(article.purchasePrice) || 0,
        purchasePackPrice: Number(article.purchasePackPrice) || 0,
        margin: Number(article.margin) || 0,
      };
      const unitCost = Number(item.unitPrice) || 0;
      const resultingUnitCost = calculateMovingAverage({
        currentStock: previousArticle.stock,
        currentUnitCost: previousArticle.purchasePrice,
        receivedQuantity: item.quantity,
        receivedUnitCost: unitCost,
      });
      const movement = await StockMovement.create({
        article: item.article,
        project: item.project,
        commission: receipt.commission,
        quantity: item.quantity,
        unitCost,
        totalValue: roundPrice(Number(item.quantity) * unitCost),
        resultingUnitCost,
        type: 'purchase_receipt',
        sourceModel: 'GoodsReceipt',
        sourceId: receipt._id,
        sourceLineId: String(item._id),
        note: receipt.deliveryNoteNumber,
        effectiveAt: receipt.receivedAt,
        createdBy: req.admin._id,
      });
      const nextStock = previousArticle.stock + Number(item.quantity);
      const nextPurchasePackPrice = roundPrice(resultingUnitCost * (Number(article.packageQuantity) || 1));
      const nextMargin = Number(article.salesPrice) > 0
        ? ((Number(article.salesPrice) - resultingUnitCost) / Number(article.salesPrice)) * 100
        : 0;
      const articleUpdate = await Article.updateOne(
        {
          _id: item.article,
          removed: false,
          stock: article.stock,
          purchasePrice: article.purchasePrice,
        },
        {
          $set: {
            stock: nextStock,
            purchasePrice: resultingUnitCost,
            purchasePackPrice: nextPurchasePackPrice,
            margin: nextMargin,
            updated: new Date(),
          },
        },
        { runValidators: true }
      );
      if (articleUpdate.matchedCount !== 1) {
        await StockMovement.deleteOne({ _id: movement._id });
        throw new Error('Der Lagerbestand wurde zwischenzeitlich geändert. Bitte laden Sie den Wareneingang neu.');
      }
      booked.push({ movement: movement._id, article: item.article, previousArticle });
    }
  } catch (error) {
    for (const entry of booked.reverse()) {
      await Article.updateOne({ _id: entry.article }, { $set: entry.previousArticle });
      await StockMovement.deleteOne({ _id: entry.movement });
    }
    await GoodsReceipt.deleteOne({ _id: receipt._id });
    throw error;
  }

  for (const item of items)
    receivedByLine.set(item.purchaseOrderLineId, (receivedByLine.get(item.purchaseOrderLineId) || 0) + item.quantity);
  const fullyReceived = order.items
    .filter((item) => item.article)
    .every((item) => (receivedByLine.get(String(item._id)) || 0) >= Number(item.quantity));
  order.status = fullyReceived ? 'received' : 'partially_received';
  await order.save();

  return res.status(201).json({ success: true, result: receipt, message: 'Wareneingang wurde gebucht.' });
};

controller.update = async (_req, res) => res.status(405).json({
  success: false,
  result: null,
  message: 'Gebuchte Wareneingänge sind unveränderlich. Erfassen Sie eine Korrekturbuchung.',
});
controller.delete = controller.update;

module.exports = controller;
