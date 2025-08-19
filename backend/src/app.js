// import required packages
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// import routers and controllers
const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const coreAdminAuth = require('./controllers/coreControllers/adminAuth');
const errorHandlers = require('./handlers/errorHandlers');
const erpApiRouter = require('./routes/appRoutes/appApi');
const fileUpload = require('express-fileupload');

// create our Express app
const app = express();

// enable CORS 
app.use(
  cors({
    origin: true,          // allow request from any origin
    credentials: true,     // allow sending cookies along with requests
  })
);

// parsing our data
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// compressing HTTP request
app.use(compression());

// default options
// app.use(fileUpload());

// Here our API Routes
app.use('/api', coreAuthRouter);
app.use('/api', coreAdminAuth.isValidAuthToken, coreApiRouter);
app.use('/api', coreAdminAuth.isValidAuthToken, erpApiRouter);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
