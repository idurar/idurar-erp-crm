import { renderFile } from 'pug';
import { existsSync, unlinkSync } from 'fs';
import moment from 'moment';
import { create } from 'html-pdf';
import { listAllSettings, loadSettings } from '@/middlewares/settings';
import { getData } from '@/middlewares/serverData';
import useLanguage from '@/locale/useLanguage';
import { useMoney, useDate } from '@/settings';

const pugFiles = ['invoice', 'offer', 'quote', 'payment'];

import('dotenv').config({ path: '.env' });
import('dotenv').config({ path: '.env.local' });

export async function generatePdf(
  modelName,
  info = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
  resultz,
  callback
) {
  try {
    const { targetLocation } = info;

    // if PDF already exists, then delete it and create a new PDF
    if (existsSync(targetLocation)) {
      unlinkSync(targetLocation);
    }

    // render pdf html

    if (pugFiles.includes(modelName.toLowerCase())) {
      // Compile Pug template

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

      const htmlContent = renderFile('src/pdf/' + modelName + '.pug', {
        model: result,
        settings,
        translate,
        dateFormat,
        moneyFormatter,
        moment: moment,
      });

      create(htmlContent, {
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
}
