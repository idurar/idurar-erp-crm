const pug = require('pug');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const pdf = require('html-pdf');
const { listAllSettings, loadSettings } = require('@/middlewares/settings');
const { getData } = require('@/middlewares/serverData');
const useLanguage = require('@/locale/useLanguage');
const { useMoney, useDate } = require('@/settings');

const pugFiles = ['invoice', 'offer', 'quote', 'payment'];
const defaultLogoPath = path.resolve(__dirname, '../../public/images/wiedesign-logo.png');
const defaultLogo = `data:image/png;base64,${fs.readFileSync(defaultLogoPath).toString('base64')}`;
const safeRichText = (html = '') => String(html)
  .replace(/<\/?(script|style|iframe|object|embed)[^>]*>/gi, '')
  .replace(/\son\w+\s*=\s*(["']).*?\1/gi, '')
  .replace(/javascript:/gi, '');

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

exports.generatePdf = async (
  modelName,
  info = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
  result,
  callback
) => {
  try {
    const { targetLocation } = info;

    if (!pugFiles.includes(modelName.toLowerCase())) {
      throw new Error(`Unsupported PDF document type: ${modelName}`);
    }

    // if PDF already exists, then delete it and create a new PDF
    if (fs.existsSync(targetLocation)) {
      fs.unlinkSync(targetLocation);
    }

    const settings = await loadSettings();
    const selectedLang = settings['idurar_app_language'];
    const translate = useLanguage({ selectedLang });

    const {
      currency_symbol,
      currency_position,
      decimal_sep,
      thousand_sep,
      cent_precision,
      zero_format,
    } = settings;

    const { moneyFormatter } = useMoney({
      settings: {
        currency_symbol,
        currency_position,
        decimal_sep,
        thousand_sep,
        cent_precision,
        zero_format,
      },
    });
    const { dateFormat } = useDate({ settings });

    settings.public_server_file = process.env.PUBLIC_SERVER_FILE;
    const companyLogo = settings.company_logo
      ? `${settings.public_server_file || ''}${settings.company_logo}`
      : defaultLogo;
    const htmlContent = pug.renderFile(path.resolve('src/pdf', `${modelName}.pug`), {
      model: result,
      settings,
      companyLogo,
      translate,
      dateFormat,
      moneyFormatter,
      moment,
      safeRichText,
    });

    fs.mkdirSync(path.dirname(targetLocation), { recursive: true });

    const pdfResult = await new Promise((resolve, reject) => {
      pdf
        .create(htmlContent, {
          format: info.format,
          orientation: 'portrait',
          border: {
            top: '20mm',
            right: '15mm',
            bottom: '20mm',
            left: '25mm',
          },
        })
        .toFile(targetLocation, (error, file) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(file);
        });
    });

    if (callback) {
      callback();
    }

    return pdfResult;
  } catch (error) {
    throw error;
  }
};
