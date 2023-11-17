const fs = require('fs');
const path = require('path');
const custom = require('@/controllers/middlewaresControllers/pdfController');
const { SendQuote } = require('@/emailTemplate/SendInvoice');
const mongoose = require('mongoose');
const QuoteModel = mongoose.model('Quote');
const ClientModel = mongoose.model('Client');
const ObjectId = mongoose.Types.ObjectId;
const { Resend } = require('resend');

module.exports = sendMail = async (req, res) => {
  const { id } = req.body;

  // Throw error if no id
  if (!id) {
    throw { name: 'ValidationError' };
  }

  try {
    const result = await QuoteModel.findById(ObjectId(id)).exec();

    // Throw error if no result
    if (!result) {
      throw { name: 'ValidationError' };
    }

    // Continue process if result is returned
    const { client } = result;
    const { email, managerName } = await ClientModel.findById(client).exec();

    await custom
      .generatePdf('Quote', { filename: 'invoice', format: 'A4' }, result, async (fileLocation) => {
        // Send the mail using the details gotten from the client
        const { id: mailId } = await sendViaApi(email, managerName, fileLocation);

        // Update the status to sent if mail was successfull
        if (mailId) {
          QuoteModel.findByIdAndUpdate(id, { status: 'sent' })
            .exec()
            .then((data) => {
              // Returning successfull response
              return res.status(200).json({
                success: true,
                result: mailId,
                message: `Successfully sent quote ${id} to ${email}`,
              });
            });
        }
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          result: null,
          error: error,
          message: error.message,
        });
      });
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    if (error.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        error: error,
        message: 'Required fields are not supplied',
      });
    } else if (error.name == 'BSONTypeError') {
      // If error is thrown by Mongoose due to invalid ID
      return res.status(400).json({
        success: false,
        result: null,
        error: error,
        message: 'Invalid ID',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        error: error,
        message: error.message,
      });
    }
  }
};

const sendViaApi = async (email, name, filePath) => {
  const absolutePath = path.normalize(filePath);
  const resend = new Resend(process.env.RESEND_API);

  // Read the file to be attatched
  const attatchedFile = fs.readFileSync(absolutePath);

  // Send the mail using the send method
  const data = await resend.emails.send({
    from: 'Idurar@onfranciis.dev',
    to: email,
    subject: 'Quote From Idurar',
    attachments: [
      {
        filename: 'Quote.pdf',
        content: attatchedFile,
      },
    ],
    html: SendQuote({ name }),
  });

  return data;
};
