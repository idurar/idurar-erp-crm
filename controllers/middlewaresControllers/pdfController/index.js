let pdf = require('html-pdf');
const pug = require('pug');
const fs = require('fs');
const moment = require('moment');

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

  // render pdf html
  const html = pug.renderFile('views/pdf/' + modelName + '.pug', {
    model: result,
    moment: moment,
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
};
