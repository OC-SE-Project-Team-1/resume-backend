module.exports = (app) => {
  const User = require("../controllers/account.controller.js");
  const { authenticateRoute, authenticateAdmin } = require("../authentication/authentication.js");
  var router = require("express").Router();

  // Create a new User
  router.post("/account/", User.create);

  // Retrieve all Users
  router.get("/account/", [authenticateRoute, authenticateAdmin], User.findAll);

  // Retrieve a single User with id
  router.get("/account/:id", User.findOne);

  // Update a User with id
  router.put("/account/:id", [authenticateRoute, authenticateUserReq], User.update);

  // Delete a User with id
  router.delete("/account/:id", [authenticateRoute, authenticateUserReq], User.delete);

  app.use("/fairytales", router);
};