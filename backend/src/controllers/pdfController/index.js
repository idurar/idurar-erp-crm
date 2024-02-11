import pug from 'pug';
import fs from 'fs';
import moment from 'moment';
import pdf from 'html-pdf';
import { listAllSettings } from '#middlewares/settings/index.js';
import useLanguage from '#locale/useLanguage.js';
import useMoney from '#settings/useMoney.js';
import useDate from '#settings/useDate.js';

const pugFiles = ['invoice', 'offer', 'quote', 'payment'];

const generatePdf = async (
  modelName,
  info = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
  result,
  callback
) => {
  try {
    const { targetLocation } = info;

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
      const { dateFormat } = useDate({ settings });

      const htmlContent = pug.renderFile(`src/pdf/${modelName}.pug`, {
        model: result,
        settings,
        translate,
        dateFormat,
        moneyFormatter,
        moment: moment,
      });

      pdf
        .create(htmlContent, {
          format: info.format,
          orientation: 'portrait',
          border: '10mm',
        })
        .toFile(targetLocation, function (error) {
          if (error) throw new Error(error);
          if (callback) callback();
        });
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default generatePdf;
