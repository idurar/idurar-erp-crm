import express from 'express';
import cors from 'cors';
import compression from 'compression';
// import NodeCache from 'node-cache';
import cookieParser from 'cookie-parser';

import coreAuthRouter from './routes/coreRoutes/coreAuth.js';
import coreApiRouter from './routes/coreRoutes/coreApi.js';
import coreDownloadRouter from './routes/coreRoutes/coreDownloadRouter.js';
import corePublicRouter from './routes/coreRoutes/corePublicRouter.js';
import adminAuth from './controllers/coreControllers/adminAuth/index.js';

import * as errorHandlers from './handlers/errorHandlers.js';
import erpApiRouter from './routes/appRoutes/appApi.js';
import { listAllSettings } from '#middlewares/settings/index.js';
import useLanguage from '#locale/useLanguage.js';

// create our Express app
const app = express();

// const settingsCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

// const loadSettings = async () => {
//   const allSettings = [];
//   const datas = await listAllSettings();
//   datas.map(async (data) => {
//     allSettings.push({ key: data.settingKey, val: data.settingValue });
//   });
//   return allSettings;
// };

// const loadSettings = async () => {
//   const allSettings = {};
//   const datas = await listAllSettings();
//   datas.map(async (data) => {
//     allSettings[data.settingKey] = data.settingValue;
//   });
//   return allSettings;
// };

// app.use(async function (req, res, next) {
//   req.settings = await loadSettings();
//   const lang = req.settings['idurar_app_language'];
//   req.translate = useLanguage(lang);
//   next();
//   // const cache = settingsCache.get('idurar_app_language');
//   // if (!cache) {
//   //   let settingsList = await loadSettings();
//   //   settingsCache.mset(settingsList);
//   //   req.settings = settingsCache;
//   //   const lang = settingsCache.get('idurar_app_language');
//   //   console.log('🚀 ~ file: app.js:40 ~ lang:', lang);
//   //   req.translate = useLanguage(lang);
//   //   next();
//   // }
// });

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());
// Here our API Routes
app.use('/api', coreAuthRouter);
app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);
app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
export default app;
