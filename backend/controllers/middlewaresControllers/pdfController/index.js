let pdf = require('html-pdf');
const pug = require('pug');
const fs = require('fs');
const moment = require('moment');

const mongoose = require('mongoose');
const ClientModel = mongoose.model('Client');
const InvoiceModel = mongoose.model('Invoice');

exports.generatePdf = async (
  modelName,
  info = { filename: 'pdf_file', format: 'A5' },
  result,
  callback
) => {
  const fileId = info.filename + '-' + result._id + '.pdf';
  const folderPath = modelName.toLowerCase();
  const targetLocation = `./public/download/${folderPath}/${fileId}`;

  // if PDF already exist, then delete it and create new PDF
  if (fs.existsSync(targetLocation)) {
    fs.unlinkSync(targetLocation);
  }

  //TODO: make the url and tekst come from the database
  const dynamicLogoSrc =
    'https://www.idurarweb.com/Theme/idurarweb-theme/assets/img/creation-de-site-web-algerie.png';
  const dynamicTextSrc = 'lorem ipsum dorem narum';

  try {
    //Searche for client info in database
    const clientInfo = await ClientModel.findById(result.client).exec();
    const invoice = await InvoiceModel.find({ _id: result._id }).exec();

    const originalDate = new Date(invoice[0].expiredDate);
    const formattedDate = originalDate.toLocaleDateString('en-GB');

    if (!clientInfo) {
      console.error('Client not found');
      return;
    }

    const clientInfoObj = {
      name: `${clientInfo.managerName} ${clientInfo.managerSurname}`,
      company: clientInfo.company,
      phone: clientInfo.phone,
      email: clientInfo.email,
      address: clientInfo.address,
    };

    const invoiceInfoObj = {
      expiredDate: formattedDate,
      number: invoice[0].number,
      total: invoice[0].total,
      company: invoice[0].client.company,
      bankAccount: invoice[0].client?.bankAccount,
    };

    //TODO: look at why there is client info now in the object. and before there was not
    const newResultObj = { ...result._doc, client: clientInfoObj };

    const html = pug.renderFile('views/pdf/' + modelName + '.pug', {
      model: newResultObj,
      invoice: invoiceInfoObj,
      moment: moment,
      logo: dynamicLogoSrc,
      text: dynamicTextSrc,
    });

    await pdf
      .create(html, {
        format: info.format,
        orientation: 'portrait',
        border: '12mm',
      })
      .toFile(targetLocation, function (err) {
        if (err) return console.log('this pdf create error ' + err);
        if (callback) callback(targetLocation);
      });
  } catch (error) {
    console.error('Error:', error);
    // Handle the error appropriately
  }
};
