const mongoose = require('mongoose');

const Invoice = mongoose.model('Invoice');
const { bookInvoice } = require('@/services/inventoryService');
const { runAtomic } = require('@/services/transactionService');

const requestError = (status, message, result = null) =>
  Object.assign(new Error(message), { status, result, expected: true });

const cancel = async (req, res) => {
  const reason = String(req.body.reason || '').trim();
  if (reason.length < 3) {
    return res
      .status(400)
      .json({ success: false, result: null, message: 'Bitte einen Stornogrund angeben.' });
  }

  try {
    const invoice = await runAtomic(async (session) => {
      const current = await Invoice.findOne({ _id: req.params.id, removed: false }).session(session);
      if (!current) throw requestError(404, 'Rechnung nicht gefunden');
      if (!current.issuedAt) {
        throw requestError(409, 'Entwürfe werden gelöscht und nicht storniert.', current);
      }
      if (current.status === 'cancelled') {
        throw requestError(409, 'Rechnung ist bereits storniert', current);
      }
      if (current.credit > 0) {
        throw requestError(
          409,
          'Rechnungen mit Zahlungen müssen zuerst vollständig rückerstattet werden.',
          current
        );
      }

      const now = new Date();
      if (current.inventoryBookedAt && !current.inventoryReversedAt) {
        await bookInvoice(current, req.admin._id, { reverse: true, effectiveAt: now, session });
        current.inventoryReversedAt = now;
      }
      current.status = 'cancelled';
      current.recurringActive = false;
      current.cancellation = { cancelledAt: now, reason, cancelledBy: req.admin._id };
      current.updated = now;
      await current.save({ session });
      return current;
    });

    return res
      .status(200)
      .json({ success: true, result: invoice, message: 'Rechnung wurde storniert' });
  } catch (error) {
    if (error?.expected) {
      return res.status(error.status).json({
        success: false,
        result: error.result,
        message: error.message,
      });
    }
    throw error;
  }
};

module.exports = cancel;
