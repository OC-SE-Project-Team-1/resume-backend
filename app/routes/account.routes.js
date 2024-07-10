module.exports = (app) => {
  const User = require("../controllers/account.controller.js");
  const { authenticateRoute } = require("../authentication/authentication.js");
  var router = require("express").Router();

  // Create a new User
  router.post("/account/", User.create);

  // Retrieve all Users
  router.get("/account/", [authenticateRoute], User.findAll);

  // Retrieve a single User with id
  router.get("/account/:id", User.findOne);

  // Update a User with id
  router.put("/account/:id", [authenticateRoute], User.update);

  // Delete a User with id
  router.delete("/account/:id", [authenticateRoute], User.delete);

  app.use("/resume-p2t1", router);
};