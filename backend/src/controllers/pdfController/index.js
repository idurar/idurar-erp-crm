const pug = require('pug');
const fs = require('fs');
const moment = require('moment');
const puppeteer = require('puppeteer');
const { listAllSettings } = require('@/middlewares/settings');
const useLanguage = require('@/locale/useLanguage');
const useMoney = require('@/settings/useMoney');

const pugFiles = ['invoice', 'offer', 'quote', 'payment'];

exports.generatePdf = async (
  modelName,
  info = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
  result,
  callback
) => {
  try {
    const { targetLocation } = info;
    let browser = await puppeteer.launch({ headless: 'new' });
    // if PDF already exists, then delete it and create a new PDF
    if (fs.existsSync(targetLocation)) {
      fs.unlinkSync(targetLocation);
    }

    // render pdf html

    if (pugFiles.includes(modelName.toLowerCase())) {
      // Compile Pug template

      const loadSettings = async () => {
        const allSettings = {};
        const datas = await listAllSettings();
        datas.map(async (data) => {
          allSettings[data.settingKey] = data.settingValue;
        });
        return allSettings;
      };

      const settings = await loadSettings();
      const selectedLang = settings['idurar_app_language'];
      const translate = useLanguage({ selectedLang });
      const { moneyFormatter } = useMoney({ settings });

      const htmlContent = pug.renderFile('src/pdf/' + modelName.toLowerCase() + '.pug', {
        model: result,
        settings,
        translate,
        moneyFormatter,
        moment: moment,
      });

      // Launch Puppeteer

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
