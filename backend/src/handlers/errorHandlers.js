/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/
const { randomUUID } = require('crypto');
const logger = require('@/utils/logger');

exports.catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch((error) => {
      const errorId = randomUUID();
      logger.error('Request failed', {
        errorId,
        method: req.method,
        path: req.originalUrl,
        controller: fn.name,
        error: error.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
      });
      if (error.name == 'ValidationError') {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'Erforderliche Angaben fehlen oder sind ungültig.',
          controller: fn.name,
          errorId,
        });
      } else {
        // Server Error
        return res.status(500).json({
          success: false,
          result: null,
          message: process.env.NODE_ENV === 'production' ? 'Interner Serverfehler' : error.message,
          controller: fn.name,
          errorId,
        });
      }
    });
  };
};

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => {
  return res.status(404).json({
    success: false,
    message: 'Die angeforderte Schnittstelle wurde nicht gefunden.',
  });
};

/*
  Development Error Handler

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
exports.developmentErrors = (error, req, res, next) => {
  error.stack = error.stack || '';
  const errorDetails = {
    message: error.message,
    status: error.status,
    stackHighlighted: error.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>'),
  };

  return res.status(500).json({
    success: false,
    message: error.message,
    error: error,
  });
};

/*
  Production Error Handler

  No stacktraces are leaked to admin
*/
exports.productionErrors = (error, req, res, next) => {
  const errorId = randomUUID();
  logger.error('Unhandled request error', {
    errorId,
    method: req.method,
    path: req.originalUrl,
    error: error.message,
  });
  return res.status(500).json({
    success: false,
    message: 'Interner Serverfehler',
    errorId,
  });
};
