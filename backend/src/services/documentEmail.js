const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { Resend } = require('resend');
const pdf = require('@/controllers/pdfController');
const { loadSettings } = require('@/middlewares/settings');
const escapeHtml = require('@/helpers/escapeHtml');

const labels = {
  Invoice: 'Rechnung',
  Quote: 'Angebot',
  Payment: 'Zahlungsbestätigung',
  PurchaseOrder: 'Bestellung',
};

async function sendDocumentEmail({ modelName, id }) {
  if (!process.env.RESEND_API)
    return {
      status: 503,
      message: 'Der E-Mail-Versand ist noch nicht eingerichtet. Bitte RESEND_API konfigurieren.',
    };
  const Model = mongoose.model(modelName);
  const document = await Model.findOne({ _id: id, removed: false });
  if (!document) return { status: 404, message: `${labels[modelName]} nicht gefunden` };
  const recipient = modelName === 'PurchaseOrder' ? document.supplier : document.client;
  if (!recipient?.email)
    return {
      status: 400,
      message:
        modelName === 'PurchaseOrder'
          ? 'Beim Lieferanten ist keine E-Mail-Adresse hinterlegt'
          : 'Beim Kunden ist keine E-Mail-Adresse hinterlegt',
    };
  if (modelName === 'Invoice' && !document.issuedAt)
    return {
      status: 409,
      message: 'Die Rechnung muss vor dem Versand verbindlich ausgestellt werden',
    };
  const settings = await loadSettings();
  const from = process.env.RESEND_FROM || settings.company_email;
  if (!from) throw new Error('RESEND_FROM oder company_email ist nicht konfiguriert');
  const documentNumber = `${document.number}${document.year ? `/${document.year}` : ''}`;
  const filename = `${labels[modelName]}-${documentNumber.replace('/', '-')}.pdf`;
  const targetLocation = path.resolve(
    'src/public/download',
    modelName.toLowerCase(),
    `${modelName.toLowerCase()}-${document._id}.pdf`
  );
  await pdf.generatePdf(modelName, { filename, format: 'A4', targetLocation }, document);
  const title = `${labels[modelName]} ${documentNumber}`;
  const result = await new Resend(process.env.RESEND_API).emails.send({
    from,
    to: recipient.email,
    subject: `${title} von ${settings.company_name || 'WIEpilot'}`,
    html: `<p>Guten Tag ${escapeHtml(
      recipient.contactName || recipient.name || ''
    )},</p><p>anbei erhalten Sie ${
      modelName === 'Invoice'
        ? 'Ihre Rechnung'
        : modelName === 'Quote'
          ? 'unser Angebot'
          : modelName === 'PurchaseOrder'
            ? 'unsere Bestellung'
            : 'Ihre Zahlungsbestätigung'
    }.</p><p>Freundliche Grüße<br>${escapeHtml(settings.company_name || 'WIEpilot')}</p>`,
    attachments: [{ filename, content: fs.readFileSync(targetLocation) }],
  });
  if (result.error) throw new Error(result.error.message);
  if (modelName === 'Invoice')
    await Model.updateOne(
      { _id: document._id },
      { $set: { sentAt: new Date(), status: document.paymentStatus === 'paid' ? 'paid' : 'sent' } }
    );
  return { status: 200, document, emailId: result.data?.id };
}

async function sendReminderEmail({ invoice, level, dueDate, fee = 0, note = '' }) {
  if (!process.env.RESEND_API) throw new Error('RESEND_API ist nicht konfiguriert');
  if (!invoice?.client?.email)
    return { status: 400, message: 'Beim Kunden ist keine E-Mail-Adresse hinterlegt' };

  const settings = await loadSettings();
  const from = process.env.RESEND_FROM || settings.company_email;
  if (!from) throw new Error('RESEND_FROM oder company_email ist nicht konfiguriert');

  const filename = `Mahnung-${invoice.number}-${invoice.year || ''}.pdf`;
  const targetLocation = path.resolve(
    'src/public/download',
    'invoice',
    `reminder-${invoice._id}.pdf`
  );
  const reminderDocument = invoice.toObject ? invoice.toObject() : { ...invoice };
  reminderDocument.dunningFees = Number(reminderDocument.dunningFees || 0) + Number(fee || 0);
  await pdf.generatePdf(
    'Invoice',
    { filename, format: 'A4', targetLocation },
    reminderDocument
  );
  const date = new Intl.DateTimeFormat('de-AT').format(dueDate);
  const formattedFee = new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency: invoice.currency || 'EUR',
  }).format(fee);
  const result = await new Resend(process.env.RESEND_API).emails.send({
    from,
    to: invoice.client.email,
    subject: `${level}. Mahnung zu Rechnung ${invoice.number}/${invoice.year}`,
    html: `<p>Guten Tag ${escapeHtml(
      invoice.client.contactName || invoice.client.name || ''
    )},</p><p>die beigefügte Rechnung ist noch offen. Bitte begleichen Sie den ausstehenden Betrag bis ${date}.</p>${
      fee > 0 ? `<p>Mahngebühr: ${formattedFee}</p>` : ''
    }${note ? `<p>${escapeHtml(note)}</p>` : ''}<p>Freundliche Grüße<br>${escapeHtml(
      settings.company_name || 'WIEpilot'
    )}</p>`,
    attachments: [{ filename, content: fs.readFileSync(targetLocation) }],
  });
  if (result.error) throw new Error(result.error.message);
  return { status: 200, emailId: result.data?.id };
}

module.exports = { sendDocumentEmail, sendReminderEmail };
