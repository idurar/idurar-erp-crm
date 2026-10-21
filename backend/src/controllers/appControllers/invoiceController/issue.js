const mongoose = require('mongoose');
const { bookInvoice } = require('@/services/inventoryService');
const { runAtomic } = require('@/services/transactionService');
const { increaseBySettingKey } = require('@/middlewares/settings');

const Invoice = mongoose.model('Invoice');

const requestError = (status, message, result = null) =>
  Object.assign(new Error(message), { status, result, expected: true });

const issue = async (req, res) => {
  try {
    const outcome = await runAtomic(async (session) => {
      let current = await Invoice.findOne({ _id: req.params.id, removed: false }).session(session);
      if (!current) throw requestError(404, 'Rechnung nicht gefunden');
      if (['cancelled', 'refunded'].includes(current.status)) {
        throw requestError(
          409,
          'Stornierte oder gutgeschriebene Rechnungen können nicht ausgestellt werden.',
          current
        );
      }

      if (current.issuedAt) {
        if (current.paymentStatus === 'paid' && current.status !== 'paid') {
          current.status = 'paid';
          current.updated = new Date();
          await current.save({ session });
        }
        return { invoice: current, alreadyIssued: true };
      }

      const now = new Date();
      current = await Invoice.findOneAndUpdate(
        { _id: current._id, removed: false, issuedAt: null },
        { $set: { issuingAt: now } },
        { new: true, session }
      );
      if (!current) {
        throw requestError(409, 'Die Rechnung wird gerade veröffentlicht. Bitte kurz erneut versuchen.');
      }

      if (!current.number) {
        const numberSetting = await increaseBySettingKey({
          settingKey: 'last_invoice_number',
          session,
        });
        if (!numberSetting) throw requestError(500, 'Rechnungsnummernkreis ist nicht konfiguriert.');
        current.number = Number(numberSetting.settingValue);
        current.year = new Date(current.date).getFullYear();
      }

      await bookInvoice(current, req.admin._id, { session });
      current.issuedAt = now;
      current.inventoryBookedAt = now;
      current.status = current.paymentStatus === 'paid' ? 'paid' : 'issued';
      current.issuingAt = undefined;
      current.updated = now;
      await current.save({ session });
      return { invoice: current, alreadyIssued: false };
    });

    return res.status(200).json({
      success: true,
      result: outcome.invoice,
      message: outcome.alreadyIssued
        ? 'Rechnung wurde bereits verbindlich ausgestellt'
        : 'Rechnung wurde verbindlich ausgestellt',
    });
  } catch (error) {
    if (error?.code === 'INSUFFICIENT_STOCK') {
      return res.status(409).json({
        success: false,
        result: { insufficientStock: error.items },
        message: 'Die Rechnung kann nicht veröffentlicht werden, weil der Lagerbestand nicht ausreicht.',
      });
    }
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        result: null,
        message: 'Die vergebene Rechnungsnummer war bereits belegt. Bitte erneut veröffentlichen.',
      });
    }
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

module.exports = issue;
