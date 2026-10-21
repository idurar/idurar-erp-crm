const buildDeliverySummary = (order, receipts = []) => {
  const receivedByLine = new Map();
  for (const receipt of receipts) {
    for (const item of receipt.items || []) {
      receivedByLine.set(
        item.purchaseOrderLineId,
        (receivedByLine.get(item.purchaseOrderLineId) || 0) + Number(item.quantity || 0)
      );
    }
  }

  const lines = (order.items || []).map((item) => {
    const ordered = Number(item.quantity || 0);
    const received = receivedByLine.get(String(item._id)) || 0;
    return {
      purchaseOrderLineId: String(item._id),
      description: item.article?.name || item.description,
      articleNumber: item.article?.number || '',
      unit: item.unit || 'Stk.',
      ordered,
      received,
      open: Math.max(0, ordered - received),
    };
  });

  return {
    lines,
    ordered: lines.reduce((sum, item) => sum + item.ordered, 0),
    received: lines.reduce((sum, item) => sum + item.received, 0),
    open: lines.reduce((sum, item) => sum + item.open, 0),
  };
};

module.exports = { buildDeliverySummary };
