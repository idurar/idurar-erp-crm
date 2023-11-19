const puppeteer = require('puppeteer');
const pug = require('pug');
const fs = require('fs');
const moment = require('moment');

const pugFiles = ['invoice', 'offer', 'quote', 'payment', 'quote', 'supplierOrder'];

exports.generatePdf = async (
  modelName,
  info = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
  result,
  callback
) => {
  try {
    const { targetLocation } = info;
    console.log('🚀 ~ file: index.js:16 ~ fileId:', targetLocation);

    // if PDF already exists, then delete it and create a new PDF
    if (fs.existsSync(targetLocation)) {
      fs.unlinkSync(targetLocation);
    }

    // render pdf html

    if (pugFiles.includes(modelName.toLowerCase())) {
      // Compile Pug template

      const htmlContent = pug.renderFile('src/pdf/' + modelName.toLowerCase() + '.pug', {
        model: result,
        moment: moment,
      });

      // Launch Puppeteer
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();

      // Set the HTML content on the page
      await page.setContent(htmlContent);

      // Generate PDF
      await page.pdf({
        path: targetLocation,
        format: info.format,
        landscape: false,
        margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
      });

      // Close the browser
      await browser.close();

      if (callback) callback();
    }
  } catch (error) {
    throw new Error(error);
  }
};
