const roundPrice = (value) => Math.round((Number(value) + Number.EPSILON) * 1_000_000) / 1_000_000;

const calculateMovingAverage = ({ currentStock, currentUnitCost, receivedQuantity, receivedUnitCost }) => {
  const stock = Number(currentStock) || 0;
  const oldCost = Math.max(0, Number(currentUnitCost) || 0);
  const quantity = Number(receivedQuantity);
  const newCost = Number(receivedUnitCost);

  if (!Number.isFinite(quantity) || quantity <= 0) throw new Error('Die Zugangsmenge muss positiv sein.');
  if (!Number.isFinite(newCost) || newCost < 0) throw new Error('Der Einkaufspreis darf nicht negativ sein.');

  // Ein nicht erfasster Preis (0) soll eine vorhandene Bewertung nicht versehentlich entwerten.
  if (newCost === 0 && stock > 0) return roundPrice(oldCost);
  if (stock <= 0) return roundPrice(newCost);

  return roundPrice(((stock * oldCost) + (quantity * newCost)) / (stock + quantity));
};

module.exports = { calculateMovingAverage, roundPrice };
