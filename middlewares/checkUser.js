//this middleware will check if the admin  is logged in, if not he will be redirected to the login page :)

//this middleware will check if the admin  is logged in, if not he will be redirected to the login page :)
module.exports = (req, res, next) => {
  console.warn(req.admin);
  // only register && public/download  routes will be allowed to get pass :)

  // he we check if the the admin collection exist in the request
  // if yes means that the admin is logged in
  // else the admin is not logged it

  if (
    req.admin == undefined &&
    req.path !== "/register" &&
    req.path !== "/login" &&
    req.path.search("/public/download") !== 0
  ) {
    // redirect to login page if the admin is not logged in :')
    return res.render("login");
  }

  // if yes continue the admin actions ^_^
  next();
};
