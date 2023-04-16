const express = require('express');

const helmet = require('helmet');
const path = require('path');
const cors = require('cors');

const cookieParser = require('cookie-parser');
require('dotenv').config({ path: '.variables.env' });

const helpers = require('./helpers');

const erpApiRouter = require('./routes/erpRoutes/erpApi');
const erpAuthRouter = require('./routes/erpRoutes/erpAuth');
const erpDownloadRouter = require('./routes/erpRoutes/erpDownloadRouter');

const errorHandlers = require('./handlers/errorHandlers');

const { isValidAdminToken } = require('./controllers/erpControllers/authJwtController ');

// create our Express app
const app = express();
// serves up static files from the public folder. Anything in public/ will just be served up as the file it is

// Takes the raw requests and turns them into usable properties on req.body

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// // Sessions allow us to Contact data on visitors from request to request
// // This keeps admins logged in and allows us to send flash messages
// app.use(
//   session({
//     secret: process.env.SECRET,
//     key: process.env.KEY,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
//   })
// );

// pass variables to our templates + all requests

app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.admin = req.admin || null;
  res.locals.currentPath = req.path;
  next();
});

// app.use(function (req, res, next) {
//   if (req.url.slice(-1) === "/" && req.path.length > 1) {
//     // req.path = req.path.slice(0, -1);
//     req.url = req.url.slice(0, -1);
//   }
//   next();
// });

// Here our API Routes

app.use(
  '/api',
  cors({
    origin: true,
    credentials: true,
  }),
  erpAuthRouter
);

// app.use("/api", cors(), isValidAdminToken, erpApiRouter);

app.use(
  '/api',
  cors({
    origin: true,
    credentials: true,
  }),
  isValidAdminToken,
  erpApiRouter
);

app.use('/download', cors(), erpDownloadRouter);

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
