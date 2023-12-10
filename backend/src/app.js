const express = require('express');

const cors = require('cors');
const compression = require('compression');
// const NodeCache = require('node-cache');
const cookieParser = require('cookie-parser');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const adminAuth = require('./controllers/coreControllers/adminAuth');

const errorHandlers = require('./handlers/errorHandlers');
const erpApiRouter = require('./routes/appRoutes/appApi');
const { listAllSettings } = require('@/middlewares/settings');
const useLanguage = require('@/locale/useLanguage');

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
module.exports = app;
