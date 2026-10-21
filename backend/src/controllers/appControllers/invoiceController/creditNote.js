const mongoose = require('mongoose');
const { increaseBySettingKey } = require('@/middlewares/settings');
const { bookInvoice } = require('@/services/inventoryService');
const { runAtomic } = require('@/services/transactionService');

const Invoice = mongoose.model('Invoice');

const requestError = (status, message, result = null) =>
  Object.assign(new Error(message), { status, result, expected: true });

const creditNote = async (req, res) => {
  const reason = String(req.body.reason || '').trim();
  if (reason.length < 3) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Bitte einen Gutschriftsgrund angeben.',
    });
  }

  try {
    const outcome = await runAtomic(async (session) => {
      const original = await Invoice.findOne({ _id: req.params.id, removed: false }).session(session);
      if (!original) throw requestError(404, 'Rechnung nicht gefunden');
      if (!original.issuedAt || original.documentType === 'credit_note') {
        throw requestError(409, 'Nur ausgestellte Rechnungen können gutgeschrieben werden.', original);
      }

      let result = await Invoice.findOne({
        originalInvoice: original._id,
        documentType: 'credit_note',
        removed: false,
      }).session(session);

      if (result && original.status === 'refunded') {
        if (!result.pdf) {
          result.pdf = `invoice-${result._id}.pdf`;
          await result.save({ session });
        }
        return { result, existing: true };
      }
      if (['refunded', 'cancelled'].includes(original.status)) {
        throw requestError(409, 'Die Rechnung wurde bereits korrigiert.', original);
      }
      if (Number(original.credit) > 0) {
        throw requestError(
          409,
          'Vor der Gutschrift müssen erfasste Zahlungen storniert werden.',
          original
        );
      }

      const now = new Date();
      if (!result) {
        const numberSetting = await increaseBySettingKey({
          settingKey: 'last_invoice_number',
          session,
        });
        if (!numberSetting) throw requestError(500, 'Rechnungsnummernkreis ist nicht konfiguriert');
        [result] = await Invoice.create([{
          ...original.toObject(),
          _id: undefined,
          documentType: 'credit_note',
          originalInvoice: original._id,
          creditReason: reason,
          number: Number(numberSetting.settingValue),
          year: now.getFullYear(),
          date: now,
          expiredDate: now,
          items: original.items.map((item) => ({
            ...item.toObject(),
            _id: undefined,
            price: -Math.abs(item.price),
            total: -Math.abs(item.total),
          })),
          subTotal: -Math.abs(original.subTotal),
          taxTotal: -Math.abs(original.taxTotal),
          total: -Math.abs(original.total),
          discount: 0,
          credit: 0,
          payment: [],
          paymentStatus: 'paid',
          status: 'issued',
          issuedAt: now,
          sentAt: undefined,
          inventoryBookedAt: undefined,
          inventoryReversedAt: undefined,
          issuingAt: undefined,
          recurring: 'none',
          recurringActive: false,
          nextRecurringDate: undefined,
          recurringAnchorDate: undefined,
          recurringEndDate: undefined,
          recurringSource: undefined,
          recurringOccurrenceDate: undefined,
          recurringProcessingAt: undefined,
          recurringFailedAt: undefined,
          recurringLastError: undefined,
          cancellation: undefined,
          reminderHistory: [],
          reminderLevel: 0,
          dunningFees: 0,
          createdBy: req.admin._id,
          created: now,
          updated: now,
          pdf: `invoice-${original._id}.pdf`,
        }], { session });
        result.pdf = `invoice-${result._id}.pdf`;
        await result.save({ session });
      }

      if (original.inventoryBookedAt && !original.inventoryReversedAt) {
        await bookInvoice(original, req.admin._id, {
          reverse: true,
          effectiveAt: now,
          session,
        });
        original.inventoryReversedAt = now;
      }
      original.status = 'refunded';
      original.recurringActive = false;
      original.updated = now;
      await original.save({ session });
      return { result, existing: false };
    });

    return res.status(200).json({
      success: true,
      result: outcome.result,
      message: outcome.existing ? 'Gutschrift wurde bereits erstellt.' : 'Gutschrift wurde erstellt.',
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        result: null,
        message: 'Die Gutschrift wurde parallel erstellt. Bitte laden Sie die Ansicht neu.',
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

module.exports = creditNote;
