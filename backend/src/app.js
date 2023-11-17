const express = require('express');

const helmet = require('helmet');
const path = require('path');
const cors = require('cors');

const cookieParser = require('cookie-parser');

const helpers = require('./helpers');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const { isValidAdminToken } = require('./controllers/coreControllers/authJwtController');

const errorHandlers = require('./handlers/errorHandlers');
const erpApiRouter = require('./routes/appRoutes/appApi');

// create our Express app
const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

// setting cors at one place for all the routes
// putting cors as first in order to avoid unneccessary requests from unallowed origins

// app.use(function (req, res, next) {
//   if (req.url.includes('/api')) {
//     cors(corsOptions)(req, res, next);
//   } else {
//     cors()(req, res, next);
//   }
// });

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is

// Takes the raw requests and turns them into usable properties on req.body

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// pass variables to our templates + all requests

app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.admin = req.admin || null;
  res.locals.currentPath = req.path;
  next();
});

// Here our API Routes
app.use('/api', coreAuthRouter);
app.use('/api', isValidAdminToken, coreApiRouter);
app.use('/api', isValidAdminToken, erpApiRouter);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
