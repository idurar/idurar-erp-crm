/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

exports.catchErrors = (fn) => {
  return function (req, res, next) {
    const resp = fn(req, res, next);
    if (resp instanceof Promise) {
      return resp.catch(next);
    }
    return resp;
  };
};

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => {
  res.render("errors/404", {
    title: "404",
  });
};

/*
  MongoDB Validation Error Handler

  Detect if there are mongodb validation errors that we can nicely show via flash messages
*/

exports.flashValidationErrors = (err, req, res, next) => {
  if (!err.errors) return next(err);
  // validation errors look like
  const errorKeys = Object.keys(err.errors);
  errorKeys.forEach((key) => req.flash("error", err.errors[key].message));
  res.redirect("back");
};

/*
  Development Error Handler

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || "";
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      "<mark>$&</mark>"
    ),
  };
  // res.status(err.status || 500);
  // res.format({
  //   // Based on the `Accept` http header
  //   "text/html": () => {
  //     res.send({
  //       "error": errorDetails
  //     })
  //   }, // Form Submit, Reload the page
  //   "application/json": () => res.json(errorDetails), // Ajax call, send JSON back
  // });
  res.render("errors/500", {
    title: "500",
    error: err.message,
  });
};

/*
  Production Error Handler

  No stacktraces are leaked to admin
*/
exports.productionErrors = (err, req, res, next) => {
  // res.status(err.status || 500);
  // res.render("error", {
  //   message: err.message,
  //   error: {},
  // });
  res.render("errors/500", {
    title: "500",
    error: err.message,
  });
};
