const fs = require('fs');
const mongoose = require('mongoose');
const InvoiceModel = mongoose.model('Invoice');
const ClientModel = mongoose.model('Client');
const ObjectId = mongoose.Types.ObjectId;
const { Resend } = require('resend');

module.exports = sendMail = async (req, res) => {
  const { id } = req.body;

  try {
    // Throw error if no id
    if (!id) {
      throw { name: 'ValidationError' };
    }

    const result = await InvoiceModel.findById(ObjectId(id)).exec();

    // Continue process if result is returned
    if (result) {
      const { pdfPath, client } = result;
      const fileLocation = `public/download/invoice/${pdfPath}`;
      const { email, managerName } = await ClientModel.findById(client).exec();

      // Send the mail using the details gotten from the client
      const { id: mailId } = await sendViaApi(email, managerName, fileLocation);

      // Returning successfull response
      return res.status(200).json({
        success: true,
        result: mailId,
        message: `Successfully sent invoice ${id} to ${email}`,
      });
    }
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        error: err,
        message: 'Required fields are not supplied',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        error: err,
        message: 'Oops there is an Error',
      });
    }
  }
};

const sendViaApi = async (email, name, filePath) => {
  const resend = new Resend(process.env.RESEND_API);

  // Read the file to be attatched
  const attatchedFile = fs.readFileSync(filePath);

  // Send the mail using the send method
  const data = await resend.emails.send({
    from: 'idurar@onfranciis.dev',
    to: email,
    subject: 'Invoice From Idurar',
    attachments: [
      {
        filename: 'Invoice.pdf',
        content: attatchedFile,
      },
    ],
    html: `
    <p>Hello ${name}, <br>
    Here's the invoice you requested at <br>
        <strong>${new Date()}</strong>
    </p>
    `,
  });

  return data;
};
