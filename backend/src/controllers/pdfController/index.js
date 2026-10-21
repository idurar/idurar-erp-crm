const pug = require('pug');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const puppeteer = require('puppeteer');
const { listAllSettings, loadSettings } = require('@/middlewares/settings');
const { getData } = require('@/middlewares/serverData');
const useLanguage = require('@/locale/useLanguage');
const { useMoney, useDate } = require('@/settings');
const sanitizeRichText = require('@/helpers/sanitizeRichText');

const pugFiles = ['invoice', 'offer', 'quote', 'payment', 'orderconfirmation', 'purchaseorder'];
const defaultLogoPath = path.resolve(__dirname, '../../public/images/wiedesign-logo.png');
const defaultLogo = `data:image/png;base64,${fs.readFileSync(defaultLogoPath).toString('base64')}`;
const imageMimeTypes = {
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const imageDataUri = (filePath) => {
  if (!filePath || !fs.existsSync(filePath)) return null;
  const mimeType = imageMimeTypes[path.extname(filePath).toLowerCase()];
  if (!mimeType) return null;
  return `data:${mimeType};base64,${fs.readFileSync(filePath).toString('base64')}`;
};

const resolveCompanyLogo = (logo, publicServerFile) => {
  if (!logo) return defaultLogo;
  if (/^data:image\//i.test(logo)) return logo;

  const normalized = String(logo).replaceAll('\\', '/').replace(/^\/+/, '');
  const relativeToPublic = normalized.startsWith('public/')
    ? path.resolve('src', normalized)
    : path.resolve('src/public', normalized);
  const embeddedLogo = imageDataUri(relativeToPublic);
  if (embeddedLogo) return embeddedLogo;

  return `${publicServerFile || ''}${logo}`;
};
const browserExecutable = () => {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate));
};

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
    const companyLogo = resolveCompanyLogo(settings.company_logo, settings.public_server_file);
    const htmlContent = pug.renderFile(path.resolve('src/pdf', `${modelName}.pug`), {
      model: result,
      settings,
      companyLogo,
      translate,
      dateFormat,
      moneyFormatter,
      moment,
      safeRichText: sanitizeRichText,
    });

    fs.mkdirSync(path.dirname(targetLocation), { recursive: true });
    const browserProfile = fs.mkdtempSync(
      path.join(path.resolve('src/public/download'), '.pdf-browser-')
    );

    const executablePath = browserExecutable();
    let browser;
    let pdfResult;
    try {
      browser = await puppeteer.launch({
        headless: true,
        userDataDir: browserProfile,
        ...(executablePath && { executablePath }),
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-dev-shm-usage',
          '--no-first-run',
        ],
      });
      const page = await browser.newPage();
      await page.setJavaScriptEnabled(false);
      await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
      await page.evaluate(async () => {
        await Promise.all(
          Array.from(document.images, (image) => {
            if (image.complete) return Promise.resolve();
            return new Promise((resolve) => {
              image.addEventListener('load', resolve, { once: true });
              image.addEventListener('error', resolve, { once: true });
              setTimeout(resolve, 3000);
            });
          })
        );
      });
      await page.emulateMediaType('print');
      await page.pdf({
        path: targetLocation,
        format: info.format,
        landscape: false,
        printBackground: true,
        margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '25mm' },
      });
      pdfResult = { filename: targetLocation };
    } finally {
      if (browser) await browser.close();
      fs.rmSync(browserProfile, { recursive: true, force: true });
    }

    if (callback) {
      callback();
    }

    return pdfResult;
  } catch (error) {
    throw error;
  }
};
