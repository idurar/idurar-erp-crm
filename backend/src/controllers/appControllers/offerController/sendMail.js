const fs = require('fs');
const custom = require('@/controllers/pdfController');
const { SendOffer } = require('@/emailTemplate/SendEmailTemplate');
const mongoose = require('mongoose');
const OfferModel = mongoose.model('Offer');
const { Resend } = require('resend');
const { loadSettings } = require('@/middlewares/settings');

const mail = async (req, res) => {
  const { id } = req.body;

  // Throw error if no id
  if (!id) {
    throw { name: 'ValidationError' };
  }

  const result = await OfferModel.findOne({ _id: id, removed: false }).exec();

  // Throw error if no result
  if (!result) {
    throw { name: 'ValidationError' };
  }

  // Continue process if result is returned
  const { lead } = result;
  const { name } = lead;
  const email = lead[lead.type].email;

  const modelName = 'Offer';

  const fileId = modelName.toLowerCase() + '-' + result._id + '.pdf';
  const folderPath = modelName.toLowerCase();
  const targetLocation = `src/public/download/${folderPath}/${fileId}`;

  await custom.generatePdf(
    modelName,
    { filename: folderPath, format: 'A4', targetLocation },
    result,
    async () => {
      const { id: mailId } = await sendViaApi(email, name, targetLocation);

      if (mailId) {
        OfferModel.findByIdAndUpdate({ _id: id, removed: false }, { status: 'sent' })
          .exec()
          .then((data) => {
            // Returning successfull response
            return res.status(200).json({
              success: true,
              result: mailId,
              message: `Successfully sent offer ${id} to ${email}`,
            });
          });
      }
    }
  );
};

const sendViaApi = async (email, name, filePath) => {
  const resend = new Resend(process.env.RESEND_API);

  const settings = await loadSettings();
  const idurar_app_email = settings['idurar_app_email'];
  // Read the file to be attatched
  const attatchedFile = fs.readFileSync(filePath);

  // Send the mail using the send method
  const { data } = await resend.emails.send({
    from: idurar_app_email,
    to: email,
    subject: 'Offer From Idurar',
    attachments: [
      {
        filename: 'Offer.pdf',
        content: attatchedFile,
      },
    ],
    html: SendOffer({ name }),
  });

  return data;
};

module.exports = mail;
