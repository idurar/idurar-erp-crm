const express = require("express");

const helmet = require("helmet");
const path = require("path");
const cors = require("cors");

const cookieParser = require("cookie-parser");

const helpers = require("./helpers");

const apiRouter = require("./routes/api");
const authJwtRouter = require("./routes/authJwt");

const errorHandlers = require("./handlers/errorHandlers");

const { isValidToken } = require("./controllers/authJwtController ");

require("dotenv").config({ path: ".variables.env" });
// create our Express app
const app = express();
// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, "public")));

// Takes the raw requests and turns them into usable properties on req.body

app.use(helmet());
// app.use(function (req, res, next) {
//   // res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE");
//   res.header("Access-Control-Expose-Headers", "Content-Length");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Accept, Authorization,x-auth-token, Content-Type, X-Requested-With, Range"
//   );
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   } else {
//     return next();
//   }
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors());
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

// // promisify some callback based APIs
// app.use((req, res, next) => {
//   req.login = promisify(req.login, req);
//   next();
// });

// app.use(function (req, res, next) {
//   if (req.url.slice(-1) === "/" && req.path.length > 1) {
//     // req.path = req.path.slice(0, -1);
//     req.url = req.url.slice(0, -1);
//   }
//   next();
// });

// Here our API Routes

app.use("/api", cors(), authJwtRouter);

// app.use("/api", cors(), isValidToken, apiRouter);

app.use(
  "/api",
  cors({
    origin: true,
    credentials: true,
  }),
  isValidToken,
  apiRouter
);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get("env") === "development") {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
