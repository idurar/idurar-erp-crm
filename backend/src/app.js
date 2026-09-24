import express, { json, urlencoded } from 'express';

import cors from 'cors';
import compression from 'compression';

import cookieParser from 'cookie-parser';

import coreAuthRouter from './routes/coreRoutes/coreAuth';
import coreApiRouter from './routes/coreRoutes/coreApi';
import coreDownloadRouter from './routes/coreRoutes/coreDownloadRouter';
import corePublicRouter from './routes/coreRoutes/corePublicRouter';
import { isValidAuthToken } from './controllers/coreControllers/adminAuth';

import { notFound, productionErrors } from './handlers/errorHandlers';
import erpApiRouter from './routes/appRoutes/appApi';

import fileUpload from 'express-fileupload';
// create our Express app
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(compression());

// // default options
// app.use(fileUpload());

// Here our API Routes

app.use('/api', coreAuthRouter);
app.use('/api', isValidAuthToken, coreApiRouter);
app.use('/api', isValidAuthToken, erpApiRouter);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(notFound);

// production error handler
app.use(productionErrors);

// done! we export it so we can start the site in start.js
export default app;
