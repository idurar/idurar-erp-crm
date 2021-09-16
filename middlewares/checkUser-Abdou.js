require("dotenv").config({ path: ".variables.env" });
const jwt = require("jsonwebtoken");

const isValidToken = (token) => {
  try {
    let admin = jwt.verify(token, process.env.JWT_SECRET);

    return {
      status: true,
      data: admin,
    };
  } catch (error) {
    console.log(error);
    // error
    return {
      status: false,
      result: null,
    };
  }
};

/**
 * retrieve token from header
 * @param {*} headers
 * @return {string} token or null
 */
const retrieveToken = (headers) => {
  if (headers && headers.authorization) {
    const tokens = headers.authorization.split(" ");
    if (tokens && tokens.length === 2) {
      return tokens[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = (req, res, next) => {
  let admin;

  let token = retrieveToken(req.headers);

  if (token) {
    admin = isValidToken(token);
    if (admin.status) {
      req.admin = admin.data;
    }
  }

  // only register && public/download  routes will be allowed to get pass :)

  // he we check if the the admin collection exist in the request
  // if yes means that the admin is logged in
  // else the admin is not logged it
  console.log(req.admin);
  if (
    req.admin == undefined &&
    req.path !== "/register" &&
    req.path !== "/login" &&
    req.path.search("/public/download") !== 0
  ) {
    // redirect to login page if the admin is not logged in :')
    return res.send({
      status: false,
      path: req.path,
      message: "CheckAdmin.js Unauthorized",
    });
  } else {
    console.log("next()");
  }

  // if yes continue the admin actions ^_^
  next();
};
